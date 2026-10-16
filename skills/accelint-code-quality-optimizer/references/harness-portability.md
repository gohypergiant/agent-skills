# 3.1 Harness Portability

## Overview

This skill runs in Claude Code, Codex, Pi and other harnesses, on Claude or GPT models. Instructions that assume one harness's tools (subagents, built-in question prompts, worktree tools) or one model's habits silently fail elsewhere: the agent skips a step it cannot perform, or performs it differently. Only file access, a shell and git are assumed.

## Key Principles

1. **Approvals are explicit stops**: Every approval is written as "STOP and show X; wait for the user's answer". Do not rely on a question tool, and do not continue in the same turn.
2. **State lives in the progress file**: Context windows reset and models differ in how much they keep. `.code-quality/progress.md` is the source of truth for scope, confirmed commands, decisions and step status.
3. **Scripts, not model judgment, for counts**: Scorecard numbers, export diffs and side-effect diffs come from scripts with JSON output, so results do not vary by model.
4. **Optional features are optional**: "If your harness can run subagents, run the pack reviews in parallel; otherwise run them in order." Never make a step depend on one.
5. **Invoke other skills in prose**: "Invoke the accelint-ts-testing skill." with the arguments on the next lines. Never slash commands.

## Examples

### Pattern 1: Harness-specific approval

**❌ Incorrect**
```
Use AskUserQuestion to confirm which findings to apply.
```

**Why this is wrong:** Harnesses without that tool skip the step or apply everything.

**✅ Correct**
```
STOP. Ask: "Apply which items? Enter ids, a theme name, `tier-a`, or `none`." Wait for the answer before Step 5.
```

### Pattern 2: State only in context

**❌ Incorrect**
```
Remember which commands passed in Step 0.
```

**✅ Correct**
```
Record each command and its result under "Verification commands" in .code-quality/progress.md.
```

## Notes for GPT-Family Models

- Keep the numbered workflow; GPT models follow explicit numbered steps and hard stops reliably and tend to merge steps that are written as prose.
- Ask for the findings table before details, in that order. Without the explicit order, findings tend to arrive one at a time with fixes already applied.
- State that "no findings" is a valid result. Without it, models tend to produce low-value findings to have something to report.

## Common Pitfalls

- Using `@file` references to load content. Several harnesses attach nothing; read the file with the harness's file tool.
- Assuming a POSIX shell. The scripts are Node; prefer `node scripts/x.mjs` over shell pipelines so they run on Windows too.
- Letting the harness auto-commit with its own trailer. Turn that off or amend before packaging; no AI trailers is a hard rule.
