# 1.2 Parallelize Independent Operations

When async operations have no interdependencies, execute them concurrently using Promise.allSettled().

**❌ Incorrect: sequential execution, 3 round trips**
```ts
const user = await fetchUser()       // Wait 100ms
const posts = await fetchPosts()     // Wait another 100ms
const comments = await fetchComments() // Wait another 100ms
// Total: 300ms
```

**✅ Correct: parallel execution, 1 round trip**
```ts
const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),      // All three start immediately
  fetchPosts(),
  fetchComments()
])
// Total: 100ms (max of all three)
```

## Promise.allSettled() vs Promise.all()

**Use `Promise.allSettled()`** - Returns all results, even if some fail:
```ts
const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

**Avoid `Promise.all()`** - Fails fast if any promise rejects:
```ts
// Bad: if fetchPosts() fails, you lose user and comments too
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),  // If this fails, everything fails
  fetchComments()
])
```

## What NOT to Do

**❌ Don't await in a loop**
```ts
// Bad: sequential
const results = []
for (const id of userIds) {
  results.push(await fetchUser(id))
}

// Good: parallel
const results = await Promise.allSettled(
  userIds.map(id => fetchUser(id))
)
```

**❌ Don't use Promise.all() unless you want fail-fast behavior**
```ts
// If any fails, you lose all results
const results = await Promise.all([op1(), op2(), op3()])

// Better: get partial results even if some fail
const results = await Promise.allSettled([op1(), op2(), op3()])
```

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - Start independent operations immediately
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md) - Component composition for parallel RSC fetches
- [2.5 React.cache() Deduplication](./react-cache-deduplication.md) - Avoid refetching same data

## References

- [Promise.allSettled() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [Promise.all() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)