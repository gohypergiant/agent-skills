# Persona-Based Design Review

Evaluate Figma designs from the perspective of specific operator personas, surfacing UX insights that generic reviews miss.

## Usage

```bash
# Review current Figma selection
/persona-review air-surveillance-tech

# Review specific Figma URL
/persona-review weapons-director https://figma.com/design/...?node-id=1-2
```

## What It Does

1. Loads the operator persona profile (responsibilities, pain points, systems, workflows)
2. Fetches the Figma design (URL or desktop selection)
3. Searches Outline docs for relevant guidelines and standards
4. Provides structured critique covering:
   - Cognitive load assessment
   - Communication pattern alignment
   - Pain point mitigation
   - Context awareness (rank, experience, schedule)
   - System visibility
   - Communication support

## Available Personas

**Surveillance Roles:**
- `air-surveillance-tech` - Air Surveillance Technician (E4-E7)
- `surveillance-tech` - Surveillance Technician (E1-E6)

**Weapons Roles:**
- `weapons-director` - Weapons Director (O1-O3)
- `senior-director` - Senior Director (O3-O4)
- `air-weapons-officer` - Air Weapons Officer (O1-O2)

**Command Roles:**
- `mission-crew-commander` - Mission Crew Commander (O4-O5)

## Adding New Personas

Create a new file in `references/personas/{persona-id}.md` following this structure:

```markdown
# [Persona Name]

**Persona ID**: `persona-identifier`

**Profile:**
- **Age:**
- **Rank:**
- **Schedule:**
- **Position:**
- **Responsibility:**

**About them:**
[Bullet points: role, certifications, responsibilities]

**Hears:**
[Communication channels they monitor]

**Sees:**
[Systems and interfaces they interact with]

**Says & Does:**
[Typical actions and communications]

**Pain Points:**
[Known frustrations and challenges]
```

Then update `references/personas/_index.md` to include the new persona.

## Requirements

- **Figma MCP**: For accessing designs (desktop or URL)
- **Outline MCP**: For searching supporting documentation
