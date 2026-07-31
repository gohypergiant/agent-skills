# Changelog

## [1.8.4] - 2026-07-31

### Changed
- Tightened `SKILL.md` body routing and rule summaries while preserving behavior and frontmatter
  - Rationale: Static audit evidence showed the root skill file was carrying more explanatory material than needed even though the package already has `AGENTS.md` and focused `references/` files for progressive disclosure.
- Tightened `AGENTS.md` prose around the React Compiler decision gate and guide usage without changing rule coverage
  - Rationale: The Stage 4 prose audit found compressed wording that made the compiler gate slightly harder to scan than necessary.
- Updated `evals/assertions.md` to match the current 16-case eval set
  - Rationale: Direct repository inspection showed documentation drift between `evals/evals.json` and `evals/assertions.md`, which reduced maintainability and made the active test surface less clear.

### Version
- Bumped from 1.8.3 → 1.8.4

## [1.8.3] - 2026-07-30

### Changed
- Tightened skill prose across the root artifact set for clearer React-only scope, cleaner audit instructions, and more consistent local wording
  - Rationale: The skill already had the correct behavior, but several files still used uneven phrasing, inconsistent emphasis, or less direct local structure that made the guidance harder to scan than necessary.
- Tightened local structure in behavior-bearing support files under `references/` and `scripts/README.md`
  - Rationale: Folder-level prose cleanup should keep the inspected artifact set internally consistent, not only the root files.

### Version
- Bumped from 1.8.2 → 1.8.3

## [1.8.2] - 2026-07-30

### Changed
- Refined the frontmatter description for tighter React-only triggering, broader React task coverage, and clearer non-React boundaries
  - Rationale: The eval set emphasizes React-specific debugging, audits, React Compiler branching, React 19 patterns, and a strong non-trigger boundary for backend-only work. The previous description covered many triggers but was lighter on audit language, explicit optimization/debugging verbs, and non-React exclusions.

### Version
- Bumped from 1.8.1 → 1.8.2

## [1.8.1] - 2026-07-30

### Changed
- Tightened the frontmatter description to follow skill-manager trigger guidance more closely
  - Rationale: The prior description was broad and imperative ("ALWAYS use") but weaker on explicit use-when framing and trigger specificity, which makes activation quality harder to maintain.
- Clarified the report-template section to scope it to audits and multi-issue reviews only
  - Rationale: The previous wording mixed audit workflow with direct-fix requests and included categories that did not match this React-focused skill.
- Refined the performance philosophy section to foreground React Compiler checks before manual memoization guidance
  - Rationale: This keeps the top-level decision framework aligned with the skill's existing compiler-awareness guidance.

### Version
- Bumped from 1.8.0 → 1.8.1

## [1.8.0] - 2026-05-18

### Changed
- **Updated output report template** to inline examples from reference files
  - Rationale: User feedback requested inline examples instead of just links for better self-contained audit reports (useful in GitHub PR reviews and Claude Code audits)
  - Template now includes: ❌ Anti-pattern Example, ✅ Correct Pattern, and Recommended Fix for This Code sections
  - Each issue shows typical bad code, typical good code, then applies pattern to user's specific code

### Evaluation Results
- **Iteration 2: 100% pass rate (8/8 tests, 24/24 assertions) - Grade A**
- Improvement: +12.5% over iteration-1 (87.5% → 100%)
- todolist-audit now passes with comprehensive severity categorization
- All test cases demonstrate strong pattern recognition across React anti-patterns
- Average time: 38.6s (vs 31.4s in iter-1, increase from more thorough audits)
- Average tokens: 23,609 (stable, similar to iter-1's 23,268)

### Version
- Bumped from 1.7.0 → 1.8.0

## [1.7.0] - 2026-05-18

### Changed
- **CRITICAL FIX:** Moved React Compiler check to the top of both SKILL.md and AGENTS.md
  - Rationale: Agents were suggesting manual memoization without first checking if React Compiler is enabled. Compiler awareness was buried in "Important Notes" section (line 160+), causing agents to miss it.
  - Impact: Agents will now check for React Compiler first before suggesting memo/useMemo/useCallback optimizations

### Added
- New "Before Optimizing Performance, Ask" section in SKILL.md with 3-step checklist
  - Does project use React Compiler?
  - Is this actually a performance problem?
  - What's the scale?
- Prominent "⚡ FIRST: Check React Compiler" section at top of AGENTS.md

### Evaluation Results
- Iteration 1: 100% pass rate (8/8 tests) after fixing permission issues
- Key strengths: React-specific terminology, modern patterns (useEffectEvent, useDeferredValue), multiple solution approaches
- Trade-off: 50% more time, 31% more tokens vs baseline, but significantly better explanations and depth

### Version
- Bumped from 1.6.0 → 1.7.0

## [1.6.0] - 2026-05-18

### Added
- **New Advanced Pattern reference: effect-event-deps.md**
  - Pattern 3.5: Do Not Put Effect Events in Dependency Arrays
  - Explains why Effect Event functions have unstable identity and must not be in deps arrays
  - Includes ❌/✅ examples showing incorrect (with handleConnected in deps) vs correct (only reactive values)
  - React Compiler note confirming manual optimization required
  - Rationale: Critical guidance for React 19.2+ useEffectEvent adoption — common mistake to treat Effect Events like regular callbacks

### Changed
- **Updated SKILL.md** to reference new effect-event-deps.md in Advanced Patterns section
- **Updated AGENTS.md** with 3.5 entry and one-line summary
- **Formatted effect-event-deps.md** with numbered title (3.5) to match existing reference structure

### Version
- Bumped from 1.5 → 1.6

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
