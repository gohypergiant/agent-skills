# 1.5 References

Contains additional documentation with detailed technical references that agents can read when needed. Keep individual reference files focused. Agents load these on demand, so smaller files mean less use of context. References should incorrect and correct examples of a rule to help reinforce context. An example of the expected format:

```markdown
## Rule Title Here

Brief explanation of the rule and why it matters.

**❌ Incorrect: (description of why)**
```
// Bad code example
```

**✅ Correct: (description of why)**
```
// Good code example
```

Optional explanatory text after examples.

Reference: [Link](https://example.com)
```

**When to include**: For documentation that an agent should reference while working

**Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides, best practices, code recipes

**Avoid duplication**: Information should live in either `AGENTS.md`, or references files, not both. Prefer references files for detailed information unless it's truly core to the skill. This keeps `AGENTS.md` lean while making information discoverable without hogging the context window. Keep only essential procedural instructions and workflow guidance in `SKILL.md`; move detailed reference material, schemas, and examples to references files.


---

Reference: https://agentskills.io/specification#references%2F