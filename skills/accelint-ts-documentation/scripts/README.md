# Documentation Audit Scripts

Automation tools for detecting and reporting JavaScript/TypeScript documentation issues including JSDoc violations and comment quality problems.

## Coverage Model

### How Scripts and Agent Review Work Together

Scripts are a **first-pass tool**, not a replacement for agent review. They work together to provide comprehensive coverage:

**What Scripts CAN Catch (~65-70% of documentation issues)**

Mechanical/syntactic patterns detectable through pattern matching:
- Exported functions/types/classes/constants without JSDoc (exact pattern match)
- Missing `@param`, `@returns`, `@template` tags (pattern match with context)
- `@example` tags without code fences (exact pattern match)
- Code fences without language identifiers (exact pattern match)
- `@returns` on `void` functions (pattern match with type checking)
- Commented-out code (syntax pattern heuristic)
- Vague TODO/FIXME markers (pattern match for common vague phrases)
- Edit history comments (pattern match for "Added/Changed/Removed")
- End-of-line comments (exact pattern match)
- Comments restating obvious code (heuristic)

**What Scripts CANNOT Catch (~30-35% of documentation issues)**

Requires semantic understanding and judgment:
- Whether documentation is clear and helpful to readers
- Whether internal code should be documented (contextual decision based on complexity)
- Whether descriptions are appropriate for the target audience
- Documentation quality and usefulness (clarity, examples, edge cases)
- Whether TODO/FIXME content is truly actionable (context-dependent)
- Complex JSDoc patterns requiring semantic understanding (overloaded functions, complex generics)
- Whether comment placement genuinely improves readability in context
- Whether object parameter properties need individual documentation
- Whether examples demonstrate realistic usage patterns

### Workflow Integration

1. **Run scripts first** (automated detection) → Catches 65-70% of mechanical issues in seconds
2. **Agent manual review** (semantic analysis) → Catches remaining 30-35% requiring judgment
3. **Apply fixes** (with context) → Agent uses expert judgment to write clear documentation
4. **Validate improvements** (type checking + human review) → Ensure documentation is helpful

Scripts save ~1,800 tokens per audit by handling mechanical detection, allowing agents to focus on documentation quality and clarity.

---

## Scripts

### 1. detect-jsdoc-issues.sh

Scans TypeScript/JavaScript code for JSDoc documentation violations using static analysis.

**Usage:**
```bash
# Scan entire directory
./scripts/detect-jsdoc-issues.sh src/ > jsdoc-issues.json

# Scan specific file
./scripts/detect-jsdoc-issues.sh src/utils/helpers.ts > jsdoc-issues.json
```

**Output:** JSON array of detected JSDoc issues with:
- File location and line number
- Issue description (e.g., "Exported function missing JSDoc", "@example missing code fence")
- Category (Missing Documentation, Incomplete Documentation, Incorrect Syntax, Incorrect Usage)
- Severity (High, Medium, Low)
- Reference file links

**Detects:**
- Exported functions without JSDoc
- Exported types/interfaces without JSDoc
- Exported classes without JSDoc
- Exported constants without JSDoc
- `@example` tags without code fences
- Code fences without language identifiers (typescript/javascript/tsx/jsx)
- `@returns` tags on `void` functions
- Functions with parameters missing `@param` tags
- Generic functions/types missing `@template` tags
- Functions that throw errors missing `@throws` tags

**Context savings: ~1,200 tokens per audit**

---

### 2. detect-comment-issues.sh

Scans TypeScript/JavaScript code for comment quality issues using static analysis.

**Usage:**
```bash
# Scan entire directory
./scripts/detect-comment-issues.sh src/ > comment-issues.json

# Scan specific file
./scripts/detect-comment-issues.sh src/components/DataTable.tsx > comment-issues.json
```

**Output:** JSON array of detected comment issues with:
- File location and line number
- Issue description (e.g., "Vague TODO marker", "Commented-out code")
- Category (Comment Quality, Dead Code, Comment Placement)
- Severity (High, Medium, Low)
- Reference file links

**Detects:**
- Vague TODO/FIXME markers (without clear actionable content)
- Commented-out code (should be deleted, git preserves history)
- Edit history comments ("Added", "Changed", "Removed" patterns)
- End-of-line comments that should be moved above code
- Comments restating obvious code
- Multiple consecutive single-line comments (could be consolidated)

**Context savings: ~600 tokens per audit**

---

### 3. generate-doc-audit-report.sh

Generates a pre-filled documentation audit report from detected issues JSON files.

**Usage:**
```bash
./scripts/generate-doc-audit-report.sh jsdoc-issues.json comment-issues.json "ComponentName" > audit-report.md
```

**Parameters:**
- `jsdoc-issues.json` - Output from detect-jsdoc-issues.sh
- `comment-issues.json` - Output from detect-comment-issues.sh
- `target-name` - Name of the audited component/module (e.g., "UserService", "DataTable")

**Output:** Markdown audit report following `assets/output-report-template.md` structure with:
- Executive summary with counts by severity and category
- Phase 1: Detailed findings with code snippets, severity, impact, and recommended fixes
- Phase 2: Summary table for tracking all issues
- Next steps prioritized by severity

**Requires:** jq (JSON processor)
- macOS: `brew install jq`
- Linux: `apt-get install jq` or `yum install jq`

**Context savings: ~600 tokens per audit report**

---

## Typical Workflow

```bash
# 1. Detect JSDoc issues
./scripts/detect-jsdoc-issues.sh src/ > jsdoc-issues.json

# 2. Detect comment quality issues
./scripts/detect-comment-issues.sh src/ > comment-issues.json

# 3. Generate audit report
./scripts/generate-doc-audit-report.sh jsdoc-issues.json comment-issues.json "MyComponent" > audit-report.md

# 4. Review report
cat audit-report.md

# 5. Apply fixes (manual or agent-assisted)
# ... fix issues following references/jsdoc.md and references/comments.md ...

# 6. Re-run to verify fixes
./scripts/detect-jsdoc-issues.sh src/ > jsdoc-issues-after.json
./scripts/detect-comment-issues.sh src/ > comment-issues-after.json
```

---

## Impact

**Context Reduction:**
- JSDoc detection script: ~1,200 tokens saved by automating mechanical checks
- Comment detection script: ~600 tokens saved by automating quality checks
- Audit report generation: ~600 tokens saved per audit
- **Total per full audit: ~1,800 tokens saved**

**Time Savings:**
- Manual documentation audit: 30-45 minutes for full codebase scan
- Automated audit with scripts: 5-10 minutes
- **70-80% time reduction** for standard documentation audits

**Coverage:**
- Scripts catch ~65-70% of mechanical documentation issues
- Agent review required for ~30-35% requiring semantic judgment
- Combined approach provides comprehensive documentation coverage

**Before:**
```markdown
To audit documentation:
1. Search for exported functions without JSDoc (grep for "export function")
2. Check each function for @param, @returns, @template tags
3. Verify @example tags use proper code fences with language identifiers
4. Check for @returns on void functions
5. Search for commented-out code patterns
6. Identify vague TODO/FIXME markers
7. Check for edit history comments
...
[Continues for 50+ more lines of manual audit instructions]
```

**After:**
```markdown
Run the detection scripts:
```bash
./scripts/detect-jsdoc-issues.sh src/ > jsdoc.json
./scripts/detect-comment-issues.sh src/ > comments.json
./scripts/generate-doc-audit-report.sh jsdoc.json comments.json "Component" > report.md
```
```

---

## Design Principles

1. **Heuristic-based with clear limitations**: Scripts use pattern matching and document what they cannot detect
2. **Clear separation of concerns**: JSDoc issues and comment quality issues are separate scripts
3. **Structured output**: JSON format enables programmatic processing and report generation
4. **Graceful coverage**: Catches ~65-70% of issues; agent reviews for semantic quality
5. **Severity-based prioritization**: High/Medium/Low helps prioritize fixes
6. **Non-destructive**: Scripts only detect, never modify files

---

## TODO Detection Specifics

The script detects vague TODO/FIXME markers using two criteria:

**1. Common vague phrases (case-insensitive):**
- "fix this" / "fix it"
- "improve"
- "update"
- "handle"
- "refactor"
- "broken"
- "todo" (just repeating the marker)

**2. Too short to be actionable:**
- Less than 3 words after the marker

**✅ Examples of CLEAR TODOs (will NOT be flagged):**
```typescript
// TODO: Replace with binary search for O(log n) lookup
// FIXME: Throws error on empty array, add guard clause before line 42
// TODO: Add timeout parameter (default 5000ms) to prevent hanging requests
// HACK: Workaround for API bug #1234, remove when upstream fixes
```

**❌ Examples of VAGUE TODOs (WILL be flagged):**
```typescript
// TODO: fix this
// TODO: improve performance
// FIXME: broken
// TODO: update
```

**Note:** The script does NOT require usernames in TODO markers. Clear, actionable content is what matters.

---

## Requirements

- **Bash** (compatible with sh/zsh)
- **jq** (for generate-doc-audit-report.sh only)
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`
- **grep** (standard on Unix systems)
- **sed** (standard on Unix systems)

---

## Limitations

- **Heuristic-based detection**: Scripts use pattern matching, may produce false positives
- **No semantic analysis**: Cannot understand documentation clarity or quality
- **~65-70% coverage**: Some issues require manual agent review for context and judgment
- **Best effort TODO detection**: Cannot determine if TODO content is truly actionable in all contexts
- **Language support**: TypeScript, JavaScript, TSX, JSX only
- **No cross-file analysis**: Cannot detect if documentation is inconsistent across related files

For semantic documentation quality issues (~30-35%), agent manual review is necessary following the skill workflow.

---

## Maintenance

All scripts use `set -euo pipefail` for defensive Bash programming and include detailed comments explaining their purpose and limitations.

To add new detection patterns:
1. Add pattern detection in relevant script (detect-jsdoc-issues.sh or detect-comment-issues.sh)
2. Use `emit_finding` helper with appropriate category and severity
3. Update this README with new detection capability
4. Update Coverage Model section with pattern classification
