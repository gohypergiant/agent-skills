# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to semantic versioning.

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