# accelint-react-best-practices description report

Description changed: yes

## Summary
Refined the SKILL.md frontmatter description to improve trigger precision, coverage, and boundary clarity against the default eval set.

## What changed
- Reframed the opening from broad React usage wording to a clearer "use when the task involves React code and the right answer depends on React-specific behavior" statement.
- Expanded trigger verbs to cover writing, reviewing, refactoring, debugging, and optimizing.
- Added explicit coverage for React-focused audits and performance reviews.
- Added missing high-signal trigger terms from the eval set, including useTransition and React Compiler.
- Clarified that the skill applies across React app contexts, including Vite and Next.js.
- Added a firm non-trigger boundary for backend, database, auth, and generic API work unless the issue is specifically about React behavior.

## Why
- Improves activation for audit/review prompts and React debugging prompts in the eval set.
- Preserves intended behavior for React rendering, state, effect, hydration, and React 19 issues.
- Reduces false positives on non-React backend/security prompts.

## Versioning
- Updated metadata.version in SKILL.md from 1.8.1 to 1.8.2.
- Added a 1.8.2 changelog entry in CHANGELOG.md.
