# Changelog

## [1.0.0] - 2026-05-20

### Added
- Initial release of accelint-core-migrate skill
- QRSPI-based workflow for migrating portfolio features to Core
- Context isolation to prevent direct copying of portfolio implementations
- Specialized questions phase focused on generalization concerns
- Research phase that compares portfolio design against Core's current state
- Design phase that adapts portfolio features to be portfolio-agnostic
- Vertical slicing enforcement for task breakdown
- Two mandatory human checkpoints (design review and task review)
- Error handling for portfolio-specific dependencies that don't exist in Core
- Parallelization strategy generation
- Support for both file paths and pasted content as input
- `references/edge-cases.md` for cataloging known portfolio → Core dependency patterns
  - Template examples included as markdown comments
  - Loaded during research and design phases to provide known migration patterns
  - Handles "known knowns" while checkpoints handle "unknown unknowns"

### Rationale
- Created to address the specific use case of taking features developed independently
  in portfolio repos and making them generic for the Core repository
- Follows the proven QRSPI methodology (from accelint-qrspi-propose) but adapted
  for cross-repo migration rather than greenfield feature planning
- Emphasizes generalization over direct copying by keeping portfolio docs out of
  context during research and design phases
- Surfaces portfolio-specific dependencies explicitly during design review to
  prevent assumptions about what exists in Core

### Version
- Initial version 1.0.0
