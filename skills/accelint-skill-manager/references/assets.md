# 1.7 Assets

Contains static resources that are not intended to be loaded into context. Instead, they are used in the output an agent produces.
- Templates (document templates, configuration templates)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

**When to include**: Use this folder when the skill needs files that appear in the final output.

**Use cases**: Templates, images, icons, boilerplate code, fonts, and sample documents that get copied or modified.

**Benefits**: This separates output resources from documentation and lets an agent use the files without loading them into context.

---

Reference: https://agentskills.io/specification#assets%2F