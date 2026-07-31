# accelint-onboard-agent description report

Changed: yes

## Before
Interactively onboard a project to agent-driven development by running a structured interview and generating a complete AGENTS.md (or CLAUDE.md). Use this skill whenever a user mentions "AGENTS.md", "CLAUDE.md", "agent behavior", "agent instructions", "agent config", "set up agent rules", "onboard agent", "configure claude code", "agent guardrails", "agent workflow", or asks how to tell an AI agent how to behave in their project — even if they just say "help me write AGENTS.md" or "what should go in CLAUDE.md". Always prefer this skill over ad-hoc agent instruction generation.

## After
Onboard a repository to agent-driven development by creating or refreshing a full AGENTS.md or CLAUDE.md through behavior-focused discovery, structured interviewing, drift-aware updates, and preview-before-write review. Use this skill whenever the user wants to create, replace, refresh, import, restructure, append to, dry-run, or review AGENTS.md / CLAUDE.md guidance; mentions agent behavior, agent instructions, agent guardrails, agent workflow, Claude Code conventions, package-level agent files, or monorepo inheritance; or asks how to tell an AI coding agent how to behave in a project. Also use it when the user wants behavior rules kept separate from openspec/config.yaml project DNA. Do not use it for OpenSpec config onboarding, architecture docs, or tiny one-line AGENTS.md edits.

## Why
- Expanded trigger coverage for import/refresh/append/dry-run and monorepo package-level cases present in the eval set.
- Added boundary language for separation of concerns with `openspec/config.yaml`.
- Added explicit non-triggers to reduce false positives on OpenSpec-only, architecture-doc, and small direct-edit requests.
- Kept the description concise enough to stay scannable while naming the skill's distinctive workflow.

## Trigger tradeoffs
- More likely to trigger on AGENTS.md maintenance requests, not just first-time onboarding.
- Slightly narrower for generic "edit AGENTS.md" requests because tiny one-off edits are now explicitly out of scope, which matches the eval intent.
