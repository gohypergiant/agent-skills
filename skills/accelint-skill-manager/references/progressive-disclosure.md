# 1.4 Progressive Disclosure

Structure skills for efficient context use:

- Metadata (~100 tokens): The name and description fields are loaded at startup for all skills.
- Instructions (< 5000 tokens recommended): The full `SKILL.md` body is loaded when the skill is activated.
- Resources (as needed): Files such as those in `scripts/`, `references/`, or `assets/` are loaded only when required.
- Keep the main `SKILL.md` under 500 lines. Move detailed reference material to separate files.
- Aim to break each rule into a dedicated `references/*` Markdown file to optimize token usage.

---

Reference: https://agentskills.io/specification#progressive-disclosure