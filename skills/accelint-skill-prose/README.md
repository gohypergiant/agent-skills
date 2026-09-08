# accelint-skill-prose

Audit and revise behavior-defining prompt artifacts while preserving what they mean and how they behave.

This skill is part of the `gohypergiant/agent-skills` repository. Install it through the repository-wide skills flow, not as a standalone npm package.

## Installation

Install the skill collection, then select `accelint-skill-prose` when the CLI prompts you.

**npm:**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-skill-prose
```

**pnpm:**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-skill-prose
```

## What it audits

`accelint-skill-prose` evaluates wording that controls agent behavior, including `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, behavior-bearing references, prompt templates, workflow guidance, and guardrails.

Every applicable audit evaluates these mandatory categories:

1. normative-language and obligation precision;
2. serial instruction and workflow integrity;
3. STE-compatible clarity and usability; and
4. user-question and waiting behavior.

The skill preserves trigger coverage, workflow and approval semantics, guardrail strength, and exact technical anchors before it pursues clarity or brevity. It can recommend a bounded structural rewrite when source evidence shows that the current structure causes instruction skipping or ambiguity; changes that alter protected behavior still require approval.

## Mandatory references

The canonical workflow requires all four rubric references for every applicable audit. They are not progressive-disclosure options.

| File | Purpose |
|---|---|
| `references/normative-language.md` | RFC 8174-based normative-language and obligation-precision rubric |
| `references/serial-instruction-guidance.md` | Serial-instruction and workflow-integrity rubric |
| `references/ste-compatible-rules.md` | STE-compatible clarity and usability rubric |
| `references/user-question-waiting.md` | User-question and waiting-behavior rubric |
| `assets/output-template.md` | Required report with category-level grades, evidence, recommendations, classifications, and uncertainty |

The category grades are local heuristic priorities, not validated scores. Each grade remains paired with cited evidence, a finding state, a concrete recommendation or no-change rationale, a change classification, and uncertainty.

## Unified workflow and report visibility

Every invocation completes the same strict workflow:

1. audit the behavior-defining prose against every mandatory rubric;
2. record findings, evidence, grades, and actionable recommendations;
3. synthesize the applicable recommendations into a prioritized rewrite proposal;
4. produce a behavior-preserving rewritten version; and
5. validate the rewritten version against the same applicable requirements.

The skill has no audit-only, rewrite-only, audit-plus-rewrite, `mode=default`, or `mode=strict` controls. The former strict safeguards apply to every invocation, including bounded structural rewrites only when cited evidence shows that structure causes instruction skipping, ambiguity, or ineffective behavior.

By default, the skill shows the audit, rewrite proposal, rewritten version, and completed report. `--quiet`, or an unambiguous request not to show the audit, findings, or report, suppresses only the user-facing audit/report. A request to be concise does not suppress reporting. Quiet reporting never skips the audit, grading, recommendations, rewrite proposal, rewrite, or validation.

## File layout

```text
skills/accelint-skill-prose/
├── SKILL.md
├── CHANGELOG.md
├── README.md
├── assets/
│   └── output-template.md
├── evals/
│   └── evals.json
└── references/
    ├── normative-language.md
    ├── serial-instruction-guidance.md
    ├── ste-compatible-rules.md
    └── user-question-waiting.md
```

## Maintenance

If you update this skill:

- keep `SKILL.md` `metadata.version` and `CHANGELOG.md` aligned;
- update `evals/evals.json` when required rubric coverage, unified-workflow steps, report visibility, recommendation requirements, or approval behavior changes;
- preserve the four mandatory rubric categories and their evidence-based reporting; and
- prefer small, evidence-backed changes unless an approved structural rewrite is necessary.

For the repository-wide contributor workflow, see [../../CONTRIBUTING.md](../../CONTRIBUTING.md).
