---
description: Generate or update README.md for a package using codebase analysis
argument-hint: [path]
skills: readme-writer
---

# create-readme

Generate or update README documentation for a package by analyzing its codebase. Uses the readme-writer skill to recursively parse code, identify public APIs, and produce human-sounding documentation with practical examples.

## Arguments

- `path` (string, optional): Target path for README generation/update
  - Default: Current working directory
  - Accepts three forms:
    1. **No argument**: Uses current working directory as package root
    2. **Directory path**: Uses specified directory as package root
    3. **README file path**: Updates the specified README, uses its parent as package root
  - Examples: `packages/my-lib`, `./README.md`, `/path/to/project/README.md`

## Workflow

### Phase 1: Path Resolution

1. Determine target from argument:
   - **No argument**: Use current working directory
   - **Directory path**: Use specified directory
   - **README file path** (ends with `README.md` or `readme.md`): Use file's parent directory
2. Resolve package root directory from target
3. Determine README path: `{package_root}/README.md`
4. Check if README already exists → sets mode to "update" or "create"

### Phase 2: Package Discovery

5. Verify package root is valid:
   - Check for `package.json`, `Cargo.toml`, `pyproject.toml`, or similar manifest
   - If no manifest found, warn but continue (may be a sub-package or simple project)
6. Detect package manager from lockfile:
   - `pnpm-lock.yaml` → pnpm
   - `package-lock.json` → npm
   - `yarn.lock` → yarn
   - `bun.lockb` → bun

### Phase 3: Codebase Analysis

7. Identify entry points:
   - Check `main`, `module`, `exports` fields in package.json
   - Look for `index.ts`, `index.js`, `main.ts`, `main.js`
8. Map public API:
   - Find all exported functions, classes, types, constants
   - Extract JSDoc/TSDoc comments for descriptions
9. Trace dependencies:
   - List direct dependencies from manifest
   - Identify peer dependencies and their requirements
10. Find existing examples:
    - Check `examples/` directory
    - Look for usage patterns in test files
    - Extract inline documentation

### Phase 4: README Assessment (Update Mode Only)

11. If mode is "update", compare existing README against codebase:
    - Identify undocumented exports
    - Find stale examples using deprecated patterns
    - Check for missing sections (installation, quick start, API)
    - Verify commands match current scripts
12. Present gap analysis to user:
    - List missing documentation items
    - Highlight outdated content
    - Suggest structural improvements

### Phase 5: README Generation

13. Generate or update README following readme-writer structure:
    - Title and description from package manifest
    - Installation instructions with detected package manager
    - Quick Start with minimal working example
    - API Reference for all public exports
    - Examples section with practical use cases
    - Contributing and License sections
14. In update mode, preserve user-authored content where appropriate
15. Apply humanizer skill to remove AI writing patterns
16. Present draft to user for review

### Phase 6: Finalization

17. Apply user feedback and revisions
18. Write README.md to resolved path
19. Display completion statistics

## Statistics Reporting

Output includes:
- Package name and resolved README path
- Mode (created / updated)
- Input type (current directory / directory path / README path)
- Sections generated/updated
- Public API items documented
- Examples included
- Gap analysis results (if updating)

Example (new README from directory):
```
Created README: packages/my-lib/README.md

Input: directory (packages/my-lib)
Mode: create (no existing README)

Documentation coverage:
- Public exports documented: 12/12
- Sections: 7 (Title, Installation, Quick Start, API, Examples, Contributing, License)
- Examples: 4 code blocks
- Package manager: pnpm

Completed in 45s
```

Example (updated README from file path):
```
Updated README: packages/my-lib/README.md

Input: file (packages/my-lib/README.md)
Mode: update (existing README found)

Changes made:
- Added 3 missing exports to API Reference
- Updated installation command (npm → pnpm)
- Added 2 new examples for recently added functions
- Fixed stale import paths in Quick Start

Gap analysis:
- Previously missing: 3 exports, 1 section
- Now documented: 100% coverage

Completed in 32s
```

Example (current directory, existing README):
```
Updated README: ./README.md

Input: current directory
Mode: update (existing README found)

Changes made:
- Added new `parseConfig` function to API Reference
- Updated Quick Start to use new async API

Completed in 28s
```

## Examples

```bash
# Current directory - create or update README.md
create:readme

# Directory path - create or update README.md in that directory
create:readme packages/utils

# Absolute directory path
create:readme /path/to/my-project

# Specific README file path - update that README
create:readme packages/utils/README.md

# Relative README file path
create:readme ./README.md
```

## Error Handling

**Path Not Found:**
```
Error: Path "packages/my-lib" not found
- Check the path and try again
- Use absolute path if relative path is ambiguous
```

**README File Not Found (when file path provided):**
```
Error: README file "packages/my-lib/README.md" not found
- File path provided but README does not exist
- Use directory path instead to create a new README: packages/my-lib
```

**No Package Manifest:**
```
Warning: No package.json found in target directory
- Proceeding with limited analysis
- Consider adding a package.json for better documentation
```

**Read Permission Denied:**
```
Error: Cannot read path "/path/to/project"
- Check file permissions
- Ensure you have read access to the path
```

## Integration with readme-writer Skill

This command uses the readme-writer skill for:

1. **Codebase Analysis**: Recursive parsing from README location
2. **Structure Guidelines**: Section ordering and content requirements
3. **Writing Principles**: Human-sounding, thorough documentation
4. **Template Application**: Consistent README format
5. **Humanizer Integration**: Removing AI writing patterns from output

The readme-writer skill automatically loads its reference materials:
- `readme-structure.md` for section organization
- `writing-principles.md` for documentation style
- `codebase-analysis.md` for code parsing guidance
- `readme-template.md` for consistent formatting

## Notes

- Path argument accepts directories or README file paths
- When a README file path is provided, it must exist (use directory path to create new)
- Existing README content is preserved where appropriate during updates
- The humanizer skill is required for final output quality
- Supports JavaScript/TypeScript, Python, Rust, and Go projects
- For monorepos, run against individual packages rather than root
