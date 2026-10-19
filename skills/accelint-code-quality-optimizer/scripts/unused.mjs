#!/usr/bin/env node
// Lists removal candidates: source files nothing reaches, and exports nothing uses, from the static import graph.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createImportGraph } from "./import-graph.mjs";
import {
  SKILL_VERSION,
  expandBraces,
  fail,
  globToRegExp,
  isStoryFile,
  isTestFile,
  isToolConfig,
  packageFor,
  parseArgs,
  printJson,
  readJson,
  resolveRoot,
  toPosix,
} from "./shared.mjs";

const USAGE = `usage: unused.mjs [repo-root] [--scope <dir>] [--typescript <path>] [--out <file>]

Lists removal candidates from the static import graph:
  unusedFiles    source files no entry point, test, story or other file reaches
  unusedExports  exports nothing imports, in files that are otherwise used

Every candidate carries a confidence:
  likely   no static importer, no textual mention elsewhere, and the file has no computed dynamic import
           nearby; still needs the user's confirmation before deletion
  review   something the graph cannot rule out: the name appears as text in another file, the package
           is a library (outside consumers), or the repo has computed import()/require() calls

A candidate is never proof. Deletion is tier C (references/removal.md).`;

const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["scope", "typescript", "out"] });
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}
const root = resolveRoot(args._[0]);
const graph = createImportGraph(root, { typescript: args.typescript });
const scope = args.scope ? toPosix(path.normalize(args.scope)).replace(/\/$/u, "") : ".";
const inScope = (file) => scope === "." || file === scope || file.startsWith(`${scope}/`);

/**
 * Files a framework or tool loads by convention, never by import. They are roots of the graph, not candidates.
 * The overlay can add more: "entryPoints": ["src/plugins/**"].
 */
const FRAMEWORK_ENTRIES = [
  "**/app/**/{page,layout,template,loading,error,not-found,default,global-error,route,head,opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.*",
  "**/pages/**",
  "**/app/routes/**",
  "**/routes/**",
  "**/{middleware,instrumentation,instrumentation-client}.*",
  "**/{main,index,server,cli,app,entry,entry.client,entry.server,root,bootstrap,setup,setupTests,worker,service-worker,sw}.{ts,tsx,js,jsx,mjs,cjs,mts,cts}",
  "**/.storybook/**",
  "**/scripts/**",
  "**/bin/**",
  "**/e2e/**",
  "**/*.d.ts",
  "**/{global,globals,env}.{ts,d.ts}",
];
const entryGlobs = [...FRAMEWORK_ENTRIES, ...(Array.isArray(graph.overlay.entryPoints) ? graph.overlay.entryPoints : [])];
const entryRegexes = entryGlobs.flatMap(expandBraces).map(globToRegExp);

/** Files package.json scripts, bin and tool configs mention by path are entries too (`node scripts/x.mjs`, setupFiles). */
function referencedByConfig() {
  const mentioned = new Set();
  const configTexts = [];
  for (const pkg of graph.packages) {
    const manifestFile = path.join(root, pkg.path, "package.json");
    if (!existsSync(manifestFile)) continue;
    const manifest = readJson(manifestFile) ?? {};
    const bin = typeof manifest.bin === "string" ? [manifest.bin] : Object.values(manifest.bin ?? {});
    configTexts.push({ dir: pkg.path, text: [...Object.values(manifest.scripts ?? {}), ...bin].join("\n") });
  }
  for (const file of graph.allFiles) {
    if (isToolConfig(file) || /(?:^|\/)(?:tsconfig[^/]*\.json|vercel\.json|turbo\.json|nx\.json|project\.json)$/u.test(file)) {
      try {
        const testRunner = /^(?:vitest|jest|playwright|cypress)[.\w-]*\.config\./u.test(path.posix.basename(file));
        configTexts.push({ dir: path.posix.dirname(file), text: readFileSync(path.join(root, file), "utf8"), globs: testRunner });
      } catch {
        // unreadable config: nothing to add
      }
    }
  }
  for (const { dir, text, globs } of configTexts) {
    const base = dir === "." ? "" : dir;
    for (const match of text.matchAll(/["'`\s=(]((?:\.{1,2}\/)?[\w@./-]+\.(?:[cm]?[jt]sx?))\b/gu)) {
      const candidate = path.posix.normalize(path.posix.join(base, match[1]));
      if (graph.fileSet.has(candidate)) mentioned.add(candidate);
    }
    // Quoted globs such as include: ["integrations/**/*.acceptance.tsx"], from test runner configs only:
    // tsconfig `include` and bundler entry globs ("src/**/*.ts") cover every file and would hide all dead code.
    if (!globs) continue;
    for (const match of text.matchAll(/["'`]((?:\.{1,2}\/)?[\w@./{},*-]*\*[\w@./{},*-]*\.(?:\{[\w,]+\}|[cm]?[jt]sx?))["'`]/gu)) {
      const regexes = expandBraces(path.posix.normalize(path.posix.join(base, match[1]))).map(globToRegExp);
      for (const file of graph.files) if (regexes.some((regex) => regex.test(file))) mentioned.add(file);
    }
  }
  return mentioned;
}

const configEntries = referencedByConfig();
const isRoot = (file) => {
  const pkg = packageFor(file, graph.packages);
  return (
    isTestFile(file) ||
    isStoryFile(file) ||
    isToolConfig(file) ||
    configEntries.has(file) ||
    graph.entriesOf(pkg).has(file) ||
    entryRegexes.some((regex) => regex.test(file))
  );
};

// Reachability from every root along import, re-export and dynamic-import edges.
const outgoing = new Map();
for (const edge of graph.edges) {
  if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
  outgoing.get(edge.from).push(edge.to);
}
const reached = new Set();
const queue = [...graph.files.filter(isRoot), ...graph.generatedSources];
for (const file of queue) reached.add(file);
while (queue.length > 0) {
  const file = queue.pop();
  for (const next of outgoing.get(file) ?? []) {
    if (!reached.has(next)) {
      reached.add(next);
      queue.push(next);
    }
  }
}

/** Plain-text mentions of a name outside its own file: registries, string keys, JSX in markdown, config. */
const textCache = new Map();
const textOf = (file) => {
  if (!textCache.has(file)) {
    try {
      textCache.set(file, readFileSync(path.join(root, file), "utf8"));
    } catch {
      textCache.set(file, "");
    }
  }
  return textCache.get(file);
};
const searchable = graph.allFiles.filter((file) => /\.(?:[cm]?[jt]sx?|json|ya?ml|mdx?|html|vue|svelte|astro)$/u.test(file));
function textMentions(name, exceptFile) {
  if (name === "default" || name.length < 4) return [];
  const pattern = new RegExp(`(?<![\\w$])${name.replace(/[$]/gu, "\\$")}(?![\\w$])`, "u");
  const hits = [];
  for (const file of searchable) {
    if (file === exceptFile) continue;
    if (pattern.test(textOf(file))) {
      hits.push(file);
      if (hits.length >= 5) break;
    }
  }
  return hits;
}

const isLibrary = (pkg) => !pkg.root && graph.entriesOf(pkg).size > 0;
const computedIn = new Set(graph.computedImports.map((entry) => packageFor(entry.file, graph.packages).path));
const lineCount = (file) => textOf(file).split(/\r?\n/u).length;

const unusedFiles = [];
for (const file of graph.files) {
  if (!inScope(file) || reached.has(file) || isRoot(file)) continue;
  const pkg = packageFor(file, graph.packages);
  const stem = path.posix.basename(file).replace(/\.[^.]+$/u, "");
  const mentions = textMentions(stem, file).filter((other) => !/\.(?:[cm]?[jt]sx?)$/u.test(other) || !graph.fileSet.has(other) || reached.has(other));
  const reasons = ["no import, re-export or literal dynamic import reaches it from any entry, test or story"];
  if (mentions.length > 0) reasons.push(`its name appears as text in ${mentions.join(", ")}`);
  if (computedIn.has(pkg.path)) reasons.push("the package has computed import()/require() calls the graph cannot follow");
  // Files reachable only from other unreached files are the same cluster: report who imports them.
  const importedBy = (graph.edgesTo.get(file) ?? []).map((edge) => edge.from).filter((from) => from !== file);
  unusedFiles.push({
    file,
    package: pkg.path,
    lines: lineCount(file),
    confidence: mentions.length === 0 && !computedIn.has(pkg.path) ? "likely" : "review",
    reasons,
    importedOnlyBy: [...new Set(importedBy)],
  });
}

const unusedExports = [];
for (const file of graph.files) {
  if (!inScope(file) || !reached.has(file) || isTestFile(file) || isStoryFile(file) || isToolConfig(file)) continue;
  const pkg = packageFor(file, graph.packages);
  const entries = graph.entriesOf(pkg);
  if (entries.has(file)) continue;
  // Framework entry files export what the framework reads (default, metadata, loader, generateStaticParams...).
  if (entryRegexes.some((regex) => regex.test(file))) continue;
  // A file a config names (bundler alias substitute, setupFiles, bin) exports what that tool expects.
  if (configEntries.has(file)) continue;
  let exported;
  try {
    exported = graph.exportsOf(file);
  } catch {
    continue;
  }
  const ownText = textOf(file);
  for (const { name, kind, line } of exported) {
    const { exposures, importers } = graph.importersOf(file, name);
    if (importers.length > 0) continue;
    const viaEntry = exposures.some((exposure) => entries.has(exposure.file));
    if (viaEntry && isLibrary(pkg)) continue; // public API of a library: consumers live outside this repo
    const usedLocally = new RegExp(`(?<![\\w$.])${name.replace(/[$]/gu, "\\$")}(?![\\w$])`, "gu");
    const localUses = name === "default" ? 0 : (ownText.match(usedLocally) ?? []).length - 1;
    const mentions = textMentions(name, file);
    const reasons = ["no file imports it, directly or through a barrel"];
    if (localUses > 0) reasons.push("still used inside its own file: remove the export keyword, not the declaration");
    if (mentions.length > 0) reasons.push(`the name appears as text in ${mentions.join(", ")}`);
    if (isLibrary(pkg)) reasons.push("library package: a consumer outside this repo may import it by deep path");
    if (computedIn.has(pkg.path)) reasons.push("the package has computed import()/require() calls the graph cannot follow");
    unusedExports.push({
      file,
      line,
      name,
      kind,
      package: pkg.path,
      action: localUses > 0 ? "unexport" : "remove",
      confidence: mentions.length === 0 && !isLibrary(pkg) && !computedIn.has(pkg.path) ? "likely" : "review",
      reasons,
    });
  }
}

const byPackage = {};
for (const entry of [...unusedFiles, ...unusedExports]) {
  const target = (byPackage[entry.package] ??= { unusedFiles: 0, unusedFileLines: 0, unusedExports: 0 });
  if ("lines" in entry) {
    target.unusedFiles += 1;
    target.unusedFileLines += entry.lines;
  } else {
    target.unusedExports += 1;
  }
}

const result = {
  tool: "unused",
  version: SKILL_VERSION,
  scope,
  note: "Candidates from the static import graph plus a text search. Not proof: runtime registries, string-keyed lookups, framework conventions not in the entry list and outside consumers are invisible. Confirm each with the user; deletion is tier C.",
  entryGlobs,
  computedImports: graph.computedImports.slice(0, 20),
  computedImportCount: graph.computedImports.length,
  summary: {
    unusedFiles: unusedFiles.length,
    unusedFileLines: unusedFiles.reduce((sum, entry) => sum + entry.lines, 0),
    unusedExports: unusedExports.length,
    likely: [...unusedFiles, ...unusedExports].filter((entry) => entry.confidence === "likely").length,
  },
  byPackage: Object.fromEntries(Object.entries(byPackage).sort(([a], [b]) => a.localeCompare(b))),
  unusedFiles: unusedFiles.sort((a, b) => a.file.localeCompare(b.file)),
  unusedExports: unusedExports.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
  parseFailures: graph.parseFailures,
};
if (args.out) writeFileSync(args.out, `${JSON.stringify(result, null, 2)}\n`);
printJson(result);
if (graph.files.length === 0) fail("no TypeScript/JavaScript sources found");
