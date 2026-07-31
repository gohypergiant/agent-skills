# Eval Cases Report

Generated default non-interactive eval coverage for `accelint-onboard-openspec`.

## Coverage summary

- Total eval cases: 17
- Primary create-mode coverage: 3 cases
- Import-mode coverage: 4 cases
- Refresh-mode coverage: 3 cases
- Separation-of-concerns and companion-skill boundaries: 3 cases
- Smart defaults, inference, and workflow guardrails: 4 cases

## Case list

1. `create-from-scratch-for-fresh-repo` — Fresh create flow with explicit mode detection and full interview kickoff.
2. `create-mode-checks-architecture-doc-first` — Related-document discovery, especially `ARCHITECTURE.md`, before config-state detection.
3. `near_blank_existing_config_falls_back_to_create` — Near-empty config handling with overwrite confirmation.
4. `import-mode-presents-restructure-append-dry-run-options` — Import mode entry and mandatory A/B/C choice presentation.
5. `import-restructure-flags-behavioral-content-for-agents-md` — Restructure path plus separation of project DNA from behavioral guidance.
6. `import-append-preserves-existing-custom-content` — Append path preserving existing config content.
7. `import-dry-run-makes-no-filesystem-changes` — Dry-run path with explicit no-write behavior.
8. `refresh-mode-with-external-findings` — Refresh flow with `findings:` parsing and merged findings announcement.
9. `refresh-mode-targets-unresolved-todos` — Targeted follow-up for unresolved `# TODO: fill in` markers.
10. `refresh-drift-detection-looks-at-repo-signals` — Drift detection across workspace, TS config, CI, and package structure.
11. `separation-of-concerns-redirects-behavioral-content` — Redirect behavioral content to `AGENTS.md` / companion skill.
12. `smart-defaults-for-recognized-stack` — Stack-aware confirmation prompts for Next.js, Vitest/RTL, and Prisma.
13. `parallel-inference-is-explicitly-preferred` — Phase 3 four-domain parallel discovery expectations.
14. `preview-before-write-and-yaml-validation-are-mandatory` — Hard workflow guardrails even when the user asks to skip them.
15. `yaml-safety-rules-handle-special-characters` — YAML quoting and validation safety coverage.
16. `boundary-case-agent-behavior-request-should-not-use-this-skill` — Negative boundary case that should route to `accelint-onboard-agents`.
17. `boundary-case-architecture-doc-request-should-route-elsewhere` — Negative boundary case that should route to architecture docs rather than OpenSpec config.

## Notes

- The eval set is designed for non-interactive benchmarking of skill selection and workflow fidelity.
- Expectations emphasize mode detection, preview-before-write, separation of concerns, refresh semantics, parallel inference, and YAML safety because those are the skill's highest-risk behaviors.
- Boundary cases are included so the evals can catch over-triggering into adjacent workflows.
