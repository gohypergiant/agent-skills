---
description: Audit JavaScript/TypeScript comments (JSDoc, inline, markers) against js-ts-best-practices standards and optionally apply fixes
argument-hint: [path]
skills: js-ts-best-practices
---

# audit-comments

Comprehensive comment auditing for JavaScript and TypeScript codebases. Scans files for JSDoc completeness, improper comment placement, missing markers, and comments that should be removed. Generates detailed reports with line-specific issues and offers interactive fix application.

## Arguments

- `path` (string, optional, default: `.`): File path, directory path, or glob pattern to audit
  - Single file: `src/core.ts`
  - Directory (recursive): `src/`
  - Glob pattern: `src/**/*.ts`
  - Current directory: `.` or omit argument

- `--extensions` (string, optional, default: `js,ts,jsx,tsx`): Comma-separated list of file extensions to audit
  - Example: `--extensions js,ts` to skip JSX/TSX files
  - Example: `--extensions ts` for TypeScript only

## Workflow

### Phase 1: File Discovery

1. Parse `path` argument to determine input type:
   - Single file: validate existence and extension
   - Directory: recursively find all files matching `--extensions`
   - Glob pattern: expand pattern and filter by extensions

2. Filter files by extension list from `--extensions` flag

3. Report discovered files count before processing

### Phase 2: Comment Analysis

For each discovered file:

1. Parse file into AST (Abstract Syntax Tree) using TypeScript compiler API

2. Extract all comment nodes (JSDoc blocks, inline comments, end-of-line comments)

3. Apply js-ts-best-practices skill rules by loading relevant reference files:
   - Load `references/jsdoc.md` for JSDoc standards
   - Load `references/comment-markers.md` for marker validation
   - Load `references/comments-to-remove.md` for removal candidates
   - Load `references/comments-to-preserve.md` for preservation rules
   - Load `references/comments-placement.md` for placement validation

4. Categorize issues by type:
   - **Missing JSDoc**: Exported functions/classes without proper documentation
   - **Incomplete JSDoc**: Missing `@param`, `@returns`, or `@example` tags
   - **Comments to remove**: Commented-out code, edit history, obsolete comments
   - **Placement issues**: End-of-line comments that should be above code
   - **Marker issues**: Improper TODO/FIXME/HACK/NOTE/PERF format
   - **Comments to preserve**: Verify business logic and linter directive comments are intact

5. Store issues with metadata:
   - File path
   - Line number and column
   - Issue type and category
   - Current code snippet
   - Suggested fix (if applicable)
   - Severity (error, warning, info)

### Phase 3: Report Generation

Generate detailed report with hierarchical structure:

```
=== Comment Audit Report ===

src/core.ts:
  Line 45: Missing JSDoc for exported function 'processData'
    Severity: error
    Expected: JSDoc with @param, @returns, @example
    Current:
      export function processData(input: Data): Result {

  Line 78: Commented-out code should be removed
    Severity: warning
    Current:
      // const oldImplementation = () => { ... }
    Reason: Dead code clutters source files

  Line 92: End-of-line comment should be moved above code
    Severity: warning
    Current:
      const result = compute(); // TODO: optimize this
    Suggested:
      // TODO: optimize this
      const result = compute();

src/utils.ts:
  Line 23: Missing JSDoc for exported function 'formatDate'
    Severity: error
    Expected: JSDoc with @param, @returns, @example

  Line 34: Use proper TODO marker format
    Severity: info
    Current:
      // todo fix later
    Expected:
      // TODO: fix later

  Line 56: Incomplete JSDoc - missing @example
    Severity: warning
    Current:
      /**
       * @param date - Input date
       * @returns Formatted string
       */
    Expected: Add @example tag with usage demonstration
```

### Phase 4: Statistics Reporting

Output comprehensive statistics:

```
=== Statistics ===

Total files scanned: 45
Files with issues: 23 (51.1%)
Files compliant: 22 (48.9%)

Issue breakdown:
- Missing JSDoc: 67 exports
- Incomplete JSDoc: 34 exports
- Comments to remove: 42 instances
  - Commented-out code: 28
  - Edit history: 10
  - Obsolete comments: 4
- Placement issues: 18 end-of-line comments
- Marker issues: 12 improper formats

Severity distribution:
- Errors: 101 (JSDoc compliance)
- Warnings: 60 (placement, removal candidates)
- Info: 12 (marker formatting)

Per-file compliance:
- src/core.ts: 3 issues (2 errors, 1 warning)
- src/utils.ts: 8 issues (5 errors, 2 warnings, 1 info)
- src/types.ts: 0 issues ✓
- src/helpers.ts: 12 issues (10 errors, 2 warnings)
- ... (top 10 files by issue count)

Files by issue count:
1. src/helpers.ts: 12 issues
2. src/utils.ts: 8 issues
3. src/core.ts: 3 issues
...
```

### Phase 5: Interactive Fix Application

After displaying report and statistics:

1. Prompt user: `Apply fixes? (y/n)`

2. If user responds `y` or `yes`:
   - Apply all auto-fixable issues:
     - Add missing JSDoc templates with placeholder text
     - Complete incomplete JSDoc with missing tags
     - Remove commented-out code and edit history
     - Move end-of-line comments above code
     - Fix marker formatting (TODO/FIXME/HACK/NOTE/PERF)
   - Preserve manual review items:
     - Flag business logic comments for preservation
     - Warn about linter directives before removal
     - Skip ambiguous cases requiring human judgment

3. Generate fix summary:
   ```
   === Fixes Applied ===

   Modified 23 files:
   - Added 67 JSDoc blocks
   - Completed 34 JSDoc blocks with missing tags
   - Removed 42 obsolete comments
   - Moved 18 comments to proper placement
   - Fixed 12 marker formats

   Manual review required:
   - src/legacy.ts: 3 business logic comments flagged for review
   - src/vendor.ts: 2 linter directives need verification
   ```

4. If user responds `n` or `no`:
   - Exit without modifying files
   - Display message: "Audit complete. No changes applied."

### Error Handling

- Invalid file paths: Report error and skip file
- Unparseable files: Log syntax errors and continue with remaining files
- Permission errors: Report and skip file
- Empty directories: Warn user and exit gracefully
- No files matching extension filter: Inform user and suggest checking `--extensions` flag

## Statistics Reporting

The command outputs detailed statistics in multiple dimensions:

### File-Level Statistics
- Total files scanned (with breakdown by extension)
- Files with issues vs compliant files (percentage)
- Top N files by issue count (default N=10)

### Issue Category Statistics
- Missing JSDoc count (by export type: function, class, interface, type)
- Incomplete JSDoc count (missing tags breakdown)
- Comments to remove count (by subcategory: dead code, edit history, obsolete)
- Placement issues count (end-of-line vs block comments)
- Marker issues count (by marker type: TODO, FIXME, HACK, NOTE, PERF)

### Severity Statistics
- Errors (JSDoc compliance violations)
- Warnings (code quality issues)
- Info (style improvements)

### Fix Application Statistics (if fixes applied)
- Files modified count
- Issues fixed by category
- Manual review items flagged

### Example Output Structure
```
Total files scanned: 45 (38 .ts, 5 .tsx, 2 .js)
Files with issues: 23 (51.1%)
Files compliant: 22 (48.9%)

Issue breakdown:
- Missing JSDoc: 67 exports
  - Functions: 45
  - Classes: 12
  - Types: 10
- Incomplete JSDoc: 34 exports (missing @example: 28, missing @param: 6)
- Comments to remove: 42 instances
  - Commented-out code: 28
  - Edit history: 10
  - Obsolete comments: 4
- Placement issues: 18 end-of-line comments
- Marker issues: 12 improper formats (TODO: 8, FIXME: 3, HACK: 1)

Per-file compliance (top 10 by issue count):
1. src/helpers.ts: 12 issues (10 errors, 2 warnings)
2. src/utils.ts: 8 issues (5 errors, 2 warnings, 1 info)
3. src/core.ts: 3 issues (2 errors, 1 warning)
4. src/api.ts: 3 issues (3 errors)
5. src/formatters.ts: 2 issues (1 error, 1 warning)
...
```

## Examples

### Example 1: Audit Current Directory

```bash
$ claude audit-comments
```

**Output:**
```
Discovering files...
Found 45 files matching extensions: js,ts,jsx,tsx

Analyzing comments...
[========================================] 45/45 files

=== Comment Audit Report ===

src/core.ts:
  Line 45: Missing JSDoc for exported function 'processData'
  ...

=== Statistics ===
Total files scanned: 45
Files with issues: 23 (51.1%)
...

Apply fixes? (y/n)
```

### Example 2: Audit Specific Directory with TypeScript Only

```bash
$ claude audit-comments src/lib --extensions ts
```

**Output:**
```
Discovering files...
Found 12 files matching extensions: ts

Analyzing comments...
[========================================] 12/12 files

=== Comment Audit Report ===

src/lib/parser.ts:
  Line 23: Missing JSDoc for exported function 'parse'
  Line 67: Commented-out code should be removed
  ...

=== Statistics ===
Total files scanned: 12
Files with issues: 8 (66.7%)
...

Apply fixes? (y/n)
```

### Example 3: Audit Single File

```bash
$ claude audit-comments src/utils/formatters.ts
```

**Output:**
```
Analyzing file: src/utils/formatters.ts

=== Comment Audit Report ===

src/utils/formatters.ts:
  Line 12: Missing JSDoc for exported function 'formatDate'
    Severity: error
    Expected: JSDoc with @param, @returns, @example

  Line 34: End-of-line comment should be moved above code
    Severity: warning
    Current:
      const result = format(date); // TODO: handle timezones
    Suggested:
      // TODO: handle timezones
      const result = format(date);

=== Statistics ===
Total files scanned: 1
Files with issues: 1 (100.0%)

Issue breakdown:
- Missing JSDoc: 1 export
- Placement issues: 1 end-of-line comment

Apply fixes? (y/n) y

=== Fixes Applied ===

Modified 1 file:
- Added 1 JSDoc block
- Moved 1 comment to proper placement

Audit complete.
```

### Example 4: Audit with Glob Pattern

```bash
$ claude audit-comments "src/**/*.test.ts" --extensions ts
```

**Output:**
```
Discovering files...
Found 8 test files matching pattern: src/**/*.test.ts

Analyzing comments...
[========================================] 8/8 files

=== Comment Audit Report ===

src/core.test.ts:
  Line 45: Use proper TODO marker format
    Current: // todo add more test cases
    Expected: // TODO: add more test cases
...

Apply fixes? (y/n) n

Audit complete. No changes applied.
```

## Implementation Notes

### TypeScript Compiler API Usage

Use `ts.createSourceFile()` and `ts.forEachChild()` to traverse AST:

```typescript
import * as ts from 'typescript';

const sourceFile = ts.createSourceFile(
  filepath,
  fileContent,
  ts.ScriptTarget.Latest,
  true // setParentNodes
);

function visitNode(node: ts.Node): void {
  // Extract comments using ts.getLeadingCommentRanges()
  // and ts.getTrailingCommentRanges()

  // Check for exported declarations
  if (ts.isExportDeclaration(node) ||
      ts.isFunctionDeclaration(node) && hasExportModifier(node)) {
    // Validate JSDoc presence and completeness
  }

  ts.forEachChild(node, visitNode);
}
```

### JSDoc Validation

Extract JSDoc tags and validate completeness:

```typescript
function validateJSDoc(node: ts.Node): Issue[] {
  const jsDocTags = ts.getJSDocTags(node);
  const issues: Issue[] = [];

  // Check for required tags based on node type
  if (ts.isFunctionDeclaration(node)) {
    const hasParam = jsDocTags.some(tag => tag.tagName.text === 'param');
    const hasReturns = jsDocTags.some(tag => tag.tagName.text === 'returns');
    const hasExample = jsDocTags.some(tag => tag.tagName.text === 'example');

    if (!hasParam) issues.push({ type: 'missing-param', ... });
    if (!hasReturns) issues.push({ type: 'missing-returns', ... });
    if (!hasExample) issues.push({ type: 'missing-example', ... });
  }

  return issues;
}
```

### Comment Marker Detection

Use regex patterns to detect and validate markers:

```typescript
const MARKER_PATTERN = /^\s*\/\/\s*(TODO|FIXME|HACK|NOTE|REVIEW|PERF)(?::|)\s*.+/;

function validateMarker(comment: string, line: number): Issue | null {
  const lowerComment = comment.toLowerCase();

  // Check for lowercase markers without proper format
  if (/\/\/\s*(todo|fixme|hack|note|review|perf)\s+/.test(lowerComment)) {
    return {
      type: 'marker-format',
      line,
      current: comment.trim(),
      expected: comment.replace(
        /\/\/\s*(todo|fixme|hack|note|review|perf)/i,
        (match, marker) => `// ${marker.toUpperCase()}:`
      )
    };
  }

  return null;
}
```

### Commented-Out Code Detection

Heuristic for detecting commented-out code vs legitimate comments:

```typescript
function isCommentedOutCode(comment: string): boolean {
  // Remove comment markers
  const content = comment.replace(/^\/\/\s*/, '').replace(/^\/\*+|\*+\/$/g, '');

  // Check for code indicators
  const codeIndicators = [
    /^\s*(const|let|var|function|class|interface|type|export|import)\s+/,
    /[{};()=>]/,
    /\w+\s*=\s*\w+/,
    /^\s*if\s*\(/,
    /^\s*for\s*\(/,
    /^\s*return\s+/
  ];

  return codeIndicators.some(pattern => pattern.test(content));
}
```

### Fix Application Strategy

Apply fixes in order of safety:

1. **Safe fixes** (apply automatically):
   - Add missing JSDoc templates
   - Fix marker formatting
   - Move end-of-line comments to proper placement

2. **Removal fixes** (apply with caution):
   - Remove commented-out code (verify no linter directives)
   - Remove edit history comments
   - Remove obsolete comments

3. **Manual review** (flag only):
   - Business logic comments
   - Linter directives (`// eslint-disable-next-line`)
   - Complex JSDoc requiring specific context

### Progress Indication

For directories with many files, show progress:

```typescript
const progressBar = (current: number, total: number): string => {
  const percentage = Math.floor((current / total) * 100);
  const filled = Math.floor((current / total) * 40);
  const bar = '='.repeat(filled) + ' '.repeat(40 - filled);
  return `[${bar}] ${current}/${total} files (${percentage}%)`;
};
```

### Exit Codes

- `0`: Successful audit (with or without issues found)
- `1`: Error during execution (invalid path, permission denied)
- `2`: No files found matching criteria
