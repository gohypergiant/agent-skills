# Quick Start Examples

## Overview

This guide shows the workflow for applying patterns from this skill: identify the issue, check `AGENTS.md`, load the appropriate reference file, and implement the solution.

## Examples

### Example 1: Replacing `any` at a Boundary

**❌ Incorrect: `any` disables type checking**
```ts
function parseUser(payload: any) {
  return {
    id: payload.id,
    email: payload.email,
  };
}
```

**Issue:** `any` bypasses type safety and lets unchecked external data flow deeper into the codebase.

**✅ Correct: validate unknown input at the boundary**
```ts
function parseUser(payload: unknown): User {
  const parsed = userSchema.parse(payload);

  return {
    id: parsed.id,
    email: parsed.email,
  };
}
```

**Why this is better:** `unknown` forces validation before use, keeping unsafe data at the boundary instead of silently propagating it.

**References:** [any.md](any.md), [input-validation.md](input-validation.md)

### Example 2: Returning Zero Values Instead of Nullable Values

**❌ Incorrect: nullable return forces defensive checks everywhere**
```ts
function findActiveUsers(users: User[]): User[] | null {
  const activeUsers = users.filter((user) => user.isActive);
  return activeUsers.length > 0 ? activeUsers : null;
}
```

**Issue:** Callers now need extra null handling before they can iterate, map, or compose the result.

**✅ Correct: return the identity value for the collection**
```ts
function findActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.isActive);
}
```

**Why this is better:** Returning `[]` preserves type safety, simplifies call sites, and makes composition straightforward.

**Reference:** [return-values.md](return-values.md)

### Example 3: Bounded Queue Processing

**❌ Incorrect: unbounded processing loop**
```ts
while (!queue.isEmpty()) {
  const task = queue.pop();
  if (!task) {
    continue;
  }

  processTask(task);
}
```

**Issue:** If queue state becomes corrupted or producers outpace consumers, this loop can run indefinitely.

**✅ Correct: enforce an explicit iteration limit**
```ts
const MAX_ITERATIONS = 10000;
let iterations = 0;

while (!queue.isEmpty() && iterations < MAX_ITERATIONS) {
  const task = queue.pop();
  if (!task) {
    continue;
  }

  processTask(task);
  iterations += 1;
}

if (iterations >= MAX_ITERATIONS) {
  throw new Error(`Queue processing exceeded ${MAX_ITERATIONS} iterations`);
}
```

**Why this is better:** Explicit limits turn a silent hang into a fast, diagnosable failure.

**Reference:** [bounded-iteration.md](bounded-iteration.md)

### Example 4: Flat Control Flow With Early Returns

**❌ Incorrect: nested control flow hides the happy path**
```ts
function getDisplayName(user: User | undefined): string {
  if (user) {
    if (user.profile) {
      if (user.profile.name) {
        return user.profile.name;
      }
    }
  }

  return 'Unknown user';
}
```

**Issue:** Deep nesting makes the main path harder to read and easier to break during edits.

**✅ Correct: guard clauses keep the function flat**
```ts
function getDisplayName(user: User | undefined): string {
  if (!user) {
    return 'Unknown user';
  }

  if (!user.profile) {
    return 'Unknown user';
  }

  if (!user.profile.name) {
    return 'Unknown user';
  }

  return user.profile.name;
}
```

**Why this is better:** Early returns make the failure cases obvious and keep the successful path easy to follow.

**Reference:** [control-flow.md](control-flow.md)

## Workflow Summary

1. **Identify the pattern** - Recognize anti-patterns such as nested conditionals, chained array methods, or repeated computations.
2. **Check `AGENTS.md`** - Find the relevant category and reference file link.
3. **Load the reference file** - Read the detailed examples and explanations.
4. **Apply the pattern** - Implement the ✅ correct version.
5. **Verify the improvement** - Benchmark if performance-related and test if safety-related.
