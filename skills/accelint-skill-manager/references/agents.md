# 1.3 AGENTS.md

## Overview

As a general rule, follow guidance from [Agents.md](https://agents.md/). Provide concise, descriptive incorrect and correct examples. Consolidate examples when that reduces token usage without losing the rule. The target audience for this document is an AI agent or LLM.

### Token Efficiency (Critical)

#### Use cross-references

**❌ Incorrect: repeated workflow details**
```
When searching, dispatch subagent with template...
[20 lines of repeated instructions]
```

**✅ Correct: reference other skill**
```
Always use subagents. REQUIRED: Use [other-skill-name] for workflow.
```

#### Compress examples

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

- Do not repeat what is already in cross-referenced skills.
- Do not explain what is already obvious from the skill.
- Do not include multiple examples of the same pattern.

---

Reference: https://agents.md/#examples