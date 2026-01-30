# Authenticate Server Actions Like API Routes

Server Actions (functions with `"use server"`) are exposed as public endpoints, just like API routes. Always verify authentication and authorization **inside** each Server Action—do not rely solely on middleware, layout guards, or page-level checks, as Server Actions can be invoked directly.

Next.js documentation explicitly states: "Treat Server Actions with the same security considerations as public-facing API endpoints, and verify if the user is allowed to perform a mutation."

Server Actions can be called:
- Directly from client components
- Via POST requests to the action endpoint
- From browser DevTools or custom scripts
- Bypassing page-level guards and middleware

## The Pattern

**❌ Incorrect: no authentication check**
```tsx
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**✅ Correct: authentication inside the action**
```tsx
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**✅ Correct: with input validation**
```tsx
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)

  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })

  return { success: true }
}
```

## Security Checklist

Every Server Action should have:

1. **Input validation** - Use Zod or similar to validate all inputs
2. **Authentication** - Verify the user is logged in
3. **Authorization** - Check if the user is allowed to perform this action
4. **Rate limiting** - Consider adding rate limits for sensitive actions
5. **Audit logging** - Log security-relevant actions (use `after()` to avoid blocking)

## Common Patterns

### Pattern 1: Extract auth helper
```tsx
// lib/auth.ts
export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

// Server Action
'use server'
import { requireAuth } from '@/lib/auth'

export async function updatePost(postId: string, content: string) {
  const session = await requireAuth()

  const post = await db.post.findUnique({ where: { id: postId } })
  if (post.authorId !== session.user.id) {
    throw new Error('Not authorized')
  }

  await db.post.update({ where: { id: postId }, data: { content } })
  return { success: true }
}
```

### Pattern 2: Role-based access control
```tsx
// lib/auth.ts
export async function requireRole(role: 'admin' | 'user') {
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  if (session.user.role !== role && session.user.role !== 'admin') {
    throw new Error('Insufficient permissions')
  }
  return session
}

// Server Action
'use server'
import { requireRole } from '@/lib/auth'

export async function banUser(userId: string) {
  await requireRole('admin') // Only admins can ban
  await db.user.update({ where: { id: userId }, data: { banned: true } })
  return { success: true }
}
```

### Pattern 3: Resource ownership check
```tsx
'use server'
import { requireAuth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await requireAuth()

  const post = await db.post.findUnique({ where: { id: postId } })

  if (!post) {
    throw new Error('Post not found')
  }

  // Check ownership or admin
  if (post.authorId !== session.user.id && session.user.role !== 'admin') {
    throw new Error('Not authorized to delete this post')
  }

  await db.post.delete({ where: { id: postId } })
  return { success: true }
}
```

## References

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Server Actions Security](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#security)
