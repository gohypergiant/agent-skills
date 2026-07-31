# Stage 1 Audit Report — accelint-nextjs-best-practices

## Scope
Static audit only. I reviewed:
- `skills/accelint-nextjs-best-practices/SKILL.md`
- `skills/accelint-nextjs-best-practices/AGENTS.md`
- `skills/accelint-nextjs-best-practices/references/quick-checklist.md`
- `skills/accelint-nextjs-best-practices/evals/evals.json`
- `skills/accelint-nextjs-best-practices/CHANGELOG.md`
- file inventory under `skills/accelint-nextjs-best-practices/`

No executed eval runs or viewer feedback were available in this workflow stage, so grades below are grounded in repository evidence and current skill-writing practices only.

## Audit Summary

### Strengths
- The frontmatter description is broad and trigger-oriented, with strong Next.js-specific coverage.
- `SKILL.md` follows progressive disclosure well: start at `AGENTS.md`, triage with `references/quick-checklist.md`, then load focused references.
- The skill clearly separates audit/report use cases from targeted fix requests.
- Supporting artifacts exist and are well organized: `AGENTS.md`, `references/`, `scripts/`, `assets/output-report-template.md`, and `evals/evals.json`.
- The eval set covers many realistic App Router cases and several boundary/negative cases.

### Weaknesses
- The body is heavily App Router-centric and does not give an explicit Pages Router handling path even though the description promises Pages Router coverage.
- `SKILL.md` instructs the agent to start with `AGENTS.md` but does not clearly tell it how to choose between `AGENTS.md`, `quick-checklist`, detailed references, and scripts for common task shapes.
- The body does not explicitly say to verify uncertain Next.js behavior against current official docs before giving high-confidence guidance. That matters because Next.js APIs and constraints shift over time.
- The route-handler/security surface in the body is narrower than the description. It covers auth and performance patterns, but not a concise reminder about safe proxying/header forwarding/caching decisions, which now appear in the eval set.
- The eval set includes route-handler proxy/caching and large-export memory scenarios that are only partially reflected in the skill body, suggesting some evaluation drift relative to the instruction set.

## Skill Creator-Style Assessment

### Triggering quality: A-
Evidence:
- The frontmatter description names strong trigger contexts: App Router, Pages Router, Server Components, Server Actions, route handlers, SSR, Suspense, cache revalidation, auth, and bundle issues.
- It explicitly says to prefer this skill over generic React/TS/backend advice when Next.js-specific behavior matters.

Why not higher:
- The body does not reinforce Pages Router handling enough for a description that claims Pages Router coverage.

### Instruction quality: B+
Evidence:
- The workflow is coherent and lightweight.
- Progressive disclosure reduces context load.
- The report template guidance is useful and scoped.

Why not higher:
- Some decision points are implicit instead of explicit, especially for Pages Router tasks, route-handler security reviews, and when to verify against official docs.

### Artifact structure: A
Evidence:
- The package contains the expected layered artifacts.
- Supporting references are specific, discoverable, and named clearly.
- `SKILL.md` remains compact at 204 lines, leaving room for targeted improvements without bloat.

### Eval alignment: B
Evidence:
- `evals/evals.json` has strong realistic prompts and negative cases.
- However, some eval scenarios go beyond what the body currently teaches explicitly, especially proxy route-handler security/caching and memory-aware export guidance.

## Grade
**Overall grade: A-**

This is a strong, publishable skill with good structure and solid coverage, but it shows mild instruction-to-eval drift and under-specified handling for Pages Router and some route-handler/security edge cases.

## Evidence Notes
- **Evidence type:** Static audit evidence only.
- **Confidence:** Moderate. Confidence is reduced because this workflow stage did not include executed eval transcripts, quantitative grading, or human review feedback.
