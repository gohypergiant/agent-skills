# Optimizations Applied: accelint-react-best-practices

## 1. Sync eval support docs with the actual 16-case eval set
- **Recommendation addressed:** Update stale eval support documentation so it matches the current test surface.
- **Evidence type supporting it:** Direct repository inspection
- **Files changed:** `skills/accelint-react-best-practices/evals/assertions.md`
- **Summary of implementation:** Rewrote `evals/assertions.md` to cover all 16 evals currently present in `evals/evals.json`, including React Compiler branching, Activity/state-preservation behavior, audit-mode behavior, and the non-trigger boundary case.
- **Reason this change matches the evidence:** The evidence showed a direct mismatch between the active eval set and the assertions guide. Updating the assertions file removes observable drift without changing behavior outside the documented eval surface.

## 2. Reduce top-level instruction load in `SKILL.md`
- **Recommendation addressed:** Trim repeated summary material in the root skill file while preserving behavior.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-react-best-practices/SKILL.md`
- **Summary of implementation:** Tightened the `NEVER Do React` section into shorter rule summaries that route to existing reference files, removed the standalone example block, and compressed the “Using Skill Patterns Appropriately” and “Important Notes” sections so they behave more like routing guidance than duplicate documentation.
- **Reason this change matches the evidence:** Stage 1 showed the root skill file was carrying too much explanatory material even though the package already has `AGENTS.md` and dedicated `references/` files. These edits reduce top-level verbosity while preserving the same decision paths.

## 3. Consolidate repeated React Compiler messaging
- **Recommendation addressed:** Keep React Compiler guidance as a decision gate, not repeated overlapping prose.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-react-best-practices/SKILL.md`
- **Summary of implementation:** Kept the existing compiler-first decision gate, but compressed nearby duplication so the root skill now points more directly to `references/react-compiler-guide.md` for boundary detail.
- **Reason this change matches the evidence:** The audit found repeated compiler guidance across root artifacts. This was a safe place to reduce duplication without weakening the important compiler check itself.

## Not applied

### Frontmatter trigger rewrite
- **Recommendation not applied:** Broaden or materially rewrite the frontmatter description.
- **Why not:** Stage 1 found the current description to be strong, clearly React-scoped, and already aligned with the changelog version. The available evidence supported tightness and drift fixes, not a description overhaul.

### Broad structural refactor across AGENTS/README/references
- **Recommendation not applied:** Repo-wide or package-wide restructuring of support artifacts.
- **Why not:** Evidence showed localized redundancy and documentation drift, not a broken package architecture. A broader rewrite would have exceeded the confidence warranted by the observed issues.
