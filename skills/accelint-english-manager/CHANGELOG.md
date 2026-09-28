# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to semantic versioning.

## [1.3.9] - 2026-08-21

### Changed
- Tightened `SKILL.md` so reference-loading order is explicit in drafting, revision, and audit workflows, and so serial-order guidance does not imply a new permission to upgrade warnings into gates.
- Added a final self-check on qualitative wording so hidden gates and fallback cues are more likely to be caught before delivery.

## [1.3.8] - 2026-08-19

### Changed
- Tightened serial instruction flow in `SKILL.md` so ordered workflows use clearer `Requires:` and `Done when:` checkpoints, more explicit completion conditions, and stronger step-by-step gating in drafting, revision, and audit paths.
- Reworked `references/serial-instruction-guidance.md` so the guidance itself follows an explicit ordered-step shape for structure choice, dependency markers, stage-container use, branch routing, and delivery-check retry order.

## [1.3.7] - 2026-08-03

### Changed
- Updated `references/serial-instruction-guidance.md` to prefer neutral stage-container wording (`Stage` or a descriptive section heading) instead of `Phase` when describing higher-level workflow containers. This is a low-risk precaution based on repo evidence that some agents treat phase-style headings as checkpoint boundaries.

## [1.3.6] - 2026-08-03

### Changed
- Tightened the serial-instruction guidance in `SKILL.md` to align more closely with the house standard: numbered lists for 2 to 3 short steps, `Step 0` plus a checklist for 4 or more steps, explicit `Requires:` and `Done when:` guidance, and a stronger prohibition against plain bullets for ordered work.
- Upgraded the revision workflow in `SKILL.md` to model `Step 0` progress tracking, clearer dependencies, done conditions, and explicit loop-back behavior when sequencing checks fail.
- Tightened `references/serial-instruction-guidance.md` so `Step 0` is the default for 4 or more ordered steps and the prohibition on plain bullets is stated more absolutely.

## [1.3.5] - 2026-08-03

### Changed
- Reworked `SKILL.md` so the main operating flow uses explicit step ordering, stronger sequencing language, and clearer gates around mode selection, rewriting, auditing, and pre-delivery checks.
- Added a dedicated serial-instruction section to `SKILL.md` so explicit and implied ordered actions are detected and strengthened instead of left in soft paragraph form.
- Added `references/serial-instruction-guidance.md` for progressive disclosure of sequencing heuristics, structure rules, branching guidance, and delivery checks for ordered prose.

## [1.3.4] - 2026-07-31

### Changed
- Tightened `README.md` so the quick-start guidance matches the skill's actual mode-selection workflow and points readers to `SKILL.md` for canonical trigger boundaries.
- Reduced duplication between `README.md`, `references/examples.md`, and `references/checklist.md` by clarifying each file's role and trimming repeated instructional framing.
- Updated audit-only guidance in `SKILL.md` and `references/examples.md` to use finding language that stays audit-first instead of implying an automatic rewrite.

## [1.3.3] - 2026-07-30

### Changed
- Tightened `SKILL.md` mode-selection wording so the skill asks for a mode without overusing RFC 2119 language in its own prose, while preserving the same workflow.
- Clarified that generic cleanup requests such as "plain English" or "clean this up" should stay on the default plain-language path unless the user explicitly asks for strict mode.
- Added an explicit limit that the skill must not invent new requirements, commitments, or product behavior while improving prose.

## [1.3.2] - 2026-07-30

### Changed
- Tightened local sentence structure in `references/examples.md`, `references/use-cases.md`, and `references/checklist.md` so the guidance is easier to scan without changing behavior.
- Clarified a stale-phrase explanation in `references/substitutions.md` so the reason for the rule is more explicit without changing the rule itself.

## [1.3.1] - 2026-07-30

### Changed
- Tightened `SKILL.md` wording in strict mode to make output-mode, rewrite-scope, and self-check rules easier to follow without changing trigger coverage or workflow behavior.
- Clarified that `mode=strict` does not broaden task scope, that rewrite-only output excludes audit notes unless requested, and that final self-check must verify both output mode and rewrite mode.

## [1.3.0] - 2026-07-30

### Added
- Added explicit `mode=default` and `mode=strict` behavior so strict plain-language and STE-leaning work can be requested without weakening the default editorial path.

### Changed
- Refactored `SKILL.md` around a shorter, more prescriptive default writing method that emphasizes how to write well before enumerating what to avoid.
- Integrated light ADHD-friendly scanability and actionability principles into the core writing system by default instead of treating them as a separate trigger-only path.
- Reframed STE-style structure, plain-language discipline, and ADHD-friendly shaping as one coordinated writing system with scoped overlays.
- Simplified routing and delivery workflow so the skill chooses output mode, preserves constraints, then applies the mode-selected default scope and discipline level.
- Tied rewrite scope more explicitly to the mode model so `mode=default` stays local by default and `mode=strict` permits structural rewrites when stronger control is needed.
- Made mode selection explicit in the workflow so drafting and rewriting tasks now require the skill to ask the user for `mode=default` or `mode=strict` up front unless the user already specified one, using RFC 2119 wording for consistency.
- Clarified STE-checking behavior so the skill loads only the relevant part of `references/ste-rules.md` before citing rule numbers, instead of implying the whole STE reference must be loaded.
- Tightened reference boundaries so `rfc-2119.md` is loaded only for genuinely normative text and `adhd-patterns.md` is reserved for stronger action-oriented shaping.
- Aligned the previously untouched reference files with the new operating model so `ste-rules.md`, `checklist.md`, `substitutions.md`, and `examples.md` reinforce the default-vs-strict mode split and the lighter default ADHD-friendly scanability layer.
- Updated trigger description to explicitly cover LLM-written documentation and LLM-generated responses that need tone-preserving cleanup.

### Fixed
- Fixed the misleading `1.2.2` changelog note so the history reflects real content changes instead of a no-op rename.

## [1.2.1] - 2026-07-29

### Changed
- Tightened `SKILL.md` prose for clarity without changing trigger coverage, core workflow intent, or guardrail strength.
- Clarified task classification by separating audit-only, rewrite-only, and audit-plus-rewrite modes.
- Added explicit output-mode and self-check sections to make delivery rules easier to follow.

## [1.2.0] - 2025-09-16

### Added
- Added strict local-vs-structural rewrite guidance, short-description preservation rules, and scope-broadening safeguards.
- Added progressive disclosure guidance and reference-loading order.
- Added RFC 2119 normalization guidance for technical and behavior-bearing prose.
- Added source synthesis note covering STE, ADHD-friendly shaping, and Orwell-style cleanup.

### Changed
- Expanded rewrite workflow, conflict resolution, and multi-turn continuity guidance.
- Strengthened instructions for preserving user constraints, exact wording, and technical specificity.