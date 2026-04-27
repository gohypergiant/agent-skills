# Human Factors Audit

## Abstract

Systematic evaluation framework for defense and mission-critical software based on autopilot human factors principles. Evaluates 9 core categories: Authority, Transparency, Graceful Degradation, Cognitive Load, Physical Usability, Automation Trust, Mode Awareness, Temporal Awareness, and Error Tolerance. Designed for high-stakes systems where operator confusion or automation opacity creates life-safety risks.

---

## How to Use This Skill

1. **Start with SKILL.md**: Follow the audit workflow for systematic evaluation
2. **Load checklist on demand**: Reference [references/checklist.md](references/checklist.md) for detailed items
3. **Apply contextual judgment**: Same violation has different severity in different operational contexts

This structure provides complete audit methodology while minimizing initial context usage.

---

## Key Audit Principles

### Context-Driven Severity

The same checklist item violation has vastly different implications:

- **Missing undo in settings UI**: Minor usability issue
- **Missing undo in weapon targeting**: Critical safety violation
- **Opaque automation in route planning**: Major issue if alternatives exist
- **Opaque automation in threat detection**: Critical if no manual verification path

Always assess severity based on:
1. **Failure consequence**: Loss of life > mission failure > degraded performance
2. **Operator stress level**: Time-critical combat decisions vs routine monitoring
3. **Recovery availability**: Can operators detect and correct errors quickly?

### Evidence Over Claims

Documentation frequently overstates capabilities:
- Manual override "available" but requires 3 menu dives under time pressure
- System "provides explanations" but only shows post-hoc logs, not real-time reasoning
- "Graceful degradation" means features disappear with no warning
- "High contrast display" optimized for office monitors, unreadable in cockpit glare

**Always verify implementation against actual operational use:**
- Test override paths under simulated stress
- Verify degraded-mode behavior with sensors disabled
- Check readability in actual lighting conditions
- Measure cognitive load during multi-tasking scenarios

### Operational Environment Matters

Office software and cockpit software have fundamentally different constraints:

| Environment | Constraints | Design Implications |
|-------------|-------------|---------------------|
| **Office** | Stable lighting, precision input, low physical stress | Standard UI patterns acceptable |
| **Cockpit** | Glare, vibration, G-forces, gloves, time pressure | Large targets, high contrast, minimal steps |
| **Field** | Sunlight, weather, mobility, equipment constraints | Readable outdoors, simple gestures, offline capable |
| **Medical** | Sterile gloves, time-critical, life-safety, regulations | Touch-friendly, clear recovery, audit trails |

Design choices acceptable in one environment create failures in others. Always audit against the actual operational context.

---

## Audit Report Best Practices

### Effective Finding Structure

❌ **Vague**: "Poor error handling"
✅ **Specific**: "No undo available for target selection (Authority #4). If operator misclicks under time pressure, must restart entire targeting sequence. **Severity: Critical** - increases engagement delay by 15-20 seconds during time-sensitive scenarios."

❌ **Generic**: "System should be more transparent"
✅ **Specific**: "Threat classification confidence level not displayed (Transparency #3). Operators cannot distinguish high-confidence detections from borderline cases, leading to false positive alerts. **Severity: Major** - contributes to alert fatigue and over-trust in automation."

### Evidence Quality

**Strong evidence:**
- Code reference: `TargetingUI.tsx:145 - no confirmation dialog before commit`
- Screenshot: Alert modal shows decision but not confidence score
- Documentation: Training manual advises "trust the system" with no guidance on uncertainty indicators
- Incident report: 3 false activations attributed to lack of manual verification step

**Weak evidence:**
- "The system seems confusing"
- "Documentation suggests it might not be clear"
- "Industry best practices recommend X"

### Prioritization Framework

Use this hierarchy when multiple findings compete for limited remediation resources:

1. **Life-safety critical**: Loss of control authority, opaque life-safety automation, no error recovery in critical paths
2. **Mission-critical**: Cognitive overload in high-stress scenarios, poor degraded-mode behavior, mode confusion
3. **Performance degrading**: Excessive steps for common tasks, poor physical usability, missing timeline/history
4. **Quality-of-life**: Inconsistent terminology, suboptimal layouts, missing convenience features

---

## Common Audit Pitfalls

### Over-Generalization

Don't apply findings from one context to all:
- "No undo anywhere" is critical
- "No undo in view-only dashboard" is irrelevant

### Perfect Score Fallacy

100% checklist compliance doesn't mean safe system:
- Could have manual override that's too slow to use under pressure
- Could have explanations that are too complex for operational context
- Could meet all items but fail to integrate coherently

**Audit for effectiveness, not just compliance.**

### Ignoring Positive Findings

Not every audit is a critique session:
- Highlight good implementations as patterns to preserve
- Note where system exceeds baseline requirements
- Identify features that demonstrate deep understanding of operational needs

---

## When to Stop Auditing

Complete the audit when:

✅ All 9 categories evaluated against available evidence
✅ Findings prioritized by operational risk
✅ Recommendations are specific and actionable
✅ Report documents evidence locations and severity rationale

Incomplete audit signals:
❌ Categories skipped without N/A justification
❌ Findings lack specific evidence or severity assessment
❌ Recommendations are generic ("improve usability")
❌ No prioritization or risk-based ranking
