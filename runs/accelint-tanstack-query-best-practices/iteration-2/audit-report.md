# Audit Report

## Skill audited
`skills/accelint-tanstack-query-best-practices`

## Evidence reviewed
- `skills/accelint-tanstack-query-best-practices/SKILL.md`
- `skills/accelint-tanstack-query-best-practices/CHANGELOG.md`
- `skills/accelint-tanstack-query-best-practices/README.md`
- `skills/accelint-tanstack-query-best-practices/evals/evals.json`
- `skills/accelint-tanstack-query-best-practices/assets/query-client.ts`
- `skills/accelint-tanstack-query-best-practices/assets/output-report-template.md`
- `skills/accelint-tanstack-query-best-practices/references/fundamentals.md`
- `skills/accelint-tanstack-query-best-practices/references/query-client-setup.md`
- `skills/accelint-tanstack-query-best-practices/references/query-keys.md`
- `skills/accelint-tanstack-query-best-practices/references/mutations-and-updates.md`
- `skills/accelint-tanstack-query-best-practices/references/patterns-and-pitfalls.md`
- `skills/accelint-tanstack-query-best-practices/references/server-integration.md`
- `skills/accelint-tanstack-query-best-practices/references/caching-strategy.md`

## Strengths
- Strong trigger coverage in `SKILL.md` frontmatter across setup, reviews, migrations, debugging, hydration, invalidation, and Next.js integration, with clear exclusions for adjacent domains.
- Good progressive-disclosure structure: `SKILL.md` routes the agent into scenario-specific references instead of loading everything at once.
- Reference pack is substantial and task-oriented across setup, keys, mutations, pitfalls, server integration, caching, and fundamentals.
- `assets/query-client.ts` gives a concrete baseline aligned with the guidance.
- `evals/evals.json` covers a broad range of realistic TanStack Query scenarios plus negative boundary cases.
- Versioning is currently aligned: `SKILL.md` metadata version and `CHANGELOG.md` both show `1.4.1`.

## Issues found
- `SKILL.md` is dense and instruction-heavy. The large “NEVER” block plus several matrices and decision trees risks over-constraining ordinary advisory work.
- Some claims are presented as fixed rules rather than heuristics, including exact observer thresholds, dataset-size cutoffs for structural sharing, and the statement that 200 list items calling `useQuery` creates 200 network requests and 200 observers.
- Some fallback and recovery snippets appear broader than necessary for baseline guidance and may encourage longer, more prescriptive answers than the task needs.
- `assets/output-report-template.md` appears orphaned: it is not referenced from `SKILL.md` and looks more like a generic audit template than a TanStack Query-specific runtime aid.
- Repository evidence shows authored eval prompts, but not executed benchmark outputs, grader artifacts, or iteration workspaces that demonstrate measured skill behavior.
- `CHANGELOG.md` documents prior improvements, but the package does not contain linked evidence artifacts that substantiate performance gains beyond file inspection.
- `references/caching-strategy.md` depends partly on outside skills, so part of the advice surface is not fully self-contained.

## Grade
**B+** — Strong package structure, broad trigger coverage, useful reference decomposition, and solid prompt-level eval coverage. Main weaknesses are packaging coherence around unused assets, instruction density/rigidity, and limited direct repository evidence of executed benchmarking.

## Audit summary
This is a strong, above-average skill package with good scope control and reference routing. The biggest opportunities are to reduce over-rigidity, reframe hard-edged rules as heuristics where warranted, and improve package coherence by removing or repurposing unused assets. Repository evidence supports the quality of the written materials, but not a fully demonstrated benchmarked skill.
