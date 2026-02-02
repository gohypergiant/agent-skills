# Security Headers

Never deploy without security headers. HTTP security headers provide critical defense-in-depth protection against XSS, clickjacking, MIME sniffing, and other attacks.

## Why This Matters

Security headers protect against:
- **XSS Attacks**: Content Security Policy blocks malicious script execution
- **Clickjacking**: X-Frame-Options prevents UI redressing attacks
- **MIME Sniffing**: X-Content-Type-Options prevents type confusion attacks
- **Protocol Downgrade**: Strict-Transport-Security enforces HTTPS
- **Referrer Leaks**: Referrer-Policy controls information disclosure

Missing security headers leave applications vulnerable even with secure code. Headers are the first line of defense, enforced by the browser before any code executes.

## Anti-Patterns to Avoid

### ❌ NEVER: Deploy Without Content Security Policy

```typescript
// ❌ NEVER: No CSP headers
app.get('/', (req, res) => {
  res.send('<html>...</html>');
  // No CSP = any script can execute, including injected malicious code
});

// ❌ NEVER: Unsafe CSP with 'unsafe-inline'
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", "'unsafe-inline'"], // ❌ Defeats purpose of CSP!
    // Allows inline scripts: <script>maliciousCode()</script>
  },
}));
```

**Risk:** Critical - XSS attacks bypass CSP, full script execution allowed

---

### ❌ NEVER: Allow Framing from Any Origin

```typescript
// ❌ NEVER: No X-Frame-Options
app.get('/', (req, res) => {
  res.send('<html>...</html>');
  // Can be embedded in any iframe = clickjacking vulnerability
});

// ❌ NEVER: Permissive frame options
res.setHeader('X-Frame-Options', 'ALLOWALL'); // Not a valid value!
// Should be DENY or SAMEORIGIN
```

**Risk:** High - Clickjacking attacks trick users into unintended actions

---

### ❌ NEVER: Skip HTTPS Enforcement

```typescript
// ❌ NEVER: No HSTS header
app.get('/', (req, res) => {
  res.send('<html>...</html>');
  // User can be downgraded to HTTP, man-in-the-middle attack possible
});

// ❌ NEVER: Weak HSTS configuration
res.setHeader('Strict-Transport-Security', 'max-age=86400');
// Only 1 day = attacker has 24hr window after expiration
```

**Risk:** High - Protocol downgrade attacks, credential theft over HTTP

---

### ❌ NEVER: Allow MIME Sniffing

```typescript
// ❌ NEVER: No X-Content-Type-Options
app.get('/api/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
  // Browser might interpret as HTML if looks like HTML
});
```

**Risk:** Medium - MIME confusion attacks, unintended script execution

---

### ❌ NEVER: Expose Server Information

```typescript
// ❌ NEVER: Expose server version
// Default Express behavior:
// X-Powered-By: Express
// Attackers know exact framework and version
```

**Risk:** Low - Reconnaissance for targeted attacks against known vulnerabilities

---

## Correct Patterns

### ✅ ALWAYS: Use helmet.js for Security Headers

```typescript
import helmet from 'helmet';

// ✅ Apply all recommended headers
app.use(helmet());

// Automatically sets:
// - Content-Security-Policy
// - X-DNS-Prefetch-Control
// - X-Frame-Options
// - X-Content-Type-Options
// - Strict-Transport-Security
// - X-Download-Options
// - X-Permitted-Cross-Domain-Policies
// - Referrer-Policy
// - And more...
```

**Benefit:** Industry-standard security headers with sensible defaults

---

### ✅ ALWAYS: Configure Strict Content Security Policy

```typescript
import helmet from 'helmet';

// ✅ Strict CSP for high-security applications
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Only load from same origin
      scriptSrc: ["'self'"], // Only scripts from same origin
      styleSrc: ["'self'"], // Only styles from same origin
      imgSrc: ["'self'", 'data:', 'https:'], // Images from self, data URIs, HTTPS
      fontSrc: ["'self'"], // Fonts from same origin
      connectSrc: ["'self'"], // API calls to same origin only
      frameSrc: ["'none'"], // No iframes
      objectSrc: ["'none'"], // No plugins
      mediaSrc: ["'none'"], // No audio/video
      workerSrc: ["'self'"], // Web workers from same origin
      formAction: ["'self'"], // Forms submit to same origin
      frameAncestors: ["'none'"], // Cannot be framed
      baseUri: ["'self'"], // Base tag only same origin
      upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
    },
  })
);

// ✅ Balanced CSP for typical applications
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://cdn.jsdelivr.net', // Trusted CDN
        'https://unpkg.com', // Trusted CDN
      ],
      styleSrc: [
        "'self'",
        'https://fonts.googleapis.com', // Google Fonts
      ],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com', // Google Fonts
      ],
      connectSrc: [
        "'self'",
        'https://api.yourdomain.com', // Your API
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// ✅ CSP with nonce for inline scripts (when necessary)
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`, // Dynamic nonce
      ],
    },
  })
);

// Template usage:
// <script nonce="<%= nonce %>">
//   // Inline script allowed with nonce
// </script>
```

**Benefit:** Blocks XSS attacks even if vulnerability exists in application code

---

### ✅ ALWAYS: Prevent Clickjacking

```typescript
import helmet from 'helmet';

// ✅ Deny all framing (most secure)
app.use(
  helmet.frameguard({
    action: 'deny', // Cannot be embedded in any iframe
  })
);

// ✅ Allow same-origin framing only
app.use(
  helmet.frameguard({
    action: 'sameorigin', // Can be embedded in iframes from same domain
  })
);

// ✅ Manual header setting
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// ✅ Modern alternative: CSP frame-ancestors
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      frameAncestors: ["'none'"], // Modern alternative to X-Frame-Options
    },
  })
);
```

**Benefit:** Prevents clickjacking attacks where UI is overlaid on malicious page

---

### ✅ ALWAYS: Enforce HTTPS with HSTS

```typescript
import helmet from 'helmet';

// ✅ Strict Transport Security (production only)
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply to all subdomains
      preload: true, // Submit to HSTS preload list
    })
  );
}

// ✅ Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// ✅ Force HTTPS in reverse proxy (Nginx, Cloudflare)
// Nginx config:
/*
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

  # SSL configuration...
}
*/
```

**Benefit:** Prevents protocol downgrade attacks, enforces HTTPS for all connections

---

### ✅ ALWAYS: Prevent MIME Sniffing

```typescript
import helmet from 'helmet';

// ✅ X-Content-Type-Options
app.use(helmet.noSniff());

// Sets: X-Content-Type-Options: nosniff
// Prevents browser from interpreting files as different MIME type

// ✅ Manual setting
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// ✅ Always set correct Content-Type
app.get('/api/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.json({ data: 'value' });
});
```

**Benefit:** Prevents MIME confusion attacks where JSON interpreted as HTML

---

### ✅ ALWAYS: Control Referrer Information

```typescript
import helmet from 'helmet';

// ✅ Strict referrer policy
app.use(
  helmet.referrerPolicy({
    policy: 'strict-origin-when-cross-origin',
    // Sends full URL to same origin, only origin to other HTTPS, nothing to HTTP
  })
);

// ✅ No referrer to external sites
app.use(
  helmet.referrerPolicy({
    policy: 'same-origin',
    // Only send referrer to same origin, nothing to external sites
  })
);

// ✅ No referrer at all (most private)
app.use(
  helmet.referrerPolicy({
    policy: 'no-referrer',
    // Never send referrer header
  })
);
```

**Benefit:** Prevents leaking sensitive URLs to third parties

---

### ✅ ALWAYS: Remove Server Fingerprinting

```typescript
import helmet from 'helmet';

// ✅ Hide X-Powered-By header
app.use(helmet.hidePoweredBy());

// ✅ Or manually
app.disable('x-powered-by');

// ✅ Custom X-Powered-By (obscurity)
app.use(helmet.hidePoweredBy({ setTo: 'PHP/7.4.3' }));

// ✅ Remove Server header (requires web server config)
// Nginx:
// server_tokens off;

// Apache:
// ServerTokens Prod
// ServerSignature Off
```

**Benefit:** Reduces reconnaissance information for attackers

---

### ✅ ALWAYS: Implement Permissions Policy

```typescript
import helmet from 'helmet';

// ✅ Restrict browser features
app.use(
  helmet.permissionsPolicy({
    features: {
      geolocation: ["'none'"], // Disable geolocation
      camera: ["'none'"], // Disable camera
      microphone: ["'none'"], // Disable microphone
      payment: ["'self'"], // Payment only from same origin
      usb: ["'none'"], // Disable USB access
      accelerometer: ["'none'"], // Disable accelerometer
      gyroscope: ["'none'"], // Disable gyroscope
      magnetometer: ["'none'"], // Disable magnetometer
    },
  })
);

// ✅ Selective permissions
app.use(
  helmet.permissionsPolicy({
    features: {
      geolocation: ["'self'", 'https://maps.google.com'],
      camera: ["'self'"], // Allow camera on same origin
      microphone: ["'self'"], // Allow microphone on same origin
    },
  })
);
```

**Benefit:** Limits browser feature access, reduces attack surface

---

### ✅ ALWAYS: Set Secure Cookie Attributes

```typescript
// ✅ Secure cookie configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true, // JavaScript cannot access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict', // CSRF protection
      maxAge: 3600000, // 1 hour
    },
  })
);

// ✅ Set cookies manually
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000,
});
```

**Benefit:** Cookies protected from XSS and CSRF attacks

---

### ✅ ALWAYS: Complete Security Headers Configuration

```typescript
import helmet from 'helmet';

// ✅ Production-ready helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  })
);
```

**Benefit:** Comprehensive defense-in-depth security posture

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] helmet.js configured and applied to all routes
- [ ] Content Security Policy configured (no 'unsafe-inline' or 'unsafe-eval')
- [ ] X-Frame-Options set to DENY or SAMEORIGIN
- [ ] Strict-Transport-Security configured with long max-age (1 year+)
- [ ] X-Content-Type-Options set to nosniff
- [ ] Referrer-Policy configured appropriately
- [ ] X-Powered-By header removed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Permissions-Policy configured to restrict unused features
- [ ] Cookies use httpOnly, secure, and sameSite attributes
- [ ] CORS configured restrictively (not wildcard '*')
- [ ] Security headers tested with securityheaders.com
- [ ] CSP tested and no violations in browser console
- [ ] HSTS preload submitted (if using preload: true)
