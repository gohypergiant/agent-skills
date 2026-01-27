# 2.6 Use after() for Non-Blocking Operations

Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.

**❌ Incorrect: logging blocks the response**
```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**✅ Correct: logging happens after response is sent**
```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

The response is sent immediately while logging happens in the background.

## Important Notes

- `after()` runs even if the response fails or redirects
- Works in Server Actions, Route Handlers, and Server Components
- Background tasks have access to request context (headers, cookies)
- Errors in `after()` callbacks don't affect the response
- Background tasks are subject to serverless function timeouts

## Use Cases

**Perfect for:**
- Analytics tracking
- Audit logging
- Sending notifications (email, SMS, push)
- Cache invalidation
- Cleanup tasks
- Third-party API calls that don't affect the response
- Webhook deliveries
- Image processing and optimization
- Search index updates

**NOT suitable for:**
- Operations that affect the response data
- Critical error handling
- Operations that must complete before responding
- Data that the client needs immediately

## Related Patterns

- [2.1 Authenticate Server Actions](./server-actions-security.md) (use `after()` for audit logging)
- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) (critical operations should still be parallelized)
- [2.5 Per-Request Deduplication](./react-cache-deduplication.md) (dedupe operations before scheduling them in after)

## References

- [Next.js after() Documentation](https://nextjs.org/docs/app/api-reference/functions/after)