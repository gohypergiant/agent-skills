# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this skill uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-10-05

### Fixed
- Excluded merge commits from the PR-description skill's commit-history evidence with `git log --no-merges <base>..HEAD`.
- Made the three-dot diff the authoritative PR scope and explicitly retained branch-side conflict-resolution changes that remain in that diff.
- Prefer the PR target's remote-tracking ref, such as `origin/main`, when it exists so a stale local target branch does not expose inherited upstream history.

### Rationale
- A merge created by `git pull origin <target>` can appear in `git log <target>..HEAD` and leak merge metadata into a generated PR narrative even though the upstream changes do not belong in the PR. Filtering merge commits preserves branch-authored motivation while the three-dot diff continues to represent the net reviewable patch.

## [1.1.0] - 2026-09-29

### Added
- A `## Verify before delivery` two-step protocol in `SKILL.md`: write the full draft against the existing content checklist, then re-read it as a fixed text and apply three span-citing checks (literal-form, concrete-subject, compression) before delivering.
- A conditional rule in "Explain the mechanism causally" and in `assets/pr-description-template.md`'s Mechanism placeholder: when an idea's referent has a literal form in the diff (a signature, call site, config key, flag value, or exact wording), the inspectable artifact must be that literal text, not a prose description of it.
- A literal-excerpt capture step in "Gather the evidence before drafting" (step 4): copy the literal before/after text while the diff is open, instead of planning to reconstruct it from memory while drafting.
- A "Never do this" bullet in `SKILL.md` prohibiting paraphrasing a signature, call pattern, or exact wording in prose when the literal form is available.
- An optional `## Before / after` heading in `assets/pr-description-template.md`'s evidence notes, for signature, import-path, or call-shape changes that need more than one inline excerpt.
- A predicate-anchored penalty and `not applicable with rationale` allowance in `references/pr-description-rubric.md` criterion 2, scoped to claims that assert a literal shape rather than to "describes an API" as a topic judgment.
- `references/pr-writing-calibration.md`: a short, plain-voiced extraction of the eight React PR findings, loaded during ordinary drafting so the model is not marinated in `react-pr-findings.md`'s denser analytical register while writing.
- A falsifiable plain-English test in `SKILL.md` and `assets/pr-description-template.md` (name the real object instead of a nominalization; one sentence, one job) with one worked avoid/write example pair placed directly beside the instruction.

### Changed
- Gated `references/react-pr-findings.md` and `references/pr-description-rubric.md` to the grading/review path only; drafting now loads the plain `references/pr-writing-calibration.md` instead, with an explicit instruction to use the findings to decide what to say, not how to phrase it.
- Rephrased the "prior rule, uncovered case, exact new rule" and "preserved invalid behavior, non-goals, fallback behavior" list-of-abstractions phrasing in `references/pr-description-rubric.md` criteria 2 and 3 as questions, since the parallel-noun-triplet shape was itself being reproduced verbatim in drafted output.
- Bumped `metadata.version` to `1.1.0` (additive instruction and reference changes; no change to required output structure).

### Rationale
- A review of four real `pr-description`-generated PRs found the existing plain-English instruction and inspectable-artifact rule were already present and well-articulated, yet 3 of 4 outputs still shipped dense, nominalization-heavy prose with almost no quoted code or literal text — because the existing "Before delivering" checklist runs in the same generation pass as the draft it is meant to check, and the artifact rule never distinguished *naming* an artifact in prose from *showing* its literal form.
- Splitting code-snippet coverage (a locally checkable, literal-form predicate) from prose register (a diffuse, graded style target) let each get a fix suited to its own tractability, rather than one generic "add more instructions" pass for both.
- The skill's own reference material was itself written in the dense register the plain-English instruction asks the model to avoid, and the one PR about the skill itself (a meta-PR) reproduced that vocabulary almost verbatim — gating the dense analysis to the grading path, and giving drafting a plain-voiced calibration summary instead, removes that in-context imitation pressure without deleting the deeper analysis.

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
