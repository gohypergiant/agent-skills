# pr-description

Write pull request descriptions that explain a behavior change to the reviewer, a future maintainer reading git history, and a non-expert engineer integrating the affected surface.

The skill reads the full branch and local PR conventions before drafting. It emphasizes the existing problem, the causal mechanism, correctness assumptions, evidence, uncertainty, and deliberate scope boundaries instead of repeating the diff.

## Installation

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill pr-description
```

```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill pr-description
```

## Usage

Examples:

```text
Write a PR title and description for the changes on this branch.
```

```text
Review this PR description and rewrite it for a non-expert reader.
```

```text
Draft a PR body with a reproducible test plan. The benchmark report is at reports/cache-v2.md.
```

## Included resources

- `SKILL.md` — branch-inspection and drafting workflow
- `assets/pr-description-template.md` — ready-to-paste full and compact output forms
- `references/pr-description-rubric.md` — criterion-by-criterion review rubric
- `references/pr-writing-calibration.md` — plain-voiced calibration facts loaded during drafting
- `references/react-pr-findings.md` — source-grounded findings and limits from the eight requested React PRs, loaded only for grading or review
- `evals/evals.json` — seed scenarios for testing the skill
