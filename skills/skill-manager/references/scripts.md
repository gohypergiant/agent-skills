# 1.6 Scripts

Contains executable code that agents can run. Scripts should:
- Be self-contained or clearly document dependencies
- Include helpful error messages
- Handle edge cases gracefully

**When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed

**Benefits**: Token efficient, deterministic, may be executed without loading into context

---

Reference: https://agentskills.io/specification#scripts%2F