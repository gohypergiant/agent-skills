---
name: accelint-persona-review
description: Review operator-facing interfaces from a specific persona perspective using documented responsibilities, systems, pain points, and workflow context. Use when the user wants a persona-based UX review, role-specific interface critique, or feedback on whether a Figma flow, dashboard, screen, desktop selection, or control panel supports an operator role such as air-surveillance-tech, surveillance-tech, weapons-director, senior-director, or mission-crew-commander. Also use for questions about cognitive load, system visibility, communication fit, decision support, context switching, or operator-tempo alignment. Includes Figma URL review and screenshot fallback when MCP access is unavailable. Do not use for generic visual-polish feedback, product strategy, or non-design writing work.
compatibility: Works best with the outline mcp server and figma mcp server
metadata:
  version: "1.3.0"
---

# Persona-Based Design Review

Evaluate Figma designs from the perspective of specific operator personas. Generic UX advice ("make it more intuitive") misses insights grounded in the persona's documented profile: responsibilities, pain points, systems they monitor, and operational context.

## Workflow

### 1. Load the Persona Profile

Start by loading the persona index to confirm the available personas and persona IDs:

```
Read references/personas/_index.md
```

Then load only the persona the user requested:

```
Read references/personas/{persona-id}.md
```

If the user names a role loosely instead of giving an exact persona ID, map it to the closest entry in the index. Confirm only when the match is ambiguous.

Do not load multiple persona files for a single review unless the user explicitly asks for a comparison.

Do not load `references/evaluation-examples.md` yet. Wait until Step 4, when you are ready to critique the design.

If the persona does not exist, list the available options from the index and ask the user to choose one.

### 2. Gather Design Context

Collect enough design context to tie the critique to the persona's actual workflow.

**Figma URL provided:**
Use the appropriate Figma MCP tool to fetch the design. If the URL includes `node-id=1-2`, convert it to the MCP node format `1:2`. Capture the frame or component name, visible states, surrounding workflow context, and any annotations the MCP returns.

**No URL provided:**
Use Figma MCP desktop to inspect the current file or selection. If nothing is selected, ask the user to select the frame, flow, or component they want reviewed.

**Figma MCP unavailable:**
Ask the user for one or more screenshots. Review the screenshots visually, but explicitly note that the critique is limited because interaction states, component properties, hidden variants, and layout constraints are unavailable.

Before you continue, identify the review scope in one line for yourself: component, screen, workflow slice, or broader dashboard.

### 3. Search Supporting Documentation

Use Outline MCP to gather only the supporting context that sharpens the review.

Because Outline requires workspace selection, start with:

```
ListMcpResourcesTool(server: "outline")
```

Then search for documents covering:
- UI standards or guidelines for this operator role
- Previous design reviews or feedback on the same workflow
- System requirements or specifications
- Training materials or user guides

Prioritize documents that mention the persona's role, responsibilities, communication channels, or the systems they interact with.

Do not pad the review with weak references. Cite one clearly relevant document rather than several generic ones.

**Outline MCP unavailable:**
Proceed using the persona profile and design context alone. State that supporting documentation was unavailable, and mention which kinds of organizational standards or source material would strengthen the review.

### 4. Analyze and Critique

Load the evaluation examples to calibrate the depth and style of the critique:

```
Read references/evaluation-examples.md
```

Use the evaluation framework below, but adapt the structure to the findings. Do not force the critique into rigid sections when another organization would make the operational risks clearer.

As you analyze, keep these distinct:
- evidence from the persona profile
- evidence from the design itself
- evidence from supporting docs
- reasonable inferences where evidence is incomplete

Label uncertainty plainly instead of overstating conclusions.

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

Provide the critique in a concise structure that makes the operational risks easy to scan. Use this general format unless another layout fits the findings better:

```
## Persona Review: [Persona Name]

### Scope Reviewed
[What you reviewed and what evidence was available: Figma context, screenshot-only, supporting docs]

### Operational Summary
[1-2 sentence summary of the main fit or mismatch for this persona]

### Highest-Impact Findings
[2-4 prioritized findings tied to persona evidence]

### Detailed Evaluation

**Cognitive Load**: [Assessment with specific examples from persona profile]

**Workflow & Communication Fit**: [How well it supports their "Says & Does" and "Hears"]

**Pain Point Mitigation**: [Which pain points are reduced, unchanged, or newly introduced]

**Context & Experience Fit**: [Whether the design fits their rank, responsibility, and tempo]

**System Visibility**: [Coverage of their "Sees" systems and any integration gaps]

### Recommendations
[Prioritized list of actionable improvements, grounded in persona profile]

### Supporting References
[Relevant Outline docs or "None available"]
```

This is an example structure, not a rigid template. Adapt it based on:
- the depth of findings in specific areas
- the completeness of the persona profile
- the review scope: component, screen, or full dashboard

The review should always include:
1. clear connection to the persona's documented profile
2. specific, actionable recommendations
3. prioritization by operational impact
4. explicit scope limits or uncertainty when evidence is incomplete
5. supporting-doc evidence when available

## Evaluation Principles

**Be specific to the persona**: Ground every observation in the documented profile (`Profile`, `About them`, `Hears`, `Sees`, `Says & Does`, `Pain Points`). If you cannot tie a point back to the persona, tighten it or drop it.

**Prioritize operational impact**: Focus first on what could slow, distract, confuse, or mislead the operator during real work. A small mismatch that breaks muscle memory can matter more than obvious visual polish issues.

**Assume domain expertise**: These operators are specialists. Do not recommend "simplifications" that remove complexity required for threat assessment, coordination, or mission execution.

**Consider the full context**: Read the whole profile before you conclude. Important insights often come from connecting responsibilities, systems, communication channels, and pain points.

**Connect across profile sections**: The strongest findings usually synthesize multiple profile sections, such as a pain point plus the systems they monitor plus the actions they routinely take.

**State evidence and uncertainty clearly**: Separate observed evidence from inference, especially when the review is based on screenshots or lacks supporting docs.

## Never Do When Reviewing

- Do not give generic UX advice such as "make it more intuitive" or "improve the user experience." Ground every observation in the persona's documented profile.
- Do not suggest simplifications that remove necessary operational complexity. Complexity that supports the persona's real responsibilities is often essential.
- Do not ignore operational context. A small inconsistency that interrupts a high-tempo workflow can matter more than a larger visual-style issue.
- Do not treat all personas as interchangeable. An E4 AST review should differ meaningfully from an O4 MCC review of the same interface.
- Do not skip loading the persona profile. Without it, the review loses the skill's main value.
- Do not present inference as fact when the evidence is partial.

## References

- **Persona profiles**: `references/personas/{persona-id}.md`
- **Persona index**: `references/personas/_index.md`
- **Evaluation examples**: `references/evaluation-examples.md`

Load these on demand to minimize context usage.
