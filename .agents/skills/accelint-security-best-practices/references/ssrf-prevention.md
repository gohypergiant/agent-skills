# SSRF Prevention

Never fetch user-provided URLs without validation. Server-Side Request Forgery (SSRF) allows attackers to make requests from your server to internal resources or external targets.

## Why This Matters

SSRF attacks enable:
- **Internal Network Access**: Access internal services not exposed to internet (databases, admin panels, cloud metadata)
- **Port Scanning**: Enumerate internal network topology and services
- **Credential Theft**: Access cloud metadata endpoints (AWS, GCP, Azure) to steal credentials
- **Data Exfiltration**: Read internal files or database contents via internal APIs
- **Bypass Firewall**: Use server as proxy to access restricted resources

For cloud-hosted applications, SSRF to `http://169.254.169.254/latest/meta-data/iam/security-credentials/` returns AWS credentials with full account access. A single unvalidated URL fetch can compromise entire infrastructure.

## Anti-Patterns to Avoid

### ❌ NEVER: Fetch User-Provided URLs Without Validation

```typescript
// ❌ NEVER: Direct fetch of user URL
app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  // CRITICAL: No validation!
  const response = await fetch(url);
  const data = await response.text();

  res.send(data);

  // Attacker payload: http://169.254.169.254/latest/meta-data/
  // Returns AWS metadata including credentials!
});

// ❌ NEVER: User-controlled URL in axios
import axios from 'axios';

app.post('/api/proxy', async (req, res) => {
  const { url } = req.body;

  const response = await axios.get(url); // No validation!
  res.json(response.data);

  // Attacker payload: http://localhost:6379/
  // Access internal Redis database!
});
```

**Risk:** Critical - Full access to internal network, cloud credentials, databases

---

### ❌ NEVER: Allow Internal IP Addresses

```typescript
// ❌ NEVER: Allow localhost or private IPs
app.post('/api/fetch-image', async (req, res) => {
  const { imageUrl } = req.body;

  // Basic validation but allows private IPs
  if (!imageUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const response = await fetch(imageUrl);
  // Attacker payload: http://localhost:8080/admin
  // Access internal admin panel!

  // Attacker payload: http://192.168.1.1/
  // Access internal router/devices!
});
```

**Risk:** Critical - Internal network enumeration, service access

---

### ❌ NEVER: Trust URL After Basic Validation Only

```typescript
// ❌ NEVER: Check protocol but nothing else
app.post('/api/webhook', async (req, res) => {
  const { webhookUrl } = req.body;

  // Only checks protocol
  if (!webhookUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Must use HTTPS' });
  }

  // Still vulnerable!
  await fetch(webhookUrl);

  // Attacker payload: https://127.0.0.1:8443/admin
  // Uses HTTPS but targets localhost!

  // Attacker payload: https://metadata.google.internal/
  // GCP metadata endpoint!
});
```

**Risk:** Critical - Partial validation insufficient, still exploitable

---

### ❌ NEVER: Allow URL Redirects Without Validation

```typescript
// ❌ NEVER: Follow redirects without checking final destination
app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;

  // Validates initial URL
  if (!url.startsWith('https://trusted-domain.com')) {
    return res.status(400).json({ error: 'Invalid domain' });
  }

  // Vulnerable: follows redirects
  const response = await fetch(url, {
    redirect: 'follow', // Default behavior
  });

  // Attacker sets up: https://trusted-domain.com/redirect?to=http://169.254.169.254/
  // Initial URL passes validation, redirects to metadata endpoint!
});
```

**Risk:** Critical - Validation bypassed via redirect

---

### ❌ NEVER: Parse URLs with String Methods

```typescript
// ❌ NEVER: Manual URL parsing
app.post('/api/proxy', async (req, res) => {
  const { url } = req.body;

  // Weak validation
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  await fetch(url);

  // Bypasses:
  // - http://127.1/ (alternative localhost notation)
  // - http://[::1]/ (IPv6 localhost)
  // - http://2130706433/ (decimal IP for 127.0.0.1)
  // - http://0x7f.0x0.0x0.0x1/ (hex IP)
  // - http://localtest.me/ (DNS resolves to 127.0.0.1)
});
```

**Risk:** Critical - Easy to bypass with IP encoding tricks

---

## Correct Patterns

### ✅ ALWAYS: Whitelist Allowed Domains

```typescript
import { URL } from 'url';

// ✅ Strict domain whitelist
const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com',
  'images.example.com',
];

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // ✅ Check protocol
    if (url.protocol !== 'https:') {
      return false;
    }

    // ✅ Check domain whitelist
    const hostname = url.hostname.toLowerCase();
    const isAllowed = ALLOWED_DOMAINS.some(
      domain => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    return isAllowed;
  } catch {
    return false; // Invalid URL
  }
}

app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  // ✅ Validate before fetching
  if (!isAllowedUrl(url)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  const response = await fetch(url);
  const data = await response.text();

  res.send(data);
});
```

**Benefit:** Only explicitly allowed domains can be accessed

---

### ✅ ALWAYS: Block Private IP Ranges

```typescript
import { URL } from 'url';
import { isIP } from 'net';

// ✅ Check if IP is private/internal
function isPrivateIP(ip: string): boolean {
  // IPv4 private ranges
  const privateIPv4Ranges = [
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^127\./, // Loopback
    /^169\.254\./, // Link-local
    /^0\./, // Current network
  ];

  if (isIP(ip) === 4) {
    return privateIPv4Ranges.some(regex => regex.test(ip));
  }

  // IPv6 private ranges
  const privateIPv6Ranges = [
    /^::1$/, // Loopback
    /^fe80:/i, // Link-local
    /^fc00:/i, // Unique local
    /^fd00:/i, // Unique local
  ];

  if (isIP(ip) === 6) {
    return privateIPv6Ranges.some(regex => regex.test(ip));
  }

  return false;
}

// ✅ Validate URL doesn't target internal IPs
async function isValidExternalUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);

    // ✅ Block non-HTTP(S) protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // ✅ Block special hostnames
    const hostname = url.hostname.toLowerCase();
    const blockedHostnames = [
      'localhost',
      'metadata.google.internal',
      '169.254.169.254', // AWS metadata
      '[::1]', // IPv6 localhost
    ];

    if (blockedHostnames.includes(hostname)) {
      return false;
    }

    // ✅ Resolve hostname to IP and check if private
    const dns = require('dns').promises;

    try {
      const addresses = await dns.resolve4(hostname);

      for (const address of addresses) {
        if (isPrivateIP(address)) {
          return false; // Resolves to private IP
        }
      }
    } catch {
      // DNS resolution failed or hostname is already an IP
      if (isIP(hostname)) {
        if (isPrivateIP(hostname)) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return false; // Invalid URL
  }
}

app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  // ✅ Async validation including DNS resolution
  if (!(await isValidExternalUrl(url))) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  const response = await fetch(url);
  const data = await response.text();

  res.send(data);
});
```

**Benefit:** Blocks all private IP ranges, prevents internal network access

---

### ✅ ALWAYS: Disable Redirects or Validate Redirect Targets

```typescript
import { URL } from 'url';

// ✅ Disable redirects entirely (safest)
app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;

  if (!isAllowedUrl(url)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  // ✅ Disable automatic redirects
  const response = await fetch(url, {
    redirect: 'manual', // Don't follow redirects
  });

  if (response.status >= 300 && response.status < 400) {
    return res.status(400).json({ error: 'Redirects not allowed' });
  }

  const data = await response.text();
  res.send(data);
});

// ✅ Validate redirect target before following
async function fetchWithValidatedRedirects(
  urlString: string,
  maxRedirects: number = 3
): Promise<Response> {
  let currentUrl = urlString;
  let redirectCount = 0;

  while (redirectCount < maxRedirects) {
    // ✅ Validate each URL in redirect chain
    if (!(await isValidExternalUrl(currentUrl))) {
      throw new Error('Redirect target not allowed');
    }

    const response = await fetch(currentUrl, {
      redirect: 'manual',
    });

    // Not a redirect, return response
    if (response.status < 300 || response.status >= 400) {
      return response;
    }

    // Get redirect location
    const location = response.headers.get('location');

    if (!location) {
      throw new Error('Redirect without location header');
    }

    // ✅ Resolve relative URLs
    currentUrl = new URL(location, currentUrl).toString();
    redirectCount++;
  }

  throw new Error('Too many redirects');
}

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetchWithValidatedRedirects(url);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Benefit:** Validates every URL in redirect chain, prevents bypass

---

### ✅ ALWAYS: Use Timeouts and Size Limits

```typescript
import { URL } from 'url';

// ✅ Fetch with timeout and size limit
async function safeFetch(
  url: string,
  options: {
    timeout?: number;
    maxSize?: number;
  } = {}
): Promise<string> {
  const timeout = options.timeout || 5000; // 5 seconds default
  const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default

  // ✅ Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'manual',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // ✅ Check content length
    const contentLength = response.headers.get('content-length');

    if (contentLength && parseInt(contentLength) > maxSize) {
      throw new Error('Response too large');
    }

    // ✅ Stream with size limit
    const reader = response.body!.getReader();
    const chunks: Uint8Array[] = [];
    let receivedSize = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedSize += value.length;

      // ✅ Enforce size limit during streaming
      if (receivedSize > maxSize) {
        reader.cancel();
        throw new Error('Response too large');
      }
    }

    // Combine chunks
    const combined = new Uint8Array(receivedSize);
    let position = 0;

    for (const chunk of chunks) {
      combined.set(chunk, position);
      position += chunk.length;
    }

    return new TextDecoder().decode(combined);
  } finally {
    clearTimeout(timeoutId);
  }
}

app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  if (!(await isValidExternalUrl(url))) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  try {
    const data = await safeFetch(url, {
      timeout: 10000, // 10 seconds
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});
```

**Benefit:** Prevents slowloris attacks and resource exhaustion

---

### ✅ ALWAYS: Implement Network Segmentation

```typescript
// ✅ Use dedicated egress proxy for external requests
import { HttpsProxyAgent } from 'https-proxy-agent';

const PROXY_URL = process.env.EGRESS_PROXY_URL!;

async function fetchViaProxy(url: string): Promise<Response> {
  const agent = new HttpsProxyAgent(PROXY_URL);

  return fetch(url, {
    agent, // Route through egress proxy
    redirect: 'manual',
  });

  // Egress proxy enforces:
  // - Blocks private IPs at network level
  // - Logs all outgoing requests
  // - Applies rate limiting
  // - Filters malicious domains
}

// ✅ Network policy (Kubernetes)
/*
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-internal-egress
spec:
  podSelector:
    matchLabels:
      app: api-server
  policyTypes:
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8      # Block private IPs
              - 172.16.0.0/12
              - 192.168.0.0/16
              - 169.254.0.0/16  # Block metadata
      ports:
        - protocol: TCP
          port: 443
*/
```

**Benefit:** Network-level protection independent of application logic

---

### ✅ ALWAYS: Log and Monitor External Requests

```typescript
// ✅ Audit external requests
async function fetchWithAudit(
  url: string,
  userId: string
): Promise<Response> {
  const startTime = Date.now();

  try {
    // ✅ Log request
    console.log('External fetch', {
      userId,
      url,
      timestamp: new Date().toISOString(),
    });

    const response = await safeFetch(url);

    // ✅ Log successful response
    console.log('External fetch completed', {
      userId,
      url,
      status: response.status,
      duration: Date.now() - startTime,
    });

    return response;
  } catch (error) {
    // ✅ Log failures
    console.error('External fetch failed', {
      userId,
      url,
      error: error.message,
      duration: Date.now() - startTime,
    });

    throw error;
  }
}

// ✅ Alert on suspicious patterns
function detectSSRFAttempt(url: string): boolean {
  const suspiciousPatterns = [
    /169\.254\.169\.254/, // AWS metadata
    /metadata\.google\.internal/, // GCP metadata
    /localhost/i,
    /127\.0\.0\.1/,
    /::1/,
    /192\.168\./,
    /10\./,
    /172\.(1[6-9]|2[0-9]|3[0-1])\./,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(url));
}

app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;

  // ✅ Alert on SSRF attempts
  if (detectSSRFAttempt(url)) {
    console.warn('Potential SSRF attempt', {
      userId: req.user?.userId,
      url,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Validate and fetch...
});
```

**Benefit:** Detect and respond to SSRF attempts, audit trail for investigation

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All user-provided URLs validated before fetching
- [ ] Domain whitelist implemented for allowed external hosts
- [ ] Private IP ranges blocked (10.x, 192.168.x, 172.16-31.x, 127.x)
- [ ] Localhost and loopback addresses blocked (including IPv6 ::1)
- [ ] Cloud metadata endpoints blocked (169.254.169.254, metadata.google.internal)
- [ ] DNS resolution performed to check if hostname resolves to private IP
- [ ] Redirects disabled or redirect targets validated
- [ ] Non-HTTP(S) protocols blocked (file://, ftp://, gopher://)
- [ ] Request timeouts configured (5-10 seconds)
- [ ] Response size limits enforced (prevent memory exhaustion)
- [ ] External requests logged with user context
- [ ] SSRF attempts alerted and monitored
- [ ] Network segmentation in place (egress proxy or network policies)
- [ ] URL encoding bypass attempts handled (hex IPs, decimal IPs, etc.)
