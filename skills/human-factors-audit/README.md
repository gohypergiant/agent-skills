# Human Factors Audit

Systematic evaluation of defense and mission-critical software against autopilot-inspired human factors principles.

## Overview

This skill enables AI agents to conduct comprehensive human factors audits of software systems where operator errors can have life-safety consequences. Based on aerospace and mission-critical system practices, it evaluates 9 core categories:

1. **Authority** — Human in Control
2. **Transparency** — Explainable Behavior
3. **Graceful Degradation** — Fail Soft
4. **Cognitive Load** — Designed for Stress
5. **Physical Usability** — Real Environments
6. **Automation Trust** — Appropriate Reliance
7. **Mode Awareness** — No Surprises
8. **Temporal Awareness** — Trends Over Time
9. **Error Tolerance** — Safe Recovery

## When to Use

This skill is designed for auditing:

- **Defense systems**: Weapon systems, C4ISR, battlefield management
- **Aerospace**: Flight controls, autopilots, navigation systems
- **Medical devices**: Surgical robots, critical care monitors, infusion pumps
- **Industrial control**: Nuclear, chemical, power generation systems
- **Autonomous vehicles**: Self-driving cars, drones, maritime vessels

**Not designed for**: Consumer apps, websites, business software (unless life-safety critical)

## Quick Start

Simply ask:

```
"Audit this code for human factors compliance"
"Review this interface against mission-critical UX standards"
"Evaluate this automation system for operator safety"
```

The agent will:
1. Understand your system's operational context
2. Evaluate against all 9 checklist categories
3. Prioritize findings by life-safety risk
4. Generate a detailed audit report with specific remediation steps

## What You'll Get

A structured audit report including:

- **Compliance scores** for each category
- **Critical findings** requiring immediate attention
- **Specific evidence** (code locations, screenshots, documentation references)
- **Severity assessments** based on operational consequences
- **Prioritized recommendations** with concrete remediation steps

## Example Findings

**Critical**: "No manual override available during automated threat response (Authority #1). Operators cannot intervene if automation misclassifies friendly assets. Risk: Fratricide incident."

**Major**: "Automation confidence level not displayed (Transparency #3). Operators cannot distinguish certain detections from uncertain ones, leading to inappropriate trust calibration."

**Minor**: "Common targeting workflow requires 5 steps (Cognitive Load #4). Benchmark systems accomplish same task in 3 steps. Increases time-to-engagement by ~8 seconds."

## File Structure

```
human-factors-audit/
├── SKILL.md              # Main audit workflow and methodology
├── AGENTS.md             # Agent-specific guidance and principles
├── README.md             # This file (human-readable overview)
└── references/
    └── checklist.md      # Complete 9-category checklist with all items
```

## Key Principles

### Context-Driven Severity

The same violation has different implications in different systems:
- Missing undo in settings = minor usability issue
- Missing undo in weapon targeting = critical safety violation

### Evidence-Based Evaluation

Don't trust documentation alone:
- Claims of "manual override" may hide it under 3 menus
- "Graceful degradation" may mean features disappear with no warning
- Test actual implementation against operational conditions

### Operational Environment Matters

Office software and cockpit software have fundamentally different constraints:
- Cockpit: glare, vibration, G-forces, gloves, time pressure
- Field: sunlight, weather, mobility, equipment constraints
- Medical: sterile environment, regulations, audit requirements

## How It Works

The skill uses **progressive disclosure** to minimize context usage:

1. **SKILL.md** loads first with workflow and anti-patterns
2. **Checklist** loads on-demand when evaluating specific categories
3. Agent applies contextual judgment based on operational environment

This structure provides complete audit capability while keeping the initial context footprint small.

## Requirements

To conduct an effective audit, you'll need:

- **System access**: Code, designs, or live system for testing
- **Context**: Operational environment, operator profile, failure consequences
- **Documentation** (if available): Design specs, training materials, incident reports

The agent will ask clarifying questions to understand your specific context before beginning the audit.

## License

Apache-2.0

## Author

gohypergiant

## Version

1.0
