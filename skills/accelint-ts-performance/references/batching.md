# 4.4 Batching

Batch operations to amortize costly work, especially for I/O-bound operations.

## When to Use This Pattern

Use batching when the same kind of expensive operation runs repeatedly and the system can process those operations together. Common examples include network requests, database queries, file writes, and message publishing.

Batching is most useful when the per-operation overhead is high relative to the work done for each individual item.

## What Batching Improves

Batching can reduce:

- connection overhead
- repeated serialization or parsing
- round-trip latency
- lock contention
- per-call allocation and scheduling overhead

It can also improve throughput by letting the runtime or downstream system process larger chunks of work more efficiently.

## Examples

### Network Requests

**❌ Incorrect: send one request per item**
```ts
for (const id of ids) {
  await fetch(`/api/items/${id}`);
}
```

**✅ Correct: batch requests when the API supports it**
```ts
await fetch('/api/items/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids }),
});
```

### Database Writes

**❌ Incorrect: insert one row at a time**
```ts
for (const row of rows) {
  await db.insert(row);
}
```

**✅ Correct: write rows in batches**
```ts
const BATCH_SIZE = 500;

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  await db.insertMany(rows.slice(i, i + BATCH_SIZE));
}
```

### File Output

**❌ Incorrect: write on every iteration**
```ts
for (const line of lines) {
  await file.write(`${line}\n`);
}
```

**✅ Correct: join and write once, or write in chunks**
```ts
await file.write(lines.join('\n') + '\n');
```

## Guardrails

- Do not batch operations if batching changes correctness, ordering guarantees, or failure semantics the caller depends on.
- Set explicit batch sizes when unbounded batches could create memory pressure or oversized requests.
- If partial failure matters, define how retries, deduplication, and error reporting work before you batch writes.
- When batching hides per-item visibility, add reporting that still lets users identify which items failed.

## Fallback Patterns

### Fallback 1: Limit concurrency when true batching is unavailable

If the downstream system does not support a batch API, limit concurrency instead of firing unlimited parallel requests.

```ts
const CONCURRENCY = 5;

for (let i = 0; i < ids.length; i += CONCURRENCY) {
  await Promise.all(
    ids.slice(i, i + CONCURRENCY).map((id) => fetch(`/api/items/${id}`)),
  );
}
```

### Fallback 2: Keep single-item processing when ordering is strict

If each operation must commit in order and batching would change behavior, keep single-item processing and optimize elsewhere.

```ts
for (const event of orderedEvents) {
  await appendEvent(event);
}
```

## Decision Check

Use batching when it reduces repeated overhead without changing the correctness model. If batching would change ordering, visibility, or failure handling in a way the caller depends on, do not apply it blindly.
