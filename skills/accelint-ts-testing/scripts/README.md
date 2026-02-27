# Testing Automation Scripts

Five scripts to automate repetitive validation tasks, test auditing, and reduce context usage.

## Coverage Model

### How Scripts and Agent Review Work Together

Scripts are a **first-pass tool**, not a replacement for agent review. They work together to provide comprehensive coverage:

**What Scripts CAN Catch (~60-70% of anti-patterns)**

Mechanical/syntactic patterns detectable through pattern matching:
- Loose assertions (`toBeTruthy()`, `toBeDefined()`) - exact pattern match
- Nested describe blocks > 2 levels - pattern match with context
- Using `any` in test files - exact pattern match
- Non-sentence test descriptions - heuristic pattern match
- Missing mock cleanup configuration - config file analysis
- Shared mutable state patterns - heuristic detection
- Sequential test file execution dependencies - basic pattern match
- `vitest.each()` opportunities (repeated test structures) - pattern match

**What Scripts CANNOT Catch (~30-40% of anti-patterns)**

Requires semantic understanding and domain knowledge:
- Whether tests verify behavior vs implementation details (requires understanding intent)
- Whether AAA pattern boundaries are semantically meaningful (requires understanding test logic)
- Whether mocks are appropriate vs fakes/stubs (requires understanding dependencies)
- Whether test descriptions accurately describe behavior (requires domain knowledge)
- Whether property-based testing would provide better coverage (requires understanding invariants)
- Edge case completeness (requires understanding failure modes)
- Whether tests are testing the right things (requires product knowledge)
- Test performance issues requiring actual execution time measurement

### Workflow Integration

1. **Run scripts first** (automated detection) → Catches 60-70% of mechanical anti-patterns in seconds
2. **Agent manual review** (semantic analysis) → Catches remaining 30-40% requiring test intent understanding
3. **Apply fixes** (with validation) → Agent applies fixes and validates with test execution
4. **Verify correctness** (type checking + test runs) → Ensure tests pass and types are correct

Scripts save ~2,000 tokens per audit by handling mechanical detection, allowing agents to focus on anti-patterns requiring semantic understanding of test intent and domain knowledge.

---

## Scripts

### 1. `check-test-types.sh`
**Purpose:** Verify TypeScript type correctness in test files before marking work complete.

**Usage:**
```bash
./scripts/check-test-types.sh path/to/test.test.ts
```

**What it does:**
- Detects package manager automatically (bun, pnpm, yarn, npm) by checking lock files
- Runs `tsc --noEmit` on the test file
- Reports type errors with clear output
- Exit code 0 = no errors, 1 = type errors found

**Why it matters:** Test files are typically excluded from `tsconfig.json`, so running `tsc` at project root won't catch test type errors. This script catches type errors before tests provide false confidence.

---

### 2. `check-vitest-config.sh`
**Purpose:** Verify global mock cleanup configuration to prevent order-dependent test failures.

**Usage:**
```bash
./scripts/check-vitest-config.sh
```

**What it does:**
- Finds `vitest.config.*` file
- Checks for required settings: `clearMocks`, `mockReset`, `restoreMocks`
- Follows local relative imports (e.g., `./vitest.base.config`)
- Detects external package imports and gives appropriate warnings
- Exit codes: 0 = all settings found, 1 = definitely missing, 2 = warning (might be in external config)

**Limitations:**
- Uses grep-based checking (doesn't require vitest to be installed)
- Can follow local imports but not external packages (e.g., `@company/vitest-config`)
- When settings aren't found but inheritance is detected, reports a warning instead of failing

**Why it matters:** Missing mock cleanup configuration causes "action at a distance" failures where mocks leak between test files, creating Heisenbugs that only appear when tests run in specific orders.

---

### 3. `find-setup-files.sh`
**Purpose:** Discover existing test setup files before writing tests.

**Usage:**
```bash
./scripts/find-setup-files.sh
```

**What it does:**
- Searches for setup files in common locations:
  - `test/setup.{ts,js}`
  - `testing/setup.{ts,js}`
  - `vitest.setup.{ts,js}`
  - `src/test/setup.{ts,js}`
- Checks `vitest.config.*` for configured `setupFiles` and `globalSetup`
- Lists found files with helpful hints about what setup files typically contain

**Why it matters:** Understanding existing test setup prevents duplication and helps follow project conventions for global mocks, custom matchers, and test utilities.

---

### 4. `detect-test-anti-patterns.sh`
**Purpose:** Scan test files for common vitest anti-patterns using static analysis.

**Usage:**
```bash
# Scan entire test directory
./scripts/detect-test-anti-patterns.sh tests/ > anti-patterns.json

# Scan specific test file
./scripts/detect-test-anti-patterns.sh src/components/UserService.test.ts > issues.json
```

**Output:** JSON array of detected issues with:
- File location and line number
- Pattern type (e.g., "Loose assertions", "Nested describe blocks")
- Category (Assertions, Test Organization, Test Doubles, etc.)
- Severity (Critical, High, Medium, Low)
- Expected gain from fixing the issue
- Reference file links

**Detects:**
- Loose assertions (`toBeTruthy()`, `toBeDefined()`, etc.)
- Nested describe blocks > 2 levels deep
- Tests without clear AAA pattern boundaries
- Mocking own functions (should use fakes)
- Using `any` in test files
- Non-sentence test descriptions
- Testing library internals
- Exporting internal functions for testing
- Shared mutable state between tests
- Opportunities for parameterized tests with `it.each()`

**Context savings: 600-900 tokens per audit**

---

### 5. `generate-test-audit-report.sh`
**Purpose:** Generate pre-filled audit report from detected anti-patterns.

**Usage:**
```bash
./scripts/generate-test-audit-report.sh anti-patterns.json "UserService Tests" > audit-report.md
```

**Parameters:**
- `anti-patterns.json` - Output from detect-test-anti-patterns.sh
- `target-name` - Name of the audited test file/module (e.g., "UserService Tests", "cart.test.ts")

**Output:** Markdown audit report following the output-report-template.md structure with:
- Executive summary with issue counts by severity and category
- Phase 1: Detailed findings with code snippets, severity, impact, and recommended fixes
- Phase 2: Summary table for tracking all issues

**Requires:** jq (JSON processor)
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

**Context savings: ~900 tokens per audit report**

---

## Typical Workflow

```bash
# 1. Check existing test configuration
./scripts/check-vitest-config.sh
./scripts/find-setup-files.sh

# 2. Detect anti-patterns in test files
./scripts/detect-test-anti-patterns.sh tests/ > anti-patterns.json

# 3. Generate audit report
./scripts/generate-test-audit-report.sh anti-patterns.json "My Component Tests" > report.md

# 4. Review report and fix issues
cat report.md

# 5. Verify type correctness after fixes
./scripts/check-test-types.sh tests/MyComponent.test.ts
```

---

## Impact

**Context Reduction:**
- Original 3 scripts: ~110 lines saved in AGENTS.md (19% reduction)
- New audit scripts: ~1,500-1,800 tokens saved per test audit workflow
- Total per full audit: ~2,000 tokens saved

**Time Savings:**
- Manual test audit: 15-20 minutes
- Automated audit with scripts: 3-5 minutes
- **70-80% time reduction** for standard test audits

**Before:**
```markdown
To detect the package manager, check for:
- `bun.lockb` or `bun.lock` → use `bunx`
- `pnpm-lock.yaml` → use `pnpm exec`
- `yarn.lock` → use `yarn exec`
- `package-lock.json` → use `npm exec`

Then run the appropriate command:
# - npm: npm exec tsc -- --noEmit path/to/test.test.ts
# - pnpm: pnpm exec tsc --noEmit path/to/test.test.ts
...
```

**After:**
```markdown
Run the type checker script:
```bash
./scripts/check-test-types.sh path/to/test.test.ts
```
```

## Design Principles

1. **No false positives:** Scripts handle config inheritance and external imports appropriately
2. **Clear output:** Success/failure messages are explicit and actionable
3. **Graceful degradation:** Scripts work without vitest installed (grep-based checking)
4. **Appropriate exit codes:** 0 = success, 1 = error, 2 = warning

## Maintenance

All scripts use `set -euo pipefail` for defensive Bash programming and include detailed comments explaining their purpose and limitations.
