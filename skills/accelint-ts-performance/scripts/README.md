# Performance Optimization Scripts

Automation tools for detecting and reporting TypeScript/JavaScript performance anti-patterns.

## Coverage Model

### How Scripts and Agent Review Work Together

Scripts are a **first-pass tool**, not a replacement for agent review. They work together to provide comprehensive coverage:

**What Scripts CAN Catch (~60-70% of anti-patterns)**

Mechanical/syntactic patterns detectable through pattern matching:
- Nested loops (O(n²) complexity) - exact pattern match
- Array method chaining (`.filter().map()`) - exact pattern match
- `Array.includes()` in loops - pattern match with context
- `try/catch` in loops - pattern match with context
- Unbounded `while(true)` loops - exact pattern match
- Sequential `await` statements - pattern match
- `localStorage`/`sessionStorage` in loops - pattern match with context
- Spread operators in loops - pattern match with context
- Nested property access in loops - pattern match with context
- Template literals with single variables - exact pattern match

**What Scripts CANNOT Catch (~30-40% of anti-patterns)**

Requires semantic understanding and profiling data:
- Whether nested loops are justified by algorithm requirements
- Whether caching would introduce correctness issues
- Whether premature optimization would harm readability
- Actual hot paths without profiling data (scripts audit ALL code, which is correct)
- Memory vs CPU trade-offs (requires runtime profiling)
- Environment-specific optimizations (V8 behavior differs across versions)
- Whether micro-optimizations are worth complexity cost
- Data structure choice appropriateness (requires understanding access patterns)

### Workflow Integration

1. **Run scripts first** (automated detection) → Catches 60-70% of mechanical anti-patterns in seconds
2. **Agent manual review** (semantic analysis) → Catches remaining 30-40% requiring profiling and judgment
3. **Apply optimizations** (with measurement) → Agent measures impact and validates correctness
4. **Verify improvements** (profiling + tests) → Ensure performance gains and no regressions

Scripts save ~2,000 tokens per audit by handling mechanical detection, allowing agents to focus on optimizations requiring profiling data and semantic understanding.

---

## Scripts

### detect-anti-patterns.sh

Scans TypeScript/JavaScript code for common performance anti-patterns using static analysis.

**Usage:**
```bash
./detect-anti-patterns.sh <file-or-directory>
```

**Output:** JSON array of detected issues with:
- File location and line number
- Pattern type (e.g., "Nested loops", "Array method chaining")
- Optimization category (Algorithmic, Caching, I/O, Memory, etc.)
- Expected performance gain
- Reference file links

**Example:**
```bash
# Scan entire src directory
./detect-anti-patterns.sh src/ > anti-patterns.json

# Scan specific file
./detect-anti-patterns.sh src/components/DataTable.tsx > issues.json
```

**Detects:**
- Nested loops (O(n²) complexity)
- Array method chains (`.filter().map()`)
- `Array.includes()` in loops (should use `Set.has()`)
- `try/catch` in hot paths
- Unbounded `while(true)` loops
- Sequential `await` statements
- `localStorage`/`sessionStorage` in loops
- Spread operators in loops
- Nested property access in loops
- Template literals with single variables

---

### generate-audit-report.sh

Generates a pre-filled audit report from anti-patterns JSON.

**Usage:**
```bash
./generate-audit-report.sh <anti-patterns.json> <target-name>
```

**Parameters:**
- `anti-patterns.json` - Output from detect-anti-patterns.sh
- `target-name` - Name of the audited component/module (e.g., "UserService", "DataTable")

**Output:** Markdown audit report following the skill's template structure with:
- Executive summary
- Categorized findings
- Code snippets
- Expected gains
- Reference file links

**Example:**
```bash
# Generate report from detected issues
./generate-audit-report.sh anti-patterns.json "Authentication Service" > audit-report.md
```

---

### quick-categorize.sh

Quick lookup for categorizing performance issues.

**Usage:**
```bash
# Via pipe
echo "issue description" | ./quick-categorize.sh

# Via argument
./quick-categorize.sh "nested for loops"
```

**Output:** Category, expected gain, and reference files for the issue.

**Examples:**
```bash
# Categorize a specific pattern
echo "nested for loops" | ./quick-categorize.sh
# Output:
# Category: Algorithmic
# Expected Gain: 10-1000x
# References: reduce-looping.md, reduce-branching.md

# Quick lookup during optimization
./quick-categorize.sh "localStorage in loop"
# Output:
# Category: Caching
# Expected Gain: 5-20x
# References: cache-storage-api.md
```

---

## Typical Workflow

```bash
# 1. Detect anti-patterns
./scripts/detect-anti-patterns.sh src/ > anti-patterns.json

# 2. Generate audit report
./scripts/generate-audit-report.sh anti-patterns.json "MyComponent" > report.md

# 3. Review report, identify issues to fix
cat report.md

# 4. Quick categorize specific issues as needed
echo "template literal in loop" | ./scripts/quick-categorize.sh
```

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
- **Best effort**: Some anti-patterns require deeper analysis (use manual review)
- **Language support**: TypeScript, JavaScript, TSX, JSX only

For complex analysis or low false-positive requirements, use full manual audits following the skill workflow.
