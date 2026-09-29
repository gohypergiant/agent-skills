# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this skill uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2026-09-29

### Changed
- Made the changed-path dependency explicit: inspect the required full three-dot diff before reading nested instruction files that govern those paths.

### Rationale
- The workflow still reads root guidance and the repository template first, preserves the required Git and optional Sem evidence sequence, and ensures path-specific instructions are discovered before source inspection, validation collection, or drafting.

### Version
- Bumped from `1.1.3` to `1.1.4` for a behavior-preserving structural clarification.

## [1.1.3] - 2026-09-29

### Changed
- Aligned the `SKILL.md` plain-technical-English rule with the template and drafting subsection by making its one-term limit explicit.

### Rationale
- The wording preserves the existing reader-need condition and technical-detail requirement while removing ambiguity about the number of terms to define.

### Version
- Bumped from `1.1.2` to `1.1.3` for a behavior-preserving wording clarification.

## [1.1.2] - 2026-09-29

### Changed
- Aligned the template’s one-term instruction with the clearer terminology in `SKILL.md` by replacing “hinge term” with “one term.”

### Rationale
- The change preserves the existing one-term limit and reader-need condition while removing an undefined term from the ready-to-paste template.

### Version
- Bumped from `1.1.1` to `1.1.2` for a behavior-preserving wording clarification.

## [1.1.1] - 2026-09-29

### Added
- A matching technical-plain-English reminder in `SKILL.md` and `assets/pr-description-template.md`.

### Rationale
- The skill now states its prose standard at both the drafting rule and ready-to-paste template, while preserving the requirement for precise, evidence-bounded technical detail.

### Version
- Bumped from `1.1.0` to `1.1.1` for a behavior-guidance clarification.

## [1.1.0] - 2026-09-29

### Added
- Conditional Sem CLI guidance after the required Git branch inspection. It uses `sem diff` as supplementary entity-level evidence and permits `sem impact --tests` for related-test discovery when a changed entity needs it.
- Explicit evidence boundaries: Sem never replaces `git log <base>..HEAD` or `git diff <base>...HEAD`, does not establish test or validation results, and excludes untracked files.

### Rationale
- Semantic entity names and impact relationships can focus source inspection without replacing the full patch or conflating static analysis with executed validation.
- The bounded fallback preserves PR drafting when Sem is unavailable, unsupported, or fails.

### Version
- Bumped from `1.0.0` to `1.1.0` for the new optional evidence capability.

## [1.0.0] - 2026-09-29

### Added
- Initial `pr-description` skill for drafting and reviewing pull request titles and bodies from the complete branch, local repository conventions, and available validation evidence.
- A ready-to-paste PR body template with a compact small-fix form in `assets/pr-description-template.md`.
- A criterion-by-criterion PR-description rubric in `references/pr-description-rubric.md` covering reader context, mechanism, correctness contracts, uncertainty and scope, validation evidence, repository integration, and proportion.
- A source-grounded synthesis of eight specified pre-2023 React PR descriptions in `references/react-pr-findings.md`, including explicit limits on generalizing author-specific rollout and audience assumptions.
- Seed evaluation scenarios for a behavioral change, a bounded API validation fix, and a performance experiment.

### Rationale
- Reviewers, future maintainers, and non-expert integrators need the behavioral problem and the reasoning behind a diff, not a restatement of changed files.
- The skill makes evidence, uncertainty, and scope boundaries explicit while preserving proportional writing for small fixes.

### Version
- Initial release at `1.0.0`.
