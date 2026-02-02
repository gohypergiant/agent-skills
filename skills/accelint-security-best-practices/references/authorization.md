# Authorization

Never skip authorization checks. Authentication verifies identity; authorization verifies permission. Attackers will manipulate IDs, skip authentication, or guess URLs to access unauthorized resources.

## Why This Matters

Broken access control is the #1 OWASP vulnerability because:
- **IDOR (Insecure Direct Object Reference)**: Users access others' resources by changing IDs in URLs
- **Vertical Privilege Escalation**: Regular users perform admin-only actions
- **Horizontal Privilege Escalation**: Users access other users' data at the same privilege level
- **Missing Function Level Access Control**: Protected UI but unprotected API endpoints

For an application with 50,000 users, missing authorization on `/api/users/:id` means any authenticated user can view all 50,000 user profiles. A single missing ownership check exposes all user data.

## Anti-Patterns to Avoid

### ❌ NEVER: Skip Ownership Checks

```typescript
// ❌ NEVER: No ownership validation
app.get('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  // CRITICAL: No check if req.user owns this post!
  const post = await db.posts.findUnique({
    where: { id },
  });

  res.json(post); // Exposes ANY post to ANY authenticated user
});

// ❌ NEVER: Trust client-provided ownership claims
app.put('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { isOwner } = req.body; // Attacker sets this to true!

  if (isOwner) {
    await db.posts.update({
      where: { id },
      data: req.body,
    });
  }
});

// ❌ NEVER: Check ownership after fetching
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  const post = await db.posts.findUnique({ where: { id } });

  // TIMING ATTACK: Post data already loaded and may leak in error messages
  if (post.authorId !== req.user!.userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await db.posts.delete({ where: { id } });
});
```

**Risk:** Critical - Any authenticated user can access/modify any resource

---

### ❌ NEVER: Use Frontend-Only Authorization

```typescript
// ❌ NEVER: Authorization logic only in frontend
// Frontend code (React/Vue/etc.)
function Dashboard() {
  const { user } = useAuth();

  if (user.role !== 'ADMIN') {
    return <div>Access Denied</div>; // Only UI protection!
  }

  // Fetch admin data
  const { data } = useFetch('/api/admin/stats'); // API has no auth check!

  return <AdminDashboard data={data} />;
}

// Backend (vulnerable)
app.get('/api/admin/stats', async (req, res) => {
  // No role check! Relies on frontend to enforce
  const stats = await db.stats.findAll();
  res.json(stats);
  // Attacker bypasses frontend and calls API directly
});
```

**Risk:** Critical - Anyone can bypass frontend and access protected APIs

---

### ❌ NEVER: Use Array.includes() for Permission Checks

```typescript
// ❌ NEVER: Array.includes() for permissions (slow and type-unsafe)
app.delete('/api/users/:id', authenticate, async (req, res) => {
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'];

  // O(n) lookup, no TypeScript type safety
  if (!allowedRoles.includes(req.user!.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  // Delete user...
});

// ❌ NEVER: Permission checks with typos
const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
if (allowedRoles.includes(req.user!.role)) {
  // Typo: should be MODERATOR, not MODERAT0R
  // Legitimate moderators denied access
}
```

**Risk:** Medium - Performance issues with large permission sets, typo-prone

---

### ❌ NEVER: Rely on Sequential IDs

```typescript
// ❌ NEVER: Sequential integer IDs without ownership check
app.get('/api/invoices/:id', authenticate, async (req, res) => {
  const invoiceId = parseInt(req.params.id);

  // No ownership check!
  const invoice = await db.invoices.findUnique({
    where: { id: invoiceId },
  });

  res.json(invoice);
  // Attacker iterates: /api/invoices/1, /api/invoices/2, /api/invoices/3...
  // Enumerates all invoices in database!
});
```

**Risk:** High - Predictable IDs enable enumeration attacks

---

### ❌ NEVER: Check Permissions Inconsistently

```typescript
// ❌ NEVER: Different authorization logic in different endpoints
app.get('/api/posts/:id', authenticate, async (req, res) => {
  // Checks ownership
  const post = await db.posts.findFirst({
    where: { id: req.params.id, authorId: req.user!.userId },
  });
  res.json(post);
});

app.put('/api/posts/:id', authenticate, async (req, res) => {
  // No ownership check - inconsistent!
  await db.posts.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ success: true });
});
```

**Risk:** High - Inconsistent enforcement creates exploitable gaps

---

## Correct Patterns

### ✅ ALWAYS: Check Ownership Before Operations

```typescript
// ✅ Ownership check in WHERE clause (prevents data leaks)
app.get('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // ✅ Ownership check in query
  const post = await db.posts.findFirst({
    where: {
      id,
      authorId: userId, // Must be owned by requesting user
    },
  });

  if (!post) {
    // ✅ Generic 404 (don't reveal if post exists but isn't owned)
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// ✅ Ownership check for updates
app.put('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const { title, content } = req.body;

  // ✅ Update only if owned by user
  const post = await db.posts.updateMany({
    where: {
      id,
      authorId: userId, // Ownership check
    },
    data: { title, content },
  });

  // updateMany returns count
  if (post.count === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ success: true });
});

// ✅ Ownership check for deletion
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // ✅ Delete only if owned
  const result = await db.posts.deleteMany({
    where: {
      id,
      authorId: userId,
    },
  });

  if (result.count === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ success: true });
});
```

**Benefit:** Ownership checked at database level, prevents information leakage

---

### ✅ ALWAYS: Implement Role-Based Access Control (RBAC)

```typescript
// ✅ Define roles with Set for O(1) lookup
enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// ✅ Type-safe permission sets
const Permissions = {
  DELETE_ANY_POST: new Set([Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]),
  DELETE_USER: new Set([Role.ADMIN, Role.SUPER_ADMIN]),
  MANAGE_ROLES: new Set([Role.SUPER_ADMIN]),
  VIEW_ANALYTICS: new Set([Role.ADMIN, Role.SUPER_ADMIN]),
} as const;

// ✅ Reusable authorization middleware
function requireRole(...allowedRoles: Role[]) {
  const allowedSet = new Set(allowedRoles);

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // ✅ O(1) lookup with Set
    if (!allowedSet.has(req.user.role as Role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// ✅ Permission-based middleware
function requirePermission(permission: Set<Role>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!permission.has(req.user.role as Role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// ✅ Usage: Role-based authorization
app.delete('/api/posts/:id',
  authenticate,
  requireRole(Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN),
  async (req, res) => {
    const { id } = req.params;

    // Moderator+ can delete any post
    await db.posts.delete({ where: { id } });

    res.json({ success: true });
  }
);

// ✅ Usage: Permission-based authorization
app.get('/api/admin/analytics',
  authenticate,
  requirePermission(Permissions.VIEW_ANALYTICS),
  async (req, res) => {
    const analytics = await getAnalytics();
    res.json(analytics);
  }
);

// ✅ Usage: Super admin only
app.put('/api/users/:id/role',
  authenticate,
  requireRole(Role.SUPER_ADMIN),
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    await db.users.update({
      where: { id },
      data: { role },
    });

    res.json({ success: true });
  }
);
```

**Benefit:** Type-safe roles, O(1) permission checks, centralized authorization logic

---

### ✅ ALWAYS: Combine Ownership and Role Checks

```typescript
// ✅ Users can edit own posts, moderators can edit any post
app.put('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role as Role;
  const { title, content } = req.body;

  // ✅ Fetch post first
  const post = await db.posts.findUnique({
    where: { id },
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // ✅ Authorization: Owner OR Moderator+
  const canModify =
    post.authorId === userId ||
    Permissions.DELETE_ANY_POST.has(userRole);

  if (!canModify) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Update post
  await db.posts.update({
    where: { id },
    data: { title, content },
  });

  res.json({ success: true });
});

// ✅ Reusable authorization helper
async function canAccessResource(
  resourceType: 'post' | 'comment' | 'profile',
  resourceId: string,
  userId: string,
  userRole: Role
): Promise<boolean> {
  switch (resourceType) {
    case 'post': {
      const post = await db.posts.findUnique({ where: { id: resourceId } });
      return (
        post?.authorId === userId ||
        Permissions.DELETE_ANY_POST.has(userRole)
      );
    }
    case 'comment': {
      const comment = await db.comments.findUnique({ where: { id: resourceId } });
      return (
        comment?.authorId === userId ||
        Permissions.DELETE_ANY_POST.has(userRole)
      );
    }
    case 'profile': {
      return resourceId === userId || userRole === Role.ADMIN;
    }
    default:
      return false;
  }
}

// ✅ Usage
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role as Role;

  const authorized = await canAccessResource('post', id, userId, userRole);

  if (!authorized) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await db.posts.delete({ where: { id } });
  res.json({ success: true });
});
```

**Benefit:** Flexible authorization combining ownership and roles

---

### ✅ ALWAYS: Use UUIDs Instead of Sequential IDs

```typescript
// ✅ Use UUID for resource IDs (prevents enumeration)
import { randomUUID } from 'crypto';

app.post('/api/orders', authenticate, async (req, res) => {
  const userId = req.user!.userId;
  const { items } = req.body;

  // ✅ Generate UUID
  const orderId = randomUUID();

  const order = await db.orders.create({
    data: {
      id: orderId, // UUID instead of auto-increment
      userId,
      items,
    },
  });

  res.json(order);
});

// ✅ Prisma schema with UUID
/*
model Order {
  id        String   @id @default(uuid())
  userId    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
*/

// ✅ Still require ownership check even with UUIDs
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // ✅ Ownership check still required
  const order = await db.orders.findFirst({
    where: {
      id, // UUID makes guessing harder
      userId, // But ownership still enforced
    },
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});
```

**Benefit:** UUIDs prevent enumeration attacks, add defense in depth

---

### ✅ ALWAYS: Implement Resource-Level Permissions

```typescript
// ✅ Granular permissions at resource level
interface ResourcePermissions {
  ownerId: string;
  sharedWith: Array<{
    userId: string;
    permission: 'READ' | 'WRITE' | 'ADMIN';
  }>;
  isPublic: boolean;
}

async function checkDocumentPermission(
  documentId: string,
  userId: string,
  requiredPermission: 'READ' | 'WRITE' | 'ADMIN'
): Promise<boolean> {
  const document = await db.documents.findUnique({
    where: { id: documentId },
    include: { sharedWith: true },
  });

  if (!document) {
    return false;
  }

  // ✅ Owner has all permissions
  if (document.ownerId === userId) {
    return true;
  }

  // ✅ Check if public and only READ required
  if (document.isPublic && requiredPermission === 'READ') {
    return true;
  }

  // ✅ Check shared permissions
  const sharedPermission = document.sharedWith.find(
    (share) => share.userId === userId
  );

  if (!sharedPermission) {
    return false;
  }

  // ✅ Permission hierarchy: ADMIN > WRITE > READ
  const permissionLevel = {
    READ: 1,
    WRITE: 2,
    ADMIN: 3,
  };

  return (
    permissionLevel[sharedPermission.permission] >=
    permissionLevel[requiredPermission]
  );
}

// ✅ Usage
app.get('/api/documents/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const hasPermission = await checkDocumentPermission(id, userId, 'READ');

  if (!hasPermission) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const document = await db.documents.findUnique({ where: { id } });
  res.json(document);
});

app.put('/api/documents/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const hasPermission = await checkDocumentPermission(id, userId, 'WRITE');

  if (!hasPermission) {
    return res.status(403).json({ error: 'Access denied' });
  }

  await db.documents.update({
    where: { id },
    data: req.body,
  });

  res.json({ success: true });
});
```

**Benefit:** Fine-grained permissions support complex sharing scenarios

---

### ✅ ALWAYS: Implement Middleware for Consistent Authorization

```typescript
// ✅ Reusable resource authorization middleware
interface ResourceAuthOptions {
  resourceType: 'post' | 'comment' | 'document';
  idParam: string; // Name of URL parameter (e.g., 'id', 'postId')
  requiredPermission?: 'READ' | 'WRITE' | 'DELETE';
  allowedRoles?: Role[];
}

function authorizeResource(options: ResourceAuthOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const resourceId = req.params[options.idParam];
    const userId = req.user.userId;
    const userRole = req.user.role as Role;

    // ✅ Check role-based access first
    if (options.allowedRoles) {
      const allowedSet = new Set(options.allowedRoles);
      if (allowedSet.has(userRole)) {
        return next(); // Role grants access
      }
    }

    // ✅ Check resource ownership
    let isAuthorized = false;

    switch (options.resourceType) {
      case 'post': {
        const post = await db.posts.findUnique({
          where: { id: resourceId },
        });
        isAuthorized = post?.authorId === userId;
        break;
      }
      case 'comment': {
        const comment = await db.comments.findUnique({
          where: { id: resourceId },
        });
        isAuthorized = comment?.authorId === userId;
        break;
      }
      case 'document': {
        isAuthorized = await checkDocumentPermission(
          resourceId,
          userId,
          options.requiredPermission || 'READ'
        );
        break;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    next();
  };
}

// ✅ Usage
app.put('/api/posts/:id',
  authenticate,
  authorizeResource({
    resourceType: 'post',
    idParam: 'id',
    requiredPermission: 'WRITE',
  }),
  async (req, res) => {
    // Authorization already checked by middleware
    const { id } = req.params;
    await db.posts.update({
      where: { id },
      data: req.body,
    });
    res.json({ success: true });
  }
);

app.delete('/api/comments/:commentId',
  authenticate,
  authorizeResource({
    resourceType: 'comment',
    idParam: 'commentId',
    allowedRoles: [Role.MODERATOR, Role.ADMIN],
  }),
  async (req, res) => {
    const { commentId } = req.params;
    await db.comments.delete({ where: { id: commentId } });
    res.json({ success: true });
  }
);
```

**Benefit:** DRY authorization logic, consistent enforcement, easy to audit

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Every protected endpoint has authentication middleware
- [ ] Ownership checks in WHERE clause for all user-scoped resources
- [ ] Role-based access control implemented with Set for O(1) lookup
- [ ] Authorization checked on backend (not just frontend)
- [ ] Sequential IDs replaced with UUIDs or ownership checks enforced
- [ ] Generic 404 errors (don't reveal if resource exists but isn't accessible)
- [ ] Authorization middleware applied consistently across all CRUD operations
- [ ] Resource-level permissions implemented for shared resources
- [ ] Admin endpoints protected with requireRole middleware
- [ ] Authorization failures logged for security monitoring
- [ ] No permission checks in frontend only
- [ ] Authorization logic centralized in middleware/helpers
