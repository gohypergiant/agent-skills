# 3.2 Server vs Client Component

**Server Components are the DEFAULT in Next.js App Router.** All components are Server Components by default unless you add the `'use client'` directive. DO NOT add `'use client'` unless you specifically need client-side features.

## Why This Matters

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

## Common Patterns

### Pattern 1: Interactive wrapper with static content
```tsx
// ❌ Incorrect: entire component is client-side
'use client'

export function Card({ title, content }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
      {expanded && <div>{content}</div>}
    </div>
  )
}
```

```tsx
// ✅ Correct: only interactive part is client-side
'use client'

function ExpandButton({ expanded, onToggle }) {
  return (
    <button onClick={onToggle}>
      {expanded ? 'Collapse' : 'Expand'}
    </button>
  )
}

// Server Component
export function Card({ title, content }) {
  return (
    <div>
      <h2>{title}</h2>
      <CardContent content={content} />
    </div>
  )
}

function CardContent({ content }) {
  'use client'
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <ExpandButton expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      {expanded && <div>{content}</div>}
    </>
  )
}
```

### Pattern 2: Data fetching with interactivity
```tsx
// ✅ Correct: fetch in Server Component, pass to Client Component
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData() // Can access database directly

  return <InteractiveList data={data} />
}

// InteractiveList.tsx (Client Component)
'use client'

export function InteractiveList({ data }) {
  const [selected, setSelected] = useState(null)

  return (
    <ul>
      {data.map(item => (
        <li
          key={item.id}
          onClick={() => setSelected(item.id)}
          className={selected === item.id ? 'selected' : ''}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

### Pattern 3: Composition pattern for complex layouts
```tsx
// layout.tsx (Server Component)
export default async function Layout({ children }) {
  const user = await getUser() // Server-side auth

  return (
    <div>
      <nav>
        <UserMenu user={user} /> {/* Client Component */}
      </nav>
      <main>{children}</main>
      <footer>
        <StaticFooter /> {/* Server Component */}
      </footer>
    </div>
  )
}

// UserMenu.tsx (Client Component)
'use client'

export function UserMenu({ user }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {user.name}
      </button>
      {open && <DropdownMenu user={user} />}
    </div>
  )
}

// StaticFooter.tsx (Server Component - no directive needed)
export function StaticFooter() {
  return (
    <footer>
      <p>&copy; 2026 My App</p>
    </footer>
  )
}
```

### Pattern 4: Third-party libraries requiring client-side
```tsx
// ✅ Correct: isolate client-side library in smallest component
'use client'

import { DatePicker } from 'some-client-only-library'

export function DatePickerWrapper({ value, onChange }) {
  return <DatePicker value={value} onChange={onChange} />
}

// page.tsx (Server Component)
export default function Page() {
  return (
    <div>
      <h1>Select a date</h1>
      <DatePickerWrapper /> {/* Only this is client-side */}
      <StaticContent /> {/* Stays server-side */}
    </div>
  )
}
```

## When to Use Server Components

**Perfect for:**
- Fetching data from APIs or databases
- Accessing backend resources (environment variables, file system)
- Processing sensitive information (API keys, tokens)
- Reducing client-side JavaScript bundle
- SEO-critical content rendering
- Static or infrequently changing content
- Markdown rendering
- Heavy computation that can happen server-side

**Benefits:**
- Zero client-side JavaScript by default
- Direct database/API access
- Secure handling of secrets
- Automatic code splitting
- Better initial page load performance
- Reduced bundle size

## When to Use Client Components

**Required for:**
- React hooks (useState, useEffect, useContext, useReducer, etc.)
- Event handlers (onClick, onChange, onSubmit, etc.)
- Browser-only APIs (window, localStorage, navigator, document)
- Third-party libraries requiring browser environment
- Interactive UI elements (modals, dropdowns, tabs, accordions)
- Real-time features (WebSocket, animations)
- Custom hooks
- Context providers

**Requirements:**
- Must have `'use client'` directive at top of file
- Cannot use async/await directly in component (use useEffect instead)
- Cannot access server-only APIs (cookies, headers, searchParams)
- All imported components become Client Components (unless passed as children)

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

## Bundle Size Impact

**Example comparison:**

```tsx
// Server Component approach: ~2KB client bundle
export default async function Page() {
  const posts = await db.post.findMany()

  return (
    <div>
      <h1>Blog Posts</h1>
      <PostList posts={posts} /> {/* Client Component for interactivity */}
    </div>
  )
}

// Client Component approach: ~45KB client bundle
'use client'

export default function Page() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(setPosts)
  }, [])

  return (
    <div>
      <h1>Blog Posts</h1>
      <PostList posts={posts} />
    </div>
  )
}
```

**Savings:** 95.6% smaller bundle (43KB saved)

## Related Patterns

- 2.3 Minimize Serialization at RSC Boundaries (pass only needed props to Client Components)
- 1.3 Strategic Suspense Boundaries (use with Server Components for streaming)
- 3.1 Avoid Barrel File Imports (especially important for Client Components)

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

**Related Sections:**
- 2.3 Minimize Serialization at RSC Boundaries
- 1.3 Strategic Suspense Boundaries
- 3.1 Avoid Barrel File Imports
