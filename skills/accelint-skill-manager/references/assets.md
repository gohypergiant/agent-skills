# 1.7 Assets

Contains static resources that are not meant to be loaded into context. Instead, they are used in the output an agent produces.
- Templates such as document templates and configuration templates
- Images such as diagrams and examples
- Data files such as lookup tables and schemas

**When to include**: Use this folder when the skill needs files that appear in the final output.

**Use cases**: Templates, images, icons, boilerplate code, fonts, and sample documents that get copied or modified.

**Benefits**: This separates output resources from documentation and lets an agent use the files without loading them into context.

---

Reference: https://agentskills.io/specification#assets%2F