#!/usr/bin/env node
// Infers the repo's de facto conventions and reports each one as a proposal, never as a decided standard.
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import {
  SKILL_VERSION,
  discoverPackages,
  fail,
  isSourceFile,
  isTestFile,
  isToolConfig,
  listFiles,
  loadOverlay,
  loadTypescript,
  packageFor,
  parseArgs,
  parseSource,
  printJson,
  readJson,
  resolveRoot,
  toPosix,
  globToRegExp,
} from "./shared.mjs";

const USAGE = "usage: conventions.mjs [repo-root] [--scope <dir>] [--typescript <path>] [--min-share <0-1>]";
const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["scope", "typescript", "min-share"] });
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}

const root = resolveRoot(args._[0]);
const minShare = args["min-share"] === undefined ? 0.7 : Number(args["min-share"]);
if (!(minShare > 0.5 && minShare <= 1)) fail("--min-share must be between 0.5 and 1");
const overlay = loadOverlay(root);
const allFiles = listFiles(root, overlay.ignore);
const packages = discoverPackages(root, allFiles);
const scope = args.scope ? toPosix(path.normalize(args.scope)).replace(/\/$/u, "") : ".";
const inScope = (file) => scope === "." || file === scope || file.startsWith(`${scope}/`);
const files = allFiles.filter(inScope);
const sources = files.filter(isSourceFile);
const ts = sources.length > 0 ? loadTypescript(root, args.typescript) : undefined;

/**
 * Paths where a framework dictates the pattern, so they must not vote: Next.js and Remix route files need
 * default exports, Storybook needs a default export of story metadata. The overlay can add more per convention:
 * "conventionExclusions": { "module-exports": ["src/pages/**"] }.
 */
const FRAMEWORK_EXCLUSIONS = {
  "module-exports": [
    "**/app/**/{page,layout,template,loading,error,not-found,default,global-error,route,head,opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.*",
    "**/pages/**",
    "**/app/routes/**",
    "**/*.stories.*",
    "**/middleware.*",
    "**/instrumentation.*",
  ],
  "file-naming": ["**/*.stories.*", "**/app/routes/**", "**/pages/**"],
};
const excluded = {};
const exclusionCounts = {};
for (const [id, globs] of Object.entries(FRAMEWORK_EXCLUSIONS)) excluded[id] = globs.flatMap(expandBraces).map(globToRegExp);
for (const [id, globs] of Object.entries(overlay.conventionExclusions ?? {})) {
  excluded[id] = [...(excluded[id] ?? []), ...globs.flatMap(expandBraces).map(globToRegExp)];
}

function expandBraces(glob) {
  const match = /\{([^{}]+)\}/u.exec(glob);
  if (!match) return [glob];
  return match[1].split(",").flatMap((option) => expandBraces(glob.replace(match[0], option)));
}

/** Each observation is one file or package voting for one value of a convention. */
const observations = new Map();
const observe = (id, value, where) => {
  const file = where.replace(/(?::\d+| \(.*\))$/u, "");
  if (excluded[id]?.some((pattern) => pattern.test(file))) {
    exclusionCounts[id] = (exclusionCounts[id] ?? 0) + 1;
    return;
  }
  const entry = observations.get(id) ?? new Map();
  const list = entry.get(value) ?? [];
  list.push(where);
  entry.set(value, list);
  observations.set(id, entry);
};

function nameCase(base) {
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(base)) return /-/u.test(base) ? "kebab-case" : "lowercase";
  if (/^[a-z0-9]+(?:_[a-z0-9]+)+$/u.test(base)) return "snake_case";
  if (/^[A-Z][A-Za-z0-9]*$/u.test(base)) return "PascalCase";
  if (/^[a-z][A-Za-z0-9]*$/u.test(base)) return "camelCase";
  return "mixed";
}

for (const file of sources) {
  const base = path.posix.basename(file).replace(/\.(?:test|spec)(?:-d)?(?=\.)/u, "").replace(/\.[^.]+$/u, "");
  const stem = base.split(".")[0];
  if (stem !== "index" && !isToolConfig(file)) {
    const kind = nameCase(stem);
    if (kind !== "lowercase") observe("file-naming", kind, file);
  }
  if (isTestFile(file)) {
    observe("test-suffix", /\.spec(?:-d)?\./u.test(file) ? ".spec" : ".test", file);
    const dir = path.posix.dirname(file);
    observe("test-placement", /(?:^|\/)(?:test|tests|__tests__)(?:\/|$)/u.test(dir) ? "separate test directory" : "co-located", file);
  }
}

for (const file of sources) {
  let source;
  try {
    source = parseSource(ts, root, file);
  } catch {
    continue;
  }
  const test = isTestFile(file);
  const isConfig = isToolConfig(file);
  let hasDefault = false;
  let hasNamed = false;
  const visit = (node) => {
    if (ts.isExportAssignment(node) && !node.isExportEquals) hasDefault = true;
    const modifiers = ts.canHaveModifiers?.(node) ? (ts.getModifiers(node) ?? []) : [];
    const exported = modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (exported) {
      if (modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) hasDefault = true;
      else hasNamed = true;
    }
    if (ts.isExportDeclaration(node)) hasNamed = true;
    if (ts.isInterfaceDeclaration(node)) {
      const merges = node.heritageClauses === undefined && node.parent && ts.isModuleBlock(node.parent);
      if (!merges) observe("type-declarations", "interface", `${file}:${line(source, node)}`);
    }
    if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
      observe("type-declarations", "type", `${file}:${line(source, node)}`);
    }
    if (ts.isEnumDeclaration(node)) observe("constant-sets", "enum", `${file}:${line(source, node)}`);
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isAsExpression(node.initializer) &&
      ts.isTypeReferenceNode(node.initializer.type) &&
      node.initializer.type.typeName.getText(source) === "const" &&
      ts.isObjectLiteralExpression(node.initializer.expression)
    ) {
      observe("constant-sets", "as const object", `${file}:${line(source, node)}`);
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === "react") {
      const clause = node.importClause;
      if (clause && !clause.isTypeOnly) {
        if (clause.name) observe("react-imports", "default import", `${file}:${line(source, node)}`);
        else if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
          observe("react-imports", "namespace import", `${file}:${line(source, node)}`);
        } else if (clause.namedBindings) observe("react-imports", "named imports", `${file}:${line(source, node)}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!test && !isConfig && (hasDefault || hasNamed)) {
    observe("module-exports", hasDefault ? (hasNamed ? "default and named" : "default export") : "named exports only", file);
  }
}

function line(source, node) {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

/** Follows `extends` through relative paths and node_modules. Unresolved bases make the setting unknown. */
function resolveTsconfig(file, seen = new Set()) {
  if (seen.has(file)) return { options: {}, unresolved: [] };
  seen.add(file);
  const config = readJson(file);
  if (!config) return { options: {}, unresolved: [toPosix(path.relative(root, file))] };
  let options = {};
  const unresolved = [];
  const bases = Array.isArray(config.extends) ? config.extends : config.extends ? [config.extends] : [];
  for (const base of bases) {
    let target;
    if (base.startsWith(".") || path.isAbsolute(base)) {
      target = path.resolve(path.dirname(file), base);
      if (!target.endsWith(".json") && !existsSync(target)) target += ".json";
    } else {
      try {
        target = createRequire(file).resolve(base.endsWith(".json") ? base : `${base}.json`);
      } catch {
        try {
          target = createRequire(file).resolve(base);
        } catch {
          target = undefined;
        }
      }
    }
    if (target && existsSync(target)) {
      const resolved = resolveTsconfig(target, seen);
      options = { ...options, ...resolved.options };
      unresolved.push(...resolved.unresolved);
    } else {
      unresolved.push(base);
    }
  }
  return { options: { ...options, ...config.compilerOptions }, unresolved, extends: bases };
}

const STRICT_FLAGS = ["strict", "noUncheckedIndexedAccess", "verbatimModuleSyntax", "noImplicitOverride", "exactOptionalPropertyTypes"];
const tsconfigs = files.filter((file) => path.posix.basename(file) === "tsconfig.json" && !file.includes("/fixtures/"));
for (const file of tsconfigs) {
  const resolved = resolveTsconfig(path.join(root, file));
  const pkg = packageFor(file, packages).path;
  observe("tsconfig-base", resolved.extends?.length ? "extends a shared base" : "standalone", file);
  for (const flag of STRICT_FLAGS) {
    const value = resolved.options[flag];
    const label = value === undefined ? (resolved.unresolved.length ? "unknown (unresolved base)" : "unset") : String(value);
    observe(`tsconfig:${flag}`, label, `${file} (${pkg})`);
  }
}

const vitestConfigs = files.filter((file) => /(?:^|\/)vitest\.config\.[cm]?[jt]s$/u.test(file));
for (const file of vitestConfigs) {
  const text = readFileSync(path.join(root, file), "utf8");
  const flags = ["clearMocks", "mockReset", "restoreMocks"].filter((flag) => new RegExp(`\\b${flag}\\s*:\\s*true`, "u").test(text));
  const sharesPreset = /mergeConfig|from\s+["'][^"']*vitest-config/u.test(text);
  const value = flags.length === 3 ? "all three set" : flags.length === 0 ? (sharesPreset ? "unknown (shared preset)" : "none set") : `partial (${flags.join(", ")})`;
  observe("vitest-mock-cleanup", value, file);
}

/** Matching accelint guidance, so a majority that contradicts it is flagged instead of adopted. */
const GUIDANCE = {
  "file-naming": { skill: "accelint-ts-testing", reference: "references/organization.md", recommends: "kebab-case" },
  "test-placement": { skill: "accelint-ts-testing", reference: "references/organization.md", recommends: "co-located" },
  "type-declarations": { skill: "accelint-ts-best-practices", reference: "references/type-vs-interface.md", recommends: "type" },
  "constant-sets": { skill: "accelint-ts-best-practices", reference: "references/enums.md", recommends: "as const object" },
  "react-imports": { skill: "accelint-react-best-practices", reference: "references/named-imports.md", recommends: "named imports" },
  "vitest-mock-cleanup": { skill: "accelint-ts-testing", reference: "references/vitest-features.md", recommends: "all three set" },
  "tsconfig:strict": { skill: null, reference: null, recommends: "true" },
};

const QUESTIONS = {
  "file-naming": "How are source file names cased?",
  "test-suffix": "Which test file suffix is used?",
  "test-placement": "Where do test files live?",
  "module-exports": "How do modules export?",
  "type-declarations": "How are object types declared?",
  "constant-sets": "How are sets of constants declared?",
  "react-imports": "How is React imported?",
  "tsconfig-base": "Do tsconfig files extend a shared base?",
  "vitest-mock-cleanup": "Do Vitest configs reset mocks between tests?",
};
for (const flag of STRICT_FLAGS) QUESTIONS[`tsconfig:${flag}`] = `What is ${flag} set to in each tsconfig?`;

const conventions = [];
for (const [id, values] of observations) {
  const total = [...values.values()].reduce((sum, list) => sum + list.length, 0);
  const ranked = [...values.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const [dominant, dominantList] = ranked[0];
  const share = dominantList.length / total;
  const deviating = ranked.slice(1).flatMap(([value, list]) => list.map((where) => ({ value, where })));
  const guidance = GUIDANCE[id] ?? null;
  const knownValues = ranked.filter(([value]) => !value.startsWith("unknown"));
  const status = ranked.length === 1 ? "uniform" : share >= minShare ? "proposal" : "conflict";
  conventions.push({
    id,
    question: QUESTIONS[id] ?? id,
    status,
    observed: Object.fromEntries(ranked.map(([value, list]) => [value, list.length])),
    dominant,
    share: Math.round(share * 1000) / 1000,
    deviatingCount: deviating.length,
    deviating: deviating.slice(0, 25),
    guidance,
    majorityContradictsGuidance: guidance !== null && knownValues.length > 0 && knownValues[0][0] !== guidance.recommends,
  });
}
conventions.sort((a, b) => {
  const order = { conflict: 0, proposal: 1, uniform: 2 };
  return order[a.status] - order[b.status] || Number(b.majorityContradictsGuidance) - Number(a.majorityContradictsGuidance) || a.id.localeCompare(b.id);
});

printJson({
  tool: "conventions",
  version: SKILL_VERSION,
  scope,
  minShare,
  note: "Every entry is a proposal. Nothing here is a standard until the user approves it into standards.md.",
  excludedByFramework: exclusionCounts,
  conventions,
});
