# 2.6 Use after() for Non-Blocking Operations

Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.

## Why This Matters

Every millisecond matters for user experience. Operations like logging, analytics tracking, and notifications are important but shouldn't delay the response to the user. By moving these operations after the response, you can:

- Reduce perceived latency for users
- Improve Time to First Byte (TTFB)
- Maintain responsive server actions
- Prevent timeout issues for long-running background tasks

The `after()` function ensures these operations still run reliably, even if the response fails or redirects.

## The Pattern

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

## Common Patterns

### Pattern 1: Analytics tracking
```tsx
'use server'
import { after } from 'next/server'
import { trackEvent } from '@/lib/analytics'

export async function purchaseItem(itemId: string, userId: string) {
  // Critical: process the purchase
  const purchase = await db.purchase.create({
    data: { itemId, userId, timestamp: new Date() }
  })

  // Non-critical: track analytics after response
  after(async () => {
    await trackEvent('purchase_completed', {
      itemId,
      userId,
      amount: purchase.amount,
      timestamp: purchase.timestamp
    })
  })

  return { success: true, purchaseId: purchase.id }
}
```

### Pattern 2: Audit logging
```tsx
'use server'
import { after } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { auditLog } from '@/lib/audit'

export async function deleteUser(userId: string) {
  const session = await requireAuth()

  // Critical: perform the deletion
  await db.user.delete({ where: { id: userId } })

  // Non-critical: log the audit trail after response
  after(async () => {
    await auditLog({
      action: 'user_deleted',
      actorId: session.user.id,
      targetUserId: userId,
      timestamp: new Date(),
      ip: session.ip
    })
  })

  return { success: true }
}
```

### Pattern 3: Sending notifications
```tsx
'use server'
import { after } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function createPost(title: string, content: string) {
  // Critical: save the post
  const post = await db.post.create({
    data: { title, content, authorId: session.user.id }
  })

  // Non-critical: notify followers after response
  after(async () => {
    const followers = await db.follower.findMany({
      where: { followingId: session.user.id }
    })

    await Promise.allSettled(
      followers.map(follower =>
        sendEmail({
          to: follower.email,
          subject: `New post from ${session.user.name}`,
          body: `${title}\n\n${content.slice(0, 200)}...`
        })
      )
    )
  })

  return { success: true, postId: post.id }
}
```

### Pattern 4: Cache invalidation
```tsx
'use server'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(userId: string, data: ProfileData) {
  // Critical: update the database
  await db.user.update({
    where: { id: userId },
    data
  })

  // Non-critical: invalidate caches after response
  after(async () => {
    // Invalidate user profile page
    revalidatePath(`/users/${userId}`)

    // Invalidate user's posts
    revalidatePath(`/users/${userId}/posts`)

    // Clear external cache
    await fetch(`https://cdn.example.com/purge/user/${userId}`, {
      method: 'POST'
    })
  })

  return { success: true }
}
```

## Performance Impact

**Before using after():**
- Response time: Database update (100ms) + Logging (50ms) + Analytics (30ms) = **180ms**
- User waits for all operations to complete

**After using after():**
- Response time: Database update (100ms) = **100ms**
- User receives response immediately
- Background tasks run without blocking: Logging (50ms) + Analytics (30ms)

**Real-world improvement:** 44% faster response time for users.

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

- 2.1 Authenticate Server Actions (use after() for audit logging)
- 1.1 Prevent Waterfall Chains (critical operations should still be parallelized)
- 2.5 Per-Request Deduplication (dedupe operations before scheduling them in after())

## References

- [Next.js after() Documentation](https://nextjs.org/docs/app/api-reference/functions/after)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**Related Sections:**
- 2.1 Authenticate Server Actions Like API Routes
- 1.1 Prevent Waterfall Chains
- 2.5 Per-Request Deduplication with React.cache()
