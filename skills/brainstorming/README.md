# Brainstorming Skill

Transform vague ideas into fully-formed designs through structured collaborative dialogue.

## Quick Start

**For users:** Read `SKILL.md` for overview and examples.

**For agents:** Read `AGENTS.md` for detailed workflow, then load references as needed.

## Structure

```
brainstorming-skill/
├── SKILL.md                         # User-facing overview
├── AGENTS.md                        # Agent workflow instructions
├── README.md                        # This file
└── references/                      # Detailed references (load as needed)
    ├── decision-trees.md           # When to skip phases
    ├── question-templates.md       # Pre-built questions
    ├── research-synthesis.md       # Research output format
    ├── anti-patterns.md            # Common mistakes to avoid
    ├── time-estimates.md           # Duration guidance
    └── document-templates.md       # Design doc templates
```

## Progressive Loading

The skill is designed for minimal context usage:

1. **Always load:** `SKILL.md` to determine if skill applies
2. **Load for workflow:** `AGENTS.md` for phase-by-phase guidance
3. **Load on demand:** Reference files only when explicitly needed

## Reference Loading Guide

| Reference | Load When |
|-----------|-----------|
| `decision-trees.md` | Need to determine which phases to skip |
| `question-templates.md` | Need pre-built questions for requirements |
| `research-synthesis.md` | User chooses to research similar solutions |
| `anti-patterns.md` | Want to avoid common mistakes during validation |
| `time-estimates.md` | Need to set time boxes or estimate duration |
| `document-templates.md` | Ready to create design document |

## Token Efficiency

**Minimal load (check relevance):**
- Just `SKILL.md`: ~800 tokens

**Standard load (run workflow):**
- `SKILL.md` + `AGENTS.md`: ~2,500 tokens

**With 2 references:**
- `SKILL.md` + `AGENTS.md` + 2 references: ~4,500 tokens

**All files:**
- Complete skill: ~9,000 tokens

## Common Workflows

### Simple Feature (No references needed)
1. Load `SKILL.md` → Confirms applicability
2. Load `AGENTS.md` → Follow phases 1-6
3. No reference loading needed

### Complex Feature (Research needed)
1. Load `SKILL.md` → Confirms applicability
2. Load `AGENTS.md` → Follow phases 1-3
3. Load `research-synthesis.md` → Structure research findings
4. Continue with phases 4-6
5. Load `document-templates.md` → Create design doc

### RFC (Comprehensive)
1. Load `SKILL.md` → Confirms applicability
2. Load `AGENTS.md` → Follow all phases
3. Load `decision-trees.md` → Validate depth needed
4. Load `question-templates.md` → RFC questions
5. Load `anti-patterns.md` → Avoid pitfalls
6. Load `document-templates.md` → RFC template

## When to Use This Skill

✅ Use for:
- Brainstorming new features
- Creating POCs
- Drafting RFCs
- Exploring approaches
- Validating ideas before implementation

❌ Don't use for:
- Executing existing plans
- Debugging bugs
- Making small code changes
- When requirements are fully specified

## Output

Produces validated design documents in:
- `docs/designs/YYYY-MM-DD-feature-name.md` (Features)
- `docs/pocs/YYYY-MM-DD-poc-name.md` (POCs)
- `docs/rfcs/YYYY-MM-DD-rfc-name.md` (RFCs)

## Methodology

Incorporates:
- **Starbursting (5WH)** - Structured questions
- **Design Thinking** - Iterative refinement
- **YAGNI** - Ruthless scope reduction
- **Incremental validation** - Section-by-section approval

## Support

For questions about using this skill:
1. Check `SKILL.md` examples
2. Review `AGENTS.md` workflow
3. Consult relevant reference files
