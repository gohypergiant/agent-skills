# 1.3 AGENTS.md

## Overview

General rule of thumb is to follow guidance from [Agents.md](https://agents.md/). At minimum try and provide concise and descriptive examples of what incorrect and correct. Consolidate examples as reasonably as possible to reduce token usage. The persona and target audience for this document is an AI Agent or LLM.

Example of sections to include:
```markdown
## Abstract

## How to Use This Guide

## 1. {Rule Group}

### 1.1 {Rule Name}

```

Also include this note hint towards the persona:

```markdown
> **Note:**
> This document is mainly for agents and LLMs to follow <condition for skill> at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.
```

Refer to [this file](../../react-best-practices/AGENTS.md) as a reference on content and structure.

### Token Efficiency (Critical)

#### Use cross-references:

**❌ Incorrect: repeated workflow details**
```
When searching, dispatch subagent with template...
[20 lines of repeated instructions]
```

**✅ Correct: reference other skill**
```
Always use subagents. REQUIRED: Use [other-skill-name] for workflow.
```

#### Compress examples:

```markdown
# ❌ BAD: Verbose example (42 words)
your human partner: "How did we handle authentication errors in React Router before?"
You: I'll search past conversations for React Router authentication patterns.
[Dispatch subagent with search query: "React Router authentication error handling 401"]

# ✅ GOOD: Minimal example (20 words)
Partner: "How did we handle auth errors in React Router?"
You: Searching...
[Dispatch subagent → synthesis]
```

**❌ Incorrect: verbose example (42 words)**
```ts
your human partner: "How did we handle authentication errors in React Router before?"
You: I'll search past conversations for React Router authentication patterns.
[Dispatch subagent with search query: "React Router authentication error handling 401"]
```

**✅ Correct: minimal example (20 words)**
```ts
Partner: "How did we handle auth errors in React Router?"
You: Searching...
[Dispatch subagent → synthesis]
```

#### Eliminate redundancy

- Don't repeat what's in cross-referenced skills
- Don't explain what's obvious from skill
- Don't include multiple examples of same pattern

---

Reference: https://agents.md/#examples