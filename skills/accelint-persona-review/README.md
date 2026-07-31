# Persona-Based Design Review

Evaluate Figma designs from the perspective of specific operator personas and surface role-specific UX insights that generic reviews miss.

## Usage

```bash
# Review current Figma selection
/persona-review air-surveillance-tech

# Review specific Figma URL
/persona-review weapons-director https://figma.com/design/...?node-id=1-2
```

## What It Does

1. Loads the operator persona profile (responsibilities, pain points, systems, workflows)
2. Fetches the Figma design from a URL or desktop selection, or falls back to screenshots when MCP access is unavailable
3. Searches Outline docs for the most relevant guidelines, requirements, and prior review context
4. Produces a persona-grounded critique that prioritizes operational impact across:
   - cognitive load
   - workflow and communication fit
   - pain point mitigation
   - context awareness (rank, experience, schedule)
   - system visibility
   - communication support
5. Calls out evidence gaps when the review is limited by missing design context or supporting documentation

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

Then update `references/personas/_index.md` to include the new persona ID and summary.

## Requirements

- **Figma MCP**: Preferred for accessing designs from desktop or URL
- **Outline MCP**: Preferred for searching supporting documentation

## Version history

See [CHANGELOG.md](CHANGELOG.md) for details.

Current version: 1.3.0
- Audit-driven trigger and workflow clarity improvements
- Default eval coverage for persona selection, fallbacks, and boundary validation
- Stronger evidence-versus-inference guidance in reviews

## Fallbacks

- If Figma MCP is unavailable, review screenshots and state the resulting scope limits clearly.
- If Outline MCP is unavailable, proceed with the persona profile plus design context and note that supporting-document evidence was unavailable.
