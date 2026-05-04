---
name: human-factors-audit
description: Use when auditing defense, aerospace, or mission-critical software for human factors compliance. Evaluates systems against autopilot-inspired checklist covering authority, transparency, degradation, cognitive load, physical usability, automation trust, mode awareness, temporal awareness, and error tolerance. Use when users say "audit for human factors", "review safety-critical interface", "check mission system UX", or when reviewing high-stakes automation systems.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.1"
---

# Human Factors Audit

Systematic evaluation of defense and mission-critical software against autopilot-inspired human factors principles. Ensures operators maintain authority, systems remain transparent, and failures degrade gracefully under stress.

## NEVER Do When Auditing

- **NEVER audit without understanding operational context** - A medical device and a fighter jet have different stress profiles, failure modes, and time constraints. Same checklist, different severity thresholds.
- **NEVER treat all violations as equal** - Missing undo on a settings page ≠ missing manual override on weapon systems. Prioritize by consequence: loss of life > mission failure > operator frustration.
- **NEVER assume compliance from documentation alone** - Manuals claim "manual override available" while the actual interface hides it under three menus during automation. Test actual implementation paths.
- **NEVER ignore physical operating environment** - Cockpit glare, turbulence, G-forces, gloved hands, and time pressure aren't edge cases in defense systems—they're standard conditions.
- **NEVER skip degraded-mode testing** - Systems that work perfectly with full sensors but become opaque when GPS fails create the highest-risk situations. Audit behavior at capability boundaries.
- **NEVER assess automation trust in isolation** - Under-trust (ignoring valid alerts) and over-trust (failing to monitor) both kill. Assess whether the system actively maintains appropriate operator engagement.
- **NEVER accept "it's intuitive" without evidence** - Intuition fails under stress and time pressure. Require explicit training materials, decision trees, and recovery procedures.

## Before Auditing, Ask

### Scope Definition
- **What is the system's mission-critical function?** Directly supports life-safety decisions, enables mission success, or provides operator situational awareness?
- **What are the failure consequences?** Loss of life, mission failure, equipment damage, data loss, or operator confusion?
- **What is the operational environment?** Cockpit, vehicle, field deployment, control room, medical setting?

### Context Assessment
- **Who are the operators?** Training level, stress exposure, physical constraints (gloved, seated/standing, lighting conditions)?
- **What automation level exists?** Full manual, assisted, semi-autonomous, supervisory control, full autonomous with override?
- **What happens when sensors fail?** Does the system degrade gracefully or fail catastrophically?

### Audit Boundaries
- **What is in scope?** Entire system, specific subsystem, new feature, interface redesign?
- **What existing standards apply?** MIL-STD-1472, DO-178C, IEC 62366, ARINC 661, or internal certification requirements?
- **What documentation exists?** Design specs, training materials, incident reports, user complaints?

## Audit Workflow

### 1. Preparation

**MANDATORY - READ ENTIRE FILE**: Before proceeding with the audit, you MUST read [`references/checklist.md`](references/checklist.md) completely (~170 lines) from start to finish. **NEVER set any range limits when reading this file.** This provides the complete evaluation criteria for all 9 categories.

**Do NOT load** `assets/audit-report-template.md` until Step 5 (Report Generation).

All 9 evaluation categories:

1. **Authority** - Human in control
2. **Transparency** - Explainable behavior
3. **Graceful Degradation** - Fail soft
4. **Cognitive Load** - Designed for stress
5. **Physical Usability** - Real environments
6. **Automation Trust** - Appropriate reliance
7. **Mode Awareness** - No surprises
8. **Temporal Awareness** - Trends over time
9. **Error Tolerance** - Safe recovery

### 2. Evidence Collection

Gather audit evidence systematically:

**Code Review:**
- UI components and control flows
- State management and mode transitions
- Error handling and recovery paths
- Override mechanisms and authority chains
- Automation decision logic

**Interface Review:**
- Screenshots, mockups, or live system access
- Modal states and transition behaviors
- Alert/warning presentation
- Information hierarchy and layout
- Physical control mappings

**Documentation Review:**
- Training materials and procedures
- Incident reports and user feedback
- Design specifications and requirements
- Certification documents (if available)

**Checkpoint before proceeding to evaluation**:
- [ ] Code review completed (or limitation documented)
- [ ] Interface access obtained or screenshots collected
- [ ] Documentation gathered or absence noted
- [ ] Operational context understood (environment, operators, failure consequences)

### 3. Category-by-Category Evaluation

For each of the 9 categories:

**Score each checklist item:**
- ✅ **Pass** - Requirement fully met with evidence
- ⚠️  **Partial** - Partially implemented or context-dependent
- ❌ **Fail** - Requirement not met or contradicted by evidence
- ⭕ **N/A** - Not applicable to this system/scope

**Document findings:**
- Specific evidence (code locations, screenshot references, doc sections)
- Severity assessment (critical/major/minor based on failure consequences)
- Concrete examples of violations or good implementations

**Identify impact:**
- Operational risk (what can go wrong?)
- Operator workload (cognitive or physical burden added?)
- Mission effectiveness (degrades performance under what conditions?)

**Checkpoint before proceeding to synthesis**:
- [ ] All 9 categories evaluated (or marked N/A with justification)
- [ ] Evidence documented for each finding (code locations, screenshots, doc references)
- [ ] Severity assessed for each failing item (Critical/Major/Minor or flagged as indeterminate)
- [ ] Pass/Partial/Fail/N/A scoring completed for all applicable checklist items

### 4. Synthesis and Prioritization

After evaluating all categories:

**Calculate coverage:**
- Total applicable items
- Items passed/partial/failed
- Category-level scores (e.g., "Authority: 3/5 passed")

**Prioritize findings by risk:**

**Critical (fix immediately):**
- Loss of manual override capability
- Opaque automation in life-safety systems
- No recovery from common errors
- Unreadable displays in operational conditions

**Major (fix before deployment):**
- Cognitive overload during high-stress scenarios
- Inconsistent mode indications
- Missing confidence/uncertainty indicators
- Poor degraded-mode behavior

**Minor (improvement opportunities):**
- Suboptimal information layout
- Missing timeline/history features
- Inconsistent terminology
- Excessive steps for common tasks

**Checkpoint before proceeding to report**:
- [ ] Coverage calculated (X/Y items passed per category)
- [ ] Findings prioritized by operational risk (Critical > Major > Minor)
- [ ] Each finding has specific remediation recommendation
- [ ] Positive findings identified (good implementations to preserve)

### 5. Report Generation

**NOW load** [`assets/audit-report-template.md`](assets/audit-report-template.md) - Use this structure for final report.

Structure the audit report:

```markdown
# Human Factors Audit Report
System: [Name]
Date: [Date]
Auditor: [Name/Role]
Scope: [What was evaluated]

## Executive Summary
- Overall compliance: X/Y items passed
- Critical findings: [Count]
- Major findings: [Count]
- Key recommendations: [Top 3]

## Findings by Category

### 1. Authority — Human in Control
Score: X/Y items passed
- ✅ [Item]: [Evidence]
- ❌ [Item]: [Evidence] | **Severity: Critical** | [Impact]
- ⚠️ [Item]: [Evidence] | **Severity: Major** | [Context]

[Repeat for all 9 categories]

## Prioritized Recommendations

### Critical (Immediate Action Required)
1. [Finding]: [Specific remediation]
2. [Finding]: [Specific remediation]

### Major (Before Next Release)
1. [Finding]: [Specific remediation]

### Minor (Improvement Opportunities)
1. [Finding]: [Specific remediation]

## Conclusion
[Overall assessment of system safety and operator support]
[Certification/deployment readiness opinion]
```

## Handling Common Challenges

### System Still in Design (No Implementation)

When auditing mockups, wireframes, or design files rather than implemented systems:

**Use Figma MCP integration** - Load [references/figma-integration.md](references/figma-integration.md) for detailed guidance on:
- Extracting design context from Figma URLs or desktop app
- Getting screenshots for visual inspection
- Evaluating variables and design systems
- Documenting design-phase limitations

**Quick reference**:
- ✅ Can evaluate: Visual hierarchy, mode awareness, physical usability (touch targets, contrast)
- ⚠️ Limited evaluation: Automation behavior, degradation paths, temporal awareness
- ❌ Cannot evaluate: Actual implementation of overrides, real-time explanations, error recovery paths

**Document clearly**: "Audit conducted on design artifacts only. Implementation validation required before certification."

### Documentation Unavailable

When design specs, training materials, or operational procedures don't exist:

**Helpful error message**:
```
⚠️ DOCUMENTATION GAP: No design specifications or training materials available.

Impact on audit:
- Cannot verify intended behavior vs implemented behavior
- Cannot assess training burden or operator preparation
- Cannot validate against stated requirements

Recommended actions:
1. Flag as critical finding: "No training materials exist for operators"
2. Reverse-engineer intent from implementation only
3. Note limitation prominently in Executive Summary
4. Recommend documentation creation as critical remediation

Audit proceeds with: Implementation review + operator interviews (if available)
```

Continue audit using available evidence but escalate documentation absence as a **Major finding** under Transparency category.

### Operators Unavailable for Interviews

When operators cannot participate due to security clearance, contract limitations, or operational tempo:

**Primary approach - Invoke persona-review skill**:
```
If persona-review skill is available:
- Use persona-review to simulate operator perspective
- Apply human factors engineering judgment based on operational context
- Generate operator personas matching system's user profile
```

**Fallback approach - Human factors engineer judgment**:
```
If persona-review unavailable or branch doesn't have skill:
- Leverage human factors engineering principles directly
- Reference industry baselines for similar operator populations
  - Military pilots: High training, high stress, gloved operation
  - Medical staff: Time-critical, sterile environment, regulatory constraints
  - Vehicle operators: Mobile platform, environmental exposure, divided attention
- Apply conservative severity assessments (assume worst-case operator constraints)
- Document clearly: "Audit conducted without operator input. Validation with actual users required."
```

**Document limitation**: Note in Executive Summary that operator validation is required before final certification.

### Conflicting Checklist Items

When two checklist requirements appear to conflict (e.g., "minimize alerts" vs "show confidence levels"):

**This is valuable insight - not a problem**:

1. **Document the conflict explicitly**:
   ```markdown
   ⚡ DESIGN TENSION IDENTIFIED

   Checklist items in tension:
   - Cognitive Load #1: "Limited simultaneous alerts"
   - Transparency #3: "Confidence levels shown"

   Conflict: Showing confidence for every alert increases alert count/complexity
   ```

2. **Analyze the trade-off**:
   - What does each requirement protect against?
   - What's the operational context?
   - What's the failure mode of each approach?

3. **Recommend resolution**:
   ```markdown
   Recommended approach: Show confidence levels ONLY for:
   - Life-safety decisions (weapon engagement, collision avoidance)
   - Borderline detections (confidence < 80%)

   Suppress confidence display for:
   - Routine alerts (confidence > 95%)
   - Non-critical notifications

   Rationale: Preserves transparency for high-stakes decisions while
   managing cognitive load during routine operations.
   ```

4. **Elevate as positive finding**: Design tensions reveal sophisticated understanding of operational trade-offs. Include in report as evidence of thoughtful design.

### Cannot Determine Severity

When evidence is insufficient to assess whether a violation is Critical, Major, or Minor:

**Flag explicitly with limiting factors**:

```markdown
⚠️ SEVERITY INDETERMINATE: [Finding description]

Checklist item: [Category #X]
Evidence: [What was observed]

Limiting factors preventing severity assessment:
- [ ] Failure consequence unknown (no operational context provided)
- [ ] Operator stress level unclear (no user profile available)
- [ ] Recovery capability uncertain (degraded-mode behavior not documented)
- [ ] Similar system benchmarks unavailable
- [ ] Time-pressure constraints unknown
- [ ] Life-safety involvement unclear

Required to determine severity:
- [Specific information needed, e.g., "Operator training level and time constraints"]
- [Specific information needed, e.g., "Consequence analysis: what happens if this fails?"]

Provisional assessment: [Critical/Major/Minor] - VALIDATE WITH STAKEHOLDERS
Rationale: [Conservative reasoning, e.g., "Assuming worst-case: time-critical operation"]
```

**Conservative default**: When uncertain, assume higher severity and escalate for stakeholder input. Document: "Severity requires validation with [operators/safety engineers/domain experts]."

## Progressive Disclosure

**Start with:** This SKILL.md file for workflow and anti-patterns

**Load when needed:**
- [references/checklist.md](references/checklist.md) - Full 9-category checklist with all items and impact descriptions
- [references/figma-integration.md](references/figma-integration.md) - Detailed guidance for design-phase audits using Figma MCP (load only when auditing mockups/wireframes)

**Reference externally (not included):**
- Relevant military/aerospace standards (MIL-STD-1472, DO-178C, etc.)
- System-specific design documentation
- Training materials and operational procedures
- persona-review skill (if unavailable on branch, use human factors engineer judgment)

## Calibration Notes

This audit requires **medium freedom** with expert judgment:

- **Checklist provides structure** - Clear items to evaluate
- **Context determines severity** - Same violation has different risk in different systems
- **Evidence quality matters** - Push for concrete examples over claims
- **Operator safety is paramount** - When uncertain, prioritize preventing operator error and maintaining control authority

The goal is not perfect scores but appropriate implementations for the specific operational context and risk profile.
