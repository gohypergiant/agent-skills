# Eval Cases Report

- Generated 7 eval cases.
- Coverage areas:
  - Audit-only mode for scoped auth/API review
  - Implementation mode for auth hardening fixes
  - Large-repo scoping with Critical/High prioritization
  - File-upload security assessment
  - SSRF-focused outbound fetch review
  - Dependency and vulnerable-components triage
  - Near-miss maintainability request that should not trigger the skill
- Result: the eval set now tests both trigger precision and workflow behavior, especially scope control and audit-vs-fix mode selection.
