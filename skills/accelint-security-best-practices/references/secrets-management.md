# Secrets Management

Never hardcode secrets in source code. All API keys, passwords, tokens, and credentials must be stored in environment variables and validated at application startup.

## Why This Matters

Hardcoded secrets in source code are immediately compromised when:
- Pushed to version control (git history persists forever)
- Shared with team members (can't revoke access to individuals)
- Accessed by third parties (contractors, auditors)
- Leaked through employee turnover
- Exposed in CI/CD logs or error messages

Even private repositories are not secure for secrets - they're accessible to anyone with repository access and persist in git history indefinitely.

## Anti-Patterns to Avoid

### ❌ NEVER: Hardcode Secrets in Source Code

```typescript
// ❌ NEVER: API keys in source code
const apiKey = "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const openaiKey = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ❌ NEVER: Passwords in source code
const dbPassword = "password123";
const adminPassword = "admin2024!";

// ❌ NEVER: Tokens in source code
const jwtSecret = "my-super-secret-key";
const githubToken = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// ❌ NEVER: Connection strings with credentials
const dbUrl = "postgresql://user:password@localhost:5432/db";

// ❌ NEVER: Private keys in source code
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIE...";
```

**Risk:** Critical - Secrets exposed in version control, accessible to anyone with repository access

---

### ❌ NEVER: Commit `.env` Files

```bash
# ❌ NEVER commit .env files
git add .env
git add .env.local
git add .env.production

# ❌ NEVER have secrets in committed config
git add config/secrets.json
```

**Risk:** Critical - Secrets visible in git history even after deletion

---

### ❌ NEVER: Use Weak or Default Secrets

```typescript
// ❌ NEVER: Weak secrets
const jwtSecret = "secret";
const apiKey = "12345";

// ❌ NEVER: Default secrets
const adminPassword = "admin";
const dbPassword = "password";
```

**Risk:** High - Easily guessed by attackers, automated scanners detect defaults

---

## Correct Patterns

### ✅ ALWAYS: Use Environment Variables

```typescript
// ✅ ALWAYS: Load from environment
const apiKey = process.env.OPENAI_API_KEY;
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

// ✅ Validate secrets exist at startup
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

**Benefit:** Secrets managed outside source code, can be rotated without code changes

---

### ✅ ALWAYS: Validate All Secrets at Startup

```typescript
// ✅ Centralized secret validation
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'STRIPE_SECRET_KEY',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

// ✅ Type-safe environment config
type Config = {
  openaiApiKey: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  stripeSecretKey: string;
};

function loadConfig(): Config {
  const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };

  // Validate all values are defined
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Environment variable for ${key} is not set`);
    }
  }

  return config as Config;
}

export const config = loadConfig();
```

**Benefit:** Fail fast at startup rather than at runtime, type-safe configuration

---

### ✅ ALWAYS: Add `.env` to `.gitignore`

```bash
# .gitignore

# Environment variables
.env
.env.local
.env.development
.env.production
.env.test

# Secrets and credentials
secrets.json
credentials.json
*.pem
*.key
```

**Benefit:** Prevents accidental commit of secrets

---

### ✅ ALWAYS: Provide `.env.example` Template

```bash
# .env.example - Commit this file

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# External Services
STRIPE_SECRET_KEY=sk_test_your-stripe-key
SENDGRID_API_KEY=SG.your-sendgrid-key

# Application
NODE_ENV=development
PORT=3000
```

**Benefit:** Documents required environment variables without exposing actual secrets

---

## Secret Storage by Environment

### Development Environment

```typescript
// ✅ Load from .env.local (not committed)
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// ✅ Or use separate development config
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}
```

**Setup:**
1. Create `.env.local` with development secrets
2. Add `.env.local` to `.gitignore`
3. Share `.env.example` with team

---

### Production Environment

```typescript
// ✅ Production secrets from hosting platform
// Vercel: Environment Variables in dashboard
// Railway: Project Settings → Variables
// Heroku: Config Vars
// AWS: Secrets Manager or Parameter Store

// No .env files in production!
// Secrets injected by platform at runtime
```

**Setup:**
1. Add secrets to hosting platform dashboard
2. Never commit production secrets
3. Use different secrets for production vs development
4. Rotate production secrets regularly

---

### CI/CD Environment

```yaml
# ✅ GitHub Actions secrets
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    steps:
      - uses: actions/checkout@v3
      - run: npm test
```

**Setup:**
1. Add secrets to GitHub Settings → Secrets and variables → Actions
2. Reference with `${{ secrets.SECRET_NAME }}`
3. Secrets never appear in logs

---

## Secret Rotation

### ✅ Regular Secret Rotation

```typescript
// ✅ Support multiple valid secrets during rotation
const validJwtSecrets = [
  process.env.JWT_SECRET,           // Current secret
  process.env.JWT_SECRET_PREVIOUS,  // Previous secret (grace period)
];

function verifyToken(token: string): Payload {
  for (const secret of validJwtSecrets) {
    if (!secret) continue;

    try {
      return jwt.verify(token, secret) as Payload;
    } catch (error) {
      // Try next secret
      continue;
    }
  }

  throw new Error('Invalid token');
}

// ✅ Sign tokens with current secret only
function signToken(payload: Payload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}
```

**Rotation Process:**
1. Generate new secret
2. Add as `JWT_SECRET`, move old to `JWT_SECRET_PREVIOUS`
3. Deploy
4. Wait for all old tokens to expire
5. Remove `JWT_SECRET_PREVIOUS`

---

## Secret Validation Patterns

### ✅ Validate Secret Format

```typescript
// ✅ Validate API key format
function validateOpenAIKey(key: string | undefined): string {
  if (!key) {
    throw new Error('OPENAI_API_KEY is required');
  }

  if (!key.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY must start with "sk-"');
  }

  if (key.length < 20) {
    throw new Error('OPENAI_API_KEY appears to be invalid (too short)');
  }

  return key;
}

const openaiKey = validateOpenAIKey(process.env.OPENAI_API_KEY);
```

**Benefit:** Fail fast with clear error messages rather than cryptic API errors

---

### ✅ Validate JWT Secret Strength

```typescript
// ✅ Ensure JWT secret is sufficiently random
function validateJWTSecret(secret: string | undefined): string {
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  // Check for weak secrets
  const weakSecrets = ['secret', 'password', '12345', 'test'];
  if (weakSecrets.includes(secret.toLowerCase())) {
    throw new Error('JWT_SECRET is too weak');
  }

  return secret;
}

const jwtSecret = validateJWTSecret(process.env.JWT_SECRET);
```

**Benefit:** Prevents weak secrets in production

---

## Generating Strong Secrets

### ✅ Generate Cryptographically Random Secrets

```typescript
import crypto from 'crypto';

// ✅ Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);
// Output: JWT_SECRET=a3f7b2e9c4d8f1a5b6c7e8d9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0

// ✅ Generate API key
const apiKey = crypto.randomBytes(32).toString('base64url');
console.log('API_KEY=' + apiKey);
// Output: API_KEY=Xy9zAbC_dEfGhIjKlMnOpQrStUvWxYz123
```

---

## Common Mistakes

### ❌ Logging Secrets

```typescript
// ❌ NEVER log secrets
console.log('Connecting with password:', process.env.DB_PASSWORD);
logger.info('API Key:', process.env.OPENAI_API_KEY);

// ✅ Log without secrets
console.log('Connecting to database');
logger.info('API client initialized');
```

---

### ❌ Exposing Secrets in Error Messages

```typescript
// ❌ NEVER include secrets in errors
throw new Error(`Invalid API key: ${apiKey}`);

// ✅ Generic error messages
throw new Error('Invalid API key');
```

---

### ❌ Sending Secrets to Client

```typescript
// ❌ NEVER send secrets to client
res.json({
  config: {
    apiKey: process.env.OPENAI_API_KEY, // Exposed to client!
  }
});

// ✅ Never expose server secrets
res.json({
  config: {
    // Only public configuration
    apiUrl: '/api',
  }
});
```

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] No hardcoded secrets in source code
- [ ] All secrets in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] Environment variables validated at startup
- [ ] Production secrets different from development
- [ ] Strong, randomly generated secrets
- [ ] Secrets not logged or exposed in errors
- [ ] Secret rotation process documented
- [ ] Team knows how to access production secrets securely
- [ ] Git history scanned for leaked secrets (use tools like `git-secrets` or `trufflehog`)
