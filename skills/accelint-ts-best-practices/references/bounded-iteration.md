# 4.6 Bounded Iteration

NEVER create unbounded loops, queues, or recursive calls. Always set explicit limits to prevent runaway resource consumption.

## Loop Limits

**❌ Incorrect: unbounded while loop**
```ts
while (true) {
  if (queue.isEmpty()) break;
  process(queue.pop());
}

// Risk: If queue.isEmpty() never returns true, infinite loop
```

**✅ Correct: bounded iteration with max iterations**
```ts
const MAX_ITERATIONS = 10000;
let iterations = 0;

while (!queue.isEmpty() && iterations < MAX_ITERATIONS) {
  process(queue.pop());
  iterations++;
}

if (iterations >= MAX_ITERATIONS) {
  throw new Error(`Loop exceeded ${MAX_ITERATIONS} iterations - possible infinite loop`);
}
```

**Why this matters**: Production systems need fail-safes. A condition that "should always become true" may fail due to bugs, corrupted state, or edge cases. Explicit iteration limits prevent infinite loops from consuming CPU and hanging the application.

## Queue Limits

**❌ Incorrect: unbounded queue**
```ts
const queue: Task[] = [];

function addTask(task: Task): void {
  queue.push(task); // No size limit
}

// Risk: Memory exhaustion if tasks are added faster than processed
```

**✅ Correct: bounded queue with max size**
```ts
const MAX_QUEUE_SIZE = 1000;

class BoundedQueue<T> {
  private items: T[] = [];

  constructor(private readonly maxSize: number = MAX_QUEUE_SIZE) {}

  push(item: T): void {
    if (this.items.length >= this.maxSize) {
      throw new Error(`Queue exceeded max size ${this.maxSize}`);
    }
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const queue = new BoundedQueue<Task>(1000);
```

**Why this matters**: Unbounded queues can grow indefinitely if producers outpace consumers. This leads to memory exhaustion and crashes. Bounded queues fail fast with clear error messages instead of silent resource depletion.

## Recursion Limits

**❌ Incorrect: unbounded recursion**
```ts
function traverse(node: Node): void {
  if (!node) return;
  process(node);
  traverse(node.left);
  traverse(node.right);
}

// Risk: Stack overflow on deep/cyclic structures
```

**✅ Correct: bounded recursion depth**
```ts
const MAX_DEPTH = 100;

function traverse(node: Node, depth = 0): void {
  if (!node) return;

  if (depth >= MAX_DEPTH) {
    throw new Error(`Recursion exceeded ${MAX_DEPTH} levels - possible cycle or excessive depth`);
  }

  process(node);
  traverse(node.left, depth + 1);
  traverse(node.right, depth + 1);
}
```

**Why this matters**: Stack overflow crashes are hard to debug. Explicit depth limits catch cycles early and provide clear error messages. For legitimate deep structures, iterative solutions with explicit stacks are safer.

## Timeout Patterns

**❌ Incorrect: no timeout for long operations**
```ts
async function processAll(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item); // Could run forever
  }
}
```

**✅ Correct: timeout for entire operation**
```ts
const TIMEOUT_MS = 30000;

async function processAll(items: Item[]): Promise<void> {
  const startTime = Date.now();

  for (const item of items) {
    const elapsed = Date.now() - startTime;

    if (elapsed > TIMEOUT_MS) {
      throw new Error(`Operation exceeded ${TIMEOUT_MS}ms timeout after processing ${items.indexOf(item)} items`);
    }

    await processItem(item);
  }
}
```

**✅ Correct alternative: per-item timeout with AbortController**
```ts
const ITEM_TIMEOUT_MS = 5000;

async function processWithTimeout(item: Item): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ITEM_TIMEOUT_MS);

  try {
    await processItem(item, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function processAll(items: Item[]): Promise<void> {
  for (const item of items) {
    await processWithTimeout(item);
  }
}
```

**Why this matters**: Hung async operations can block application flow indefinitely. Timeouts ensure operations fail fast with actionable error messages rather than appearing frozen to users.

## Array Length Limits

**❌ Incorrect: unbounded array growth in loop**
```ts
const results: Result[] = [];

for (const item of items) {
  const processed = processItem(item);
  results.push(...processed); // processed could contain thousands of items
}
```

**✅ Correct: check array size before adding**
```ts
const MAX_RESULTS = 10000;
const results: Result[] = [];

for (const item of items) {
  const processed = processItem(item);

  if (results.length + processed.length > MAX_RESULTS) {
    throw new Error(`Results exceeded ${MAX_RESULTS} items - possible memory issue`);
  }

  results.push(...processed);
}
```

## Recommended Limits

| Operation Type | Recommended Limit | Rationale |
|----------------|-------------------|-----------|
| Loop iterations | 10,000 - 100,000 | Prevents infinite loops while allowing large datasets |
| Queue size | 1,000 - 10,000 | Prevents memory exhaustion from unbounded growth |
| Recursion depth | 100 - 1,000 | Prevents stack overflow; typical stack supports ~10k frames |
| Operation timeout | 30s - 5min | Prevents hung operations; depends on expected duration |
| Array length | 10,000 - 1,000,000 | Depends on element size and available memory |
| String length | 1MB - 100MB | Prevents memory issues from pathological inputs |

**Adjust limits based on**:
- Available system resources (memory, CPU)
- Expected data sizes in production
- Performance requirements
- Error recovery strategy

## When to Use Each Pattern

| Scenario | Pattern | Example |
|----------|---------|---------|
| Any `while(true)` or `do-while` loop | Loop iteration counter | Processing queue until empty |
| Task queues, event queues, buffers | Queue size limit | Job processing system |
| Tree traversal, graph algorithms | Recursion depth limit | JSON parsing, DOM traversal |
| Async operations, network calls | Timeout | API calls, file I/O |
| Arrays built in loops | Array length check | Aggregating results |
| String concatenation in loops | String length check | Building large text output |

## Retry Loops with Exponential Backoff

**❌ Incorrect: unbounded retry with fixed delay**
```ts
async function retryOperation(): Promise<Result> {
  while (true) {
    try {
      return await unstableOperation();
    } catch (error) {
      await sleep(1000); // Hammers failing service forever
    }
  }
}
```

**✅ Correct: bounded retry with exponential backoff**
```ts
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 32000;

async function retryOperation(): Promise<Result> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await unstableOperation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < MAX_RETRIES - 1) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Operation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}
```

**Production lesson**: A service with unbounded retry `while(true)` hammered a failing database during an outage, preventing it from recovering. The retry storm amplified the outage. Bounded retries with exponential backoff reduce load on failing systems and allow recovery.

## Circuit Breaker Pattern for Repeated Failures

**Production-grade pattern**: After N consecutive failures, stop trying for a cooldown period.

```ts
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold = 5,
    private readonly cooldownMs = 60000,
    private readonly maxAttempts = 100 // Absolute safety limit
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.failureCount >= this.maxAttempts) {
      throw new Error(`Circuit breaker: exceeded ${this.maxAttempts} total failures`);
    }

    // If circuit is OPEN, check if cooldown period has passed
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure < this.cooldownMs) {
        throw new Error(`Circuit breaker OPEN: ${this.cooldownMs - timeSinceFailure}ms remaining`);
      }
      this.state = 'HALF_OPEN'; // Try one request
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 60000, 100);
await breaker.execute(() => unstableOperation());
```

**Why this matters**: Circuit breakers prevent cascading failures. When a dependency is down, continuing to call it wastes resources and delays error detection. Opening the circuit fails fast and gives the failing system time to recover.

## Memory-Based Iteration Limits

**Expert pattern**: Stop iteration when approaching memory limits, not just based on count.

```ts
async function processWithMemoryLimit(items: Item[]): Promise<Result[]> {
  const MAX_MEMORY_MB = 500; // Stop if we allocate more than 500MB
  const results: Result[] = [];
  const startMemory = process.memoryUsage().heapUsed;

  for (let i = 0; i < items.length; i++) {
    const currentMemory = process.memoryUsage().heapUsed;
    const memoryUsedMB = (currentMemory - startMemory) / 1024 / 1024;

    if (memoryUsedMB > MAX_MEMORY_MB) {
      throw new Error(
        `Memory limit exceeded: ${memoryUsedMB.toFixed(2)}MB used ` +
        `after processing ${i}/${items.length} items`
      );
    }

    results.push(await processItem(items[i]));

    // Optional: Force GC periodically if running with --expose-gc
    if (i % 1000 === 0 && global.gc) {
      global.gc();
    }
  }

  return results;
}
```

**When to use**: Processing large datasets where individual items vary in size (images, documents, large JSON objects). Count-based limits aren't sufficient when one item can consume 100MB.

## Production Considerations

**Make limits configurable**:
```ts
interface BoundedLoopConfig {
  maxIterations?: number;
  timeout?: number;
  onLimitExceeded?: (reason: string) => void;
}

async function processWithLimits(
  items: Item[],
  config: BoundedLoopConfig = {}
): Promise<void> {
  const maxIterations = config.maxIterations ?? 10000;
  const timeout = config.timeout ?? 30000;
  const startTime = Date.now();

  for (let i = 0; i < items.length && i < maxIterations; i++) {
    if (Date.now() - startTime > timeout) {
      const reason = `Timeout after ${timeout}ms`;
      config.onLimitExceeded?.(reason);
      throw new Error(reason);
    }

    await processItem(items[i]);
  }
}
```

**Log when approaching limits**:
```ts
const MAX_ITERATIONS = 10000;
const WARN_THRESHOLD = 0.8; // Warn at 80%
let iterations = 0;

while (condition && iterations < MAX_ITERATIONS) {
  iterations++;

  if (iterations === Math.floor(MAX_ITERATIONS * WARN_THRESHOLD)) {
    console.warn(`Loop approaching limit: ${iterations}/${MAX_ITERATIONS} iterations`);
  }

  process();
}
```

**Graceful degradation**:
```ts
// Instead of throwing, return partial results
function processUpToLimit(items: Item[], limit = 10000): ProcessResult {
  const results: Result[] = [];
  const processed = Math.min(items.length, limit);

  for (let i = 0; i < processed; i++) {
    results.push(processItem(items[i]));
  }

  return {
    results,
    processed,
    total: items.length,
    truncated: items.length > limit,
  };
}
```
