# Input Validation

Never trust user input. All input from users, APIs, file uploads, or external sources is potentially malicious. Validate type, format, size, and content with schemas before processing.

## Why This Matters

Unvalidated user input is the root cause of most security vulnerabilities:
- **SQL Injection**: Malicious SQL in user input accesses or destroys database
- **XSS Attacks**: Malicious scripts in user input steal credentials or perform actions
- **Buffer Overflows**: Oversized inputs crash applications or enable code execution
- **Business Logic Bypass**: Invalid data types or values break application logic
- **Data Corruption**: Invalid input persisted to database corrupts data integrity

Attackers will send crafted payloads designed to exploit weaknesses. A single unvalidated input can compromise your entire application.

## Anti-Patterns to Avoid

### ❌ NEVER: Accept User Input Without Validation

```typescript
// ❌ NEVER: No validation on user input
app.post('/api/users', async (req, res) => {
  const { email, age, username } = req.body;
  // Direct use without validation!
  const user = await db.users.create({ email, age, username });
  res.json(user);
});

// ❌ NEVER: Missing type checks
function processOrder(orderId: any) {
  // orderId could be anything: string, object, array, null
  return db.orders.findById(orderId);
}

// ❌ NEVER: No format validation
app.post('/api/email', async (req, res) => {
  const { email } = req.body;
  // email could be: "not-an-email", "<script>alert(1)</script>", etc.
  await sendEmail(email, 'Welcome!');
});
```

**Risk:** Critical - Opens door to injection attacks, data corruption, business logic bypass

---

### ❌ NEVER: Use Weak Manual Validation

```typescript
// ❌ NEVER: Incomplete email validation
function isValidEmail(email: string): boolean {
  return email.includes('@');
  // Accepts: "@@@@", "test@", "@domain.com"
}

// ❌ NEVER: Client-side validation only
// Frontend code
function handleSubmit() {
  if (!email.includes('@')) {
    alert('Invalid email');
    return;
  }
  // Attacker bypasses by calling API directly!
  fetch('/api/users', { method: 'POST', body: JSON.stringify({ email }) });
}

// ❌ NEVER: Regex that's too permissive
const usernameRegex = /^.+$/; // Accepts anything with at least one character
```

**Risk:** High - Weak validation easily bypassed, false sense of security

---

### ❌ NEVER: Skip Size/Length Validation

```typescript
// ❌ NEVER: No length limits
app.post('/api/profile', async (req, res) => {
  const { bio } = req.body;
  // bio could be 10MB of text causing database/memory issues
  await db.users.update(userId, { bio });
});

// ❌ NEVER: No array length limits
app.post('/api/batch', async (req, res) => {
  const { items } = req.body;
  // items could be array with 1 million elements
  for (const item of items) {
    await processItem(item);
  }
});

// ❌ NEVER: No file size limits
app.post('/api/upload', upload.single('file'), async (req, res) => {
  // Attacker uploads 10GB file exhausting disk space
  const file = req.file;
  await saveFile(file);
});
```

**Risk:** High - Denial of service, resource exhaustion, database overflow

---

### ❌ NEVER: Trust Enum-Like Values Without Validation

```typescript
// ❌ NEVER: No enum validation
app.post('/api/users', async (req, res) => {
  const { role } = req.body;
  // role could be "SUPER_ADMIN" instead of "USER" or "ADMIN"
  await db.users.create({ role });
});

// ❌ NEVER: Array.includes() for enums (type-unsafe)
const validRoles = ['USER', 'ADMIN'];
if (validRoles.includes(role)) {
  // Works but no TypeScript type safety
}
```

**Risk:** High - Privilege escalation, business logic bypass

---

## Correct Patterns

### ✅ ALWAYS: Use Schema Validation with Zod

```typescript
import { z } from 'zod';

// ✅ Comprehensive user input schema
const UserSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(18).max(120),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  role: z.enum(['USER', 'ADMIN']),
  bio: z.string().max(1000).optional(),
});

app.post('/api/users', async (req, res) => {
  try {
    // ✅ Parse and validate
    const validatedData = UserSchema.parse(req.body);

    // validatedData is now fully typed and validated
    const user = await db.users.create(validatedData);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ✅ Return validation errors (safe to expose)
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    throw error;
  }
});
```

**Benefit:** Type-safe validation with clear error messages, automatic TypeScript types

---

### ✅ ALWAYS: Validate with Whitelist Approach

```typescript
import { z } from 'zod';

// ✅ Strict enum validation
const OrderStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']);

// ✅ Whitelist allowed values
const SortFieldSchema = z.enum(['created_at', 'updated_at', 'name', 'price']);

app.get('/api/orders', async (req, res) => {
  // ✅ Validate query parameters
  const QuerySchema = z.object({
    status: OrderStatusSchema.optional(),
    sortBy: SortFieldSchema.default('created_at'),
    page: z.coerce.number().int().min(1).max(1000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  });

  const query = QuerySchema.parse(req.query);

  // ✅ query is fully validated and typed
  const orders = await db.orders.findMany({
    where: { status: query.status },
    orderBy: { [query.sortBy]: 'desc' },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  res.json(orders);
});
```

**Benefit:** Only explicitly allowed values accepted, prevents injection and unexpected behavior

---

### ✅ ALWAYS: Validate Nested Objects and Arrays

```typescript
import { z } from 'zod';

// ✅ Nested schema validation
const AddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2), // US state codes
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
});

const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  price: z.number().positive(),
});

const CreateOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1).max(50), // At least 1 item, max 50
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  notes: z.string().max(500).optional(),
});

app.post('/api/orders', async (req, res) => {
  // ✅ Validates nested objects and array items
  const validatedOrder = CreateOrderSchema.parse(req.body);

  // Calculate total (using validated prices)
  const total = validatedOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await db.orders.create({
    data: {
      ...validatedOrder,
      total,
    },
  });

  res.json(order);
});
```

**Benefit:** Deep validation ensures all nested data is safe, prevents partial validation gaps

---

### ✅ ALWAYS: Validate File Uploads

```typescript
import { z } from 'zod';
import multer from 'multer';

// ✅ File validation schema
const FileUploadSchema = z.object({
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]),
  size: z.number().max(5 * 1024 * 1024), // 5MB max
  originalname: z.string().regex(/^[a-zA-Z0-9_.-]+$/), // Safe filename chars
});

// ✅ Configure multer with limits
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Single file
  },
  fileFilter: (req, file, cb) => {
    // ✅ Whitelist allowed MIME types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // ✅ Validate file properties
  const validatedFile = FileUploadSchema.parse(req.file);

  // ✅ Generate safe filename (don't trust user input)
  const safeFilename = `${crypto.randomUUID()}.${validatedFile.mimetype.split('/')[1]}`;

  await saveFile(req.file.buffer, safeFilename);

  res.json({ filename: safeFilename });
});
```

**Benefit:** Multiple layers of file validation prevent malicious file uploads

---

### ✅ ALWAYS: Validate External API Responses

```typescript
import { z } from 'zod';

// ✅ Validate external API responses
const ExternalUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
});

async function fetchExternalUser(userId: number) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  const data = await response.json();

  // ✅ Validate external data before using
  const validatedUser = ExternalUserSchema.parse(data);

  return validatedUser;
}

// ✅ Handle validation errors from external sources
async function syncExternalUsers() {
  const response = await fetch('https://api.example.com/users');
  const data = await response.json();

  const UsersArraySchema = z.array(ExternalUserSchema);

  try {
    const validatedUsers = UsersArraySchema.parse(data);

    for (const user of validatedUsers) {
      await db.users.upsert({
        where: { externalId: user.id },
        create: { externalId: user.id, ...user },
        update: user,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ✅ Log validation failures from external API
      console.error('External API returned invalid data:', error.errors);
      throw new Error('External API data validation failed');
    }
    throw error;
  }
}
```

**Benefit:** Validates untrusted external data, prevents corrupted data from entering system

---

### ✅ ALWAYS: Validate and Sanitize Path Parameters

```typescript
import { z } from 'zod';

// ✅ Validate UUID path parameters
const UuidSchema = z.string().uuid();

app.get('/api/users/:userId', async (req, res) => {
  // ✅ Validate path parameter
  const userId = UuidSchema.parse(req.params.userId);

  const user = await db.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// ✅ Validate numeric IDs
const NumericIdSchema = z.coerce.number().int().positive();

app.get('/api/posts/:postId', async (req, res) => {
  // ✅ Coerce string to number and validate
  const postId = NumericIdSchema.parse(req.params.postId);

  const post = await db.posts.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// ✅ Validate slug parameters
const SlugSchema = z.string().regex(/^[a-z0-9-]+$/).min(1).max(100);

app.get('/blog/:slug', async (req, res) => {
  // ✅ Validate slug format
  const slug = SlugSchema.parse(req.params.slug);

  const post = await db.posts.findUnique({
    where: { slug },
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});
```

**Benefit:** Prevents path traversal, injection via URL parameters, invalid type errors

---

### ✅ ALWAYS: Create Reusable Validation Middleware

```typescript
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// ✅ Generic validation middleware
function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// ✅ Query parameter validation middleware
function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// ✅ Usage with schemas
const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
});

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

app.post('/api/users',
  validate(CreateUserSchema),
  async (req, res) => {
    // req.body is validated and typed
    const user = await db.users.create({ data: req.body });
    res.json(user);
  }
);

app.get('/api/users',
  validateQuery(PaginationSchema),
  async (req, res) => {
    // req.query is validated and typed
    const users = await db.users.findMany({
      skip: (req.query.page - 1) * req.query.limit,
      take: req.query.limit,
    });
    res.json(users);
  }
);
```

**Benefit:** DRY validation logic, consistent error handling, type safety across routes

---

## Common Validation Patterns

### ✅ Email Validation

```typescript
// ✅ Email with constraints
const EmailSchema = z.string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .toLowerCase(); // Normalize to lowercase

// ✅ Optional email
const OptionalEmailSchema = z.string().email().optional();

// ✅ Email with domain whitelist
const CorporateEmailSchema = z.string().email().refine(
  (email) => email.endsWith('@company.com'),
  { message: 'Must be a company email address' }
);
```

---

### ✅ Password Validation

```typescript
// ✅ Strong password requirements
const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');

// ✅ Password confirmation
const PasswordWithConfirmSchema = z.object({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);
```

---

### ✅ Date/Time Validation

```typescript
// ✅ Date validation
const DateSchema = z.coerce.date();

// ✅ Date range validation
const DateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// ✅ Future date validation
const FutureDateSchema = z.coerce.date().refine(
  (date) => date > new Date(),
  { message: 'Date must be in the future' }
);
```

---

### ✅ URL Validation

```typescript
// ✅ URL with protocol validation
const UrlSchema = z.string().url();

// ✅ URL with allowed domains
const SafeUrlSchema = z.string().url().refine(
  (url) => {
    const allowedDomains = ['example.com', 'trusted-site.com'];
    const domain = new URL(url).hostname;
    return allowedDomains.some(allowed =>
      domain === allowed || domain.endsWith(`.${allowed}`)
    );
  },
  { message: 'URL domain not allowed' }
);

// ✅ HTTPS only
const HttpsUrlSchema = z.string().url().refine(
  (url) => url.startsWith('https://'),
  { message: 'URL must use HTTPS' }
);
```

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All user input validated with Zod or similar schema library
- [ ] Validation applied to: request body, query params, path params, headers
- [ ] Array and object lengths limited to prevent DoS
- [ ] File uploads validated for type, size, and extension
- [ ] Enum values validated with whitelist approach
- [ ] External API responses validated before use
- [ ] Validation errors return 400 status with safe error messages
- [ ] No sensitive data leaked in validation error messages
- [ ] Path parameters validated to prevent path traversal
- [ ] Numeric IDs validated as positive integers
- [ ] String inputs have max length limits
- [ ] Validation middleware applied consistently across all routes
