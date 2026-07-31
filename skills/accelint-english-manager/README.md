# accelint-english-manager

Rewrite English so it is clearer, plainer, easier to scan, and easier to act on without changing the user's meaning.

This skill is part of the `gohypergiant/agent-skills` repository. Install it through the repo-wide skills workflow.

## Installation

Use the [Agent Skills](https://agentskills.io/) CLI to install from the repository:

**npm:**
```bash
npx skills add gohypergiant/agent-skills
```

**pnpm:**
```bash
pnpm dlx skills add gohypergiant/agent-skills
```

Select `accelint-english-manager` when prompted. This skill is not published as a standalone npm package.

## Quick Start

Specify the job and the mode up front when you can. If the mode is missing, the skill should ask before rewriting:

```text
/accelint-english-manager audit+rewrite in strict mode the following:

"
This page is intended to provide users with a helpful overview of how project access works. In most cases, people will be able to request access through the admin panel, although there are some exceptions for legacy environments.
"
```

This prompt shape is already used elsewhere in this repo when another skill needs a final prose-polish pass.

## What is accelint-english-manager?

`accelint-english-manager` rewrites English to make it clearer without drifting meaning, tone, audience, or required constraints. Use it for docs, prompts, support replies, release notes, UI copy, policy text, and other writing where clarity matters more than flourish.

The skill combines plain-language discipline, STE-leaning structure, and ADHD-friendly shaping. It uses them together rather than treating them as separate modes.

## Why use it?

Many editing tools make text shorter but less accurate. Others flatten the voice so much that the result sounds robotic.

This skill avoids both problems:

- Preserves meaning before optimizing wording
- Keeps exact technical text, commands, identifiers, and file paths intact unless asked to rewrite them
- Separates rewrite scope with `mode=default` and `mode=strict`
- Supports audit-only, rewrite-only, and audit-plus-rewrite work
- Does not claim official ASD-STE100 compliance

Use it when you want cleaner writing that still does the same job. If you need subject-matter review, legal review, or formal standards certification, this skill is not a substitute.

## When to use this skill

Use this skill for prose-improvement requests where the main job is to make writing clearer without changing its intended meaning.

Common triggers include:
- "plain English", "simple English", "make this clearer", "make this more direct"
- "clean this up", "edit this", "review this writing", "grammar check"
- "too wordy", "too formal", "less fluffy", "friendlier", "shorter"
- "audit then rewrite", "keep the tone", `mode=strict`, `STE`, `ASD-STE100`, `ADHD-friendly`

Common artifacts include docs, prompts, emails, UI copy, support replies, release notes, status updates, incident notes, procedural text, and other LLM-written prose.

Do not use it for fact-checking, policy setting, or substantive content design. For the canonical trigger and boundary language, see [`SKILL.md`](./SKILL.md).

## API

This skill is content-first. Its public surface is the skill folder and the behavior-bearing files inside it.

### `SKILL.md`

The canonical instructions for when to use the skill, how to choose rewrite mode and output mode, how to preserve constraints, and how to structure the final response.

Key concepts documented there include:

- rewrite modes: `mode=default`, `mode=strict`
- output modes: `audit only`, `rewrite only`, `audit plus rewrite`
- hard constraints that outrank style preferences
- reference-loading guidance
- required self-checks before delivery

### `references/substitutions.md`

Wording cleanup guidance for filler removal, consistency sets, and modality checks.

### `references/checklist.md`

A final verification pass for meaning preservation, stable terminology, modality, exact technical text, and output-mode compliance.

### `references/ste-rules.md`

The reference for strict STE-leaning or highly controlled technical rewrites.

Use this when the request is procedural, technical, instructional, or explicitly asks for STE-style review. The skill does not claim official ASD-STE100 compliance.

### `references/adhd-patterns.md`

Patterns for stronger action-oriented shaping when the reader needs clearer execution help or lower-friction next steps.

### `references/use-cases.md`

Guidance for adapting the skill to different artifact types such as docs, prompts, support replies, incident notes, UI copy, and voice-sensitive writing.

### `references/rfc-2119.md`

Guidance for normalizing informal severity labels in normative or behavior-defining text when clearer obligation wording helps.

### `references/examples.md`

Worked examples that show how the skill handles audits, rewrites, voice-sensitive text, procedural wording, and scope control.

### `CHANGELOG.md`

Version history for the skill. This repo uses file-driven versioning for skills, so `CHANGELOG.md` and `metadata.version` in `SKILL.md` should stay aligned.

### `evals/evals.json`

Evaluation prompts for the skill. These are most useful to maintainers, but they also provide the best real request examples in this folder.

## Examples

These examples come from real files in this repo.

### Audit plus rewrite

Source: `skills/accelint-english-manager/evals/evals.json`

```text
Audit this paragraph and list the highest-risk issues first, then give a rewrite: 'We have identified an issue that may have impacted some users during the deployment window, and engineering is currently working to remediate the situation as quickly as possible.'
```

### Rewrite-only release note cleanup

Source: `skills/accelint-english-manager/evals/evals.json`

```text
Tighten this release note entry without changing scope or adding hype: 'This update includes improvements to export reliability and reduces the number of cases where scheduled reports fail when a data source responds slowly.' Return only the revised release note in final output.
```

See [`references/examples.md`](./references/examples.md) for more worked before/after patterns and audit shapes.

## Architecture & Development Guides

For project structure and maintenance guidance, see:

- [ARCHITECTURE.md](../../ARCHITECTURE.md) — system architecture and tech stack
- [AGENTS.md](../../AGENTS.md) — agent behavior and workflow conventions

## Further Reading

- [./SKILL.md](./SKILL.md) — canonical skill instructions
- [./CHANGELOG.md](./CHANGELOG.md) — version history
- [./references/substitutions.md](./references/substitutions.md) — wording cleanup guidance
- [./references/checklist.md](./references/checklist.md) — final verification checklist
- [./references/ste-rules.md](./references/ste-rules.md) — STE-leaning guidance
- [./references/adhd-patterns.md](./references/adhd-patterns.md) — action-oriented scanability patterns
- [./references/use-cases.md](./references/use-cases.md) — artifact-specific guidance
- [./references/rfc-2119.md](./references/rfc-2119.md) — normative wording guidance
- [./references/examples.md](./references/examples.md) — worked examples

## License

Apache 2.0 - see [../../LICENSE](../../LICENSE) for details.

## Contributing

If you update this skill, keep `SKILL.md` and `CHANGELOG.md` aligned.

For the broader contributor workflow, see [../../CONTRIBUTING.md](../../CONTRIBUTING.md).
