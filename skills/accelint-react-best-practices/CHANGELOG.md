# Changelog

## [1.5.0] - 2026-03-19

### Added
- **New re-render optimization references** for advanced hook patterns
  - `split-combined-hooks.md` - Split hooks with independent dependencies to avoid unnecessary recomputation
  - `use-deferred-value.md` - Use useDeferredValue to keep input responsive during expensive renders
  - Rationale: These patterns address common performance issues with combined hooks and expensive derived state

- **Enhanced Quick Diagnostic Guide** in AGENTS.md
  - Added "Hook runs expensive computation unnecessarily → 1.14 Split Combined Hook Computations"
  - Added "useDeferredValue" as alternative to "Typing/input feels sluggish"

- **Expanded trigger keywords** in frontmatter description
  - Added "useDeferredValue, combined hooks" for better skill activation

### Changed
- Updated SKILL.md re-render optimizations section
  - Added references to split-combined-hooks.md and use-deferred-value.md
  - Positioned under existing re-render optimizations, before "Rendering Performance"

- Updated AGENTS.md with new pattern entries
  - 1.14 Split Combined Hook Computations
  - 1.15 Use useDeferredValue for Expensive Derived Renders

- Updated compound-patterns.md to integrate new patterns
  - Example 1 (Search Component): Added useDeferredValue as alternative approach to useTransition with comparison guide
  - Example 4 (Form Validation): Explicitly called out 1.14 Split Combined Hook pattern, which was already demonstrated but not labeled
  - Added inline comments clarifying where split-combined-hooks pattern is applied

### Version
- Bumped from 1.4 → 1.5

## [1.4.0] - 2026-03-18

### Added
- **New "Using Skill Patterns Appropriately" section** to improve flexibility
  - Encourages presenting reference patterns while mentioning alternative approaches
  - Guides agents to consider user's React version, project complexity, and team preferences
  - Suggests simpler solutions for basic cases even when not in reference files
  - Example: SSR hydration can use mounted flag pattern for simple cases vs synchronous script
  - Rationale: Evaluation showed skill could be overly prescriptive by only suggesting one solution from reference files

### Version
- Bumped from 1.3 → 1.4

## [1.3.0] - 2026-03-18

### Changed - Structural Improvements
- **CRITICAL FIX:** Removed 80 lines of activation knowledge from SKILL.md body (lines 14-94)
  - "When to Activate This Skill" section → moved to description only
  - "When NOT to Use This Skill" section → moved to description only
  - "Example Trigger Phrases" section → moved to description only
  - Rationale: Activation knowledge belongs ONLY in frontmatter description, not skill body

- **Added "NEVER Do React" section** with 8 critical anti-patterns and expert reasoning
  - Inline component definitions causing remounts
  - Unnecessary subscriptions to searchParams/localStorage
  - Object/array dependencies in effects
  - useState + useEffect for derived state
  - Client-only state in SSR causing hydration mismatches
  - Deprecated forwardRef usage
  - Inline props breaking memoization
  - User interaction logic in effects

- **Enhanced description** to be more "pushy" about triggering
  - Added "ALWAYS use this skill when working with any React code"
  - Expanded trigger keywords: useEffect, useState, useMemo, useCallback, memo, SSR, Next.js
  - Increased from 344 chars to 640 chars for better coverage

### Fixed
- Corrected skill name reference in SKILL.md line 168 (`/accelint-ts-best-practices` → `/accelint-react-best-practices`)
- Author metadata confirmed as "accelint" (consistent across all files)

### Added
- Created comprehensive evaluation test suite (`evals/evals.json`)
  - 8 realistic test prompts covering all major React patterns
  - Inline component focus loss debugging
  - Infinite effect loop resolution
  - SSR hydration mismatch fixes
  - Performance optimization for large datasets
  - Long list rendering optimization
  - Stale closure bugs
  - React 19 migration patterns
  - Effect re-subscription issues

### Version
- Bumped from 1.2 → 1.3

## [1.2.0] - Previous
- Initial comprehensive React best practices skill
- 30+ optimization patterns across re-renders, effects, SSR, React 19
- Progressive disclosure structure with AGENTS.md + references/
- React Compiler awareness guide
- Quick reference checklists
- Helper detection scripts
