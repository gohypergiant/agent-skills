# 1.5 References

Contains additional documentation with detailed technical references that agents can read when needed. Keep each reference file focused. Agents load these files on demand, so smaller files use less context. References should include incorrect and correct examples of a rule to reinforce the pattern. Show the incorrect version before the correct version so the learning flow stays clear. The target audience for this document is an AI agent or LLM.

Follow the structure in the [reference template](../assets/skill-template/references/example.md) as closely as possible. If a different structure already exists, you MUST prioritize alignment and consistency. Ask the user whether it is acceptable to aggressively refactor the document format.

**When to include**: Use references for documentation an agent should consult while working.

**Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides, best practices, and code recipes.

**Avoid duplication**: Information should live in either `AGENTS.md` or reference files, not both. Prefer reference files for detailed information unless it is truly core to the skill. This keeps `AGENTS.md` lean while making information discoverable without consuming unnecessary context. Keep only essential procedural instructions and workflow guidance in `SKILL.md`. Move detailed reference material, schemas, and examples to reference files.


---

Reference: https://agentskills.io/specification#references%2F