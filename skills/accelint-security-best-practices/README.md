# Security Best Practices

Systematic security auditing and vulnerability detection for JavaScript/TypeScript applications. Combines audit workflow with OWASP Top 10 security patterns for production-ready code.

**Framework-Agnostic**: This skill provides security principles applicable across frameworks (Express, Fastify, Nest.js, Next.js, etc.), package managers (npm, yarn, pnpm, bun), and libraries. Code examples illustrate concepts—adapt them to your project's specific stack.

## Overview

This skill provides:

- **4-phase workflow** (Discover → Categorize → Remediate → Verify) for systematic security auditing
- **OWASP Top 10 security patterns** with ❌/✅ examples for all vulnerability categories
- **Severity classification** and risk assessment frameworks
- **Defense-in-depth strategies** for layered security

## When to Use

Use this skill when:
- Auditing code for security vulnerabilities
- Implementing authentication or authorization
- Adding API endpoints, file uploads, or user input handling
- Working with secrets, credentials, or sensitive data
- Conducting pre-deployment security checks
- Users say "audit security", "check for vulnerabilities", "security review", "secure this code"

## Structure

```
accelint-security-best-practices/
├── SKILL.md                    # 4-phase workflow + guidance
├── AGENTS.md                   # Compressed security rules overview
├── README.md                   # This file
├── references/
│   ├── quick-reference.md      # Vulnerability → category mapping
│   ├── secrets-management.md   # Environment variables, no hardcoding
│   ├── input-validation.md     # Zod schemas, type checking
│   ├── file-uploads.md         # Size, type, extension validation
│   ├── injection-prevention.md # SQL, NoSQL, Command, XSS
│   ├── authentication.md       # JWT, sessions, cookies
│   ├── mfa.md                  # Multi-factor authentication
│   ├── authorization.md        # RBAC, ownership checks, IDOR
│   ├── xss-prevention.md       # Sanitization, CSP
│   ├── csrf-protection.md      # Tokens, SameSite cookies
│   ├── rate-limiting.md        # API protection, brute force
│   ├── sensitive-data.md       # Logging, error messages
│   ├── dependency-security.md  # npm audit, updates
│   ├── security-headers.md     # CSP, HSTS, helmet
│   └── ssrf-prevention.md      # URL validation, allowlists
└── assets/
    ├── audit-report-template.md
    └── audit-report-example.md
```

## Progressive Disclosure

This skill minimizes context usage through progressive loading:

1. **Start with SKILL.md** - Follow the 4-phase workflow
2. **Load AGENTS.md** - Scan compressed security rule summaries
3. **Load specific references** - Detailed ❌/✅ examples when implementing

## OWASP Top 10 Coverage

| OWASP Category | Description | Reference Files |
|----------------|-------------|-----------------|
| A01: Broken Access Control | Missing auth/authorization, IDOR | authorization.md, authentication.md |
| A02: Cryptographic Failures | Hardcoded secrets, weak hashing | secrets-management.md, authentication.md |
| A03: Injection | SQL, NoSQL, Command, XSS | injection-prevention.md, xss-prevention.md |
| A04: Insecure Design | Missing validation, no rate limiting | input-validation.md, rate-limiting.md |
| A05: Security Misconfiguration | Defaults, missing headers | security-headers.md |
| A06: Vulnerable Components | Outdated dependencies | dependency-security.md |
| A07: Auth Failures | Weak sessions, no MFA | authentication.md, mfa.md |
| A08: Data Integrity Failures | Missing CSRF protection | csrf-protection.md |
| A09: Logging Failures | No security logging | sensitive-data.md |
| A10: SSRF | Unvalidated URL fetching | ssrf-prevention.md |

## Quick Start

1. **Discover vulnerabilities** - Systematically analyze code for security anti-patterns across all OWASP categories
2. **Categorize by severity** - Map vulnerabilities to OWASP categories with Critical/High/Medium/Low severity
3. **Load relevant pattern** - Open corresponding reference file for ❌/✅ examples and remediation guidance
4. **Apply and verify** - Implement security fix, validate closure, confirm no new vulnerabilities introduced

## Critical Security Anti-Patterns

**NEVER** do these:
- ❌ Hardcode secrets (API keys, passwords, tokens) - use environment variables exclusively
- ❌ Concatenate user input into queries - use parameterized queries/ORMs
- ❌ Store tokens in localStorage - use httpOnly cookies
- ❌ Skip authorization checks - verify ownership/permissions before resource access
- ❌ Trust user input - validate type, format, size with schemas (Zod, Joi)
- ❌ Expose detailed errors to users - log server-side, return generic messages
- ❌ Skip rate limiting on APIs - apply limits to all endpoints, stricter on auth
- ❌ Log sensitive data - redact passwords, tokens, PII before logging
- ❌ Use default configurations in production - harden all settings
- ❌ Use Array.includes() for permission checks - use Set.has() or RBAC

See reference files for ✅ correct patterns.

## Severity Levels

- **Critical**: Direct path to data breach, RCE, or complete system compromise (SQL injection, hardcoded production secrets, no auth on admin endpoints)
- **High**: Likely unauthorized access, data theft, or service disruption (missing authorization, XSS, insecure session management)
- **Medium**: Exploitable with specific conditions or when chained (missing rate limiting, weak CORS, insufficient logging)
- **Low**: Defense-in-depth improvements, best practices (missing security headers, detailed error messages)

## Defense in Depth

Layer security controls so single vulnerability doesn't compromise entire system:
- Authentication (verify identity) + Authorization (verify permission)
- Input validation (type/format) + Injection prevention (parameterized queries)
- Rate limiting (prevent brute force) + Logging (detect attacks)
- Security headers (browser protection) + CSRF tokens (request validation)

---

## References

- https://github.com/hoodini/ai-agents-skills/blob/master/skills/owasp-security/SKILL.md
- https://github.com/sickn33/antigravity-awesome-skills/blob/main/skills/cc-skill-security-review/SKILL.md

## License

Apache-2.0
