# accelint-skill-prose

Safely edit behavior-defining prompt artifacts without changing what they mean or how they behave.

This skill is part of the `gohypergiant/agent-skills` repository. Install it through the repo-wide skills flow, not as a standalone npm package.

## Installation

Install the skill collection, then select `accelint-skill-prose` when the CLI prompts you.

**npm:**
```bash
npx skills add gohypergiant/agent-skills
```

**pnpm:**
```bash
pnpm dlx skills add gohypergiant/agent-skills
```

This skill does not ship as a separate package with its own `package.json`.

## What is accelint-skill-prose?

`accelint-skill-prose` edits prompt artifacts where wording controls behavior, not just style. That includes `SKILL.md` files, `AGENTS.md` or `CLAUDE.md` guidance, prompt templates, guardrails, workflow notes, and behavior-bearing Markdown in `references/` folders.

It makes those files easier to follow and audit without changing trigger coverage, workflow order, guardrail strength, or exact technical meaning.

## Why use it?

Prompt cleanup is risky when the text also acts as execution logic. A sentence that reads better can still be a bad edit if it changes when a skill triggers, weakens a prohibition, or softens an approval gate.

This skill is built for that problem.

- It treats frontmatter descriptions as trigger logic.
- It treats workflow prose as executable guidance.
- It treats paths, commands, field names, identifiers, and quoted text as exact behavior anchors.
- It requires a structured self-check before delivery.

Use it when you want safer prompt editing. If you only need general prose cleanup with no behavior risk, a general English-editing skill is usually a better fit.

## API

This skill is content-first. Its public surface is the skill folder and the behavior-bearing files inside it.

### `SKILL.md`

The canonical instructions for when to use the skill, how to choose output and rewrite modes, how to preserve behavior, and how to handle folder-level artifact sets.

Key concepts documented there include:

- output modes: `audit only`, `rewrite only`, `audit plus rewrite`
- rewrite modes: `mode=default`, `mode=strict`
- artifact-set discovery for skill-folder work
- hard stops, priority order, and required self-checks

### `assets/output-template.md`

The required report template for `accelint-skill-prose` outputs.

It defines the expected sections for:

- summary
- changed and unchanged files
- behavior checks
- risks or limits

If you use this skill for audit-only, rewrite-only, or audit-plus-rewrite work, this template is part of the output contract.

### `references/*.md`

Progressive-disclosure reference files that the root skill loads when needed.

| File | Purpose |
|------|---------|
| `references/artifact-patterns.md` | Positive rewrite patterns for descriptions, workflows, guardrails, rationale, and examples |
| `references/checklist.md` | Final pass checks for output-mode compliance, no-rewrite decisions, and cross-file consistency |
| `references/examples.md` | Worked examples of safe audits, rewrites, and no-rewrite decisions |
| `references/frontmatter-descriptions.md` | Safe tightening rules for frontmatter descriptions and trigger language |
| `references/rfc-2119.md` | Guidance for obligation-strength normalization without changing behavior |
| `references/ste-compatible-rules.md` | Selective Simplified Technical English patterns adapted for behavior-preserving edits |
| `references/workflow-guardrails.md` | Guidance for workflow order, approval gates, rationale, and behavior-bearing verbs |

### `CHANGELOG.md`

Version history for the skill. This repo uses file-driven versioning for skills, so the changelog and `metadata.version` in `SKILL.md` should stay aligned.

### `evals/evals.json`

Evaluation prompts that exercise the skill's behavior. This file is more useful to maintainers than end users, but it is also the best source of real request examples in this package.

## Examples

These examples come from real eval prompts in `evals/evals.json`. They are the closest thing this package has to usage examples, and they are better than invented samples.

### Audit-only request

```text
Audit this workflow prose for behavior risk. Do NOT provide a rewrite, only findings.
```

Use this when you want risk analysis without replacement text.

### Rewrite-only request with exact preservation

```text
Tighten this instruction without changing step number, approval dependency, timing rule, exact tokens, or rationale. Return only the revised instruction in final output.
```

Use this when you want tight control over what must stay exact.

### Frontmatter-description tightening

```text
Tighten this skill description without losing trigger phrases or task coverage. Keep it suitable for frontmatter. Return only the revised description in final output.
```

Use this when the wording in `description:` helps decide when a skill should trigger.

### Folder-level skill audit

```text
Request: Tighten this skill's prose safely. The user pasted only one section, but the skill also has `AGENTS.md` and `references/` files.
```

Use this when a local rewrite could create drift across a whole skill folder.

Source: `references/examples.md`

## File Layout

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
    ├── artifact-patterns.md
    ├── checklist.md
    ├── examples.md
    ├── frontmatter-descriptions.md
    ├── rfc-2119.md
    ├── ste-compatible-rules.md
    └── workflow-guardrails.md
```

## Further Reading

- [./SKILL.md](./SKILL.md) — canonical skill instructions
- [./CHANGELOG.md](./CHANGELOG.md) — version history
- [./assets/output-template.md](./assets/output-template.md) — required output template

## License

Apache 2.0 - see [../../LICENSE](../../LICENSE) for details.

## Contributing

If you update this skill, keep `SKILL.md` and `CHANGELOG.md` aligned.

For the broader contributor workflow, see [../../CONTRIBUTING.md](../../CONTRIBUTING.md).
