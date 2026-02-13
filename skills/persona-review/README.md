# Persona-Based Design Review Skill

Evaluate Figma designs from the perspective of specific operator personas, providing structured UX critique aligned with their responsibilities, pain points, and operational context.

## Usage

```bash
/persona-review <persona-id> [figma-url]
```

**Examples:**
```bash
# Review current Figma MCP desktop selection
/persona-review air-surveillance-tech

# Review specific Figma URL
/persona-review air-surveillance-tech https://figma.com/file/...
```

## How It Works

1. **Loads the operator persona** from the profile database
2. **Fetches the Figma design** (from URL or current desktop selection)
3. **Searches Outline docs** for relevant guidelines and standards
4. **Provides structured critique** covering:
   - Cognitive Load assessment
   - Communication Pattern alignment
   - Pain Point mitigation
   - Context awareness
   - System visibility
   - Communication support

## Adding New Personas

Edit `instructions.md` and add new persona profiles to the **PERSONA PROFILES** section. Follow the template provided:

```markdown
### [Persona Name]

**Persona ID**: `persona-identifier`

**Profile:**
- **Age:**
- **Rank:**
- **Schedule:**
- **Position:**
- **Responsibility:**

**About them:**
[Bullet points describing their role]

**Hears:**
[Communication channels]

**Sees:**
[Systems they interact with]

**Says & Does:**
[Typical actions]

**Pain Points:**
[Known challenges]
```

## Requirements

- **Figma MCP**: For accessing designs (desktop or URL)
- **Outline MCP**: For searching supporting documentation

## Current Personas

- `air-surveillance-tech` - Air Surveillance Technician (E4-E7)
