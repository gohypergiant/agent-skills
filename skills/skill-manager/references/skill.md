# 1.2 SKILL.md

## Overview

General rule of thumb is to follow guidance from [Agent Skills](https://agentskills.io/). Since the overview and references table of contents is contained in the `AGENTS.md` file the content for this `AGENTS.md` file should be optimized towards adding any additional context, hints, or suggestions that help an agent more accurately determine if this skill is relevant. The persona and target audience for this document is an AI Agent or LLM.

Do not link to other skills' files directly. Use skill name references instead.

### Rich Description Field

**Purpose:** Some agents like Claude read the description field to decide which skills to load for a given task. Make it answer: "Should I read this skill right now?"

**Format:** Start with "Use when..." to focus on triggering conditions

**CRITICAL: Description = When to Use, NOT What the Skill Does**

The description should ONLY describe triggering conditions. Do NOT summarize the skill's process or workflow in the description.

**Why this matters:** Testing revealed that when a description summarizes the skill's workflow, an agent may follow the description instead of reading the full skill content. A description saying "code review between tasks" caused an agent to do ONE review, even though the skill's flowchart clearly showed TWO reviews (spec compliance then code quality).

When the description was changed to just "Use when executing implementation plans with independent tasks" (no workflow summary), the agent correctly read the flowchart and followed the two-stage review process.

**The trap:** Descriptions that summarize workflow create a shortcut an agent will take. The skill body becomes documentation that an agent skips.

**❌ Incorrect: summarizes workflow - agent may follow this instead of reading skill**
```
description: Use when executing plans - dispatches subagent per task with code review between tasks
```

**❌ Incorrect: too much process detail**
```
description: Use for TDD - write test first, watch it fail, write minimal code, refactor
```

**✅ Correct: just triggering conditions, no workflow summary**
```
description: Use when executing implementation plans with independent tasks in the current session
```

**✅ Correct: triggering conditions only**
```
description: Use when implementing any feature or bugfix, before writing implementation code
```

**Content:**
- Use concrete triggers, symptoms, and situations that signal this skill applies
- Describe the *problem* (race conditions, inconsistent behavior) not *language-specific symptoms* (setTimeout, sleep)
- Keep triggers technology-agnostic unless the skill itself is technology-specific
- If skill is technology-specific, make that explicit in the trigger
- Write in third person (injected into system prompt)
- **NEVER summarize the skill's process or workflow**

**❌ Incorrect: too abstract, vague, doesn't include when to use**
```
description: For async testing
```

**❌ Incorrect: first person**
```
description: I can help you with async tests when they're flaky
```

**❌ Incorrect: mentions technology but skill isn't specific to it**
```
description: Use when tests use setTimeout/sleep and are flaky
```

**✅ Correct: Starts with "Use when", describes problem, no workflow**
```
description: Use when tests have race conditions, timing dependencies, or pass/fail inconsistently
```

**✅ Correct: technology-specific skill with explicit trigger**
```
description: Use when using Next.js and handling authentication redirects
```

### Keyword Coverage

Use words an agent would search for:
- Error messages: "Hook timed out", "ENOTEMPTY", "race condition"
- Symptoms: "flaky", "hanging", "zombie", "pollution"
- Synonyms: "timeout/hang/freeze", "cleanup/teardown/afterEach"
- Tools: Actual commands, library names, file types

### Cross-Referencing Other Skills

**When writing documentation that references other skills:**

Use skill name only, with explicit requirement markers:
- ✅ Correct: `**REQUIRED SUB-SKILL:** Use js-ts-best-practices`
- ✅ Correct: `**REQUIRED BACKGROUND:** You MUST understand vitest-best-practices`
- ❌ Incorrect: `See skills/vitest-best-practices` (unclear if required)
- ❌ Incorrect: `@skills/react-best-practices/SKILL.md` (force-loads, burns context)

**Why no @ links:** `@` syntax force-loads files immediately, consuming context before you need them.

---

Reference: https://agentskills.io/specification#skill-md-format