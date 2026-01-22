---
description: Audit JavaScript/TypeScript code for performance issues and offer to correct found issues
argument-hint: "[path] [--fix-mode=interactive|all|none] [--report=<file>]"
skills:
  - js-ts-best-practices
---

# audit-js-ts-perf

Audit JavaScript and TypeScript code for performance anti-patterns and offer interactive or automated fixes. Leverages the `js-ts-best-practices` skill to detect common performance issues including inefficient loops, excessive branching, missing memoization, blocking async operations, and more.

## Arguments

### path
- **Type:** string (file path, directory path, or glob pattern)
- **Required:** No
- **Default:** `.` (current directory)
- **Description:** Specifies what to audit. Can be:
  - A single file: `src/utils.ts`
  - A directory: `src/components` (recursively scans all `.js`, `.ts`, `.jsx`, `.tsx` files)
  - A glob pattern: `**/*.tsx` or `src/**/*.ts`

Files in `node_modules`, `dist`, `build`, `.next`, and other build directories are automatically excluded.

### --fix-mode
- **Type:** string
- **Required:** No
- **Default:** `interactive`
- **Valid values:** `interactive`, `all`, `none`
- **Description:** Controls how performance issues are handled:
  - `interactive`: For each issue, prompt user to fix, skip, fix all remaining, or abort
  - `all`: Automatically apply all fixes without prompting
  - `none`: Report issues only, don't modify any files

### --report
- **Type:** string (file path)
- **Required:** No
- **Default:** none (no report generated)
- **Description:** Path to generate a markdown report file containing:
  - Audit summary statistics
  - All issues found with file locations and explanations
  - Fixes applied (if any)
  - Remaining issues (if any)

Example: `--report=audit-report.md`

## Workflow

### 1. Parse and validate arguments
- Validate that `path` exists (if provided)
- Ensure `--fix-mode` is one of: `interactive`, `all`, `none`
- Verify `--report` path is writable (if provided)
- Exit with clear error message if validation fails

### 2. Discover files to audit
- Resolve the `path` argument:
  - **Single file:** Audit that specific file only
  - **Directory:** Recursively find all `.js`, `.ts`, `.jsx`, `.tsx` files
  - **Glob pattern:** Use Glob tool to resolve pattern to file list
- Filter out excluded directories:
  - `node_modules`, `dist`, `build`, `.next`, `.cache`, `coverage`, `.turbo`
- Display discovered file count to user

### 3. Load performance patterns from js-ts-best-practices skill
- Read reference documents from `references/`
- Build comprehensive checklist of patterns to detect:
  - **Loops:** Reduce iteration, bounded iteration, cache property access
  - **Branching:** Reduce branching, early returns, lookup tables
  - **Memoization:** Cache expensive calculations, memoize function results
  - **Async:** Defer await, parallel execution, non-blocking operations
  - **State:** Avoid unnecessary state, batch updates
  - **Other:** Property access optimization, Storage API caching
- Prioritize patterns by performance impact (critical → high → medium → low)

### 4. Scan files for performance issues
- For each file in the discovered file list:
  - Use Read tool to load file contents
  - Apply pattern detection using Grep tool for specific anti-patterns
  - For each detected pattern:
    - Identify specific line numbers
    - Extract code snippet showing the issue
    - Categorize by pattern type (e.g., "Inefficient loop", "Missing memoization")
    - Attach explanation of the performance problem
    - Generate suggested fix based on js-ts-best-practices guidelines
- Collect all issues with full context
- Display progress indicator during scanning

### 5. Present findings to user
- Display summary statistics:
  - Total files scanned
  - Total issues found
  - Issues grouped by category (loops, branching, memoization, etc.)
- For each issue category:
  - Show category name and count
  - List individual issues with:
    - File path:line_number format
    - Code snippet with issue highlighted
    - Clear explanation of performance problem
    - Suggested fix with code example
- If no issues found, display success message

### 6. Handle fixes based on fix-mode
**If `fix-mode=interactive`:**
- For each issue:
  - Display issue details (file, line, problem, suggested fix)
  - Prompt user with options:
    - `[f]ix` - Apply this fix
    - `[s]kip` - Skip this issue
    - `[a]ll` - Fix this and all remaining issues
    - `[q]uit` - Abort and exit
  - If user chooses fix/all:
    - Apply fix using Edit tool
    - Confirm fix was applied successfully
    - Track fix in fixes-applied list
  - If user chooses skip:
    - Track issue in skipped-issues list
  - If user chooses quit:
    - Display summary of fixes applied so far
    - Exit workflow

**If `fix-mode=all`:**
- Display message: "Auto-fixing all N issues..."
- For each issue:
  - Apply fix using Edit tool
  - Show progress: "Fixed M/N issues..."
  - Track all fixes in fixes-applied list
- Display completion message with total fixes applied

**If `fix-mode=none`:**
- Display message: "Report-only mode: no files will be modified"
- Skip fixing step entirely
- All issues remain in issues-found list for reporting

### 7. Generate report (if --report specified)
- Create markdown report with the following sections:

  **Audit Summary:**
  - Command invoked with arguments
  - Timestamp of audit
  - Files scanned count
  - Total issues found
  - Fixes applied count (if any)
  - Issues remaining count

  **Issues Found:**
  - Grouped by category
  - For each issue:
    - File path and line number
    - Code snippet (before)
    - Explanation
    - Suggested fix (or applied fix if fixed)

  **Fixes Applied:** (if fix-mode ≠ none)
  - List of all files modified
  - Count of fixes per file
  - Summary of fix types applied

  **Remaining Issues:** (if any issues not fixed)
  - List of issues that were skipped or not fixed
  - Recommendations for manual review

- Write report to specified file path using Write tool
- Display confirmation: "Report written to <path>"

## Statistics Reporting

After command completes, display:

```
audit-js-ts-perf completed

Files scanned: 42
Issues found: 18
  - Inefficient loops: 7
  - Excessive branching: 4
  - Missing memoization: 5
  - Blocking async: 2

Fixes applied: 15
Fixes skipped: 3
Files modified: 8

Report: audit-report.md (if --report specified)
```

Example with no issues:
```
audit-js-ts-perf completed

Files scanned: 42
Issues found: 0

No performance issues detected!
```

Example with report-only mode:
```
audit-js-ts-perf completed (report-only mode)

Files scanned: 42
Issues found: 18
  - Inefficient loops: 7
  - Excessive branching: 4
  - Missing memoization: 5
  - Blocking async: 2

Report: audit-report.md
No files were modified (--fix-mode=none)
```

## Examples

### Basic usage - audit current directory with interactive fixes
```bash
audit-js-ts-perf
```
Scans all JS/TS files in current directory and subdirectories, prompts for each issue.

### Audit specific file
```bash
audit-js-ts-perf src/utils/performance.ts
```
Audits a single file, prompts for each issue found.

### Audit directory with auto-fix
```bash
audit-js-ts-perf src/components --fix-mode=all
```
Scans all JS/TS files in `src/components`, automatically applies all fixes.

### Report only (no modifications)
```bash
audit-js-ts-perf --fix-mode=none --report=perf-issues.md
```
Scans entire project, generates report, doesn't modify any files.

### Audit with glob pattern and report
```bash
audit-js-ts-perf "src/**/*.tsx" --report=react-perf-audit.md
```
Audits only `.tsx` files in `src/`, generates detailed report, prompts for each fix interactively.

### Auto-fix with report
```bash
audit-js-ts-perf src/ --fix-mode=all --report=fixes-applied.md
```
Scans `src/` directory, auto-applies all fixes, generates report of changes made.

## Notes

- The command uses the `js-ts-best-practices` skill's reference documentation to identify performance anti-patterns
- Pattern detection focuses on high-impact performance issues first (loops, branching, async operations)
- All fixes preserve code functionality while improving performance characteristics
- Interactive mode allows careful review of each change before applying
- Report generation is useful for documentation and tracking technical debt
- The command is safe to run in CI/CD pipelines with `--fix-mode=none` to detect issues without modifying code
