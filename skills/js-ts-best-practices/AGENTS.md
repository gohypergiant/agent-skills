# JavaScript and TypeScript Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring JavaScript or TypeScript code at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for JavaScript or TypeScript applications, designed for AI agents and LLMs. Rules are prioritized by impact from critical to incremental. Each rule includes detailed explanations, and real-world examples comparing incorrect vs. correct implementations to guide automated refactoring and code generation.

---

## Table of Contents

1. [General](#1-general)
    - 1.1 [Naming Conventions](#11-naming-conventions)
    - 1.2 [Functions](#12-functions)
    - 1.3 [Control Flow](#13-control-flow)
    - 1.4 [State Management](#14-state-management)
    - 1.5 [Return Values](#15-return-values)
    - 1.6 [Misc](#16-misc)
2. [TypeScript](#2-typescript)
    - 2.1 [Any](#21-any)
    - 2.2 [Enums](#22-enums)
    - 2.3 [Type vs. Interface](#23-type-vs-interface)
3. [Safety](#3-safety)
    - 3.1 [Input Validation](#31-input-validation)
    - 3.2 [Assertions](#32-assertions)
    - 3.3 [Error Handling](#33-error-handling)
    - 3.4 [Error Messages](#34-error-messages)
4. [Performance](#4-performance)

---

## 1. General

### 1.1 Naming Conventions

Use descriptive, meaningful names. Stick to complete words unless abbreviation is widely recognized (ID, URL, RCS).

**❌ Incorrect: non descriptive and meaning cannot be inferred**
```ts
const usrNm = /**/;
const a = /**/;
let data;
```

**✅ Correct: descriptive and meaningful**
```ts
const numberOfProducts = /**/;
const customerList = /**/;
const radarCrossSection = lookupCrossSection(entity.platformType);
```

For units and qualifiers append in descending order of significance.

**❌ Incorrect: max qualifier is not appended**
```ts
const maxLatencyMs = /**/;
```

**✅ Correct: qualifiers appended and in correct order**
```ts
const latencyMsMax = /**/;
const latencyMsMin = /**/;
```

For Booleans prefix with `is` or `has`.

**❌ Incorrect: no is or has prefix**
```ts
const visible = true;
const children = false;
```

**✅ Correct: contains is or has prefix**
```ts
const isVisible = true;
const hasChildren = false;
```

### 1.2 Functions

- Keep functions under 50 lines
- Limit parameters; prefer simple return types
- Avoid default parameters; make all values explicit at call site
- Use `function` keyword for pure functions
- Use arrow functions only for simple cases (< 3 instructions)

**❌ Incorrect: implicit defaults**
```ts
const position = getPosition();
```

**✅ Correct: explicit values**
```ts
const position = getPosition(330);
```

### 1.3 Control Flow

Use simple, flat control flow. Prefer early returns over nested conditionals.

**❌ Incorrect: nested structure**
```ts
if (condition1) {
  if (condition2) {
    if (condition3) {
      result = /* something4 */;
    } else {
      result = /* something3 */;
    }
  } else {
    result = /* something2 */;
  }
} else {
  result = /* something1 */;
}
```

**✅ Correct: early returns**
```ts
if (!condition1) {
  return /* something1 */;
}

if (!condition2) {
  return /* something2 */;
}

if (!condition3) { 
  return /* something3 */;
}

return /* something4 */;
```

Use block style for early control flow returns instead of inline.

**❌ Incorrect: inline**
```ts
if (!condition1) return /* something1 */;
if (!condition2) return /* something2 */;
if (!condition3) return /* something3 */;
```

**✅ Correct: block style**
```ts
if (!condition1) {
  return /* something1 */;
}

if (!condition2) {
  return /* something2 */;
}

if (!condition3) { 
  return /* something3 */;
}

return /* something4 */;
```

### 1.4 State Management

- Use `const` instead of `let` whenever possible
- Use `let` only for valid performance reasons
- Declare variables at smallest possible scope
- Never mutate passed references; create copies instead
- Centralize state manipulation in parent functions; keep leaf functions pure

**❌ Incorrect: reassignment**
```ts
let color = src.substring(start + 1, end - 1);
color = color.replace(/\s/g, '');
```

**✅ Correct: single assignment**
```ts
const color = src.substring(start + 1, end - 1).replace(/\s/g, '');
```

**❌ Incorrect: conditional with let**
```ts
let result;
if (validation.success) {
  result = primary.data.options.map(addIndex);
} else {
  result = fallback.data.options.map(addIndex);
}
```

**✅ Correct: ternary with const**
```ts
const config = validation.success ? primary : fallback;
const result = config.data.options.map(addIndex);
```

### 1.5 Return Values

Always return a zero value (identity element) instead of `null` or `undefined`. This eliminates downstream branching.

**❌ Incorrect: requires downstream check**
```ts
function makeList(someVar) {
  if (!someVar) return;
  return toList(someVar);
}

function anotherFn() {
  const baseList = makeList(/*...*/);
  if (!Array.isArray(baseList)) return;
  return baseList.map((x) => {/*...*/});
}
```

**✅ Correct: no checks needed**
```ts
function makeList(someVar) {
  if (!someVar) return [];
  return toList(someVar);
}

function anotherFn() {
  return getSomeList(/*...*/).map((x) => {/*...*/});
}
```

### 1.6 Misc

- Use Linux line endings (`\n`)
- Employ defensive/negative-space programming
- Return identity/zero elements instead of null/undefined
- Consider cache locality

---

## 2. TypeScript

### 2.1 Any

Avoid `any` type and always provide a correct return type.

### 2.2 Enums

Avoid `enum` and utilize `as const` structs instead. This prevents extra JavaScript code and forces TypeScript to infer the narrowest possible literal types for the object's properties.

**❌ Incorrect: enum utilized**
```ts
enum Direction {
  up = "UP",
  down = "DOWN",
}
```

**✅ Correct: struct with `as const`**
```ts
const Direction = {
  up: 'UP',
  down: 'DOWN',
} as const;
```

### 2.3 Type vs. Interface

Prefer `type` over `interface for type aliases, unions, intersections, branded types, and functional patterns. Use `interface` only when you absolutely need:

- Declaration merging (intentional extensibility)
- Class implementation contracts (`implements`)
- Legacy API compatibility

**❌ Incorrect: interface not preferred for use case**
```ts
interface AvatarProps { avatar: string; }
```

**✅ Correct: type preferred for use case**
```ts
type AvatarProps = { avatar: string; }
```

---

## 3. Safety

### 3.1 Input Validation

### 3.2 Assertions

### 3.3 Error Handling

### 3.4 Error Messages

---

## 4. Performance

### 4.x Bounded Iteration

Set limits on all loops, queues, and data structures.

**❌ Incorrect: unbounded**
```ts
while (true) {
  if (someCondition) break;
}
```

**✅ Correct: bounded**
```ts
for (const item of items) {
  // process item
}
```