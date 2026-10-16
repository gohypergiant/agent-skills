# Code Standards

Created with accelint-code-quality-optimizer and maintained by the team. Only the first two sections are enforced. Change this file through a normal MR/PR.

**Last updated:** {YYYY-MM-DD}

## 1. Written Rules

Rules already written down in the repository, with their source.

| Area | Rule | Source |
|------|------|--------|
| Boundaries | {Modules must not depend on other modules} | `{AGENTS.md:31}` |
| TypeScript | {strict: true} | `{packages/ui/tsconfig.json}` |
| Lint | {rules enabled in the lint config} | `{.oxlintrc.json}` |
| Tests | {mock cleanup configured globally} | `{vitest.config.ts}` |

## 2. Approved Conventions

Conventions inferred from the code and approved by the team. Each keeps its evidence so it can be re-checked.

| Convention | Standard | Evidence at approval | Approved | Migration |
|------------|----------|----------------------|----------|-----------|
| {file-naming} | {kebab-case} | {614 kebab-case, 12 camelCase} | {YYYY-MM-DD, by} | {rename deviating files as tier C, one package per MR} |

## 3. Open Decisions

Conflicts with no clear majority, or majorities that contradict accelint guidance. Not enforced until decided.

| Convention | Observed | Guidance | Options | Owner |
|------------|----------|----------|---------|-------|
| {tsconfig:noUncheckedIndexedAccess} | {unset 9, true 2, false 3} | {none} | {adopt everywhere / leave per package} | {} |
