# Audit Report: accelint-react-best-practices

**Package audited:** `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices`  
**Overall grade:** **B+**

## Strengths

### Strong frontmatter basics
- `SKILL.md` has the required `name` and a detailed `description`, plus explicit `license` and `metadata.version` fields.  
  Evidence: `skills/accelint-react-best-practices/SKILL.md`
- `metadata.version` is aligned with the latest changelog entry at `1.8.3`.  
  Evidence: `skills/accelint-react-best-practices/SKILL.md`, `skills/accelint-react-best-practices/CHANGELOG.md`

### Good trigger specificity and boundary-setting
- The description is clearly React-scoped and names concrete trigger contexts: rendering, state, effects, hydration, React 19 behavior, re-renders, stale closures, remounting, and hydration mismatches.  
  Evidence: `skills/accelint-react-best-practices/SKILL.md`
- It also draws a visible exclusion boundary for backend, database, auth, and generic API tasks unless the issue is specifically React behavior.  
  Evidence: `skills/accelint-react-best-practices/SKILL.md`

### Solid package completeness and layered structure
- The package includes the expected supporting artifacts for a mature skill: `AGENTS.md`, `references/`, `scripts/`, `assets/`, `evals/`, `README.md`, and `CHANGELOG.md`.  
  Evidence: `skills/accelint-react-best-practices/`
- The structure supports progressive disclosure well:
  - `SKILL.md` gives routing and usage guidance
  - `AGENTS.md` provides compact rule summaries
  - `references/` holds focused deep dives
  - `scripts/` contains optional automation
  Evidence: `skills/accelint-react-best-practices/SKILL.md`, `skills/accelint-react-best-practices/AGENTS.md`, `skills/accelint-react-best-practices/scripts/README.md`

### Eval presence is directly observable
- The package has a non-trivial eval set in `evals/evals.json` with 16 prompts and per-prompt expectations.
- Supporting assertion guidance is present in `evals/assertions.md`.  
  Evidence: `skills/accelint-react-best-practices/evals/evals.json`, `skills/accelint-react-best-practices/evals/assertions.md`

## Issues

### 1. SKILL.md is doing too much at the top level
- `SKILL.md` is not just a trigger/workflow file; it also contains a long “NEVER Do React” rules section, example workflows, philosophy notes, React 19 notes, and audit-template guidance.
- This is useful content, but it weakens the skill-creator progressive-disclosure pattern, where the root skill file should stay more selective and route the model to narrower references sooner.  
  Evidence: static audit evidence from `skills/accelint-react-best-practices/SKILL.md`

### 2. Some guidance is redundant across root artifacts
- React Compiler branching appears in all of these:
  - `SKILL.md` (“Before Optimizing Performance, Ask”, “Important Notes”)
  - `AGENTS.md` (“FIRST: Check React Compiler”)
  - `README.md` (“React Compiler Awareness”, “Performance Philosophy”)
  Evidence: static audit evidence from `skills/accelint-react-best-practices/SKILL.md`, `skills/accelint-react-best-practices/AGENTS.md`, `skills/accelint-react-best-practices/README.md`
- React 19 feature summaries also repeat across `SKILL.md` and `README.md`.  
  Evidence: static audit evidence from `skills/accelint-react-best-practices/SKILL.md`, `skills/accelint-react-best-practices/README.md`

### 3. Trigger description is strong, but still broad in task verbs
- The description covers writing, reviewing, refactoring, debugging, optimizing, and auditing React code. That breadth is supported by the package, but it still creates a wide trigger surface.
- The main scope limiter is “the right answer depends on React behavior,” which is good, but still somewhat abstract compared with more concrete exclusions.  
  Evidence: static audit evidence from `skills/accelint-react-best-practices/SKILL.md`

### 4. Eval documentation appears partially stale relative to the current eval set
- `evals/evals.json` contains 16 evals, including React Compiler branching cases, Activity usage, audit/report behavior, and non-trigger boundaries.
- `evals/assertions.md` documents only 8 evals and does not reflect the full current set.  
  Evidence: direct repository inspection of `skills/accelint-react-best-practices/evals/evals.json` and `skills/accelint-react-best-practices/evals/assertions.md`
- This does not mean the evals are unusable, but it is direct evidence of drift inside the package.

## Risks

### Root-skill context may be heavier than necessary
- Because `SKILL.md` carries both routing logic and substantial direct React guidance, the model may load more top-level instruction than needed before consulting focused references.  
  Evidence: static audit evidence from `skills/accelint-react-best-practices/SKILL.md`

### Drift risk between evaluation artifacts
- The mismatch between the 16-case eval file and the 8-case assertions document creates maintenance risk: future reviewers may misread actual coverage or rely on stale benchmark assumptions.  
  Evidence: direct repository inspection of `skills/accelint-react-best-practices/evals/evals.json` and `skills/accelint-react-best-practices/evals/assertions.md`

### Audit-template usability risk
- The output template is comprehensive and detailed, but it is also long and somewhat prescriptive. That is appropriate for multi-issue audits, yet it increases the chance of over-structuring outputs when a lighter audit would suffice.  
  Evidence: static audit evidence from `skills/accelint-react-best-practices/assets/output-report-template.md` and `skills/accelint-react-best-practices/SKILL.md`

## Summary

This is a strong, clearly scoped, and well-populated skill package with real supporting materials, direct eval coverage, and thoughtful React-specific boundaries. Its main weaknesses are not missing pieces, but **tightness and drift**: the root skill file is somewhat overloaded, several root artifacts repeat the same guidance, and the assertions document no longer matches the observable eval set.

**Overall grade: B+**
