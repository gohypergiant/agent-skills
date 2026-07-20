# Sensitive Data Protection

Never log sensitive data or expose it in error messages. Passwords, tokens, credit cards, and personal information must be protected in logs, errors, and client responses.

## Why This Matters

Sensitive data exposure occurs when:
- **Logs Leaked**: Logs aggregated to third-party services (Datadog, Splunk) expose credentials
- **Error Messages**: Stack traces reveal database structure, API keys, or user data
- **Client Responses**: APIs return more data than needed, exposing PII to frontend
- **Debug Mode**: Development mode enabled in production leaks internal details
- **Backups**: Database backups copied to insecure locations contain plaintext data

A single `console.log(user)` statement logging passwords persists in log files forever. Logs are accessible to more people than the application itself (ops teams, contractors, log aggregation services).

## Anti-Patterns to Avoid

### ❌ NEVER: Log Passwords or Tokens

```typescript
// ❌ NEVER: Log passwords
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password }); // CRITICAL: Password in logs!

  const user = await validateUser(email, password);
  // Password now in application logs, accessible to ops team
});

// ❌ NEVER: Log tokens
console.log('JWT token:', token); // Logged token can be stolen
console.log('API key:', process.env.OPENAI_API_KEY); // API key exposed

// ❌ NEVER: Log full user objects
const user = await db.users.findUnique({ where: { id } });
console.log('User found:', user); // Includes password hash, email, etc.
```

**Risk:** Critical - Credentials persisted in logs, accessible indefinitely

---

### ❌ NEVER: Expose Sensitive Data in Error Messages

```typescript
// ❌ NEVER: Detailed database errors to client
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.findUnique({
      where: { id: req.params.id },
    });
    res.json(user);
  } catch (error) {
    // CRITICAL: Exposes database structure, credentials
    res.status(500).json({
      error: error.message,
      stack: error.stack, // Full stack trace to client!
      query: error.query, // SQL query with parameters!
    });
  }
});

// ❌ NEVER: Expose validation details
if (!user) {
  res.status(404).json({
    error: 'User not found',
    userId: req.params.id,
    userEmail: user?.email, // Leaks email even when user not found!
  });
}
```

**Risk:** High - Attackers learn database structure, reconnaissance for attacks

---

### ❌ NEVER: Return More Data Than Needed

```typescript
// ❌ NEVER: Return full user object to client
app.get('/api/users/:id', authenticate, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
  });

  // CRITICAL: Exposes password hash, internal IDs, etc.
  res.json(user);
  // Response: { id, email, password: "$2b$12$...", role, createdAt, ... }
});

// ❌ NEVER: Include sensitive fields in API responses
app.get('/api/profile', authenticate, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.user!.userId },
    // No select statement - returns ALL fields!
  });

  res.json(user); // Includes password hash, reset tokens, etc.
});
```

**Risk:** High - PII exposed to frontend, accessible via browser DevTools

---

### ❌ NEVER: Enable Debug Mode in Production

```typescript
// ❌ NEVER: Debug logging in production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { query, params, headers });
}
// If NODE_ENV not set, defaults to undefined (falsy), condition fails!
// Or developer forgets to set NODE_ENV in production

// ❌ NEVER: Detailed error responses
app.use((error, req, res, next) => {
  res.status(500).json({
    error: error.message,
    stack: error.stack, // Stack trace always exposed
  });
});
```

**Risk:** High - Internal details leaked, reconnaissance for attackers

---

### ❌ NEVER: Log Request Headers or Bodies Without Sanitization

```typescript
// ❌ NEVER: Log all request headers
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  // Logs: Authorization: Bearer <token>, Cookie: session=<session_id>
  next();
});

// ❌ NEVER: Log request bodies
app.use(express.json());
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  // Logs passwords, credit cards, anything in request body
  next();
});
```

**Risk:** Critical - Tokens and credentials logged with every request

---

## Correct Patterns

### ✅ ALWAYS: Redact Sensitive Fields in Logs

```typescript
// ✅ Redact sensitive fields before logging
const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'creditCard', 'ssn'];

function redactSensitiveData(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // ✅ Redact sensitive fields
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

// ✅ Safe logging
app.post('/api/login', async (req, res) => {
  const sanitizedBody = redactSensitiveData(req.body);
  console.log('Login attempt:', sanitizedBody);
  // Output: { email: "user@example.com", password: "[REDACTED]" }

  // Validate user...
});

// ✅ Log user actions without sensitive data
app.post('/api/update-profile', authenticate, async (req, res) => {
  console.log('Profile update:', {
    userId: req.user!.userId,
    fields: Object.keys(req.body), // ✅ Log which fields changed, not values
    timestamp: new Date().toISOString(),
  });

  await updateProfile(req.user!.userId, req.body);
});
```

**Benefit:** Security events logged for monitoring, sensitive data protected

---

### ✅ ALWAYS: Return Only Necessary Fields

```typescript
// ✅ Explicitly select fields to return
app.get('/api/users/:id', authenticate, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      // ✅ Password, tokens excluded
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// ✅ Use DTO (Data Transfer Object) pattern
interface UserPublicDTO {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

function toPublicUserDTO(user: User): UserPublicDTO {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    // ✅ Explicitly exclude password, tokens, etc.
  };
}

app.get('/api/profile', authenticate, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.user!.userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // ✅ Transform to safe DTO before sending
  res.json(toPublicUserDTO(user));
});
```

**Benefit:** Only necessary data exposed to client, reduces attack surface

---

### ✅ ALWAYS: Use Generic Error Messages for Clients

```typescript
// ✅ Generic error messages to client, detailed logs server-side
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  // ✅ Log detailed error server-side
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    userId: req.user?.userId,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // ✅ Generic error to client
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'An error occurred',
      // No stack trace, no internal details
    });
  } else {
    // ✅ Detailed errors only in development
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

// ✅ Specific error handling with generic messages
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(toPublicUserDTO(user));
  } catch (error) {
    // ✅ Log detailed error
    console.error('Database error:', error);

    // ✅ Generic message to client
    res.status(500).json({
      error: 'Unable to retrieve user',
    });
  }
});
```

**Benefit:** Errors logged for debugging, no reconnaissance info for attackers

---

### ✅ ALWAYS: Sanitize Logs from Third-Party Libraries

```typescript
import winston from 'winston';

// ✅ Configure Winston with redaction
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    // ✅ Custom format to redact sensitive data
    winston.format((info) => {
      const redacted = redactSensitiveData(info);
      return redacted;
    })(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// ✅ Safe logging
logger.info('User login', {
  userId: user.id,
  email: user.email,
  // password automatically redacted by format function
});

// ✅ Pino with redaction
import pino from 'pino';

const logger = pino({
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    remove: true, // ✅ Remove fields entirely
  },
});

logger.info({ req }, 'Request received');
// Authorization header redacted automatically
```

**Benefit:** Structured logging with automatic redaction of sensitive fields

---

### ✅ ALWAYS: Encrypt Sensitive Data at Rest

```typescript
import crypto from 'crypto';

// ✅ Encrypt sensitive fields before storing
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ✅ Encrypt credit card before storing
app.post('/api/payment-methods', authenticate, async (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;

  // ✅ Encrypt sensitive data
  const encryptedCard = encrypt(cardNumber);

  await db.paymentMethods.create({
    data: {
      userId: req.user!.userId,
      cardNumber: encryptedCard.encrypted,
      cardNumberIv: encryptedCard.iv,
      cardNumberTag: encryptedCard.tag,
      expiryDate, // Not sensitive, can store plaintext
      // ✅ Never store CVV!
    },
  });

  res.json({ message: 'Payment method added' });
});

// ✅ Decrypt when needed
app.get('/api/payment-methods', authenticate, async (req, res) => {
  const methods = await db.paymentMethods.findMany({
    where: { userId: req.user!.userId },
  });

  // ✅ Decrypt and mask card number
  const safeMethods = methods.map(method => ({
    id: method.id,
    // ✅ Show only last 4 digits
    cardNumber: '****' + decrypt(
      method.cardNumber,
      method.cardNumberIv,
      method.cardNumberTag
    ).slice(-4),
    expiryDate: method.expiryDate,
  }));

  res.json(safeMethods);
});
```

**Benefit:** Data encrypted at rest, protected even if database leaked

---

### ✅ ALWAYS: Implement Structured Logging with Context

```typescript
import { AsyncLocalStorage } from 'async_hooks';

// ✅ Request context storage
interface RequestContext {
  requestId: string;
  userId?: string;
  ipAddress: string;
}

const requestContext = new AsyncLocalStorage<RequestContext>();

// ✅ Middleware to set request context
app.use((req, res, next) => {
  const context: RequestContext = {
    requestId: crypto.randomUUID(),
    userId: req.user?.userId,
    ipAddress: req.ip,
  };

  requestContext.run(context, () => {
    next();
  });
});

// ✅ Logger that includes context
function logWithContext(level: string, message: string, metadata?: any) {
  const context = requestContext.getStore();

  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    requestId: context?.requestId,
    userId: context?.userId,
    ipAddress: context?.ipAddress,
    ...redactSensitiveData(metadata || {}),
  };

  console.log(JSON.stringify(logEntry));
}

// ✅ Usage
app.post('/api/transfer', authenticate, async (req, res) => {
  logWithContext('info', 'Transfer initiated', {
    amount: req.body.amount,
    // userId automatically included from context
  });

  await transferMoney(req.user!.userId, req.body.toAccount, req.body.amount);

  logWithContext('info', 'Transfer completed');

  res.json({ success: true });
});
```

**Benefit:** Structured logs with request tracing, automatic context, sensitive data redacted

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Passwords never logged (including in error messages)
- [ ] Tokens and API keys never logged
- [ ] Sensitive fields redacted in all logs (password, token, ssn, creditCard)
- [ ] Authorization headers excluded from request logs
- [ ] Generic error messages sent to clients (no stack traces)
- [ ] Detailed errors logged server-side only
- [ ] API responses include only necessary fields (explicit select or DTO)
- [ ] Sensitive data encrypted at rest (credit cards, SSNs)
- [ ] Debug mode disabled in production
- [ ] Structured logging configured with automatic redaction
- [ ] Third-party logging services configured to exclude sensitive data
- [ ] Database connection strings don't include credentials in logs
- [ ] Request/response bodies sanitized before logging
- [ ] CVV never stored (PCI DSS compliance)
- [ ] Log rotation configured to prevent disk exhaustion
