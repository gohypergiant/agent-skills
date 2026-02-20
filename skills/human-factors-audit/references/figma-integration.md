# Figma Integration for Design-Phase Audits

When auditing systems still in design phase (mockups, wireframes, prototypes), use Figma MCP to access design artifacts.

## Getting Design Context

### Option 1: From Figma URL
When user provides a Figma URL like:
```
https://figma.com/design/:fileKey/:fileName?node-id=1-2
```

Extract node ID by converting format: `1-2` → `1:2`

Then call:
```
mcp__figma-desktop__get_design_context(
  nodeId: "1:2",
  clientLanguages: "design-review",
  clientFrameworks: "human-factors-audit"
)
```

### Option 2: From Figma Desktop App
If user has Figma desktop app open with design selected:
```
mcp__figma-desktop__get_design_context(
  clientLanguages: "design-review",
  clientFrameworks: "human-factors-audit"
)
```
Omit `nodeId` to use currently selected node.

## Getting Screenshots

For visual inspection of specific frames, components, or screens:
```
mcp__figma-desktop__get_screenshot(
  nodeId: "1:2",
  clientLanguages: "design-review",
  clientFrameworks: "human-factors-audit"
)
```

Use screenshots to evaluate:
- Visual hierarchy and information density
- Touch target sizes (minimum 44x44px for mobile, 32x32px for desktop)
- Color contrast ratios (4.5:1 for text, 3:1 for UI elements)
- Mode indicators and state visibility
- Alert/warning visual prominence

## Audit Constraints for Design-Phase Systems

### Can Evaluate ✅
- **Physical Usability**: Touch target sizes, contrast ratios, glove-friendly designs
- **Mode Awareness**: Visual indicators for modes, state transitions shown in mockups
- **Visual Cognitive Load**: Information density, alert prominence, layout consistency
- **Error Tolerance**: Confirmation dialogs shown, undo buttons visible

### Limited Evaluation ⚠️
- **Automation Trust**: Can see confidence displays if mocked, but not real behavior
- **Graceful Degradation**: Can evaluate if design shows degraded states, but not transitions
- **Temporal Awareness**: Can see history/timeline UI if designed, but not actual data
- **Transparency**: Can see explanation UI but not actual decision logic

### Cannot Evaluate ❌
- **Authority**: Cannot test actual manual override implementation
- **Real-time Behavior**: Cannot verify automation actually responds to manual inputs
- **Error Recovery**: Cannot test actual recovery paths under stress
- **Degraded-Mode Behavior**: Cannot disable sensors to verify graceful degradation
- **Performance Under Load**: Cannot test cognitive load with real multi-tasking

## Documenting Design-Phase Limitations

Always include in audit report:

```markdown
## Audit Scope Limitation

**Design-Phase Audit**: This evaluation was conducted on design artifacts (Figma mockups)
prior to implementation. Findings reflect design intent, not implemented behavior.

**Validation Required**:
- Manual override mechanisms must be tested in implemented system
- Degraded-mode behavior requires sensor simulation testing
- Cognitive load assessment requires user testing with real operators
- Automation transparency requires runtime testing with actual decision logic

**Certification Status**: Design-phase approval only. Implementation validation required
before operational deployment or safety certification.
```

## Design-Phase Specific Findings

Structure findings to distinguish design intent from implementation gaps:

❌ **Design Gap** - Issue visible in design artifacts
```markdown
**No manual override button visible in automation mode** (Authority #1)
- Evidence: Figma frame "AutoPilot-Active" shows no override control
- Severity: Critical - operators cannot take control during automation
- Recommendation: Add prominent "MANUAL OVERRIDE" button, always visible
```

⚠️ **Implementation Risk** - Design shows intent, but implementation uncertain
```markdown
**Confidence level display designed but implementation unclear** (Transparency #3)
- Evidence: Figma shows "Confidence: 87%" label in threat detection modal
- Uncertainty: Real-time confidence calculation not specified
- Recommendation: Verify implementation provides actual confidence scores, not placeholders
```

✅ **Design Strength** - Good design pattern worth preserving
```markdown
**High contrast alert colors with redundant text** (Physical Usability #2)
- Evidence: Critical alerts use red background + "CRITICAL" text + icon
- Strength: Accessible to colorblind users, readable in bright sunlight
- Recommendation: Preserve this pattern in implementation
```

## Variable Extraction for Design Systems

For design systems with variables (colors, spacing, typography):
```
mcp__figma-desktop__get_variable_defs(
  nodeId: "1:2",
  clientLanguages: "design-review",
  clientFrameworks: "human-factors-audit"
)
```

Check for:
- High contrast ratios defined in color variables
- Consistent spacing for touch targets
- Typography scales appropriate for operational environment
- Mode-specific color schemes (normal, degraded, emergency)

## Code Connect (If Available)

If design is connected to implementation via Code Connect:
```
mcp__figma-desktop__get_code_connect_map(
  nodeId: "1:2",
  clientLanguages: "design-review",
  clientFrameworks: "human-factors-audit"
)
```

Use to:
- Link design findings to specific code files
- Verify design intent matches implementation
- Provide concrete file paths in remediation recommendations

## Common Design-Phase Anti-Patterns

Watch for these issues visible in mockups:

- **Invisible modes**: No visual indicator distinguishing automated vs manual control
- **Hidden overrides**: Manual control buried in menus or sub-screens
- **Low contrast**: Designs look good on designer's monitor but fail in operational environments
- **Small touch targets**: Buttons <44x44px unusable with gloves or in turbulence
- **Information overload**: Too many simultaneous elements competing for attention
- **Inconsistent patterns**: Same action represented differently across screens
- **No degraded states**: Only "happy path" designed, no sensor failure states shown
