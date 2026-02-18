---
description: Evaluate Figma designs from operator persona perspectives. Use when reviewing UX for specific user roles (e.g., air-surveillance-tech, weapons-director). Analyzes cognitive load, communication patterns, pain points, and system visibility. Works with Figma MCP (desktop/URL) and Outline docs.
keywords: figma, persona, review, ux, operator, design critique, user experience, evaluation
version: 1.1
invocations:
  - keyword: persona-review
    type: user-invocable
    arguments:
      - name: persona
        type: string
        description: Persona identifier (e.g., air-surveillance-tech)
        required: true
      - name: figma_url
        type: string
        description: Optional Figma URL (defaults to current Figma MCP desktop selection)
        required: false
mcp_servers:
  - figma_mcp
  - outline
---

# Persona-Based Design Review

Evaluate Figma designs from the perspective of specific operator personas. Generic UX advice ("make it more intuitive") misses insights that emerge from the persona's documented profile - their responsibilities, pain points, systems they monitor, and operational context.

## Workflow

### 1. Load Persona Profile

Start by loading the persona index to find available personas:

```
Read references/personas/_index.md
```

Then load the specific persona requested by the user:

```
Read references/personas/{persona-id}.md
```

If the persona doesn't exist, list available options from the index and ask the user to choose.

### 2. Gather Design Context

**Figma URL provided:**
Use appropriate Figma MCP tool to fetch the design (e.g., `mcp__figma-desktop__get_design_context` with extracted node ID from URL pattern `node-id=1-2` → `1:2`).

**No URL (default):**
Use Figma MCP desktop to get current file/selection. If nothing selected, prompt user to select a frame or component.

### 3. Search Supporting Documentation

Use Outline MCP to find relevant context. Since Outline requires workspace selection, use this pattern:

```
ListMcpResourcesTool(server: "outline")
```

Search for documents covering:
- UI standards/guidelines for this operator role
- Previous design reviews or feedback
- System requirements or specifications
- Training materials or user guides

Prioritize documents mentioning the persona's role, responsibilities, or systems they interact with.

### 4. Analyze & Critique

Load evaluation examples to calibrate your approach:

```
Read references/evaluation-examples.md
```

Use the evaluation framework below, but **adapt structure to findings** - don't force insights into rigid sections.

## Evaluation Framework

### Cognitive Load Assessment
- **Information density**: Can they process all displayed data given their experience level and work tempo?
- **Visual hierarchy**: Does critical info for their role stand out immediately?
- **Mental models**: Does the interface match systems they already use (documented in "Sees")?

### Communication Pattern Alignment
- **"Says & Does" support**: Does the UI facilitate their typical actions and communications?
- **Workflow integration**: How well does this fit documented workflows?
- **Error prevention**: Does it prevent mistakes aligned with their documented pain points?

### Pain Point Mitigation
- **Direct pain relief**: Which documented pain points does this design address?
- **Inadvertent pain creation**: Does this introduce new friction or complexity?
- **System consolidation**: If they juggle multiple systems, does this reduce context switching?

### Context Awareness
- **Experience calibration**: Is complexity appropriate for their rank/experience (e.g., E4 vs E7)?
- **Responsibility alignment**: Does the design support their specific responsibilities?
- **Schedule considerations**: Can they use this effectively given their work schedule/tempo?

### System Visibility
- **"Sees" coverage**: Are the systems they monitor visible/accessible (e.g., BCS-F, RS-4, ERSA)?
- **Integration gaps**: What critical systems are missing?
- **Redundancy**: Is there unnecessary duplication of information they see elsewhere?

### Communication Support
- **"Hears" integration**: Does the design support their communication channels (e.g., Surveillance Net)?
- **Information relay**: Can they easily relay information as documented in "Says & Does"?
- **Notification design**: Are alerts/notifications appropriate for their attention budget?

## Output Structure

Provide critique in this general format (adapt as needed):

```
## Persona Review: [Persona Name]

### Design Summary
[1-2 sentence summary of what you reviewed]

### Critical Findings
[2-3 most important insights specific to this persona]

### Detailed Evaluation

**Cognitive Load**: [Assessment with specific examples from persona profile]

**Communication Patterns**: [How well it supports their "Says & Does"]

**Pain Point Mitigation**: [Which pain points addressed/created]

**Context Awareness**: [Appropriate for their experience/responsibilities]

**System Visibility**: [Coverage of their "Sees" systems]

**Communication Support**: [Integration with their "Hears" channels]

### Recommendations
[Prioritized list of actionable improvements, grounded in persona profile]

### Supporting References
[Links to relevant Outline docs found during research]
```

**This is an example structure, not a rigid template.** Adapt based on:
- Depth of findings in specific areas
- Completeness of persona profile
- Design scope (component vs. full dashboard)

The critical elements are:
1. Clear connection to persona's documented profile
2. Specific, actionable recommendations
3. Prioritization based on operational impact
4. Evidence from supporting docs (when available)

## Evaluation Principles

**Be specific to the persona**: Generic UX advice helps no one. Ground every observation in the persona's documented profile (Profile, About, Hears, Sees, Says & Does, Pain Points).

**Prioritize operational impact**: A minor UI inconsistency that breaks muscle memory for a high-tempo operator matters more than major visual polish issues. Consider the stakes of their work.

**Assume domain expertise**: These operators are experts in their field. Don't suggest "simplifications" that remove necessary complexity they need to do their jobs.

**Consider the full context**: Review their entire profile - insights often emerge from connections between sections. A pain point in one area may relate to systems they monitor or communication channels they use.

**Connect across profile sections**: The most valuable insights synthesize multiple parts of the persona profile (e.g., a pain point + systems they see + actions they take = integrated solution opportunity).

## References

- **Persona profiles**: `references/personas/{persona-id}.md`
- **Persona index**: `references/personas/_index.md`
- **Evaluation examples**: `references/evaluation-examples.md`

Load these on-demand to minimize context usage.
