# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this skill uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-29

### Added
- Initial `pr-description` skill for drafting and reviewing pull request titles and bodies from the complete branch, local repository conventions, and available validation evidence.
- A ready-to-paste PR body template with a compact small-fix form in `assets/pr-description-template.md`.
- A criterion-by-criterion PR-description rubric in `references/pr-description-rubric.md` covering reader context, mechanism, correctness contracts, uncertainty and scope, validation evidence, repository integration, and proportion.
- A source-grounded synthesis of eight specified pre-2023 React PR descriptions in `references/react-pr-findings.md`, including explicit limits on generalizing author-specific rollout and audience assumptions.
- Seed evaluation scenarios for a behavioral change, a bounded API validation fix, and a performance experiment.
- Optional Sem CLI guidance after the required Git branch inspection. It uses `sem diff` as supplementary entity-level evidence and permits `sem impact --tests` for related-test discovery when a changed entity needs it.
- Explicit evidence boundaries: Sem never replaces `git log <base>..HEAD` or `git diff <base>...HEAD`, does not establish test or validation results, and excludes untracked files.
- A matching technical-plain-English reminder in `SKILL.md` and `assets/pr-description-template.md`.

### Changed
- Aligned the template’s one-term instruction with the clearer terminology in `SKILL.md` by replacing “hinge term” with “one term.”
- Aligned the `SKILL.md` plain-technical-English rule with the template and drafting subsection by making its one-term limit explicit.
- Made the changed-path dependency explicit: inspect the required full three-dot diff before reading nested instruction files that govern those paths.

### Rationale
- Reviewers, future maintainers, and non-expert integrators need the behavioral problem and the reasoning behind a diff, not a restatement of changed files.
- The skill makes evidence, uncertainty, and scope boundaries explicit while preserving proportional writing for small fixes.
- Semantic entity names and impact relationships can focus source inspection without replacing the full patch or conflating static analysis with executed validation; the bounded fallback preserves PR drafting when Sem is unavailable, unsupported, or fails.
- The one-term wording preserves the reader-need condition and technical-detail requirement while removing ambiguity from the skill and ready-to-paste template.
- The changed-path dependency preserves the required Git and optional Sem evidence sequence while ensuring path-specific instructions are discovered before source inspection, validation collection, or drafting.

### Version
- Consolidated the prior `1.0.0` through `1.1.4` release history into the baseline `1.0.0` release.
