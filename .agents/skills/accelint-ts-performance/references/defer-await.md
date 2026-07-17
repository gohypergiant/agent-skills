# 4.7 Defer Await

Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.

**❌ Incorrect: blocks both branches**
```ts
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true };
  }

  // Only this branch uses userData
  return processUserData(userData);
}
```

**✅ Correct: only blocks when needed**
```ts
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true };
  }

  // Fetch only when needed
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

This optimization is especially valuable when the skipped branch is frequently taken, or when the deferred operation is expensive.
