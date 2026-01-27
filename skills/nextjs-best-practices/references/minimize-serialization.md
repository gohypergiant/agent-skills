# 2.3 Minimize Serialization at RSC Boundaries

The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

**❌ Incorrect: serializes all 50 fields**
```tsx
// Server Component
async function Page() {
  const user = await fetchUser()  // 50 fields: id, name, email, bio, preferences, settings, ...
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // Only uses 1 field!
}
```

**✅ Correct: serializes only 1 field**
```tsx
// Server Component
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />  // Pass only what's needed
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

## When to Pass Full Objects

**Acceptable to pass full objects when:**

1. **Client needs most/all fields** (>80% of fields used)
2. **Object is small** (<1KB serialized)
3. **Shared across many client components** (avoid duplication)

**✅ Correct: client needs most fields**
```tsx
async function Page() {
  const config = await fetchConfig()  // 5 small fields

  return <ConfigPanel config={config} />  // Uses 4/5 fields
}
```

**✅ Correct: shared across components**
```
async function Page() {
  const theme = await fetchTheme()  // Small object

  return (
    <div>
      <ThemeHeader theme={theme} />
      <ThemeBody theme={theme} />
      <ThemeFooter theme={theme} />
    </div>
  )
}
```

## Related Patterns

- [2.2 Avoid Duplicate Serialization](./avoid-duplicate-serialization.md) - Share references, not copies
- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - Fetch data efficiently
- [3.2 Server vs Client Component](./server-vs-client-component.md) - Keep data in Server Components when possible
