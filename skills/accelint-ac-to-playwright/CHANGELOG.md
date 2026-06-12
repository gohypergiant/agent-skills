# Changelog

All notable changes to the accelint-ac-to-playwright skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-09

### Changed
- **Major refactor: Progressive disclosure pattern with subagent-based validation**
  - Rationale: Improved skill performance by reducing context bloat and enabling parallel validation; original SKILL.md was loading all validation rules upfront regardless of need
  - Split SKILL.md into focused mode files:
    - `references/assessment-mode.md` - AC quality validation workflow
    - `references/conversion-mode.md` - Test generation workflow
  - Created 6 specialized subagent validators (all run in parallel):
    - `references/validate-targets.md` - Format + controlled vocabulary validation using target-validator.ts
    - `references/validate-gherkin-structure.md` - Comprehensive .feature file structure validation
    - `references/validate-bullet-format.md` - Markdown bullet-style AC format validation
    - `references/validate-preconditions.md` - Given step context setup validation
    - `references/validate-actions.md` - When step action verb and parameter validation
    - `references/validate-assertions.md` - Then step explicitness and measurability validation
  - Standardized input/output formats across all validators with line numbers for precise error reporting
  - SKILL.md now serves as high-level orchestrator with mode detection, loading detailed workflows only when needed

### Version
- Bumped from 1.1.9 → 2.0.0

## [1.1.10] - 2026-07-09

### Changed
- Updated vulnerable dependencies
  - Rationale: Security maintenance to address known vulnerabilities

### Version
- Bumped from 1.1.9 → 1.1.10

## [1.1.9] - 2026-06-04

### Added
- CHANGELOG.md with complete version history from 0.5 through 1.1.8 (#115)
  - Rationale: Provides transparency into skill evolution and rationale for changes; required per repository conventions

### Version
- Bumped from 1.1.8 → 1.1.9

## [1.1.8] - 2026-05-29

### Fixed
- Removed `any` type usage in codebase (#113)
  - Rationale: Improves type safety by enforcing explicit typing
- Replaced null return value with -1 in error cases (#113)
  - Rationale: Makes error states more explicit and easier to handle

### Version
- Bumped from 1.1.7 → 1.1.8

## [1.1.7] - 2026-05-29

### Changed
- Updated vulnerable dependencies (#112)
  - Rationale: Security maintenance to address known vulnerabilities

### Version
- Bumped from 1.1.6 → 1.1.7

## [1.1.6] - 2026-05-27

### Added
- Missing visibility assertion test (#111)
  - Rationale: Improves test coverage for visibility checking functionality

### Version
- Bumped from 1.1.5 → 1.1.6

## [1.1.5] - 2026-05-27

### Changed
- Updated `selectOption` to use label-based selection instead of value (#110)
  - Rationale: More intuitive methodology that matches how users think about dropdown options

### Version
- Bumped from 1.1.4 → 1.1.5

## [1.1.4] - 2026-05-26

### Changed
- Improved `sourceDescription` handling (#109)
  - Rationale: Eliminates fragile regex parsing of sourceDescription from generated code; passes data through pipeline directly instead of round-tripping through TypeScript annotations

### Version
- Bumped from 1.1.3 → 1.1.4

## [1.1.3] - 2026-05-26

### Changed
- Enhanced visibility pairing validation (#108)
  - Rationale: Allows multiple elements to change visibility from single action; validator now groups by target and counts only actions between pairs instead of requiring exactly 2 steps apart

### Version
- Bumped from 1.1.2 → 1.1.3

## [1.1.2] - 2026-05-20

### Fixed
- Made `notvisible` assertion properly handle cases where 0 elements are present (#105)
  - Rationale: Previously failed when element didn't exist in DOM; now correctly passes since non-existent elements are obviously not visible, aligning with Playwright's `toBeVisible()` behavior where absence equals not visible

### Version
- Bumped from 1.1.1 → 1.1.2

## [1.1.1] - 2026-05-18

### Added
- TypeScript type inference from Zod schemas using `z.infer` (#103)
  - Rationale: Eliminates manual type definitions that duplicate schema structure; single source of truth reduces maintenance burden and prevents schema/type drift

### Version
- Bumped from 1.1.0 → 1.1.1

## [1.1.0] - 2026-05-18

### Added
- Shared test fixtures extraction (#102)
  - Rationale: Reduces duplication across test files and ensures consistency; common test data was being redefined in multiple places

### Version
- Bumped from 1.0.6 → 1.1.0

## [1.0.6] - 2026-05-18

### Added
- Case-insensitive keyboard key handling (#100)
  - Rationale: Users shouldn't have to remember exact capitalization for key names; "Enter", "enter", and "ENTER" should all work identically

### Version
- Bumped from 1.0.5 → 1.0.6

## [1.0.5] - 2026-05-18

### Added
- Numpad key support (#99)
  - Rationale: Enables testing of numeric keypad interactions; applications often have different handlers for numpad vs top-row numbers

### Version
- Bumped from 1.0.4 → 1.0.5

## [1.0.4] - 2026-05-18

### Added
- Target validation for actions (#98)
  - Rationale: Ensures all actions specify valid targets using area/component/intent pattern; catches malformed acceptance criteria before test generation

### Version
- Bumped from 1.0.3 → 1.0.4

## [1.0.3] - 2026-05-18

### Added
- Tag validation for Gherkin scenarios (#97)
  - Rationale: Validates @tag syntax and prevents malformed tags in Gherkin files; invalid tags cause test runner failures that are hard to debug

### Version
- Bumped from 1.0.2 → 1.0.3

## [1.0.2] - 2026-05-12

### Fixed
- Improved regex handling in URL expectations (#96)
  - Rationale: Regular expressions in URL matchers were being incorrectly escaped; enables flexible URL matching for dynamic routes and query parameters

### Version
- Bumped from 1.0.1 → 1.0.2

## [1.0.1] - 2026-05-08

### Changed
- Removed outdated example files (#91)
  - Rationale: Examples were no longer representative of current functionality; prevents confusion from outdated patterns

### Version
- Bumped from 1.0.0 → 1.0.1

## [1.0.0] - 2026-03-19

### Changed
- Promoted skill to stable 1.0 release (#79, #80)
  - Rationale: Skill considered production-ready after comprehensive feature development

### Version
- Bumped from 0.12 → 1.0.0

## [0.12] - 2026-03-05

### Added
- Drag composed action (#76)
  - Rationale: Enables more efficient testing of mouse drag interactions; common UI pattern that requires coordinated mouseDown → mouseMove → mouseUp

### Version
- Bumped from 0.11 → 0.12

## [0.11] - 2026-03-05

### Added
- Schema validation for paired actions (#75)
  - Rationale: Enforces that certain actions must appear in pairs; prevents malformed test plans where keyDown has no matching keyUp
- Enforcement of mouseDown/mouseUp pairing (#75)
  - Rationale: Mouse button must be released after being pressed
- Enforcement of keyDown/keyUp pairing (#75)
  - Rationale: Key must be released after being pressed
- Enforcement of expectVisible/expectNotVisible pairing validation (#75)
  - Rationale: An element should be verified to be the opposite visibility before the action that changes its visiblility to prevent false greens

### Version
- Bumped from 0.10 → 0.11

## [0.10] - 2026-02-26

### Added
- `reload` action for page refresh (#70)
  - Rationale: Enables testing of scenarios requiring page reload
- `hover` action for mouse hover interactions (#70)
  - Rationale: Common UI pattern for tooltips, dropdowns, and interactive elements

### Version
- Bumped from 0.9 → 0.10

## [0.9] - 2026-02-26

### Added
- Console logs to Playwright test reports (#69)
  - Rationale: Improves debugging by capturing browser console output; frontend errors often appear in console, not test output

### Version
- Bumped from 0.8 → 0.9

## [0.8] - 2026-02-26

### Added
- Assessment mode to evaluate AC quality before conversion (#67)
  - Rationale: Allows validation without full test generation; provides faster feedback on AC readiness for automation

### Version
- Bumped from 0.7 → 0.8

## [0.7] - 2026-02-26

### Added
- Mouse actions (#66)
  - `mouseClick` action
  - `mouseMove` action
  - `mouseDown` and `mouseUp` actions
  - `doubleClick` action
  - `scroll` action
  - Rationale: Enables precise coordinate-based interactions and scrolling for scenarios where element-based selectors are insufficient or unavailable

### Version
- Bumped from 0.6 → 0.7

## [0.6] - 2026-02-26

### Added
- Keyboard actions (#65)
  - `press` action
  - `keyDown` and `keyUp` actions
  - Rationale: Enables keyboard modifier combinations (Shift+g, Control+Enter) and single key presses required for complex keyboard-driven workflows

### Version
- Bumped from 0.5 → 0.6

## [0.5] - 2026-02-20

### Added
- Initial skill creation with GitHub Actions setup (#40)
  - Rationale: Establishes foundational AC-to-Playwright conversion capability

### Version
- Initial release as 0.5
