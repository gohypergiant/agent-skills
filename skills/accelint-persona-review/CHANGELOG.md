# Changelog

## [1.3.0] - 2026-07-30

### Changed
- **Audit-driven trigger and workflow clarity improvements** — refined the skill and local artifact set after a full persona-review audit
  - Expanded the trigger description beyond narrow Figma-only wording to better cover operator-interface, workflow-fit, and role-specific review requests
  - Clarified persona selection behavior, including loose role-name mapping, ambiguity handling, and single-persona review discipline unless comparison is requested
  - Strengthened evidence handling so reviews distinguish persona evidence, design evidence, supporting-doc evidence, and inference
  - Tightened fallback behavior for screenshot-only reviews and missing Outline context, with explicit scope-limit callouts
  - Improved output expectations around operational summary, highest-impact findings, actionable recommendations, and uncertainty disclosure
  - Tightened README and local reference prose for consistency and scanability without changing behavior

### Added
- **Default eval coverage** — added a generated eval set for non-interactive validation of trigger quality and workflow fidelity
  - Covers Figma URL reviews, screenshot fallback, Outline-unavailable fallback, ambiguous persona handling, invalid persona handling, and evidence-discipline scenarios
  - Includes negative boundary cases for generic visual-polish requests and non-design SOP-writing requests

### Version
- Initial tracked changelog entry
- Bumped from 1.2.0 → 1.3.0
