# accelint-ts-audit-all eval coverage summary

Created `skills/accelint-ts-audit-all/evals/evals.json` with 25 eval cases.

Coverage areas:
- New-audit initialization, worktree creation, tracking-file setup, and exact verification-command capture
- Directory scanning, exclusion rules, invalid paths, and zero-auditable-file handling
- Resume behavior for matching audits, multiple audit files, and legacy non-worktree audits
- Large-scope session planning and verification-command discovery when commands are not yet known
- Required workflow ordering: ts-testing first, best-practices plus performance in parallel, and documentation last
- Mandatory interactive approval structure, including overview table, full before/after details, and grouped approvals
- Overlapping recommendation handling, property-based test stability rules, and verification-failure handling
- Progress persistence after every step, completion gating, archival to history, and final merge/cleanup flow
- Boundary behavior confirming the skill should not run from generic natural-language requests

The eval set is weighted toward workflow compliance and guardrail enforcement, with both positive and boundary cases.