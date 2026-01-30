# Command Patterns and Syntax

This reference provides detailed patterns and examples for Claude Code command specifications.

**Note:** The patterns shown below are simplified for clarity. For complete, production-ready examples with full implementation details, error handling, and comprehensive workflows, see:
- `optimize-images-example.md` - Complete realistic example
- `../../../commands/audit/js-ts-docs.md` - Real production command

## Command File Format

Commands are defined as **single Markdown files with YAML front matter**.

**Structure:**
```markdown
---
description: Brief description of what the command does
argument-hint: [arg1 | arg2] or [file-path] or [directory-path]
skills: skill-name-1, skill-name-2
---

# Command Name

[Command body with sections: Arguments, Workflow, Statistics Reporting, Examples]
```

**YAML Front Matter Fields:**
- `description`: Brief description of command purpose (required)
- `argument-hint`: Argument syntax hint shown in help (required)
- `skills`: Comma-separated list of skills to reference (optional)

## Pattern Examples

### Pattern 1: Simple Skill-Based Command

Command that leverages a single skill with minimal arguments.

```markdown
---
description: Rotate pages in a PDF document
argument-hint: [file-path] [--angle 90|180|270]
skills: pdf
---

# rotate-pdf

Rotate all pages in a PDF document by specified angle.

## Arguments

- `file` (file, required): PDF file to rotate
- `angle` (number, optional, default: 90): Rotation angle in degrees
  - Validation: Must be 90, 180, or 270

## Workflow

1. Validate PDF file exists and is readable
2. Load PDF using pdf skill
3. Rotate each page by specified angle
4. Save rotated PDF to output file
5. Report statistics

## Statistics Reporting

Output includes:
- Total pages processed
- Output file size vs input file size
- Processing time

Example:
```
Processed 15 pages
Input size: 2.4 MB
Output size: 2.4 MB
Completed in 1.2s
```

## Examples

```bash
rotate-pdf document.pdf
rotate-pdf document.pdf --angle 180
```
```

### Pattern 2: Multi-Skill Command

Command that integrates multiple skills for complex workflows.

```markdown
---
description: Generate formatted report from data analysis
argument-hint: [data-file] [--template template-file] [--charts]
skills: xlsx, docx
---

# create-report

Analyze data from Excel and generate formatted Word document report.

## Arguments

- `data` (file, required): Excel file containing source data
- `template` (file, optional): Word template for output formatting
- `charts` (boolean, optional, default: true): Include visualizations in report

## Workflow

1. Read and validate Excel data using xlsx skill
2. Analyze data and compute statistics
3. Generate visualizations if charts enabled
4. Load Word template if provided, otherwise use default format
5. Format output using docx skill
6. Save report and display statistics

## Statistics Reporting

Output includes:
- Data rows processed
- Charts generated
- Report sections created
- Output file size
- Processing time

Example:
```
Processed 1,247 data rows
Generated 5 charts
Created 8 report sections
Output: quarterly_report.docx (458 KB)
Completed in 3.4s
```

## Examples

```bash
create-report sales_data.xlsx
create-report sales_data.xlsx --template quarterly.docx
create-report sales_data.xlsx --template quarterly.docx --no-charts
```
```

### Pattern 3: Standalone Command (No Skills)

Command that doesn't require existing skills.

```markdown
---
description: Generate RFC4122 compliant UUIDs
argument-hint: [--count N] [--version 1|4]
---

# generate-uuid

Generate one or more RFC4122 compliant UUIDs.

## Arguments

- `count` (number, optional, default: 1): Number of UUIDs to generate
- `version` (number, optional, default: 4): UUID version (1 or 4)
  - Validation: Must be 1 or 4

## Workflow

1. Validate count and version arguments
2. Generate specified number of UUIDs
3. Output UUIDs (one per line if count > 1)
4. Report statistics

## Statistics Reporting

Output includes:
- UUIDs generated
- Version used
- Format validation status

Example:
```
Generated 10 UUIDs (version 4)
Format: RFC4122 compliant
All UUIDs validated successfully
```

## Examples

```bash
generate-uuid
generate-uuid --count 10
generate-uuid --count 5 --version 1
```
```

### Pattern 4: Directory Processing Command

Command that operates on directory structures.

```markdown
---
description: Analyze TypeScript codebase for code quality issues
argument-hint: [directory-path] [--exclude dirs] [--strict]
---

# audit-codebase

Scan TypeScript codebase and report code quality issues.

## Arguments

- `directory` (directory, required): Root directory of TypeScript project
- `exclude` (string, optional, default: "node_modules,dist"): Comma-separated list of directories to exclude
- `strict` (boolean, optional, default: false): Enable strict mode checks

## Workflow

1. Validate directory exists and contains TypeScript files
2. Build file list, excluding specified directories
3. Parse each TypeScript file
4. Check for code quality issues:
   - Unused imports
   - Type safety violations
   - Performance anti-patterns
   - Missing documentation
5. Generate per-file and aggregate reports
6. Output statistics

## Statistics Reporting

Output includes:
- Total files scanned
- Total issues found (by severity)
- Issues by category breakdown
- Per-file issue counts
- Top 10 files by issue count
- Compliance percentage

Example:
```
Scanned 47 TypeScript files
Total issues: 128 (24 errors, 89 warnings, 15 info)

Issues by category:
- Unused imports: 34 (26.6%)
- Type safety: 45 (35.2%)
- Performance: 28 (21.9%)
- Documentation: 21 (16.4%)

Top files by issue count:
1. src/legacy/parser.ts: 18 issues
2. src/utils/helpers.ts: 12 issues
3. src/core/engine.ts: 9 issues

Overall compliance: 72.8%
```

## Examples

```bash
audit-codebase ./src
audit-codebase ./src --exclude node_modules,dist,build
audit-codebase ./src --exclude test --strict
```
```

## Argument Type Guidelines

When documenting arguments in the command specification:

### string
- Use for text values, paths, URLs
- Specify validation rules for constrained formats
- Provide examples of valid values in description
- Example: `exclude` (string, optional, default: "node_modules"): Comma-separated directories

### number
- Use for counts, measurements, percentages
- Specify valid ranges in validation
- Include units in description if applicable
- Example: `quality` (number, optional, default: 85): JPEG quality 1-100

### boolean
- Use for flags and toggles
- Default should be the "safe" or most common option
- Name arguments positively (prefer `--include` over `--no-exclude`)
- Example: `strict` (boolean, optional, default: false): Enable strict mode checks

### file
- Validates that path points to existing file
- Include expected file extensions in description
- Consider whether to allow multiple files
- Example: `input` (file, required): PDF file to process

### directory
- Validates that path points to existing directory
- Specify if relative or absolute paths expected
- Consider whether recursive processing is implied
- Example: `source` (directory, required): Root directory to scan

## Validation Pattern Examples

When documenting argument validation:

**Enumerated values:**
```markdown
- Validation: Must be one of: low, medium, high
```

**Numeric range:**
```markdown
- Validation: Must be between 1 and 100
```

**Pattern matching:**
```markdown
- Validation: Must match pattern: ^[a-z][a-z0-9-]*$
```

**File extension:**
```markdown
- Validation: Must be .json or .yaml file
```

**Multiple constraints:**
```markdown
- Validation: Must be positive integer less than 1000
```

## Workflow Section Structure

The Workflow section should be structured as a numbered list with clear steps:

1. **Input processing**: Validate and prepare arguments
2. **Main operations**: Core workflow steps in execution order
3. **Skill integration**: When/how to invoke referenced skills
4. **Output generation**: Format and save results
5. **Statistics reporting**: Compute and display metrics

## Statistics Reporting Requirements

Every command should include a Statistics Reporting section that specifies:
- Key metrics to track during execution
- Breakdown categories (by file, by type, by status, etc.)
- Success/failure counts
- Performance metrics (time, size, percentage)
- Example output format

**Template:**
```markdown
## Statistics Reporting

Output includes:
- [Metric 1]: Description
- [Metric 2]: Description
- [Breakdown category]: Sub-metrics

Example:
```
[Example statistics output]
```
```

## Complete Command Example

For a full production-ready command example with comprehensive workflow, error handling, implementation notes, and statistics reporting, see `optimize-images-example.md`.
