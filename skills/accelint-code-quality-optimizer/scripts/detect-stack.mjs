#!/usr/bin/env node
// Reports the stacks, packages, verification commands, configs and tools in a repo. Never runs commands.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  SKILL_VERSION,
  discoverPackages,
  isGoFile,
  isSourceFile,
  listFiles,
  loadOverlay,
  parseArgs,
  printJson,
  readJson,
  resolveRoot,
} from "./shared.mjs";

const USAGE = "usage: detect-stack.mjs [repo-root]";
const args = parseArgs(process.argv.slice(2), { flags: ["help"] });
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}

const root = resolveRoot(args._[0]);
const overlay = loadOverlay(root);
const files = listFiles(root, overlay.ignore);
const packages = discoverPackages(root, files);
const has = (rel) => existsSync(path.join(root, rel));
const rootPkg = readJson(path.join(root, "package.json"));

const packageJsons = files.filter((file) => path.posix.basename(file) === "package.json");
const dependsOn = (name) =>
  packageJsons.some((file) => {
    const pkg = readJson(path.join(root, file));
    return Boolean(pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name] ?? pkg?.peerDependencies?.[name]);
  });

const tsFiles = files.filter((file) => isSourceFile(file) && /\.[cm]?tsx?$/u.test(file));
const goFiles = files.filter(isGoFile);
const stacks = {
  node: rootPkg !== undefined || packageJsons.length > 0,
  typescript: tsFiles.length > 0 || files.some((file) => /(?:^|\/)tsconfig[^/]*\.json$/u.test(file)),
  react: dependsOn("react"),
  go: goFiles.length > 0,
  python: files.some((file) => /(?:^|\/)(?:pyproject\.toml|setup\.py|requirements[^/]*\.txt)$/u.test(file)),
  java: files.some((file) => /(?:^|\/)(?:pom\.xml|build\.gradle(?:\.kts)?)$/u.test(file)),
  rust: files.some((file) => /(?:^|\/)Cargo\.toml$/u.test(file)),
};

const packs = [];
if (stacks.typescript || stacks.react) packs.push("ts-react");
if (stacks.go) packs.push("go");
const unsupportedStacks = ["python", "java", "rust"].filter((stack) => stacks[stack]);

function packageManager() {
  const declared = rootPkg?.packageManager?.split("@")[0];
  if (declared) return declared;
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("package-lock.json")) return "npm";
  return rootPkg ? "npm" : null;
}

const pm = packageManager();
const runPrefix = pm === "npm" ? "npm run" : pm;

// Script names that usually verify code. The agent confirms each by running it once.
const ROLES = [
  ["lint", /^lint$/u],
  ["format-check", /^(?:format:check|fmt:check|prettier:check|check:format)$/u],
  ["typecheck", /^(?:typecheck|type-check|tsc|check:types|types:check)$/u],
  ["test", /^test$/u],
  ["build", /^build$/u],
  ["boundaries", /^(?:boundaries|lint:boundaries|depcruise)$/u],
];

const commands = [];
for (const [name] of Object.entries(rootPkg?.scripts ?? {})) {
  const role = ROLES.find(([, pattern]) => pattern.test(name))?.[0];
  if (role) commands.push({ role, command: `${runPrefix} ${name}`, source: "package.json" });
}
if (has("Makefile")) {
  const targets = readFileSync(path.join(root, "Makefile"), "utf8").match(/^[a-zA-Z][\w-]*(?=:)/gmu) ?? [];
  for (const target of targets) {
    const role = ROLES.find(([, pattern]) => pattern.test(target))?.[0];
    if (role && !commands.some((command) => command.role === role)) {
      commands.push({ role, command: `make ${target}`, source: "Makefile" });
    }
  }
}
for (const pkg of packages.filter((entry) => entry.go)) {
  const dir = pkg.path === "." ? "." : pkg.path;
  commands.push({ role: "go-vet", command: `go vet ./...`, cwd: dir, source: "go.mod default" });
  commands.push({ role: "go-test", command: `go test ./...`, cwd: dir, source: "go.mod default" });
}
for (const [role, command] of Object.entries(overlay.commands)) {
  const index = commands.findIndex((entry) => entry.role === role);
  const entry = { role, command, source: overlay.path };
  if (index === -1) commands.push(entry);
  else commands[index] = entry;
}

const CONFIG_PATTERNS = {
  agentGuidance: /(?:^|\/)(?:AGENTS|CLAUDE|CONTRIBUTING)\.md$/u,
  oxlint: /(?:^|\/)\.?oxlintrc(?:\.json)?$/u,
  eslint: /(?:^|\/)(?:\.eslintrc(?:\.[cm]?js|\.json|\.ya?ml)?|eslint\.config\.[cm]?[jt]s)$/u,
  formatter: /(?:^|\/)(?:\.oxfmtrc\.json|\.prettierrc(?:\.\w+)?|prettier\.config\.[cm]?js|biome\.jsonc?|\.editorconfig)$/u,
  tsconfig: /(?:^|\/)tsconfig[^/]*\.json$/u,
  vitest: /(?:^|\/)vitest\.(?:config|workspace)\.[cm]?[jt]s$/u,
  jest: /(?:^|\/)jest\.config\.[cm]?[jt]s$/u,
  boundaries: /(?:^|\/)(?:turbo\.json|\.dependency-cruiser\.[cm]?js|nx\.json)$/u,
  golangci: /(?:^|\/)\.golangci\.ya?ml$/u,
  ci: /^(?:\.gitlab-ci\.yml|\.github\/workflows\/[^/]+\.ya?ml)$/u,
};
const configs = Object.fromEntries(
  Object.entries(CONFIG_PATTERNS).map(([kind, pattern]) => [kind, files.filter((file) => pattern.test(file))]),
);

function onPath(binary) {
  const exts = process.platform === "win32" ? ["", ".exe", ".cmd", ".bat"] : [""];
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    if (exts.some((ext) => dir && existsSync(path.join(dir, `${binary}${ext}`)))) return true;
  }
  return false;
}
const localBin = (binary) => has(path.join("node_modules", ".bin", binary)) || has(path.join("node_modules", ".bin", `${binary}.cmd`));

/** `sg` is also util-linux's set-group command, so a binary only counts as ast-grep if its --version says so. */
function isAstGrep(binary) {
  const result = spawnSync(binary, ["--version"], { encoding: "utf8", shell: process.platform === "win32", timeout: 5000 });
  return result.status === 0 && /ast-grep/iu.test(`${result.stdout}${result.stderr}`);
}
const tools = {
  typescript: has("node_modules/typescript/package.json"),
  oxlint: localBin("oxlint"),
  eslint: localBin("eslint"),
  vitest: localBin("vitest"),
  astGrep: ["ast-grep", "sg"].some((binary) => onPath(binary) && isAstGrep(binary)),
  go: onPath("go"),
  staticcheck: onPath("staticcheck"),
  golangciLint: onPath("golangci-lint"),
};

const vcsHost = configs.ci.some((file) => file === ".gitlab-ci.yml")
  ? "gitlab"
  : configs.ci.some((file) => file.startsWith(".github/"))
    ? "github"
    : null;

const warnings = [];
if (packs.length === 0) warnings.push("No supported stack found. This version supports TypeScript/React and Go.");
if (unsupportedStacks.length > 0) warnings.push(`No pack yet for: ${unsupportedStacks.join(", ")}. Those files are not analysed.`);
if (stacks.typescript && !tools.typescript) {
  warnings.push("TypeScript is not installed in the repo. Install dependencies before running the scorecard, or pass --typescript.");
}
if (!commands.some((command) => command.role === "test")) warnings.push("No test command found. Ask the user for one before any change.");

printJson({
  tool: "detect-stack",
  version: SKILL_VERSION,
  root,
  overlay: overlay.path,
  stacks,
  packs,
  unsupportedStacks,
  packageManager: pm,
  vcsHost,
  packages: packages.map(({ name, path: dir, go, node }) => ({ name, path: dir, node, go })),
  commands,
  configs,
  tools,
  counts: { files: files.length, typescriptSources: tsFiles.length, goSources: goFiles.length },
  warnings,
});
