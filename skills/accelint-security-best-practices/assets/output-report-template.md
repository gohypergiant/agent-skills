╭──────────────────────────────────╮
│ accelint-security-best-practices │
╰──────────────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌──────────────────────────────────────────────────────┐
│ ⚠️  WARNING: Security is highly context-dependent.   │
│ This skill provides general security guidance but    │
│ cannot know your application's threat model, risk    │
│ tolerance, or deployment context. Please evaluate    │
│ each finding against your specific security          │
│ requirements. Not all identified issues may be       │
│ relevant or critical for your use case.              │
└──────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "Authentication API", "User Management Service")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the workflow used
   - Count vulnerabilities by severity (e.g., "2 Critical, 5 High, 3 Medium")
   - Include Risk Assessment explaining WHY security matters for this specific code

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group vulnerabilities when they share the SAME root cause AND same fix pattern
   - Example: Multiple endpoints missing authentication → group together
   - Example: Different types of injection vulnerabilities → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH VULNERABILITY/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the vulnerability
   - Severity (Critical, High, Medium, Low)
   - OWASP Category (A01-A10)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Data breach, RCE, complete system compromise (SQL injection, hardcoded production secrets, no auth on admin endpoints)
   - High: Unauthorized access, data theft, service disruption (missing authorization, XSS, insecure session management)
   - Medium: Exploitable with conditions or when chained (missing rate limiting, weak CORS, insufficient logging)
   - Low: Defense-in-depth improvements, best practices (missing security headers, detailed error messages)

6. PHASE 2: Generate summary table from Phase 1 findings
   - Include all vulnerabilities with their numbers
   - Keep it concise - one row per vulnerability/group
-->

## Executive Summary

Completed systematic security audit of [file/module path] following accelint-security-best-practices workflow. Identified [N] security vulnerabilities across [N] OWASP categories. [Brief description of what this code does and why security matters].

**Key Findings:**
- **Critical**: [N] vulnerabilities (immediate data breach/RCE risk)
- **High**: [N] vulnerabilities (likely unauthorized access/data theft)
- **Medium**: [N] vulnerabilities (exploitable with conditions)
- **Low**: [N] vulnerabilities (defense-in-depth improvements)

**Risk Assessment:**
[Explain WHY these vulnerabilities matter for this specific code. Consider:]
- What sensitive data does this code handle? (user credentials, PII, payment info, etc.)
- What operations can attackers perform if exploited? (data access, privilege escalation, service disruption)
- What is the blast radius? (single user, all users, entire system)
- What compliance requirements apply? (GDPR, PCI-DSS, HIPAA, SOC2)

---

## Phase 1: Identified Vulnerabilities

### 1. [Function/Location] - [Vulnerability Type]

**Location:** `[file:line]` or `[file:line-range]`

```ts
// ❌ Current: [Brief description of vulnerability]
[code snippet showing the vulnerability]
```

**Vulnerability:**
- [Point 1 explaining the security issue]
- [Point 2 with attack scenario or exploit method]
- [Point 3 quantifying the impact - data exposed, users affected, etc.]

**Severity:** [Critical|High|Medium|Low]
**OWASP Category:** [A01-A10: Category Name]
**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of secure solution]
[code snippet showing the fix]
```

---

### 2. [Function/Location] - [Vulnerability Type]

**Location:** `[file:line]` or `[file:line-range]`

```ts
// ❌ Current: [Brief description of vulnerability]
[code snippet]
```

**Vulnerability:**
- [Explanation]

**Severity:** [Critical|High|Medium|Low]
**OWASP Category:** [A01-A10: Category Name]
**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of secure solution]
[code snippet]
```

---

### 3-N. [Grouped Vulnerabilities] - [Shared Vulnerability Type] ([N] instances)

<!-- Use this format when multiple vulnerabilities share the same root cause and fix pattern -->

**Locations:**
- `[file:line]` - [endpoint/function/context]
- `[file:line]` - [endpoint/function/context]
- `[file:line]` - [endpoint/function/context]

**Example from [specific location]:**
```ts
// ❌ Current: [Brief description of vulnerability]
[representative code snippet]
```

**Vulnerability:**
- [Shared root cause explanation]
- [Why this pattern is insecure]
- [Attack scenario and impact across all instances]

**Severity:** [Critical|High|Medium|Low]
**OWASP Category:** [A01-A10: Category Name]
**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of secure solution]
[fixed code snippet]
```

**Same pattern applies to all [N] instances:**
```ts
// [Location/endpoint 2]
// ❌ Current
[code snippet]

// ✅ Secure
[fixed snippet]

// [Location/endpoint 3]
// ❌ Current
[code snippet]

// ✅ Secure
[fixed snippet]
```

---

## Phase 2: Categorized Vulnerabilities

| # | Location | Vulnerability | OWASP Category | Severity |
|---|----------|---------------|----------------|----------|
| 1 | [file:line] | [Brief vulnerability description] | [A0X: Category] | [Severity] |
| 2 | [file:line] | [Brief vulnerability description] | [A0X: Category] | [Severity] |
| 3 | [file:line] | [Brief vulnerability description] | [A0X: Category] | [Severity] |
| 4-N | [multiple] | [Brief vulnerability description] | [A0X: Category] | [Severity] |

**Total Vulnerabilities:** [N]

**By Severity:**
- Critical: [N] (fix immediately)
- High: [N] (fix in next release)
- Medium: [N] (fix in scheduled release)
- Low: [N] (fix when convenient)

**By OWASP Category:**
- A01 Broken Access Control: [N]
- A02 Cryptographic Failures: [N]
- A03 Injection: [N]
- A04 Insecure Design: [N]
- A05 Security Misconfiguration: [N]
- A06 Vulnerable Components: [N]
- A07 Auth Failures: [N]
- A08 Data Integrity Failures: [N]
- A09 Logging Failures: [N]
- A10 SSRF: [N]

---

## Remediation Priority

### Immediate Action Required (Critical)
[List Critical severity vulnerabilities - deploy fixes immediately]

### High Priority (Next Release)
[List High severity vulnerabilities - deploy within days]

### Medium Priority (Scheduled Release)
[List Medium severity vulnerabilities - deploy in next scheduled release]

### Low Priority (Defense in Depth)
[List Low severity vulnerabilities - deploy when convenient or batch together]

---

## Testing Recommendations

After implementing fixes, perform the following security tests:

### Authentication & Authorization
- [ ] Test authentication bypass attempts
- [ ] Test privilege escalation scenarios
- [ ] Verify ownership checks on all protected resources
- [ ] Test JWT token validation and expiration
- [ ] Test session management and logout

### Input Validation
- [ ] Test with malformed inputs (wrong types, oversized data)
- [ ] Test with malicious payloads (SQL injection, XSS, command injection)
- [ ] Test boundary conditions (min/max values, empty strings, null)
- [ ] Test with Unicode, special characters, encoded data

### Injection Prevention
- [ ] Test SQL injection attempts on all database queries
- [ ] Test NoSQL injection with object payloads
- [ ] Test XSS with script tags, event handlers, encoded scripts
- [ ] Test command injection with shell metacharacters

### Rate Limiting
- [ ] Test brute force protection on authentication endpoints
- [ ] Verify rate limits trigger correctly
- [ ] Test rate limit bypass attempts

### Sensitive Data
- [ ] Review all logs for sensitive data (passwords, tokens, PII)
- [ ] Verify error messages are generic to users
- [ ] Test that stack traces are not exposed in production

### Security Headers
- [ ] Verify CSP is configured and blocks inline scripts
- [ ] Verify HSTS is enabled with appropriate max-age
- [ ] Check all security headers with securityheaders.com

---

## Compliance Notes

[Add any compliance-specific notes based on the application's requirements]

### GDPR
- [ ] All PII handled according to data protection requirements
- [ ] Logging complies with data minimization principles
- [ ] Data breach notification procedures in place

### PCI-DSS (if handling payment data)
- [ ] No credit card numbers in logs
- [ ] Encryption in transit and at rest
- [ ] Access controls on payment endpoints

### HIPAA (if handling health data)
- [ ] PHI properly encrypted
- [ ] Audit logging for all PHI access
- [ ] Access controls enforced

### SOC2
- [ ] Security logging sufficient for audit trails
- [ ] Access controls documented and enforced
- [ ] Incident response procedures in place
