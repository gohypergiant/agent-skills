# 3.2 Server vs Client Component

**Server Components are the DEFAULT in Next.js App Router.** All components are Server Components by default unless you add the `'use client'` directive. DO NOT add `'use client'` unless you specifically need client-side features.

Server Components provide significant benefits:
- **Zero client-side JavaScript by default** - reduces bundle size
- **Direct database/API access** - no need for API routes
- **Secure handling of secrets** - API keys never reach the client
- **Automatic code splitting** - only client components are bundled
- **Better initial page load** - HTML is rendered on the server
- **SEO benefits** - content is available immediately

Client Components increase bundle size, require hydration, and add runtime overhead. Only use them when you need client-side interactivity.

## The Pattern

**❌ Incorrect: unnecessary 'use client' directive**
```tsx
'use client'; // Unnecessary!

export function Header() {
  return <header><h1>My App</h1></header>;
}
```

**✅ Correct: no directive needed**
```tsx
export function Header() {
  return <header><h1>My App</h1></header>;
}
```

**Why:** Only use `'use client'` when you actually need client-side features. Static components should remain Server Components to reduce bundle size.

**❌ Incorrect: server component in client component**
```tsx
'use client';

import { ServerComponent } from './server'; // This makes it a Client Component

export function ClientComponent() {
  return <div><ServerComponent /></div>;
}
```

**✅ Correct: composition to preserve boundaries**
```tsx
// client.tsx
'use client'

export function ClientComponent({ children }) {
  return <div>{children}</div>;
}

// page.tsx (Server Component)
import ClientComponent from './ClientComponent';
import ServerComponent from './ServerComponent';

export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

**Why:** Importing a Server Component into a Client Component converts it to a Client Component. Pass it as children or props instead.

## Decision Tree

```
Need interactivity? (onClick, onChange, etc.)
├─ Yes → Client Component ('use client')
└─ No → Continue...

Need React hooks? (useState, useEffect, etc.)
├─ Yes → Client Component ('use client')
└─ No → Continue...

Need browser APIs? (window, localStorage, etc.)
├─ Yes → Client Component ('use client')
└─ No → Continue...

Need to fetch data?
├─ Yes → Server Component (default)
└─ No → Continue...

Need cookies/headers/searchParams?
├─ Yes → Server Component (default)
└─ No → Server Component (default, unless specific need)
```

## Common Mistakes

### Mistake 1: Adding 'use client' unnecessarily
```tsx
// ❌ Bad: static component with 'use client'
'use client'

export function Logo() {
  return <img src="/logo.png" alt="Logo" />
}

// ✅ Good: Server Component by default
export function Logo() {
  return <img src="/logo.png" alt="Logo" />
}
```

### Mistake 2: Making entire page client-side for one interactive element
```tsx
// ❌ Bad: entire page is client-side
'use client'

export default function Page() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <StaticHeader /> {/* Becomes client-side */}
      <StaticContent /> {/* Becomes client-side */}
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <StaticFooter /> {/* Becomes client-side */}
    </div>
  )
}

// ✅ Good: only interactive part is client-side
export default function Page() {
  return (
    <div>
      <StaticHeader /> {/* Server Component */}
      <StaticContent /> {/* Server Component */}
      <Counter /> {/* Client Component */}
      <StaticFooter /> {/* Server Component */}
    </div>
  )
}

// Counter.tsx
'use client'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Mistake 3: Importing Server Component into Client Component
```tsx
// ❌ Bad: converts Server Component to Client Component
'use client'

import { DatabaseInfo } from './DatabaseInfo' // Server Component becomes Client

export function Dashboard() {
  return <div><DatabaseInfo /></div>
}

// ✅ Good: pass as children
export default function Page() {
  return (
    <Dashboard>
      <DatabaseInfo /> {/* Stays Server Component */}
    </Dashboard>
  )
}

'use client'

export function Dashboard({ children }) {
  return <div>{children}</div>
}
```

## Related Patterns

- 2.3 Minimize Serialization at RSC Boundaries (pass only needed props to Client Components)
- 1.3 Strategic Suspense Boundaries (use with Server Components for streaming)
- 3.1 Avoid Barrel File Imports (especially important for Client Components)

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
