# Stage 1 Audit Report — accelint-react-testing

## Overall grade
A-

## Audit summary
Using the `skill-creator` guidance as the audit frame, this skill package is strong overall: it has good trigger specificity, clear progressive-disclosure structure, relevant references, useful audit scripts, and aligned version tracking. The main opportunities are to reduce over-absolute wording and trim dense top-level prose where the existing reference architecture can carry more detail.

## Strengths

1. **Strong trigger coverage with clear boundaries**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `skills/accelint-react-testing/SKILL.md` frontmatter description explicitly names React Testing Library APIs and patterns (`render`, `screen`, `within`, query variants, `fireEvent`, `userEvent`, `.test.tsx`, `.spec.tsx`) and explicitly excludes non-React unit tests and Playwright E2E.

2. **Good progressive disclosure design**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `SKILL.md` routes readers to `AGENTS.md` first, then to targeted `references/*.md` files only when needed. The package includes focused references for query priority, query variants, async testing, custom render, accessibility, user events, and anti-patterns.

3. **Operational guidance is concrete and reusable**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `SKILL.md` includes anti-pattern guidance, decision criteria, audit script commands, and explicit instructions for when to use the audit report template versus when to answer directly.

4. **Package completeness is high**  
   **Evidence type:** Static repository evidence  
   **Evidence:** The package contains `SKILL.md`, `AGENTS.md`, `README.md`, `CHANGELOG.md`, `evals/evals.json`, references, scripts, and assets. `metadata.version` in `SKILL.md` (`1.2.1`) matches `skills/accelint-react-testing/CHANGELOG.md`.

5. **Eval coverage is broad and relevant**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `skills/accelint-react-testing/evals/evals.json` contains 24 prompts covering query priority, query variants, async/disappearance, `userEvent`, provider wrappers, audit-vs-fix mode selection, and boundary cases such as plain Node unit tests and Playwright E2E.

## Weaknesses

1. **Some claims are too absolute or risk overstatement**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `SKILL.md` states that destructured queries from `render` create stale queries that search the initial DOM snapshot. That framing is stronger than necessary and is the least well-supported claim in the top-level guidance.

2. **Top-level skill body is denser than necessary**  
   **Evidence type:** Static repository evidence  
   **Evidence:** `SKILL.md` already has a capable reference architecture, but still front-loads many rules and detailed rationales in the main body, increasing token cost and potential instruction dilution.

3. **Some “NEVER” wording may be unnecessarily rigid**  
   **Evidence type:** Static repository evidence  
   **Evidence:** The main rules section uses several universal prohibitions where softer, reasoning-led phrasing could preserve intent while reducing brittleness.

## Highest-value improvements to consider later

1. Tighten or soften claims that could be disputed, especially around destructured queries and hard-universal wording.  
   **Evidence type:** Static repository evidence
2. Trim top-level orchestration prose and rely more on the existing references for depth.  
   **Evidence type:** Static repository evidence
3. Expand eval coverage slightly around ambiguous skill-boundary and output-shape behavior.  
   **Evidence type:** Static repository evidence

## Blockers
No reproducible environment or tooling blockers were observed during this audit.
