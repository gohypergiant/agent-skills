╭────────────────────────────╮
│ accelint-ts-best-practices │
╰────────────────────────────╯
# Code Correctness Audit Report: Task Queue Manager

## Executive Summary

Completed systematic audit of `src/services/task-queue.ts` following accelint-ts-best-practices standards. Identified 7 code correctness issues across 3 severity levels. This is a critical background job processing system that handles user-submitted tasks, API integrations, and scheduled operations.

**Key Findings:**
- 2 Critical issues (unbounded queue, missing input validation)
- 3 High severity issues (type safety with `any`, parameter mutation, missing error handling)
- 2 Medium severity issues (naming conventions, missing early returns)

**Impact Assessment:**

This module processes potentially untrusted user input and manages long-running background tasks. The critical issues create **DoS vulnerabilities** through unbounded resource consumption and **security risks** through unvalidated external data. Type safety violations with `any` disable compile-time checks across the entire task processing pipeline. Parameter mutations create hidden side effects that make debugging difficult. The combination of these issues significantly increases bug rates and makes the system fragile under load.

---

## Phase 1: Identified Issues

### 1. processTaskQueue() - Unbounded Queue Processing

**Location:** `src/services/task-queue.ts:89-105`

```ts
// ❌ Current: Processes entire queue without limit
export async function processTaskQueue(tasks: Task[]): Promise<void> {
  while (tasks.length > 0) {
    const task = tasks.shift();
    if (task) {
      await executeTask(task);
    }
  }
}
```

**Issue:**
- Processes unbounded number of tasks in a single execution
- Could run for hours/days if queue is large or tasks are added continuously
- Causes memory exhaustion, blocks other operations, enables DoS attacks

**Severity:** Critical
**Category:** Safety
**Impact:**
- **Potential bugs:** Queue could grow faster than it's processed, causing memory leaks
- **Type safety:** N/A
- **Maintainability:** Difficult to add timeout or cancellation logic later
- **Runtime failures:** Process crash from memory exhaustion, DoS vulnerability

**Pattern Reference:** bounded-iteration.md

**Recommended Fix:**
```ts
// ✅ Bounded queue processing with explicit limits
export async function processTaskQueue(
  tasks: Task[],
  maxTasks = 100,
  timeoutMs = 60000
): Promise<{ processed: number; remaining: number }> {
  const startTime = Date.now();
  let processed = 0;

  while (tasks.length > 0 && processed < maxTasks) {
    if (Date.now() - startTime > timeoutMs) break;

    const task = tasks.shift();
    if (task) {
      await executeTask(task);
      processed++;
    }
  }

  return { processed, remaining: tasks.length };
}
```

---

### 2. executeTask() - Missing Input Validation

**Location:** `src/services/task-queue.ts:112-120`

```ts
// ❌ Current: No validation of external task data
export async function executeTask(task: Task): Promise<void> {
  const handler = taskHandlers[task.type];
  if (handler) {
    await handler(task.payload);
  }
}
```

**Issue:**
- `task.payload` comes from external sources without schema validation
- Handlers assume valid data structure, causing crashes on malformed input
- Creates injection attack surface

**Severity:** Critical
**Category:** Safety
**Impact:**
- **Potential bugs:** Type mismatches cause crashes deep in handler logic
- **Type safety:** Payload shape not validated, bypassing type system at runtime
- **Maintainability:** Each handler must defensively validate, duplicating logic
- **Runtime failures:** Crashes from undefined property access, injection attacks

**Pattern Reference:** input-validation.md

**Recommended Fix:**
```ts
// ✅ Validate at system boundary
import { z } from 'zod';

const TaskPayloadSchema = z.object({
  userId: z.string().uuid(),
  action: z.string().min(1).max(50),
  data: z.record(z.unknown()),
});

export async function executeTask(task: Task): Promise<void> {
  const result = TaskPayloadSchema.safeParse(task.payload);
  if (!result.success) {
    throw new Error(`Invalid task payload: ${result.error.message}`);
  }

  const handler = taskHandlers[task.type];
  if (handler) {
    await handler(result.data);
  }
}
```

---

### 3. registerTaskHandler() - Using `any` Type

**Location:** `src/services/task-queue.ts:45`

```ts
// ❌ Current: Disables type checking for all handlers
type TaskHandler = (payload: any) => Promise<void>;

export function registerTaskHandler(type: string, handler: TaskHandler): void {
  taskHandlers[type] = handler;
}
```

**Issue:**
- `any` type disables compile-time checking for all task handlers
- Type errors only discovered at runtime when handlers crash
- Propagates through entire codebase

**Severity:** High
**Category:** Type Safety
**Impact:**
- **Potential bugs:** Type mismatches discovered only at runtime in production
- **Type safety:** Complete loss of type safety across task processing system
- **Maintainability:** Refactoring handlers is dangerous without type checking
- **Runtime failures:** Crashes from accessing undefined properties, wrong method calls

**Pattern Reference:** any.md

**Recommended Fix:**
```ts
// ✅ Use generics to preserve type information
type TaskHandler<T = unknown> = (payload: T) => Promise<void>;

export function registerTaskHandler<T>(
  type: string,
  handler: TaskHandler<T>,
  schema: z.ZodSchema<T>
): void {
  taskHandlers[type] = async (payload: unknown) => {
    const validated = schema.parse(payload);
    await handler(validated);
  };
}

// Usage preserves types
registerTaskHandler(
  'email',
  async (payload: { to: string; subject: string }) => {
    await sendEmail(payload.to, payload.subject);
  },
  z.object({ to: z.string().email(), subject: z.string() })
);
```

---

### 4. updateTaskStatus() - Parameter Mutation

**Location:** `src/services/task-queue.ts:156-162`

```ts
// ❌ Current: Mutates input parameter
export function updateTaskStatus(task: Task, status: TaskStatus): void {
  task.status = status;
  task.updatedAt = Date.now();
  if (status === 'completed') {
    task.completedAt = Date.now();
  }
}
```

**Issue:**
- Mutates `task` parameter, creating hidden side effects
- Callers don't expect mutation (no return value signals this)
- Makes testing and debugging difficult

**Severity:** High
**Category:** State Management
**Impact:**
- **Potential bugs:** Concurrent code sees unexpected state changes, race conditions
- **Type safety:** N/A
- **Maintainability:** Difficult to trace where task state changes
- **Runtime failures:** Race conditions in concurrent task processing

**Pattern Reference:** state-management.md

**Recommended Fix:**
```ts
// ✅ Return new object instead of mutating
export function updateTaskStatus(task: Task, status: TaskStatus): Task {
  const updated: Task = { ...task, status, updatedAt: Date.now() };
  if (status === 'completed') {
    updated.completedAt = Date.now();
  }
  return updated;
}

// Usage makes mutation explicit
task = updateTaskStatus(task, 'completed');
```

---

### 5. retryFailedTask() - Missing Error Handling

**Location:** `src/services/task-queue.ts:201-207`

```ts
// ❌ Current: Errors silently propagate up
export async function retryFailedTask(taskId: string): Promise<void> {
  const task = getTaskById(taskId);
  await executeTask(task);
  updateTaskStatus(task, 'completed');
}
```

**Issue:**
- `executeTask()` can throw errors, but they're not caught
- No retry logic despite function name suggesting retry capability
- Failed retries not logged or tracked

**Severity:** High
**Category:** Safety
**Impact:**
- **Potential bugs:** Silent failures when tasks throw errors
- **Type safety:** N/A
- **Maintainability:** Difficult to add retry logic or error tracking later
- **Runtime failures:** Worker process crashes on unhandled promise rejection

**Pattern Reference:** error-handling.md

**Recommended Fix:**
```ts
// ✅ Explicit error handling with retry logic
export async function retryFailedTask(
  taskId: string,
  maxRetries = 3
): Promise<{ success: boolean; error?: string }> {
  const task = getTaskById(taskId);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await executeTask(task);
      updateTaskStatus(task, 'completed');
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      if (attempt === maxRetries) {
        updateTaskStatus(task, 'failed');
        return { success: false, error: msg };
      }
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}
```

---

### 6-7. Inconsistent Naming Conventions (2 instances)

**Locations:**
- `src/services/task-queue.ts:67` - `maxRetries`, `maxConcurrent`

**Example from src/services/task-queue.ts:67:**
```ts
// ❌ Current: Qualifier at beginning
const maxRetries = 3;
const maxConcurrent = 5;
```

**Issue:**
- Qualifiers (`max`) placed at beginning of variable names
- Breaks autocomplete grouping
- Makes related variables harder to discover via IDE autocomplete

**Severity:** Medium
**Category:** Code Quality
**Impact:**
- **Potential bugs:** Poor discoverability increases chance of using wrong constant
- **Type safety:** N/A
- **Maintainability:** Related constants not grouped in autocomplete
- **Runtime failures:** N/A

**Pattern Reference:** naming-conventions.md

**Recommended Fix:**
```ts
// ✅ Qualifiers in descending order for autocomplete grouping
const retriesMax = 3;
const concurrentMax = 5;
```

---

## Phase 2: Categorized Issues

| # | Location | Issue | Category | Severity |
|---|----------|-------|----------|----------|
| 1 | task-queue.ts:89-105 | Unbounded queue processing | Safety | Critical |
| 2 | task-queue.ts:112-120 | Missing input validation | Safety | Critical |
| 3 | task-queue.ts:45 | Using `any` in TaskHandler | Type Safety | High |
| 4 | task-queue.ts:156-162 | Parameter mutation | State Management | High |
| 5 | task-queue.ts:201-207 | Missing error handling | Safety | High |
| 6-7 | Multiple locations | Inconsistent naming conventions | Code Quality | Medium |

**Total Issues:** 7
**By Severity:** Critical (2), High (3), Medium (2)
**By Category:** Safety (4), Type Safety (1), State Management (1), Code Quality (2)
