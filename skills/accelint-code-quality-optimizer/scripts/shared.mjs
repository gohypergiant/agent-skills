import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

export const SKILL_NAME = "accelint-code-quality-optimizer";
export const SKILL_VERSION = "1.4.0";

const IGNORED_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  ".pnpm-store",
  ".turbo",
  ".next",
  ".nuxt",
  ".cache",
  ".code-quality",
  "dist",
  "build",
  "out",
  "coverage",
  "vendor",
  "storybook-static",
]);

const SOURCE_EXTENSIONS = /\.(?:[cm]?[jt]sx?)$/u;
const GENERATED = /(?:\.gen\.|\.generated\.|\.min\.|(?:^|\/)generated\/|(?:^|\/)__generated__\/)/u;
const TEST_FILE = /(?:\.(?:test|spec)(?:-d)?\.[cm]?[jt]sx?$|(?:^|\/)__tests__\/)/u;

export function parseArgs(argv, { flags = [], options = [] } = {}) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      result._.push(arg);
      continue;
    }
    const [name, inline] = arg.slice(2).split(/=(.*)/su);
    if (flags.includes(name)) {
      result[name] = true;
    } else if (options.includes(name)) {
      const value = inline ?? argv[index + 1];
      if (value === undefined) fail(`--${name} needs a value`);
      if (inline === undefined) index += 1;
      result[name] = value;
    } else {
      fail(`unknown option --${name}`);
    }
  }
  return result;
}

export function fail(message) {
  process.stderr.write(`error: ${message}\n`);
  process.exit(2);
}

export function info(message) {
  process.stderr.write(`${message}\n`);
}

export function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export function toPosix(file) {
  return file.split(path.sep).join("/");
}

export function resolveRoot(arg) {
  const root = path.resolve(arg ?? ".");
  if (!existsSync(root) || !statSync(root).isDirectory()) fail(`not a directory: ${root}`);
  return root;
}

/** Strips comments and trailing commas so tsconfig-style JSONC parses. */
export function parseJsonc(text) {
  let out = "";
  let inString = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inString) {
      out += char;
      if (char === "\\") {
        out += next ?? "";
        index += 1;
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
      out += char;
    } else if (char === "/" && next === "/") {
      while (index < text.length && text[index] !== "\n") index += 1;
      out += "\n";
    } else if (char === "/" && next === "*") {
      index += 2;
      while (index < text.length && !(text[index] === "*" && text[index + 1] === "/")) index += 1;
      index += 1;
    } else {
      out += char;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/gu, "$1"));
}

export function readJson(file) {
  try {
    return parseJsonc(readFileSync(file, "utf8"));
  } catch {
    return undefined;
  }
}

/** Escapes every regular-expression metacharacter, backslash included, so `text` matches literally. */
export function escapeRegExp(text) {
  // Only syntax characters: in `u` mode an identity escape such as `\-` outside a class is a SyntaxError.
  return text.replace(/[\\^$.*+?()[\]{}|]/gu, "\\$&");
}

/** Expands `{a,b}` alternatives, which globToRegExp does not handle: "*.{ts,tsx}" -> ["*.ts", "*.tsx"]. */
export function expandBraces(glob) {
  const match = /\{([^{}]+)\}/u.exec(glob);
  if (!match) return [glob];
  return match[1].split(",").flatMap((option) => expandBraces(glob.replace(match[0], option)));
}

/** `**` matches whole path segments only, so `**\/generated/**` does not match `ungenerated/`. */
export function globToRegExp(glob) {
  let source = "";
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    if (char === "*" && glob[index + 1] === "*") {
      const atStart = index === 0 || glob[index - 1] === "/";
      const followedBySlash = glob[index + 2] === "/";
      if (atStart && followedBySlash) {
        source += "(?:.*/)?";
        index += 2;
      } else if (atStart && index + 2 === glob.length) {
        source += ".*";
        index += 1;
      } else {
        source += "[^/]*";
        index += 1;
      }
    } else if (char === "*") {
      source += "[^/]*";
    } else if (char === "?") {
      source += "[^/]";
    } else {
      source += char.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
    }
  }
  return new RegExp(`^${source}$`, "u");
}

export function loadOverlay(root) {
  const file = path.join(root, ".code-quality", "overlay.json");
  if (!existsSync(file)) return { path: null, ignore: [], thresholds: {}, commands: {}, decisions: {} };
  const overlay = readJson(file);
  if (overlay === undefined) fail(`${toPosix(path.relative(root, file))} is not valid JSON`);
  return {
    ...overlay,
    path: toPosix(path.relative(root, file)),
    ignore: overlay.ignore ?? [],
    thresholds: overlay.thresholds ?? {},
    commands: overlay.commands ?? {},
    decisions: overlay.decisions ?? {},
  };
}

/** Files git ignores under root, or null when root is not in a git work tree or git is unavailable. */
function gitIgnored(root) {
  const result = spawnSync("git", ["ls-files", "--others", "--ignored", "--exclude-standard", "--directory", "-z"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) return null;
  const prefix = spawnSync("git", ["rev-parse", "--show-prefix"], { cwd: root, encoding: "utf8" }).stdout?.trim() ?? "";
  return result.stdout
    .split("\0")
    .filter(Boolean)
    .map((entry) => (prefix && entry.startsWith(prefix) ? entry.slice(prefix.length) : entry));
}

/**
 * Lists every file under root, as posix paths relative to root, skipping dependency and build output,
 * files git ignores (when root is a git work tree) and overlay `ignore` globs.
 */
export function listFiles(root, ignore = []) {
  const ignored = ignore.map(globToRegExp);
  const gitEntries = gitIgnored(root) ?? [];
  const gitFiles = new Set(gitEntries.filter((entry) => !entry.endsWith("/")));
  const gitDirs = gitEntries.filter((entry) => entry.endsWith("/"));
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      const rel = toPosix(path.relative(root, full));
      if (ignored.some((pattern) => pattern.test(rel))) continue;
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name) && !gitDirs.includes(`${rel}/`)) visit(full);
      } else if (entry.isFile() && !gitFiles.has(rel)) {
        files.push(rel);
      }
    }
  };
  visit(root);
  return files.sort();
}

export function isGeneratedFile(file) {
  return GENERATED.test(file);
}

export function isSourceFile(file) {
  return SOURCE_EXTENSIONS.test(file) && !/\.d\.[cm]?ts$/u.test(file) && !GENERATED.test(file);
}

// Only known tool stems: product files such as src/config.ts or router.config.ts are code and must be measured.
const TOOL_STEMS =
  "vitest|vite|jest|eslint|prettier|playwright|tailwind|postcss|next|nuxt|astro|svelte|turbo|tsup|tsdown|unbuild|rollup|rolldown|webpack|rspack|esbuild|babel|commitlint|lint-staged|stylelint|storybook|cypress|karma|metro|drizzle|knip|vitepress|docusaurus|electron|capacitor|oxlint|biome|lefthook|release|changeset";
// The optional segment covers variants such as vitest.acceptance.config.ts and playwright.inc4-batch.config.ts.
const TOOL_CONFIG = new RegExp(
  `^(?:\\.?(?:${TOOL_STEMS})(?:\\.[\\w-]+)?\\.(?:config|setup|workspace)(?:\\.[\\w-]+)?\\.[cm]?[jt]s|\\.?(?:${TOOL_STEMS})rc\\.[cm]?[jt]s|vite-env\\.d\\.ts)$`,
  "u",
);

/** Tool configuration such as vitest.config.ts or eslint.config.mjs: not product code. */
export function isToolConfig(file) {
  return TOOL_CONFIG.test(path.posix.basename(file));
}

export function isTestFile(file) {
  return TEST_FILE.test(file);
}

const STORY_FILE = /\.(?:stories|story)\.[cm]?[jt]sx?$|\.mdx$/u;

/** Storybook stories are documentation fixtures: measured like tests, not like product code. */
export function isStoryFile(file) {
  return STORY_FILE.test(file);
}

export function isGoFile(file) {
  return file.endsWith(".go") && !GENERATED.test(file) && !/(?:^|\/)testdata\//u.test(file);
}

function parseWorkspaceYaml(text) {
  const patterns = [];
  let inPackages = false;
  for (const line of text.split(/\r?\n/u)) {
    if (/^packages\s*:/u.test(line)) {
      inPackages = true;
    } else if (inPackages && /^\s*-\s*/u.test(line)) {
      patterns.push(line.replace(/^\s*-\s*/u, "").replace(/\s+#.*$/u, "").replace(/^["']|["']$/gu, ""));
    } else if (inPackages && /^\S/u.test(line)) {
      inPackages = false;
    }
  }
  return patterns;
}

function expandDirPattern(root, pattern) {
  const segments = pattern.replace(/\/$/u, "").split("/").filter(Boolean);
  const results = [];
  const step = (dir, index) => {
    if (index === segments.length) {
      results.push(dir);
      return;
    }
    const segment = segments[index];
    const full = path.join(root, dir);
    if (!existsSync(full)) return;
    if (segment === "**") {
      step(dir, index + 1);
      for (const entry of readdirSync(full, { withFileTypes: true })) {
        if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) step(path.posix.join(dir, entry.name), index);
      }
    } else if (segment.includes("*")) {
      const regex = globToRegExp(segment);
      for (const entry of readdirSync(full, { withFileTypes: true })) {
        if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name) && regex.test(entry.name)) {
          step(path.posix.join(dir, entry.name), index + 1);
        }
      }
    } else {
      step(path.posix.join(dir, segment), index + 1);
    }
  };
  step("", 0);
  return results;
}

/** Finds workspace packages (pnpm, npm/yarn workspaces) and Go modules. The repo root is always included. */
export function discoverPackages(root, files) {
  const rootPkg = readJson(path.join(root, "package.json"));
  const patterns = [];
  const workspaceFile = path.join(root, "pnpm-workspace.yaml");
  if (existsSync(workspaceFile)) patterns.push(...parseWorkspaceYaml(readFileSync(workspaceFile, "utf8")));
  const workspaces = rootPkg?.workspaces;
  if (Array.isArray(workspaces)) patterns.push(...workspaces);
  else if (Array.isArray(workspaces?.packages)) patterns.push(...workspaces.packages);

  const dirs = new Set();
  const excluded = new Set();
  for (const pattern of patterns) {
    const target = pattern.startsWith("!") ? excluded : dirs;
    for (const dir of expandDirPattern(root, pattern.replace(/^!/u, ""))) {
      if (existsSync(path.join(root, dir, "package.json"))) target.add(dir);
    }
  }
  for (const file of files) {
    if (path.posix.basename(file) === "go.mod") dirs.add(path.posix.dirname(file) === "." ? "" : path.posix.dirname(file));
  }
  for (const dir of excluded) dirs.delete(dir);

  const packages = [...dirs]
    .filter((dir) => dir !== "")
    .sort()
    .map((dir) => {
      const pkg = readJson(path.join(root, dir, "package.json"));
      const goMod = existsSync(path.join(root, dir, "go.mod"));
      return { name: pkg?.name ?? goModuleName(root, dir) ?? dir, path: dir, go: goMod, node: pkg !== undefined };
    });
  packages.push({
    name: rootPkg?.name ?? goModuleName(root, "") ?? path.basename(root),
    path: ".",
    go: existsSync(path.join(root, "go.mod")),
    node: rootPkg !== undefined,
    root: true,
  });
  return packages;
}

function goModuleName(root, dir) {
  const file = path.join(root, dir, "go.mod");
  if (!existsSync(file)) return undefined;
  return /^module\s+(\S+)/mu.exec(readFileSync(file, "utf8"))?.[1];
}

/** The package that owns a file is the deepest package directory that contains it. */
export function packageFor(file, packages) {
  let best = packages.find((pkg) => pkg.root);
  for (const pkg of packages) {
    if (pkg.root) continue;
    if ((file === pkg.path || file.startsWith(`${pkg.path}/`)) && (best.root || pkg.path.length > best.path.length)) {
      best = pkg;
    }
  }
  return best;
}

/** Resolves the target repo's own TypeScript so the AST matches the compiler the repo uses. */
export function loadTypescript(root, explicit) {
  const candidates = [explicit, process.env.CQO_TYPESCRIPT].filter(Boolean);
  for (const candidate of candidates) {
    try {
      return createRequire(path.resolve(candidate, "package.json"))(path.resolve(candidate));
    } catch {
      // try the next candidate
    }
  }
  for (const base of [root, process.cwd()]) {
    try {
      return createRequire(path.join(base, "package.json"))("typescript");
    } catch {
      // try the next base
    }
  }
  fail(
    "TypeScript is required to parse sources. Install the repo's dependencies, or pass --typescript <path to the typescript package>, or set CQO_TYPESCRIPT.",
  );
  return undefined;
}

export function scriptKindFor(ts, file) {
  if (file.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (file.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (/\.[cm]?js$/u.test(file)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

export function parseSource(ts, root, file) {
  const text = readFileSync(path.join(root, file), "utf8");
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKindFor(ts, file));
}

export function countLines(text) {
  if (text.length === 0) return 0;
  return text.split(/\r?\n/u).length - (text.endsWith("\n") ? 1 : 0);
}
