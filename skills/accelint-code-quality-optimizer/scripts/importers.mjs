#!/usr/bin/env node
// Classifies each export of a file as file-private, package-internal or package-public, from the import graph.
import { existsSync } from "node:fs";
import path from "node:path";
import { createImportGraph } from "./import-graph.mjs";
import { SKILL_VERSION, fail, packageFor, parseArgs, printJson, resolveRoot, toPosix } from "./shared.mjs";

const USAGE = `usage: importers.mjs [repo-root] <file> [<file>...] [--typescript <path>]

For each file, lists its exports and who imports them, and gives each export a visibility:
  file-private      not exported (reported only for completeness)
  package-internal  exported, imported only from inside the same workspace package (or not imported
                    at all in an app package, one with no package.json entry points)
  package-public    reachable from the package's package.json exports/main/types/module,
                    re-exported by an entry file, or imported from another workspace package
  unknown           exported from a library package and no importer was found; treat as package-public

Imports are resolved with the TypeScript compiler using the nearest tsconfig (paths, baseUrl, exports,
workspace symlinks), with a plain relative/workspace-name fallback when dependencies are not installed.`;

const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["typescript"] });
if (args.help || args._.length === 0) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
const first = path.resolve(args._[0]);
const rootGiven = args._.length > 1 && existsSync(first) && !path.extname(first);
const root = resolveRoot(rootGiven ? args._[0] : ".");
const targets = (rootGiven ? args._.slice(1) : args._).map((file) => toPosix(path.relative(root, path.resolve(root, file))));
const graph = createImportGraph(root, { typescript: args.typescript });

const results = [];
const skipped = [];
for (const target of targets) {
  if (!graph.fileSet.has(target)) {
    skipped.push({ file: target, reason: "not a measured source file (missing, generated, declaration or ignored)" });
    continue;
  }
  const pkg = packageFor(target, graph.packages);
  const entrySet = new Set(graph.entriesOf(pkg).keys());
  const exportsReport = graph.exportsOf(target).map(({ name }) => {
    const { exposures, importers: all } = graph.importersOf(target, name);
    const viaEntries = [...new Set(exposures.filter((exposure) => entrySet.has(exposure.file)).map((exposure) => exposure.file))];
    const otherPackages = [...new Set(all.map((entry) => entry.package).filter((dir) => dir !== pkg.path))];
    const isRootPackage = pkg.root === true;
    let visibility = "package-internal";
    const reasons = [];
    if (viaEntries.length > 0 && !isRootPackage) {
      visibility = "package-public";
      reasons.push(`exposed by package entry ${viaEntries.join(", ")}`);
    }
    if (otherPackages.length > 0) {
      visibility = "package-public";
      reasons.push(`imported from ${otherPackages.join(", ")}`);
    }
    if (reasons.length === 0) {
      if (all.length > 0) reasons.push("imported only inside the package");
      else if (entrySet.size === 0 || isRootPackage) reasons.push("no importers found; app package without package entries");
      else {
        // A library export nothing imports is either dead or reached in a way the static graph cannot see.
        visibility = "unknown";
        reasons.push("no importers found in a library package: treat as package-public");
      }
    }
    return { name, visibility, reasons, importers: all.slice(0, 50), importerCount: all.length };
  });
  results.push({
    file: target,
    package: pkg.path,
    packageName: pkg.name,
    packageEntries: [...entrySet],
    isPackageEntry: entrySet.has(target),
    exports: exportsReport,
    summary: {
      "package-public": exportsReport.filter((entry) => entry.visibility === "package-public").length,
      "package-internal": exportsReport.filter((entry) => entry.visibility === "package-internal").length,
      unknown: exportsReport.filter((entry) => entry.visibility === "unknown").length,
    },
  });
}

printJson({
  tool: "importers",
  version: SKILL_VERSION,
  note: "Static import graph resolved with the compiler (tsconfig paths, package exports, workspace links). Dynamic imports with computed specifiers and runtime registries are not seen, so 'unknown' means unproven, not unused: never delete code on that basis.",
  results,
  skipped,
});
if (results.length === 0) fail("none of the given files are measured source files");
