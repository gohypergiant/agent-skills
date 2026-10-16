#!/usr/bin/env node
// Heuristic: lists side-effect-looking calls per function in two versions of a file and reports what changed.
import { readFileSync } from "node:fs";
import path from "node:path";
import { SKILL_VERSION, fail, loadTypescript, parseArgs, printJson, scriptKindFor } from "./shared.mjs";

const USAGE = `usage: side-effect-diff.mjs <before-file> <after-file> [--typescript <path>]

Use git to produce the before file, e.g. git show HEAD:src/x.ts > /tmp/x.before.ts
Exits 1 when side-effect calls were added, removed or reordered within a function. That means
"review by hand", not "wrong".`;

const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["typescript"] });
if (args.help || args._.length !== 2) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
const ts = loadTypescript(process.cwd(), args.typescript);

// Receivers whose method calls are side effects whatever the method name.
// A call-expression receiver such as `useRouter().push` is matched on the call's name (`useRouter`).
const SIDE_EFFECT_RECEIVERS =
  /^(?:console|logger|log|metrics|telemetry|analytics|tracer|span|fs|fsp|http|https|axios|api|client|db|database|store|cache|redis|queue|bus|eventBus|events|emitter|socket|ws|websocket|localStorage|sessionStorage|indexedDB|navigator|document|window|history|location|process|globalThis|router|navigation|navigate|useRouter|useNavigate|useHistory|useNavigation|worker|channel|broadcast|storage|transport|publisher|producer|repository|repo|session|cookies)$/iu;
// Method names that are side effects on any receiver: they only exist on I/O, timer and event APIs.
const SIDE_EFFECT_METHODS =
  /^(?:fetch|request|sendBeacon|postMessage|writeFile|writeFileSync|appendFile|appendFileSync|unlink|unlinkSync|mkdir|mkdirSync|rm|rmSync|rename|setItem|removeItem|addEventListener|removeEventListener|dispatchEvent|emit|publish|subscribe|unsubscribe|track|setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame|cancelAnimationFrame|requestIdleCallback|navigate|reload|assign|pushState|replaceState|execute|exec|query|transaction|commit|rollback|connect|disconnect|invalidateQueries|refetchQueries|setQueryData|mutate|mutateAsync)$/u;
// Bare calls that are side effects by name: timers, dialogs, and router/framework navigation helpers.
const BARE =
  /^(?:fetch|setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame|cancelAnimationFrame|requestIdleCallback|queueMicrotask|alert|confirm|prompt|structuredClone|navigate|redirect|permanentRedirect|revalidatePath|revalidateTag)$/u;

function calls(file) {
  const text = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKindFor(ts, file));
  const byFunction = new Map();
  const stack = ["<module>"];
  const nameOf = (node) => {
    if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) && node.name) return node.name.getText(source);
    if (ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name)) return node.parent.name.text;
    if (ts.isPropertyAssignment(node.parent)) return node.parent.name.getText(source);
    return undefined;
  };
  const add = (label) => {
    const list = byFunction.get(stack.at(-1)) ?? [];
    list.push(label);
    byFunction.set(stack.at(-1), list);
  };
  const visit = (node) => {
    const isFunction =
      ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node);
    if (isFunction) {
      const name = nameOf(node);
      // Anonymous callbacks belong to their enclosing named function.
      stack.push(name ? (stack.length > 1 ? `${stack.at(-1)}.${name}` : name) : stack.at(-1));
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const callee = node.expression;
      const awaited = ts.isAwaitExpression(node.parent);
      let label;
      if (ts.isIdentifier(callee) && BARE.test(callee.text)) label = callee.text;
      if (ts.isPropertyAccessExpression(callee)) {
        const object = callee.expression.getText(source).replace(/\s+/gu, "");
        const head = object.replace(/^this\./u, "").split(/[.[(]/u)[0];
        const tail = object.split(".").at(-1);
        if (SIDE_EFFECT_RECEIVERS.test(head) || SIDE_EFFECT_RECEIVERS.test(tail) || SIDE_EFFECT_METHODS.test(callee.name.text)) {
          label = `${object}.${callee.name.text}`;
        }
      }
      // An awaited call is almost always I/O, whatever it is named.
      if (!label && awaited) label = callee.getText(source).replace(/\s+/gu, "");
      if (label) add(awaited ? `await ${label}` : label);
    }
    ts.forEachChild(node, visit);
    if (isFunction) stack.pop();
  };
  visit(source);
  return byFunction;
}

function multisetDiff(a, b) {
  const counts = new Map();
  for (const item of a) counts.set(item, (counts.get(item) ?? 0) + 1);
  for (const item of b) counts.set(item, (counts.get(item) ?? 0) - 1);
  const removed = [];
  const added = [];
  for (const [item, count] of counts) {
    for (let index = 0; index < Math.abs(count); index += 1) (count > 0 ? removed : added).push(item);
  }
  return { added, removed };
}

/** Order of the calls both versions share; reordering is reported even when calls were also added or removed. */
function sharedOrderChanged(was, now) {
  const remaining = new Map();
  for (const item of now) remaining.set(item, (remaining.get(item) ?? 0) + 1);
  const keptBefore = [];
  for (const item of was) {
    if ((remaining.get(item) ?? 0) > 0) {
      keptBefore.push(item);
      remaining.set(item, remaining.get(item) - 1);
    }
  }
  const pool = new Map();
  for (const item of keptBefore) pool.set(item, (pool.get(item) ?? 0) + 1);
  const keptAfter = [];
  for (const item of now) {
    if ((pool.get(item) ?? 0) > 0) {
      keptAfter.push(item);
      pool.set(item, pool.get(item) - 1);
    }
  }
  return JSON.stringify(keptBefore) !== JSON.stringify(keptAfter);
}

const [beforeFile, afterFile] = args._.map((file) => path.resolve(file));
let before;
let after;
try {
  before = calls(beforeFile);
  after = calls(afterFile);
} catch (error) {
  fail(error.message);
}

const findings = [];
for (const name of new Set([...before.keys(), ...after.keys()])) {
  const was = before.get(name) ?? [];
  const now = after.get(name) ?? [];
  const { added, removed } = multisetDiff(was, now);
  const reordered = sharedOrderChanged(was, now);
  if (added.length || removed.length || reordered) {
    findings.push({ function: name, added, removed, reordered, before: was, after: now });
  }
}

printJson({
  tool: "side-effect-diff",
  version: SKILL_VERSION,
  status: findings.length === 0 ? "unchanged" : "review",
  note: "Heuristic. Counts calls on I/O-like receivers, I/O-only method names, timers, navigation helpers and any awaited call. A router passed under another name (r.replace) is not seen. Renamed functions show as removed plus added. A finding means review by hand.",
  findings,
});
process.exit(findings.length === 0 ? 0 : 1);
