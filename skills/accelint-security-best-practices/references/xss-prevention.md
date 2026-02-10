# XSS Prevention

Never render user input without sanitization. Cross-Site Scripting (XSS) allows attackers to inject malicious scripts that steal credentials, perform actions as the victim, or redirect to phishing sites.

**Framework Examples**: This document uses React patterns for illustration (dangerouslySetInnerHTML). Apply to your framework's rendering: Vue (v-html), Angular (innerHTML), Svelte (@html), or vanilla JavaScript (innerHTML). Sanitization libraries: DOMPurify, sanitize-html, isomorphic-dompurify.

## Why This Matters

XSS attacks enable:
- **Session Hijacking**: Stolen cookies/tokens grant full account access
- **Credential Theft**: Fake login forms capture passwords
- **Malware Distribution**: Redirect users to malicious sites
- **Defacement**: Alter page content to damage reputation
- **Keylogging**: Capture all user input including sensitive data

A single XSS vulnerability on a page with 10,000 daily visitors can steal 10,000 session tokens. Stored XSS in comments persists indefinitely, attacking every user who views the page.

## Anti-Patterns to Avoid

### ❌ NEVER: Use dangerouslySetInnerHTML Without Sanitization

```typescript
// ❌ NEVER: Render user input with dangerouslySetInnerHTML
function UserProfile({ bio }: { bio: string }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: bio }} />
    // Attacker sets bio to: <img src=x onerror="alert(document.cookie)">
    // Steals session cookies!
  );
}

// ❌ NEVER: Trust database content without sanitization
function Comment({ comment }: { comment: Comment }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    // Stored XSS: malicious script persisted in database
  );
}
```

**Risk:** Critical - Stored XSS steals credentials from all users viewing the content

---

### ❌ NEVER: Concatenate User Input into HTML

```typescript
// ❌ NEVER: String concatenation with user input
app.get('/search', (req, res) => {
  const { query } = req.query;

  const html = `
    <h1>Search Results for: ${query}</h1>
    <div id="results"></div>
  `;

  res.send(html);
  // Attacker payload: ?query=<script>alert(document.cookie)</script>
});

// ❌ NEVER: Template literals with user input
const userMessage = req.body.message;
const html = `<div class="message">${userMessage}</div>`;
res.send(html);
```

**Risk:** Critical - Reflected XSS attacks every user who clicks malicious link

---

### ❌ NEVER: Use innerHTML with User Input

```typescript
// ❌ NEVER: innerHTML with user data
function displayResults(searchTerm: string) {
  const resultsDiv = document.getElementById('results');
  resultsDiv!.innerHTML = `
    <h2>Results for: ${searchTerm}</h2>
  `;
  // XSS if searchTerm contains script tags
}

// ❌ NEVER: outerHTML with user data
element.outerHTML = `<div>${userInput}</div>`;

// ❌ NEVER: insertAdjacentHTML with user data
element.insertAdjacentHTML('beforeend', `<p>${userComment}</p>`);
```

**Risk:** High - DOM-based XSS executes in user's browser

---

### ❌ NEVER: Use eval() or Function() with User Input

```typescript
// ❌ NEVER: eval with user input
const userCode = req.body.code;
eval(userCode); // Arbitrary code execution!

// ❌ NEVER: Function constructor
const userFunction = new Function(userInput);
userFunction();

// ❌ NEVER: setTimeout/setInterval with string
setTimeout(userInput, 1000); // Executes as code!
```

**Risk:** Critical - Remote code execution, complete application compromise

---

### ❌ NEVER: Trust URL Parameters in href/src Attributes

```typescript
// ❌ NEVER: User-controlled URLs without validation
function RedirectButton({ url }: { url: string }) {
  return <a href={url}>Click here</a>;
  // Attacker payload: javascript:alert(document.cookie)
  // Clicking link executes JavaScript!
}

// ❌ NEVER: User input in src attributes
function UserAvatar({ imageUrl }: { imageUrl: string }) {
  return <img src={imageUrl} />;
  // Attacker payload: x" onerror="alert(document.cookie)
}
```

**Risk:** High - JavaScript execution via href/src injection

---

## Correct Patterns

### ✅ ALWAYS: Use React/Vue Text Rendering (Auto-Escapes)

```typescript
// ✅ React automatically escapes text content
function UserProfile({ bio }: { bio: string }) {
  // ✅ Safe: React escapes all text
  return <div>{bio}</div>;
  // Input: <script>alert(1)</script>
  // Rendered: &lt;script&gt;alert(1)&lt;/script&gt;
}

// ✅ Escape in attributes too
function UserComment({ username, comment }: { username: string; comment: string }) {
  return (
    <div>
      <h3>{username}</h3>
      <p>{comment}</p>
    </div>
  );
  // Both username and comment automatically escaped
}

// ✅ Vue also auto-escapes
/*
<template>
  <div>
    <h3>{{ username }}</h3>
    <p>{{ comment }}</p>
  </div>
</template>
*/
```

**Benefit:** Framework handles escaping automatically, XSS prevented by default

---

### ✅ ALWAYS: Sanitize HTML with DOMPurify

```typescript
import DOMPurify from 'isomorphic-dompurify';

// ✅ Sanitize user HTML before rendering
function RichTextContent({ html }: { html: string }) {
  // ✅ DOMPurify removes all dangerous elements and attributes
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOWED_URI_REGEXP: /^(?:https?):/, // Only HTTP(S) links
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

// ✅ Sanitize with strict configuration
function UserBio({ bio }: { bio: string }) {
  const sanitized = DOMPurify.sanitize(bio, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'], // Very limited set
    ALLOWED_ATTR: [], // No attributes at all
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ Sanitize on backend before storing
app.post('/api/comments', authenticate, async (req, res) => {
  const { text } = req.body;

  // ✅ Sanitize before storing
  const sanitizedText = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
  });

  const comment = await db.comments.create({
    data: {
      text: sanitizedText,
      authorId: req.user!.userId,
    },
  });

  res.json(comment);
});
```

**Benefit:** Removes all malicious code while preserving safe formatting

---

### ✅ ALWAYS: Use textContent Instead of innerHTML

```typescript
// ✅ textContent for plain text (no HTML parsing)
function displayUsername(username: string) {
  const element = document.getElementById('username');
  // ✅ Safe: textContent treats input as plain text, no HTML parsing
  element!.textContent = username;
  // Input: <script>alert(1)</script>
  // Displayed: <script>alert(1)</script> (as text, not executed)
}

// ✅ createElement for dynamic content
function addComment(comment: string) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';

  // ✅ Safe: textContent escapes automatically
  commentDiv.textContent = comment;

  document.getElementById('comments')!.appendChild(commentDiv);
}

// ✅ setAttribute for attributes (escapes automatically)
function createLink(url: string, text: string) {
  const link = document.createElement('a');
  link.textContent = text; // ✅ Safe
  link.setAttribute('href', url); // ✅ Safe: setAttribute escapes
  return link;
}
```

**Benefit:** Bypasses HTML parsing entirely, impossible to inject scripts

---

### ✅ ALWAYS: Validate and Sanitize URLs

```typescript
// ✅ Whitelist URL protocols
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // ✅ Only allow HTTP(S)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function SafeLink({ href, children }: { href: string; children: React.ReactNode }) {
  // ✅ Validate URL before rendering
  if (!isValidUrl(href)) {
    // ✅ Reject dangerous URLs
    return <span>{children}</span>;
  }

  return <a href={href} rel="noopener noreferrer">{children}</a>;
}

// ✅ Sanitize URL attributes
function UserLink({ url, text }: { url: string; text: string }) {
  const sanitizedUrl = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  if (!isValidUrl(sanitizedUrl)) {
    return <span>{text}</span>;
  }

  return (
    <a
      href={sanitizedUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {text}
    </a>
  );
}
```

**Benefit:** Blocks javascript:, data:, and other dangerous URL schemes

---

### ✅ ALWAYS: Implement Content Security Policy (CSP)

```typescript
import helmet from 'helmet';

// ✅ Configure CSP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Only load from same origin by default
      scriptSrc: [
        "'self'",
        // ✅ Never use 'unsafe-inline' or 'unsafe-eval'
      ],
      styleSrc: [
        "'self'",
        // ✅ Allow specific style CDNs if needed
        'https://fonts.googleapis.com',
      ],
      imgSrc: [
        "'self'",
        'data:', // Allow data URLs for images
        'https:', // Allow HTTPS images
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
      ],
      connectSrc: ["'self'"], // API calls only to same origin
      frameSrc: ["'none'"], // No iframes
      objectSrc: ["'none'"], // No plugins
      upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
    },
  })
);

// ✅ Strict CSP for high-security applications
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"], // Deny everything by default
      scriptSrc: ["'self'"], // Only scripts from same origin
      styleSrc: ["'self'"], // Only styles from same origin
      imgSrc: ["'self'"], // Only images from same origin
      connectSrc: ["'self'"], // Only API calls to same origin
      fontSrc: ["'self'"], // Only fonts from same origin
      objectSrc: ["'none'"], // No plugins
      mediaSrc: ["'none'"], // No audio/video
      frameSrc: ["'none'"], // No iframes
    },
  })
);
```

**Benefit:** Even if XSS vulnerability exists, CSP blocks script execution

---

### ✅ ALWAYS: Escape Output in Server-Rendered HTML

```typescript
// ✅ HTML entity encoding function
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

// ✅ Escape user input in templates
app.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  const user = await db.users.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(404).send('User not found');
  }

  // ✅ Escape all user-controlled data
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHtml(user.username)} - Profile</title>
    </head>
    <body>
      <h1>${escapeHtml(user.username)}</h1>
      <p>${escapeHtml(user.bio)}</p>
      <a href="${escapeHtml(user.website)}">${escapeHtml(user.website)}</a>
    </body>
    </html>
  `;

  res.send(html);
});

// ✅ Use templating engines with auto-escaping
import ejs from 'ejs';

app.get('/profile/:username', async (req, res) => {
  const user = await db.users.findUnique({
    where: { username: req.params.username },
  });

  // ✅ EJS auto-escapes <%= %> tags
  res.render('profile', { user });
});

// profile.ejs:
// <h1><%= user.username %></h1>  <%# Auto-escaped %>
// <p><%= user.bio %></p>  <%# Auto-escaped %>
```

**Benefit:** All user data escaped before rendering, XSS impossible

---

### ✅ ALWAYS: Use Secure Cookie Attributes

```typescript
// ✅ httpOnly cookies prevent JavaScript access
app.post('/api/login', async (req, res) => {
  const token = generateToken(user);

  res.cookie('session', token, {
    httpOnly: true, // ✅ JavaScript cannot access
    secure: true, // ✅ HTTPS only
    sameSite: 'strict', // ✅ CSRF protection
    maxAge: 3600000, // 1 hour
  });

  res.json({ message: 'Logged in' });
});

// ❌ NEVER store sensitive tokens in localStorage (XSS can steal)
// ✅ Use httpOnly cookies instead
```

**Benefit:** Even if XSS vulnerability exists, httpOnly cookies cannot be stolen

---

### ✅ ALWAYS: Sanitize User-Generated Content on Save

```typescript
import DOMPurify from 'isomorphic-dompurify';

// ✅ Sanitize when storing, not just when rendering
app.post('/api/posts', authenticate, async (req, res) => {
  const { title, content } = req.body;

  // ✅ Sanitize before storing
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
  });

  const post = await db.posts.create({
    data: {
      title: title.substring(0, 200), // ✅ Limit length
      content: sanitizedContent,
      authorId: req.user!.userId,
    },
  });

  res.json(post);
});

// ✅ Re-sanitize when rendering (defense in depth)
function PostContent({ content }: { content: string }) {
  // ✅ Sanitize again before rendering
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

**Benefit:** Defense in depth - sanitize on save AND render

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All user input rendered as text (not HTML) by default
- [ ] DOMPurify used for any rich text content with strict allowed tags
- [ ] No dangerouslySetInnerHTML without DOMPurify sanitization
- [ ] Content Security Policy configured with strict directives
- [ ] No 'unsafe-inline' or 'unsafe-eval' in CSP
- [ ] textContent used instead of innerHTML for plain text
- [ ] URLs validated against whitelist of allowed protocols (http/https only)
- [ ] httpOnly cookies for session tokens (never localStorage)
- [ ] Server-rendered HTML escapes all user data
- [ ] Templating engines configured for auto-escaping
- [ ] No eval(), Function(), or setTimeout with strings
- [ ] User-generated content sanitized before storing in database
- [ ] rel="noopener noreferrer" on all external links
