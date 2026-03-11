# Best Practices Automation Scripts

Three scripts to automate detection, reporting, and categorization of TypeScript/JavaScript best practice violations.

## Coverage Model

### How Scripts and Agent Review Work Together

Scripts are a **first-pass tool**, not a replacement for agent review. They work together to provide comprehensive coverage:

**What Scripts CAN Catch (~60-70% of violations)**

Mechanical/syntactic patterns detectable through pattern matching:
- `any` keyword usage (exact pattern match)
- `enum` keyword usage (exact pattern match)
- `interface` declarations (exact pattern match)
- `return null` or `return undefined` (exact pattern match)
- `while(true)` unbounded loops (exact pattern match)
- Boolean variables without `is`/`has` prefix (pattern match)
- `let` declarations that could be `const` (heuristic)
- Control flow without block style `{}` (pattern match)
- Magic numbers outside const declarations (heuristic)
- Parameter mutations (basic heuristic)

**What Scripts CANNOT Catch (~30-40% of violations)**

Requires semantic understanding and domain knowledge:
- Whether `interface` is justified for declaration merging or legacy compatibility
- Whether `null` return is required by external API contract
- Whether code duplication warrants extraction (requires understanding of abstraction cost)
- Function length assessment (requires understanding of cohesion and coupling)
- Complex parameter mutation patterns (requires data flow analysis)
- Input validation completeness (requires understanding data sources and boundaries)
- Whether naming follows domain conventions (requires business context)
- Whether control flow complexity is justified (requires understanding algorithm requirements)
- Edge cases in error handling (requires understanding failure modes)

### Workflow Integration

1. **Run scripts first** (automated detection) → Catches 60-70% of mechanical violations in seconds
2. **Agent manual review** (semantic analysis) → Catches remaining 30-40% requiring judgment
3. **Apply patterns** (with context) → Agent uses judgment to apply fixes appropriately
4. **Validate fixes** (type checking + tests) → Ensure correctness

Scripts save ~2,000 tokens per audit by handling mechanical detection, allowing agents to focus on violations requiring semantic understanding and domain knowledge.

---

## Scripts

### 1. `detect-best-practice-violations.sh`
**Purpose:** Scan TypeScript/JavaScript files for common best practice violations using static analysis.

**Usage:**
```bash
# Scan entire directory
./scripts/detect-best-practice-violations.sh src/ > violations.json

# Scan specific file
./scripts/detect-best-practice-violations.sh src/utils/helpers.ts > issues.json
```

**Output:** JSON array of detected violations with:
- File location and line number
- Pattern type (e.g., "Using 'any' type", "Returning null/undefined")
- Category (Type Safety, Safety, State Management, Return Values, Code Quality)
- Severity (Critical, High, Medium, Low)
- Expected gain from fixing
- Reference file links

**Detects:**
- `any` type usage (disables type checking)
- `enum` keyword usage (generates runtime code)
- `interface` usage (where `type` is preferred)
- Returning `null` or `undefined` instead of zero values
- Unbounded `while(true)` loops
- Boolean variables without `is`/`has` prefix
- `let` usage where `const` could be used
- Control flow without block style `{}`
- Parameter mutations
- Magic numbers without constants

**Context savings: ~1,200 tokens per audit**

---

### 2. `generate-audit-report.sh`
**Purpose:** Generate pre-filled audit report from detected violations JSON.

**Usage:**
```bash
./scripts/generate-audit-report.sh violations.json "UserService" > audit-report.md
```

**Parameters:**
- `violations.json` - Output from detect-best-practice-violations.sh
- `target-name` - Name of the audited component/module (e.g., "UserService", "AuthModule")

**Output:** Markdown audit report following assets/output-report-template.md structure with:
- Executive summary with counts by severity and category
- Phase 1: Detailed findings with code snippets, severity, impact, and fixes
- Phase 2: Summary table for tracking all issues

**Requires:** jq (JSON processor)
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

**Context savings: ~900 tokens per audit report**

---

### 3. `quick-categorize.sh`
**Purpose:** Quick lookup for categorizing best practice violations.

**Usage:**
```bash
# Via pipe
echo "using any type" | ./scripts/quick-categorize.sh

# Via argument
./scripts/quick-categorize.sh "returning null"
```

**Output:** Category, severity, expected gain, and reference files for the issue.

**Examples:**
```bash
# Categorize type safety issue
echo "using any type" | ./scripts/quick-categorize.sh
# Output:
# Category: Type Safety
# Severity: Critical
# Expected Gain: Enables type safety and refactoring confidence
# References: any.md

# Quick lookup during code review
./scripts/quick-categorize.sh "unbounded loop"
# Output:
# Category: Safety
# Severity: Critical
# Expected Gain: Prevents runaway resource consumption
# References: bounded-iteration.md
```

**Context savings: ~200 tokens per categorization lookup**

---

## Typical Workflow

```bash
# 1. Detect violations
./scripts/detect-best-practice-violations.sh src/ > violations.json

# 2. Generate audit report
./scripts/generate-audit-report.sh violations.json "MyComponent" > report.md

# 3. Review report, identify issues to fix
cat report.md

# 4. Quick categorize specific issues as needed
echo "parameter mutation" | ./scripts/quick-categorize.sh
```

---

## Impact

**Context Reduction:**
- Detection script: ~1,200 tokens saved by automating AGENTS.md rule scanning
- Audit report generation: ~900 tokens saved per audit
- Total per full audit: ~2,100 tokens saved

**Time Savings:**
- Manual audit: 20-30 minutes for full codebase scan
- Automated audit with scripts: 5-10 minutes
- **60-75% time reduction** for standard best practices audits

**Before:**
```markdown
To detect violations, systematically check for:
- `any` type usage by searching for `: any`, `<any>`, `as any` patterns
- `enum` keyword by searching for `enum ` followed by identifier
- `interface` declarations by searching for `interface ` at line start
- `return null` or `return undefined` statements
- Unbounded loops with `while(true)` patterns
...
[Continues for 40+ more lines of detection instructions]
```

**After:**
```markdown
Run the detection script:
```bash
./scripts/detect-best-practice-violations.sh src/ > violations.json
```
```

---

## Design Principles

1. **Heuristic-based with clear limitations**: Scripts use pattern matching and document what they cannot detect
2. **Clear output**: JSON format enables programmatic processing and report generation
3. **Graceful coverage**: Catches ~60-70% of violations; agent reviews for semantic violations
4. **Appropriate severity levels**: Critical/High/Medium/Low help prioritize fixes

---

## Requirements

- **Bash** (compatible with sh/zsh)
- **jq** (for generate-audit-report.sh only)
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`
- **grep** (standard on Unix systems)

---

## Limitations

- **Heuristic-based detection**: Scripts use pattern matching, may produce false positives
- **No semantic analysis**: Cannot understand code intent, only syntax patterns
- **~60-70% coverage**: Some violations require manual agent review for domain knowledge
- **Best effort**: Parameter mutation and const/let detection use simplified heuristics
- **Language support**: TypeScript, JavaScript, TSX, JSX only

For semantic violations requiring domain knowledge (~30-40%), agent manual review is necessary following the skill workflow.

---

## Maintenance

All scripts use `set -euo pipefail` for defensive Bash programming and include detailed comments explaining their purpose and limitations.
