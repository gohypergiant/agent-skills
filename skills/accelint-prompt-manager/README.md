# accelint-prompt-manager

Turn rough requests, draft prompts, or under-specified instructions into clearer, more executable prompts without doing the task itself.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-prompt-manager
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-prompt-manager
```

Select `accelint-prompt-manager` from the interactive picker, choose Project scope, and use Symlink method.

## Overview

`accelint-prompt-manager` is a prompt-optimization skill for agent workflows. It helps when the real need is to improve how a request is phrased, structured, constrained, or adapted to an execution context such as Claude Code, a system prompt, or a batch/API call.

Use it when someone says things like:
- "rewrite this prompt"
- "make this clearer"
- "tighten this system prompt"
- "I know what I want, but I don't know how to ask for it"
- "optimize this prompt for Claude Code"

Do not use it when the user wants the underlying task completed rather than the prompt improved.

## What This Skill Does

The skill is built around a four-phase prompt-optimization workflow:

1. **Intake and assessment** — determine whether the user wants prompt optimization or task execution.
2. **Pattern detection** — identify ambiguity, missing constraints, weak success criteria, and known prompt anti-patterns.
3. **Framework selection and optimization** — apply the right structure for the request without exposing framework labels in the final prompt.
4. **Validation and handoff** — deliver one optimized prompt, ready to copy and run.

The final artifact is the optimized prompt itself. The skill is designed to avoid drifting into execution, research, or speculative implementation work.

## Quick Start

Once installed, invoke the skill when the job is prompt improvement rather than task completion. Example requests:

```text
Rewrite this prompt so it is clearer and more actionable.
Optimize this system prompt for an API workflow.
Turn these rough notes into a strong Claude Code prompt.
I have an idea, but I do not know how to phrase the request.
```

Expected behavior:
- The skill delivers the optimized prompt first, in a markdown code block.
- If critical information is missing, it asks a small set of targeted clarification questions.
- After delivery, it can optionally help save the prompt or suggest clipboard-copy steps.

## What’s Included

- **[SKILL.md](SKILL.md)** — canonical workflow, guardrails, trigger logic, and output rules
- **[AGENTS.md](AGENTS.md)** — condensed quick reference for frameworks, anti-patterns, and optimization choices
- **[references/](references/)** — deeper guidance for specific optimization problems:
  - [credit-killing-patterns.md](references/credit-killing-patterns.md) — prompt patterns that reduce result quality
  - [frameworks.md](references/frameworks.md) — structure selection guidance
  - [complexity-detection.md](references/complexity-detection.md) — when complexity changes the prompt strategy
  - [plan-mode-triggers.md](references/plan-mode-triggers.md) — when downstream plan-mode guidance is warranted
  - [ambiguity-examples.md](references/ambiguity-examples.md) — common vague terms and safer interpretations
  - [safe-techniques.md](references/safe-techniques.md) — low-risk ways to improve prompts
  - [template-selection.md](references/template-selection.md) — when to use a bundled template shape
  - [optimization-examples.md](references/optimization-examples.md) — before/after transformation examples
- **[assets/prompt-templates/](assets/prompt-templates/)** — reusable prompt-template starting points for different task types
- **[evals/evals.json](evals/evals.json)** — evaluation cases for optimization boundaries and trigger accuracy

## Key Behaviors

### Prompt optimization, not task execution

This skill rewrites the request. It should not perform the task described by the request.

For example, if the user asks for help making an interview-analysis prompt clearer, the output should be a better interview-analysis prompt, not an interview analysis.

### Clarify only when it matters

If missing details would materially change the final prompt, the skill asks a small, targeted set of questions. If the task is already clear enough, it proceeds directly to the optimized prompt.

### Match the execution context

Prompt shape changes depending on where the prompt will run. The skill accounts for contexts such as:
- interactive chat workflows
- Claude Code or similar coding-agent sessions
- API or batch execution
- reusable system prompts
- tool-integrated prompts with input and output expectations

### Use frameworks silently

The skill may structure the result using internal optimization frameworks, but the final prompt should not expose framework names or methodology labels unless the user explicitly asks for that.

## Common Use Cases

### Rewrite a vague draft

Take a rough request and turn it into a prompt with clearer objectives, constraints, and success criteria.

### Adapt a prompt for Claude Code

Rework a generic prompt so it is suitable for a coding-agent environment, with better task framing and execution context.

### Tighten a system prompt

Improve a persistent instruction set without turning it into a long, brittle wall of text.

### Resolve ambiguity before execution

When a request contains terms like "better," "comprehensive," or "clean," the skill helps pin those words to concrete outcomes.

## Repository Context

This package currently includes:
- `SKILL.md`
- `AGENTS.md`
- `CHANGELOG.md`
- `references/`
- `assets/prompt-templates/`
- `evals/`
- `runs/`

There is no package-local `package.json` or standalone installable runtime package here. This directory is a skill package consumed through the repository’s skill-loading workflow.

## Architecture & Development Guides

For broader repository context related to this skill:
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — repository architecture and component overview
- [AGENTS.md](../../AGENTS.md) — repo-wide agent behavior and workflow rules
- [CLAUDE.md](../../CLAUDE.md) — pointer to the repo-wide agent guidance

## Maintenance Notes

When updating this README, keep it aligned with:
- the current trigger boundaries in `SKILL.md`
- the quick-reference guidance in `AGENTS.md`
- the available reference files and prompt templates
- the latest version history in [CHANGELOG.md](CHANGELOG.md)

The canonical source of truth for skill behavior is `SKILL.md`.