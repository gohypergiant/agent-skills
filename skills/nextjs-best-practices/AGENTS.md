# Nextjs Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring Next.js code at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for Next.js applications, designed for AI agents and LLMs. Each rule includes detailed explanations, and real-world examples comparing incorrect vs. correct implementations to guide automated refactoring and code generation.

---

## Table of Contents

1. [General](#1-general)
    - 1.1 []()

---

### 1.3 Prevent Waterfall Chains

In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.

**❌ Incorrect: config waits for auth, data waits for both**
```ts
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)

  return Response.json({ data, config })
}
```

**✅ Correct: auth and config start immediately**
```ts
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.allSettled([
    configPromise,
    fetchData(session.user.id)
  ])

  return Response.json({ data, config })
}
```

### 1.4 Parallelize Independent Operations

When async operations have no interdependencies, execute them concurrently using Promise.allSettled().

**❌ Incorrect: sequential execution, 3 round trips**
```ts
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**✅ Correct: parallel execution, 1 round trip**
```ts
const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.5 Suspense Boundaries

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

**❌ Incorrect: wrapper blocked by data fetching**
```ts
async function Page() {
  const data = await fetchData() // Blocks entire page
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

The entire layout waits for data even though only the middle section needs it.

**✅ Correct: wrapper shows immediately, data streams in**
```ts
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Sidebar, Header, and Footer render immediately. Only DataDisplay waits for data.

**✅ Correct: share promise across components**
```ts
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

Both components share the same promise, so only one fetch occurs. Layout renders immediately while both components wait together.

