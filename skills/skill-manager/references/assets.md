# 1.7 Assets

Contains static resources that are not intended to be loaded into context, but rather used within the output an agent produces.
- Templates (document templates, configuration templates)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

**When to include**: When the skill needs files that will be used in the final output

**Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents that get copied or modified

**Benefits**: Separates output resources from documentation, enables an agent to use files without loading them into context

---

Reference: https://agentskills.io/specification#assets%2F