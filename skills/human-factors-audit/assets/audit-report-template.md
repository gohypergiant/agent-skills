# Human Factors Audit Report

**System**: [System Name]
**Date**: [Audit Date]
**Auditor**: [Name/Role]
**Scope**: [What was evaluated - full system, subsystem, specific feature, etc.]

---

## Executive Summary

**Overall Compliance**: [X/Y] items passed ([percentage]%)
**Critical Findings**: [Count]
**Major Findings**: [Count]
**Minor Findings**: [Count]

**Key Recommendations**:
1. [Top priority recommendation]
2. [Second priority recommendation]
3. [Third priority recommendation]

**Deployment Readiness**: [Ready / Conditional / Not Ready]
**Rationale**: [Brief explanation of readiness assessment]

---

## Findings by Category

### 1. Authority — Human in Control

**Score**: [X/Y] items passed

#### ✅ Passing Items
- **[Item description]**: [Evidence - code reference, screenshot, documentation]

#### ❌ Failing Items
- **[Item description]**: [Evidence]
  - **Severity**: Critical | Major | Minor
  - **Impact**: [What can go wrong? Operational consequences]
  - **Recommendation**: [Specific remediation steps]

#### ⚠️ Partial Implementations
- **[Item description]**: [Evidence]
  - **Status**: [What's implemented, what's missing]
  - **Context**: [When it works, when it fails]
  - **Recommendation**: [How to complete implementation]

#### ⭕ Not Applicable
- **[Item description]**: [Why N/A - e.g., "System has no automation to override"]

---

### 2. Transparency — Explainable Behavior

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 3. Graceful Degradation — Fail Soft

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 4. Cognitive Load — Designed for Stress

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 5. Physical Usability — Real Environments

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 6. Automation Trust — Appropriate Reliance

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 7. Mode Awareness — No Surprises

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 8. Temporal Awareness — Trends Over Time

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

### 9. Error Tolerance — Safe Recovery

**Score**: [X/Y] items passed

[Repeat structure from Category 1]

---

## Prioritized Recommendations

### Critical (Immediate Action Required)

**Finding 1**: [Description]
- **Evidence**: [Specific code/design reference]
- **Risk**: [Life-safety / mission-critical consequence]
- **Remediation**: [Specific steps to fix]
- **Estimated Effort**: [Hours/days if known]

**Finding 2**: [Description]
[Same structure]

---

### Major (Fix Before Next Release)

**Finding 1**: [Description]
- **Evidence**: [Specific code/design reference]
- **Risk**: [Performance degradation / operator burden]
- **Remediation**: [Specific steps to fix]
- **Estimated Effort**: [Hours/days if known]

**Finding 2**: [Description]
[Same structure]

---

### Minor (Improvement Opportunities)

**Finding 1**: [Description]
- **Evidence**: [Specific code/design reference]
- **Benefit**: [Quality-of-life improvement]
- **Remediation**: [Specific steps to fix]
- **Estimated Effort**: [Hours/days if known]

**Finding 2**: [Description]
[Same structure]

---

## Positive Findings

Highlight implementations that exceed baseline requirements or demonstrate exceptional understanding of operational needs:

- **[Good implementation 1]**: [What makes it effective]
- **[Good implementation 2]**: [Pattern to preserve]
- **[Good implementation 3]**: [Example for future development]

---

## Testing Recommendations

Suggest specific tests to validate fixes and ongoing compliance:

1. **Manual override testing**: [Specific scenario to test under time pressure]
2. **Degraded-mode testing**: [Which sensors to disable, expected behavior]
3. **Stress testing**: [Cognitive load scenarios - multi-tasking, alerts, time pressure]
4. **Environmental testing**: [Lighting conditions, physical constraints, operator equipment]

---

## Appendices

### A. Evidence References

List all code files, screenshots, documents referenced in findings:
- `[File path]`: [Lines XX-YY]
- `[Screenshot]`: [Description]
- `[Document]`: [Section/page]

### B. Applicable Standards

List relevant standards evaluated against:
- MIL-STD-1472 (Human Engineering)
- DO-178C (Software Considerations in Airborne Systems)
- IEC 62366 (Medical Device Usability)
- ARINC 661 (Cockpit Display Systems)
- [Other applicable standards]

### C. Audit Methodology

Brief description of:
- Evidence collection approach (code review, live testing, documentation review)
- Severity assessment criteria
- Context and assumptions
- Limitations or scope exclusions

---

## Conclusion

[Overall assessment of system's human factors compliance]

[Summary of highest-priority risks and remediation timeline]

[Certification/deployment readiness opinion with rationale]

---

**Report prepared by**: [Name]
**Date**: [Date]
**Contact**: [Email/contact info]
