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

The skill preserves trigger coverage, workflow and approval semantics, guardrail strength, and exact technical anchors before it pursues clarity or brevity. It can recommend a bounded structural rewrite when source evidence shows that the current organization obscures a source-established prerequisite, gate, branch route, return route, or conflicting control-flow reading; changes that alter protected behavior still require approval. Numbering, headings, checklists, XML, and similar format or placement conventions are not validated workflow controls unless the source or active harness makes them behavior-bearing. A prose grade does not validate runtime tool behavior or repeated-run reliability; state-changing workflow evaluation uses the serial rubric's companion local-evaluation boundary.

## Mandatory references

The canonical workflow requires all four rubric references for every applicable audit. They are not progressive-disclosure options.

| File | Purpose |
|---|---|
| `references/normative-language.md` | RFC 8174 / RFC 2119 BCP 14 normative-language and obligation-precision rubric for every target artifact |
| `references/serial-instruction-guidance.md` | Serial-instruction and workflow-integrity rubric |
| `references/ste-compatible-rules.md` | STE-compatible clarity and usability rubric |
| `references/user-question-waiting.md` | User-question and waiting-behavior rubric |
| `assets/output-template.md` | Required report with category-level grades, evidence, recommendations, classifications, uncertainty, and review coverage |

The category grades are local heuristic priorities, not validated scores. Each grade remains paired with cited evidence, a finding state, a concrete recommendation or no-change rationale, a change classification, and uncertainty. The skill never averages or votes on them.

## Mandatory review workflow and report visibility

For a workflow with four or more real actions, the agent first creates and maintains the Step 0 task tracker, which mirrors the existing Steps 1–6 workflow.

Every invocation uses this one review workflow:

1. establish a fixed behavior ledger from the complete artifact set;
2. run four isolated rubric reviews from the same source snapshot;
3. synthesize source-grounded findings and a prioritized rewrite proposal in a fresh context; and
4. produce one behavior-preserving rewritten version and output it.

Each isolated reviewer reads the complete target artifact set and every mandatory reference. Initial reviewers do not receive another reviewer's grade, a draft rewrite, or the synthesis rationale. The synthesizer rereads source evidence and resolves conflicts without averaging or voting on local grades.

The skill has no direct single-agent, audit-only, rewrite-only, audit-plus-rewrite, `mode=default`, `mode=strict`, or fallback-rewrite controls. It permits bounded structural rewrites only when cited source evidence shows that the current organization obscures a source-established workflow mechanic. A format-standardization claim requires local, reproducible evidence for the intended model and harness; a user-requested presentation change must not be presented as a validated reliability improvement.

Each isolated reviewer returns exactly one valid JSON object containing its category, grade, state, source-cited evidence, rationale, recommendation, classification, and uncertainty. If a required reviewer cannot run or returns an invalid or incomplete JSON record, the skill may continue with explicit incomplete rubric coverage. The report names the unavailable reviewer, lost category coverage, and retry availability; it does not imply that the missing review was completed. By default, the skill shows review coverage, the audit, rewrite proposal, rewritten version, and completed report. `--quiet`, or an unambiguous request not to show the audit, findings, or report, suppresses only user-facing audit/report content. A request to be concise does not suppress reporting.

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
- update `evals/evals.json` when required-reviewer isolation, rubric coverage, synthesis, review-coverage handling, report visibility, recommendation requirements, serial-workflow evidence boundaries, local-evaluation boundaries, or approval behavior changes;
- preserve the four mandatory rubric categories, their evidence-based reporting, and the source-grounded conflict-resolution rule; and
- prefer small, evidence-backed changes unless an approved structural rewrite is necessary.

For the repository-wide contributor workflow, see [../../CONTRIBUTING.md](../../CONTRIBUTING.md).
