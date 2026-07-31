# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-07-30

### Fixed
- Tightened `SKILL.md` trigger and routing language so the skill more clearly targets TS/JS code-health work and redirects performance-heavy and documentation-heavy tasks to the adjacent specialized skills.
- Updated `README.md` and `references/quick-start.md` to remove stale performance-oriented framing and broken references to non-existent files, replacing them with examples grounded in the current reference set.
- Added `evals/evals.json` with coverage for the skill's core rule areas plus boundary cases that should redirect to `accelint-ts-performance` or `accelint-ts-documentation`.
- Applied a behavior-preserving prose pass across `SKILL.md`, `AGENTS.md`, and selected `references/*.md` files to improve scanability, clarify explicit error-handling expectations, fix boundary-validation examples, repair malformed inline-code tokens, and remove stale cross-references.

### Version
- Bumped from 1.2.1 → 1.2.2

## [1.2.1] - 2026-05-18

### Fixed
- **Added missing numbered header** to bundler-paths.md reference
  - Changed from `## Prefer Statically Analyzable Paths` to `# 2.4 Bundler-Friendly Paths` with subtitle
  - Rationale: All reference files should have numbered H1 titles matching their section number in AGENTS.md for consistency and easy cross-referencing

### Version
- Bumped from 1.2.0 → 1.2.1

## [1.2.0] - 2026-05-18

### Added
- **New reference: bundler-paths.md** - Guidance on writing statically analyzable import and file-system paths
  - Rationale: Build tools (Next.js, Vite, webpack, rollup, esbuild) require static analysis for optimal bundling. Dynamic path composition causes larger bundles, slower builds, worse cold starts, and increased memory usage.
  - Covers both import() paths and fs path operations
  - Includes ❌/✅ examples and links to official documentation

### Changed
- Updated SKILL.md to reference bundler-paths.md in TypeScript section
- Updated AGENTS.md section 2.4 with bundler-paths rule summary

### Fixed
- Grammar correction in bundler-paths.md line 54: "statically analyze" → "statically analyzes"

### Version
- Bumped from 1.1.0 → 1.2.0

## [1.1.0] - 2026-05-XX

Initial documented version with comprehensive TypeScript/JavaScript best practices.
