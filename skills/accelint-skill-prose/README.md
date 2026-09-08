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
| `references/normative-language.md` | RFC 8174 / RFC 2119 BCP 14 normative-language and obligation-precision rubric for every target artifact |
| `references/serial-instruction-guidance.md` | Serial-instruction and workflow-integrity rubric |
| `references/ste-compatible-rules.md` | STE-compatible clarity and usability rubric |
| `references/user-question-waiting.md` | User-question and waiting-behavior rubric |
| `assets/output-template.md` | Required report with category-level grades, evidence, recommendations, classifications, uncertainty, and validation provenance |
| `assets/validation-packet-template.md` | Step 7 validation-packet structure; not a mandatory material for isolated reviewers |

The category grades are local heuristic priorities, not validated scores. Each grade remains paired with cited evidence, a finding state, a concrete recommendation or no-change rationale, a change classification, and uncertainty. The skill never averages or votes on them.

## Mandatory high-assurance workflow and report visibility

For a workflow with four or more real actions, the agent first creates and maintains the Step 0 task tracker, which mirrors the existing Steps 1–7 workflow.

Every invocation uses this one high-assurance workflow:

1. establish a fixed behavior ledger from the complete artifact set;
2. run four isolated rubric reviews from the same source snapshot;
3. synthesize source-grounded findings and a prioritized rewrite proposal in a fresh context;
4. produce one behavior-preserving rewritten version; and
5. validate the rewrite with an independent fresh-context reviewer against every mandatory rubric.

Each isolated reviewer and the independent validator reads the complete target artifact set and every mandatory reference. Initial reviewers do not receive another reviewer's grade, a draft rewrite, or the synthesis rationale. The synthesizer rereads source evidence and resolves conflicts without averaging or voting on local grades.

Before independent validation, the workflow creates a validation packet that binds the original and rewritten artifact snapshots to a changed-section map. Every validator claim identifies its artifact version, path, heading or Step, quote, supported claim, and packet-verification result. The orchestrator rejects wrong-version, wrong-location, stale, missing, or unsupported citations.

The skill has no direct single-agent, audit-only, rewrite-only, audit-plus-rewrite, `mode=default`, `mode=strict`, or fallback-rewrite controls. It permits bounded structural rewrites only when cited evidence shows that the current structure causes instruction skipping, ambiguity, or ineffective behavior.

If a required reviewer cannot run or returns an incomplete record, the skill continues with explicit **degraded assurance**. An invalid independent-validator record gets one fresh retry only when the validation packet is unchanged; the retry receives the same packet but not the invalid record. A complete, packet-verified retry recovers validator coverage and must disclose the rejected attempt. Otherwise, the report names the unavailable role, lost coverage, and retry availability; it does not claim complete high-assurance coverage or independent validation. By default, the skill shows assurance coverage, the audit, rewrite proposal, rewritten version, and completed report. `--quiet`, or an unambiguous request not to show the audit, findings, or report, suppresses only user-facing audit/report content. A request to be concise does not suppress reporting.

## File layout

```text
skills/accelint-skill-prose/
├── SKILL.md
├── CHANGELOG.md
├── README.md
├── assets/
│   ├── output-template.md
│   └── validation-packet-template.md
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
- update `evals/evals.json` when required-role isolation, rubric coverage, synthesis, validation-packet provenance, independent validation, retry recovery, degraded-assurance handling, report visibility, recommendation requirements, or approval behavior changes;
- preserve the four mandatory rubric categories, their evidence-based reporting, and the source-grounded conflict-resolution rule; and
- prefer small, evidence-backed changes unless an approved structural rewrite is necessary.

For the repository-wide contributor workflow, see [../../CONTRIBUTING.md](../../CONTRIBUTING.md).
