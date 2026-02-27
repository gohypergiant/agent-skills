# Audit Orchestration Scripts

Automation tools for initializing, tracking, and completing comprehensive TypeScript audits across multiple files and sessions.

## Coverage Model

### How Scripts and Agent Orchestration Work Together

Scripts are an **orchestration layer** that automates repetitive setup, tracking, and finalization tasks. They work together with agent judgment to provide efficient multi-file audits:

**What Scripts CAN Automate (~80% of orchestration overhead)**

Mechanical setup and tracking operations:
- Worktree creation with timestamped branches (exact commands)
- TypeScript file discovery excluding test/benchmark files (pattern match)
- Audit tracking file initialization from templates (exact structure)
- File status updates (Pending → In Progress → Completed)
- Progress percentage calculations (arithmetic)
- Completed file archival to history files (file operations)
- Final merge and cleanup operations (exact git commands)

**What Scripts CANNOT Automate (~20% requiring agent judgment)**

Requires semantic understanding and interactive approval:
- Which changes to apply from each sub-skill audit (user must approve)
- Whether recommendations conflict across parallel skills (requires understanding)
- How to resolve test failures or build errors (context-dependent debugging)
- When to add PERF comments vs when code is self-evident (judgment call)
- Whether property-based test failures are legitimate bugs vs bad test properties (requires analysis)
- Verification command customization for non-standard projects (project-specific knowledge)

### Workflow Integration

1. **Initialize audit** (`init-audit.sh`) → Creates worktree, discovers files, sets up tracking (~800-1,000 tokens saved)
2. **Agent runs sub-skill audits** → Uses scripts from testing/best-practices/performance/documentation skills
3. **Update progress** (`update-audit-status.sh`) → Tracks step/file completion (~300-400 tokens saved)
4. **Agent applies changes interactively** → Two-phase approval pattern with user
5. **Complete audit** (`merge-audit.sh`) → Merges back to original branch, cleans up (~500-600 tokens saved)

Scripts save ~1,600-2,000 tokens per complete multi-file audit by handling mechanical orchestration, allowing agents to focus on interactive change approval and semantic analysis.

---

## Scripts

### init-audit.sh

Initializes a complete audit workflow with isolated worktree, file discovery, and tracking file setup.

**Usage:**
```bash
./scripts/init-audit.sh <target-path> [test-cmd] [build-cmd] [lint-cmd]
```

**Parameters:**
- `target-path` - File or directory to audit (required)
- `test-cmd` - Test command (default: `npm test`)
- `build-cmd` - Build command (default: `npm run build`)
- `lint-cmd` - Lint command (default: `npm run lint`)

**Output:** JSON with:
- Timestamp for tracking files
- Worktree path and audit branch name
- Original branch for merge-back
- Process and history file paths
- List of discovered TypeScript files
- Verification commands

**Example:**
```bash
# Audit entire directory with default commands
./scripts/init-audit.sh src/

# Audit with custom commands
./scripts/init-audit.sh src/utils/ "bun test" "bun run build" "bun run lint"

# Audit single file
./scripts/init-audit.sh src/components/DataTable.tsx
```

**What it does:**
1. Creates timestamped worktree at `.agents/worktrees/audit-YYYYMMDD-HHMMSS`
2. Discovers all `.ts` files excluding `*.test.ts`, `*.spec.ts`, `*.bench.ts`
3. Reads template files from `assets/` directory
4. Creates and populates `audit-process-YYYYMMDD-HHMMSS.md` in `.agents/audit/` (gitignored)
5. Creates and populates `audit-history-YYYYMMDD-HHMMSS.md` for archival
6. Documents verification commands and file list
7. Sets up "Resume Instructions" for first file

**Context savings: ~800-1,000 tokens per audit initialization** (includes automatic template reading and population)

---

### update-audit-status.sh

Updates audit progress tracking for step completion or file completion with archival.

**Usage:**
```bash
# Mark specific step as complete
./scripts/update-audit-status.sh <timestamp> <filename> <step-number> complete

# Mark entire file as complete (archives to history)
./scripts/update-audit-status.sh <timestamp> <filename> complete
```

**Parameters:**
- `timestamp` - Timestamp from init-audit.sh output (required)
- `filename` - Relative path to file being audited (required)
- `step-number` - Step number (1-8) or "complete" for entire file
- `status` - Status marker (default: "complete")

**Output:** JSON with:
- Action type (step_update or file_complete)
- Completion statistics (files completed, percent complete)
- Next file to audit (if any)
- Audit completion status

**Examples:**
```bash
# Mark step 1 complete for a file
./scripts/update-audit-status.sh 20240227-143022 src/utils.ts 1 complete

# Mark entire file complete (moves to history)
./scripts/update-audit-status.sh 20240227-143022 src/utils.ts complete
```

**What it does (file complete):**
1. Extracts current file progress from audit-process file
2. Appends progress to audit-history file with completion date
3. Updates file status: `[ ]` → `[x]` in "Files to Audit" section
4. Updates completion counts and percentages
5. Identifies next pending file
6. Updates "Resume Instructions" with next file
7. Clears "Current File - Detailed Progress" section
8. Updates "Last Updated" timestamp

**Context savings: ~300-400 tokens per file completion**

---

### merge-audit.sh

Completes the audit by merging changes back to original branch and cleaning up worktree.

**Usage:**
```bash
./scripts/merge-audit.sh <timestamp> [commit-message]
```

**Parameters:**
- `timestamp` - Timestamp from init-audit.sh output (required)
- `commit-message` - Custom commit message (optional, has good default)

**Output:** JSON with:
- Merge status (success/failure)
- Original and audit branch names
- Commit and merge hashes
- Cleanup commands to run

**Example:**
```bash
# Merge with default commit message
./scripts/merge-audit.sh 20240227-143022

# Merge with custom message
./scripts/merge-audit.sh 20240227-143022 "refactor: audit src/utils directory"
```

**What it does:**
1. Verifies audit-process and worktree files exist
2. Extracts original branch from audit-process file
3. Commits all changes in worktree (if any)
4. Switches back to original branch
5. Merges audit branch with `--no-ff` (preserves audit history)
6. Updates audit-process file with completion status and merge hash
7. Outputs cleanup commands for worktree and branch removal

**Default commit message:**
```
refactor: complete TypeScript audit

- Improved test coverage across all files
- Applied type safety and best practice improvements
- Optimized performance where beneficial
- Enhanced documentation

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Note:** The script outputs cleanup commands but does NOT automatically run them. This allows you to verify the merge before removing the worktree:
```bash
# After successful merge, clean up
git worktree remove .agents/worktrees/audit-20240227-143022
git branch -d audit/20240227-143022
```

**Context savings: ~500-600 tokens per audit finalization**

---

## Typical Workflow

```bash
# 1. Initialize audit
./scripts/init-audit.sh src/ > init-result.json
TIMESTAMP=$(jq -r .timestamp init-result.json)
WORKTREE=$(jq -r .worktree_path init-result.json)

# 2. Switch to worktree
cd $WORKTREE

# 3. Agent runs sub-skill audits for each file
#    /skill accelint-ts-testing <file>
#    /skill accelint-ts-best-practices <file>
#    /skill accelint-ts-performance <file>
#    /skill accelint-ts-documentation <file>

# 4. Mark file complete after all 8 steps
cd <original-repo-root>
./scripts/update-audit-status.sh $TIMESTAMP src/file1.ts complete

# 5. Repeat for remaining files...

# 6. After all files complete, merge back
./scripts/merge-audit.sh $TIMESTAMP

# 7. Clean up worktree
git worktree remove .agents/worktrees/audit-$TIMESTAMP
git branch -d audit/$TIMESTAMP
```

---

## Impact

**Context Reduction:**
- Audit initialization: ~800-1,000 tokens saved
- Progress tracking per file: ~300-400 tokens saved
- Audit finalization: ~500-600 tokens saved
- **Total per complete audit: ~1,600-2,000 tokens saved**

**Time Savings:**
- Manual audit setup: 15-20 minutes
- Automated audit setup: 30 seconds
- **90%+ time reduction** for audit initialization and tracking

**Error Reduction:**
- Manual worktree/branch management: error-prone (typos, wrong branches)
- Script-based automation: consistent, repeatable
- **Eliminates common setup errors** (missing directories, wrong timestamps, broken tracking file structure)

**Before:**
```markdown
To start an audit:
1. Create timestamp
2. Create worktree with correct naming
3. Discover all TypeScript files (exclude tests)
4. Copy audit-process template
5. Fill in all template variables
6. Create audit-history template
7. Document verification commands
8. Set up file list with checkboxes
... [continues for 30+ more manual steps]
```

**After:**
```bash
./scripts/init-audit.sh src/
```

---

## Design Principles

1. **Idempotent where possible** - Scripts check for existing state before creating new resources
2. **Clear error messages** - All failures explain what went wrong and how to fix it
3. **Structured output** - JSON format enables programmatic processing and chaining
4. **Non-destructive defaults** - Scripts output cleanup commands but don't auto-delete worktrees
5. **Defensive bash programming** - All scripts use `set -euo pipefail` for safety
6. **Template-driven** - Uses existing template files to ensure consistency

---

## Requirements

- **Bash** (compatible with sh/zsh)
- **Git** with worktree support (Git 2.5+)
- **jq** (for parsing JSON output from init-audit.sh)
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` or `yum install jq`
- **grep, sed** (standard on Unix systems)

---

## Limitations

- **Requires git repository** - Worktree feature requires git
- **Single-repo only** - Cannot audit across multiple repositories
- **No remote sync** - Scripts do not push to remote (by design - user controls this)
- **Manual sub-skill invocation** - Agent must still call each sub-skill interactively
- **No rollback automation** - If audit needs to be abandoned, manual git reset required

For interactive change approval and semantic analysis, agent manual review is necessary following the skill workflow.

---

## Maintenance

All scripts use `set -euo pipefail` for defensive Bash programming and include detailed comments explaining their purpose and limitations.

To add new orchestration capabilities:
1. Identify repetitive manual workflow patterns
2. Create script in `scripts/` directory
3. Use JSON output format for programmatic chaining
4. Update this README with usage documentation
5. Update SKILL.md to reference the new script
