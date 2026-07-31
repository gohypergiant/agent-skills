# accelint-qrspi-apply eval coverage summary

Generated 20 default eval cases for non-interactive use in `evals/evals.json`.

## Coverage areas

- Change selection and preflight
  - Explicit change name
  - Inferred change from context
  - Ambiguous change selection requiring user choice
  - Blocked change with missing `tasks.md`

- Task parsing and resume behavior
  - Invalid numbered-list task format rejection
  - Partial-completion resumption from checked slices
  - Missing `Parallelization Strategy` fallback to sequential execution

- Config context loading
  - Successful `openspec/config.yaml` context extraction and injection
  - Safe degradation when config is missing or malformed

- Parallelization safety
  - Happy-path independent parallel slices
  - Shared-file overlap risk causing caution or serial regrouping
  - Vague slice boundaries requiring clarification or serial execution
  - Pause / clear / resume choice between dependency levels

- Living documents and verification
  - Living-doc updates before final verification
  - Efficient skipping when a trivial change does not affect doc scope
  - Mandatory `/opsx:verify` as the final completion gate

- Failure and edge handling
  - No sub-agent support fallback
  - Sub-agent failure blocking dependent slices
  - Circular dependency detection
  - Missing slice reference detection
  - Refusal to implement directly outside `/opsx:apply`

## Intent of the eval set

This set is designed to test the skill's most important behavioral guarantees:

1. It behaves like a QRSPI-specific orchestrator, not a generic implementation assistant.
2. It preserves OpenSpec workflow boundaries by routing execution through `/opsx:apply` and `/opsx:verify`.
3. It parallelizes only when slice boundaries and collision risk make that safe.
4. It resumes correctly from checklist progress and handles pause / resume cleanly.
5. It keeps living document synchronization and verification in the required end-to-end flow.
6. It rejects unsafe shortcuts such as invalid task formats, guessed change names, malformed context injection, or skipped verification.
