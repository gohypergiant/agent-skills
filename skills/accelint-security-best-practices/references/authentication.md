# Authentication

Never store JWT tokens in localStorage or use weak session management. Authentication must use secure token storage, strong password hashing, and proper session lifecycle management.

## Why This Matters

Weak authentication enables attackers to:
- **Steal User Accounts**: XSS attacks extract tokens from localStorage, granting full account access
- **Brute Force Passwords**: Weak hashing (MD5, SHA1) or no rate limiting allows password cracking
- **Session Hijacking**: Tokens without expiration or refresh mechanism remain valid indefinitely
- **Credential Stuffing**: Reused passwords from data breaches tested against your application
- **Token Theft**: Tokens in URLs, logs, or browser history persist and are accessible to attackers

For an application with 100,000 users, a single XSS vulnerability extracting localStorage tokens compromises all active sessions. Weak bcrypt rounds (< 10) allow attackers to crack passwords at 1000+ hashes/second.

## Anti-Patterns to Avoid

### ❌ NEVER: Store Tokens in localStorage

```typescript
// ❌ NEVER: JWT in localStorage
function login(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const { token } = await response.json();

  // CRITICAL VULNERABILITY: XSS can steal this
  localStorage.setItem('token', token);

  // Any JavaScript code (including malicious scripts) can access:
  const stolen = localStorage.getItem('token');
}

// ❌ NEVER: sessionStorage (same vulnerability)
sessionStorage.setItem('token', token);

// ❌ NEVER: Tokens in regular cookies without httpOnly
document.cookie = `token=${token}; path=/`;
```

**Risk:** Critical - XSS attacks steal tokens, complete account takeover

---

### ❌ NEVER: Use Weak Password Hashing

```typescript
import crypto from 'crypto';

// ❌ NEVER: Plain text passwords
await db.users.create({
  email,
  password: password, // Stored in plain text!
});

// ❌ NEVER: MD5 or SHA hashing (too fast)
const hash = crypto.createHash('md5').update(password).digest('hex');
await db.users.create({ email, password: hash });
// Attackers crack MD5 at 1+ billion hashes/second

// ❌ NEVER: SHA-256 without salt
const hash = crypto.createHash('sha256').update(password).digest('hex');
// Rainbow tables crack common passwords instantly

// ❌ NEVER: Weak bcrypt rounds
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 4); // 4 rounds = too fast!
// Attacker can test thousands of passwords per second
```

**Risk:** Critical - Password database leak leads to mass account compromise

---

### ❌ NEVER: Create Tokens Without Expiration

```typescript
import jwt from 'jsonwebtoken';

// ❌ NEVER: No expiration time
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!
  // Missing expiresIn - token valid forever!
);

// ❌ NEVER: Very long expiration
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '365d' } // Valid for 1 year!
);

// ❌ NEVER: No refresh token mechanism
// User stays logged in forever with single token
```

**Risk:** High - Stolen tokens remain valid indefinitely, no way to revoke access

---

### ❌ NEVER: Skip Token Validation

```typescript
// ❌ NEVER: No authentication middleware
app.get('/api/profile', async (req, res) => {
  // No authentication check!
  const userId = req.query.userId; // Attacker can specify any userId
  const user = await db.users.findUnique({ where: { id: userId } });
  res.json(user);
});

// ❌ NEVER: Incomplete token validation
app.get('/api/data', async (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    // Just checks token exists, doesn't verify signature!
    const decoded = jwt.decode(token); // Unsafe: no verification
    const userId = decoded.userId;
    // Attacker can forge tokens
  }
});

// ❌ NEVER: No token expiration check
const decoded = jwt.verify(token, secret, {
  ignoreExpiration: true, // Accepts expired tokens!
});
```

**Risk:** Critical - Anyone can access protected resources, forge authentication

---

### ❌ NEVER: Expose Sensitive User Info in Tokens

```typescript
// ❌ NEVER: Include sensitive data in JWT payload
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    password: user.password, // Never include passwords!
    ssn: user.ssn, // Never include PII!
    creditCard: user.creditCard, // Never include financial data!
  },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);

// JWT payloads are BASE64 encoded, NOT encrypted
// Anyone can decode and read the payload:
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload.password); // Exposed!
```

**Risk:** High - Sensitive data exposed to anyone who intercepts token

---

## Correct Patterns

### ✅ ALWAYS: Use httpOnly Cookies for Tokens

```typescript
import jwt from 'jsonwebtoken';
import { Response } from 'express';

// ✅ Store tokens in httpOnly cookies
function setAuthCookie(res: Response, token: string) {
  res.cookie('auth_token', token, {
    httpOnly: true, // JavaScript cannot access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate credentials...
  const user = await validateUser(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ Create access token (short-lived)
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  // ✅ Set httpOnly cookie
  setAuthCookie(res, accessToken);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

// ✅ Logout clears cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.json({ message: 'Logged out successfully' });
});
```

**Benefit:** XSS attacks cannot access httpOnly cookies, significantly reduces token theft risk

---

### ✅ ALWAYS: Use bcrypt with Strong Work Factor

```typescript
import bcrypt from 'bcrypt';

// ✅ Strong bcrypt configuration
const BCRYPT_ROUNDS = 12; // 12 rounds = good balance of security and performance

// ✅ Hash password during registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate password strength first
  const PasswordSchema = z.string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character');

  try {
    PasswordSchema.parse(password);
  } catch (error) {
    return res.status(400).json({ error: 'Password too weak' });
  }

  // ✅ Hash with strong work factor
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await db.users.create({
    data: {
      email,
      password: hashedPassword, // Stored securely
    },
  });

  res.json({
    message: 'User created',
    userId: user.id,
  });
});

// ✅ Compare password during login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findUnique({
    where: { email },
  });

  if (!user) {
    // ✅ Generic error message (don't reveal if email exists)
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ Use bcrypt.compare for timing-safe comparison
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate and send token...
});
```

**Benefit:** bcrypt is slow by design (prevents brute force), includes automatic salting

---

### ✅ ALWAYS: Implement Refresh Token Pattern

```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ✅ Generate token pair
async function generateTokenPair(userId: string) {
  // ✅ Short-lived access token
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  // ✅ Long-lived refresh token
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  // ✅ Store refresh token hash in database (for revocation)
  const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await db.refreshTokens.create({
    data: {
      userId,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

// ✅ Login with refresh token
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await validateUser(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = await generateTokenPair(user.id);

  // ✅ Set both tokens as httpOnly cookies
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/refresh', // Only sent to refresh endpoint
  });

  res.json({ message: 'Login successful' });
});

// ✅ Refresh access token
app.post('/api/refresh', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  try {
    // ✅ Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string; type: string };

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // ✅ Check if refresh token is still valid in database
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const storedToken = await db.refreshTokens.findFirst({
      where: {
        userId: decoded.userId,
        tokenHash: refreshTokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      return res.status(401).json({ error: 'Refresh token revoked or expired' });
    }

    // ✅ Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, type: 'access' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    // ✅ Set new access token
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ✅ Revoke refresh tokens on logout
app.post('/api/logout', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // ✅ Delete refresh token from database
    await db.refreshTokens.deleteMany({
      where: { tokenHash: refreshTokenHash },
    });
  }

  // ✅ Clear cookies
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.json({ message: 'Logged out' });
});
```

**Benefit:** Short-lived access tokens limit damage from theft, refresh tokens can be revoked

---

### ✅ ALWAYS: Implement Secure Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ✅ Type-safe user payload
interface TokenPayload {
  userId: string;
  role: string;
  type: 'access' | 'refresh';
}

// ✅ Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// ✅ Authentication middleware
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // ✅ Verify token signature and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    // ✅ Validate token type
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // ✅ Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ error: 'Authentication failed' });
  }
}

// ✅ Optional authentication (for public endpoints with optional auth)
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;

  if (!token) {
    // No token, continue without user
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    if (decoded.type === 'access') {
      req.user = decoded;
    }
  } catch (error) {
    // Invalid token, continue without user (don't reject request)
  }

  next();
}

// ✅ Usage
app.get('/api/profile', authenticate, async (req, res) => {
  // req.user guaranteed to exist (set by middleware)
  const userId = req.user!.userId;

  const user = await db.users.findUnique({
    where: { id: userId },
  });

  res.json(user);
});

app.get('/api/posts', optionalAuthenticate, async (req, res) => {
  // req.user may or may not exist
  const userId = req.user?.userId;

  const posts = await db.posts.findMany({
    where: userId ? { authorId: userId } : { published: true },
  });

  res.json(posts);
});
```

**Benefit:** Centralized authentication logic, type-safe user context, consistent error handling

---

### ✅ ALWAYS: Implement Password Reset Securely

```typescript
import crypto from 'crypto';
import { sendEmail } from './email';

// ✅ Request password reset
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;

  const user = await db.users.findUnique({ where: { email } });

  // ✅ Always return success (don't reveal if email exists)
  if (!user) {
    return res.json({
      message: 'If email exists, reset link sent',
    });
  }

  // ✅ Generate cryptographically secure token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ✅ Store hashed token with expiration
  await db.users.update({
    where: { id: user.id },
    data: {
      resetTokenHash,
      resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // ✅ Send reset link (token not hashed in URL)
  const resetUrl = `https://yourdomain.com/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    body: `Reset your password: ${resetUrl}`,
  });

  res.json({ message: 'If email exists, reset link sent' });
});

// ✅ Reset password with token
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // ✅ Validate new password
  const PasswordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/);
  try {
    PasswordSchema.parse(newPassword);
  } catch (error) {
    return res.status(400).json({ error: 'Password too weak' });
  }

  // ✅ Hash token to find in database
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await db.users.findFirst({
    where: {
      resetTokenHash,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  // ✅ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // ✅ Update password and clear reset token
  await db.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetTokenHash: null,
      resetTokenExpiry: null,
    },
  });

  // ✅ Revoke all refresh tokens (force re-login)
  await db.refreshTokens.deleteMany({
    where: { userId: user.id },
  });

  res.json({ message: 'Password reset successful' });
});
```

**Benefit:** Secure token generation, limited time window, single-use tokens

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Tokens stored in httpOnly cookies (never localStorage/sessionStorage)
- [ ] Cookies configured with secure, sameSite, and httpOnly flags
- [ ] Passwords hashed with bcrypt using 12+ rounds
- [ ] Access tokens short-lived (15 minutes or less)
- [ ] Refresh token pattern implemented for session management
- [ ] Refresh tokens stored in database for revocation capability
- [ ] Authentication middleware applied to all protected routes
- [ ] Token expiration enforced (no ignoreExpiration flag)
- [ ] Sensitive data excluded from JWT payload
- [ ] Password reset uses cryptographically secure tokens
- [ ] Password reset tokens expire within 1 hour
- [ ] Generic error messages (don't reveal if email/username exists)
- [ ] Logout clears all tokens and revokes refresh tokens
- [ ] HTTPS enforced in production (secure cookies only work over HTTPS)
