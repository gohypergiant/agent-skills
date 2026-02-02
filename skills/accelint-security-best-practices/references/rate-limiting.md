# Rate Limiting

Never allow unlimited API requests. Rate limiting prevents brute force attacks, denial of service, data scraping, and resource exhaustion.

## Why This Matters

Without rate limiting, attackers can:
- **Brute Force Passwords**: Test 1000+ passwords per second to crack accounts
- **Denial of Service**: Exhaust server resources with flood of requests
- **Data Scraping**: Enumerate all users, posts, or resources by iterating IDs
- **API Abuse**: Consume expensive operations (AI API calls, database queries)
- **Credential Stuffing**: Test millions of leaked credentials rapidly

For a login endpoint, no rate limiting means attacker tries 10,000 passwords in minutes. With rate limiting (5 attempts per 15 minutes), attacker needs 500 hours for same attempts.

## Anti-Patterns to Avoid

### ❌ NEVER: Allow Unlimited Login Attempts

```typescript
// ❌ NEVER: No rate limiting on authentication
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Attacker can try unlimited passwords!
  // 1000 attempts/second = crack weak passwords in minutes
});
```

**Risk:** Critical - Account compromise via brute force attacks

---

### ❌ NEVER: Allow Unlimited Password Reset Requests

```typescript
// ❌ NEVER: No rate limiting on password reset
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;

  // No rate limit!
  // Attacker floods email inbox with reset emails
  // Or enumerates valid email addresses
  await sendPasswordResetEmail(email);

  res.json({ message: 'Reset email sent' });
});
```

**Risk:** High - Email flooding, user enumeration, resource exhaustion

---

### ❌ NEVER: Allow Unlimited API Calls to Expensive Operations

```typescript
// ❌ NEVER: No rate limiting on expensive operations
app.post('/api/generate-report', authenticate, async (req, res) => {
  // No rate limit!
  // Complex database aggregations across millions of rows
  const report = await db.$queryRaw`
    SELECT * FROM analytics
    WHERE user_id = ${req.user!.userId}
    AND created_at > NOW() - INTERVAL '1 year'
    ORDER BY created_at DESC
  `;

  res.json(report);
  // Attacker floods this endpoint, exhausts database connections
});

// ❌ NEVER: No rate limiting on external API calls
app.post('/api/ai/generate', authenticate, async (req, res) => {
  // No rate limit!
  // Costs $0.002 per request to OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: req.body.prompt }],
  });

  res.json(response);
  // Attacker makes 1000 requests = $2.00 cost, scales infinitely
});
```

**Risk:** High - Resource exhaustion, financial loss, database overload

---

### ❌ NEVER: Use Only IP-Based Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// ❌ NEVER: IP-only rate limiting (easily bypassed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // Attacker uses VPN, proxies, or rotating IPs to bypass
  // NAT/corporate networks punish all users behind same IP
});

app.use('/api/', limiter);
```

**Risk:** Medium - Bypassed via IP rotation, punishes legitimate users behind NAT

---

### ❌ NEVER: Use Weak Rate Limits

```typescript
// ❌ NEVER: Rate limit too permissive
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 attempts!
  // Attacker can still test 1000 passwords every 15 minutes
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Rate limit too weak to prevent brute force
});
```

**Risk:** High - Attacker can still brute force accounts

---

## Correct Patterns

### ✅ ALWAYS: Rate Limit Authentication Endpoints

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Strict rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // ✅ Use custom key generator (IP + email)
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || ''}`;
  },
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token...
});

// ✅ Strict rate limiting for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: 'Too many accounts created, please try again later',
});

app.post('/api/register', registerLimiter, async (req, res) => {
  // Create user...
});

// ✅ Strict rate limiting for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || ''}`;
  },
});

app.post('/api/request-password-reset', passwordResetLimiter, async (req, res) => {
  // Send reset email...
});
```

**Benefit:** Brute force attacks slowed to impractical speeds

---

### ✅ ALWAYS: Implement Tiered Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// ✅ General API rate limit (all authenticated users)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  keyGenerator: (req) => {
    // ✅ Use user ID for authenticated requests
    return req.user?.userId || req.ip;
  },
});

// ✅ Strict limit for expensive operations
const expensiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  keyGenerator: (req) => req.user?.userId || req.ip,
});

// ✅ Premium users get higher limits
function createPremiumLimiter(maxRequests: number) {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: maxRequests,
    skip: (req) => {
      // ✅ Premium users skip basic limits
      return req.user?.subscription === 'premium';
    },
  });
}

// ✅ Apply tiered limits
app.use('/api', generalLimiter); // All API requests

app.post('/api/generate-report',
  authenticate,
  expensiveLimiter, // Expensive operations
  async (req, res) => {
    // Generate report...
  }
);

app.post('/api/ai/generate',
  authenticate,
  createPremiumLimiter(100), // Premium: 100/hour, Free: rate limited
  async (req, res) => {
    // Call OpenAI...
  }
);
```

**Benefit:** Different limits for different operations and user tiers

---

### ✅ ALWAYS: Use Redis for Distributed Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// ✅ Create Redis client
const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

await redisClient.connect();

// ✅ Use Redis store for distributed rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // ✅ Redis store syncs rate limits across multiple servers
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
  }),
  keyGenerator: (req) => req.user?.userId || req.ip,
});

app.use('/api', limiter);
```

**Benefit:** Rate limits consistent across multiple servers/instances

---

### ✅ ALWAYS: Implement Account Lockout After Failed Attempts

```typescript
// ✅ Track failed login attempts in database
interface FailedAttempt {
  email: string;
  attemptCount: number;
  lastAttempt: Date;
  lockedUntil: Date | null;
}

async function checkAccountLockout(email: string): Promise<boolean> {
  const attempt = await db.failedAttempts.findUnique({
    where: { email },
  });

  if (!attempt) {
    return false; // No failed attempts
  }

  // ✅ Check if account is locked
  if (attempt.lockedUntil && attempt.lockedUntil > new Date()) {
    return true; // Account locked
  }

  // ✅ Reset attempts if more than 15 minutes passed
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  if (attempt.lastAttempt < fifteenMinutesAgo) {
    await db.failedAttempts.update({
      where: { email },
      data: {
        attemptCount: 0,
        lockedUntil: null,
      },
    });
    return false;
  }

  return false;
}

async function recordFailedAttempt(email: string) {
  const attempt = await db.failedAttempts.findUnique({
    where: { email },
  });

  const newAttemptCount = (attempt?.attemptCount || 0) + 1;

  // ✅ Lock account after 5 failed attempts
  const shouldLock = newAttemptCount >= 5;
  const lockedUntil = shouldLock
    ? new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    : null;

  await db.failedAttempts.upsert({
    where: { email },
    create: {
      email,
      attemptCount: 1,
      lastAttempt: new Date(),
      lockedUntil: null,
    },
    update: {
      attemptCount: newAttemptCount,
      lastAttempt: new Date(),
      lockedUntil,
    },
  });

  return shouldLock;
}

// ✅ Usage in login endpoint
app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // ✅ Check if account is locked
  const isLocked = await checkAccountLockout(email);

  if (isLocked) {
    return res.status(429).json({
      error: 'Account locked due to too many failed attempts. Try again later.',
    });
  }

  const user = await db.users.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    // ✅ Record failed attempt
    const locked = await recordFailedAttempt(email);

    if (locked) {
      return res.status(429).json({
        error: 'Account locked due to too many failed attempts.',
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ Reset failed attempts on successful login
  await db.failedAttempts.delete({ where: { email } }).catch(() => {});

  // Generate token...
});
```

**Benefit:** Persistent lockout prevents distributed brute force attacks

---

### ✅ ALWAYS: Rate Limit by User ID for Authenticated Endpoints

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Rate limit by user ID (prevents IP rotation bypass)
const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    // ✅ Use user ID for authenticated requests
    if (req.user?.userId) {
      return `user:${req.user.userId}`;
    }
    // ✅ Fall back to IP for unauthenticated requests
    return `ip:${req.ip}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// ✅ Apply to authenticated endpoints
app.use('/api', authenticate, userRateLimiter);
```

**Benefit:** Attackers cannot bypass by rotating IPs, each user account limited individually

---

### ✅ ALWAYS: Implement Exponential Backoff

```typescript
// ✅ Exponential backoff for failed login attempts
async function getLoginWaitTime(email: string): Promise<number> {
  const attempt = await db.failedAttempts.findUnique({
    where: { email },
  });

  if (!attempt || attempt.attemptCount === 0) {
    return 0; // No wait
  }

  // ✅ Exponential backoff: 2^attempts seconds
  // Attempt 1: 2s, Attempt 2: 4s, Attempt 3: 8s, Attempt 4: 16s, Attempt 5: 32s
  const waitSeconds = Math.min(Math.pow(2, attempt.attemptCount), 300); // Max 5 minutes

  const waitUntil = new Date(attempt.lastAttempt.getTime() + waitSeconds * 1000);

  if (waitUntil > new Date()) {
    return Math.ceil((waitUntil.getTime() - Date.now()) / 1000);
  }

  return 0;
}

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // ✅ Check exponential backoff
  const waitTime = await getLoginWaitTime(email);

  if (waitTime > 0) {
    return res.status(429).json({
      error: `Too many failed attempts. Please wait ${waitTime} seconds.`,
      retryAfter: waitTime,
    });
  }

  // Validate credentials...
});
```

**Benefit:** Each failed attempt increases wait time, making brute force exponentially slower

---

### ✅ ALWAYS: Add Rate Limit Headers

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Include rate limit info in response headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // ✅ Return RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Response headers:
// RateLimit-Limit: 100
// RateLimit-Remaining: 95
// RateLimit-Reset: 1640000000

app.use('/api', limiter);
```

**Benefit:** Clients can self-throttle before hitting rate limits

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Authentication endpoints rate limited (5 attempts per 15 min)
- [ ] Registration rate limited (3 per hour per IP)
- [ ] Password reset rate limited (3 per hour per email)
- [ ] General API rate limit applied (100 per 15 min per user)
- [ ] Expensive operations strictly rate limited (10 per hour per user)
- [ ] Rate limiting by user ID for authenticated requests
- [ ] Rate limiting by IP for unauthenticated requests
- [ ] Redis store for distributed rate limiting in production
- [ ] Account lockout after 5 failed login attempts
- [ ] Exponential backoff for repeated failed attempts
- [ ] Rate limit headers included in responses
- [ ] Different rate limits for free vs premium users
- [ ] Failed attempts tracked in database (persistent across restarts)
- [ ] Rate limit errors return 429 status with retry-after header
