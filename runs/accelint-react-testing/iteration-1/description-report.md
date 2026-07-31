# accelint-react-testing description report

Description changed: yes

## Summary
- Expanded trigger language from a short API list to explicit React Testing Library and Testing Library pattern coverage.
- Added broader file-pattern coverage, including `*.spec.jsx`, plus explicit `getBy*/findBy*/queryBy*` trigger families.
- Added scoped-query and anti-pattern coverage to better reflect `within()`, async utilities, audits, and review-oriented prompts.
- Added a clear boundary sentence excluding non-React unit tests and Playwright end-to-end testing unless the question is specifically about RTL behavior.

## Rationale
- Improves trigger precision for review, rewrite, and audit prompts in the default eval set.
- Increases coverage for common RTL request shapes without broadening into unrelated testing domains.
- Makes boundaries explicit so Node utility tests and Playwright selector questions are less likely to mis-trigger this skill.
