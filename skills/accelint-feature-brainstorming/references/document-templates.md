# Document Templates

Templates for design documents created during brainstorming.

---

## Standard Design Document

Use this template for features and standard work:

```markdown
# [Feature/Component Name] Design

**Date:** YYYY-MM-DD
**Author:** [Name or Team]
**Type:** [Feature | Modification | Integration]
**Status:** Draft

## Problem Statement

### Background
[What context is needed to understand this problem?]

### Current State
[How do things work today?]

### Problem
[What specific problem are we solving?]

### Why Now
[Why is this important to solve now?]

## Solution Overview

[High-level description of the approach in 2-3 paragraphs]

## Architecture

### Components

**Component A**
- Responsibility: [What it does]
- Key logic: [Important behavior]
- Dependencies: [What it depends on]

**Component B**
- Responsibility: [What it does]
- Key logic: [Important behavior]
- Dependencies: [What it depends on]

### Component Diagram

```
┌─────────────┐
│ Component A │
└──────┬──────┘
       │
       v
┌─────────────┐
│ Component B │
└─────────────┘
```

### Relationships

[How components interact and communicate]

## Data Flow

### Input
[What data comes in and from where]

### Processing
[How data is transformed]

### Output
[What data goes out and where to]

### Data Flow Diagram

```
Input → Process → Transform → Output
```

## Key Decisions

### Decision 1: [Title]
- **Options considered:** [A, B, C]
- **Chosen:** [Option B]
- **Rationale:** [Why B over A and C]
- **Trade-offs:** [What we're accepting]

### Decision 2: [Title]
- **Options considered:** [A, B, C]
- **Chosen:** [Option A]
- **Rationale:** [Why A over B and C]
- **Trade-offs:** [What we're accepting]

## Error Handling

### Failure Mode 1: [Scenario]
- **Cause:** [What triggers this]
- **Impact:** [What breaks]
- **Recovery:** [How we handle it]
- **Mitigation:** [How we prevent it]

### Failure Mode 2: [Scenario]
- **Cause:** [What triggers this]
- **Impact:** [What breaks]
- **Recovery:** [How we handle it]
- **Mitigation:** [How we prevent it]

## Success Criteria

### Functional Requirements
- ✅ [Requirement 1]
- ✅ [Requirement 2]
- ✅ [Requirement 3]

### Non-Functional Requirements
- ✅ Performance: [Metric]
- ✅ Reliability: [Metric]
- ✅ Usability: [Metric]

### Acceptance Criteria
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]

## Out of Scope

Explicitly not included:

- ❌ [Feature/aspect 1] - Deferred to [later phase/never]
- ❌ [Feature/aspect 2] - Not needed because [reason]
- ❌ [Feature/aspect 3] - Out of scope because [reason]

## Future Considerations

Ideas deferred for later:

- 💡 [Idea 1] - Consider when [trigger]
- 💡 [Idea 2] - Consider when [trigger]
- 💡 [Idea 3] - Consider when [trigger]

## Open Questions

Unresolved items:

- ❓ [Question 1] - Need to determine [aspect]
- ❓ [Question 2] - Depends on [external factor]
- ❓ [Question 3] - To be decided during implementation

## References

- [Link to research source 1]
- [Link to research source 2]
- [Link to related internal doc]

## Appendix

### Alternatives Considered

**Approach A (Not chosen)**
- Description: [Brief summary]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Why rejected: [Reason]

**Approach B (Not chosen)**
- Description: [Brief summary]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Why rejected: [Reason]
```

---

## POC Document

Use this template for proof of concept work:

```markdown
# [Technology/Approach] POC

**Date:** YYYY-MM-DD
**Duration:** [Actual time spent]
**Status:** [In Progress | Complete | Abandoned]

## Hypothesis

[What we're trying to prove or disprove]

## Success Criteria

**Must prove:**
- [ ] [Critical requirement 1]
- [ ] [Critical requirement 2]

**Nice to validate:**
- [ ] [Optional validation 1]
- [ ] [Optional validation 2]

## Approach

[How we'll test the hypothesis]

### Setup
[What needs to be in place]

### Experiments
1. [Experiment 1]
2. [Experiment 2]
3. [Experiment 3]

## Results

### Experiment 1: [Name]
- **Expected:** [What we thought would happen]
- **Actual:** [What actually happened]
- **Conclusion:** [What this means]

### Experiment 2: [Name]
- **Expected:** [What we thought would happen]
- **Actual:** [What actually happened]
- **Conclusion:** [What this means]

## Findings

### What Worked
- ✅ [Finding 1]
- ✅ [Finding 2]

### What Didn't Work
- ❌ [Finding 1]
- ❌ [Finding 2]

### Surprises
- 💡 [Unexpected finding 1]
- 💡 [Unexpected finding 2]

## Recommendation

**Verdict:** [Proceed | Modify approach | Abandon | Need more info]

**Rationale:** [Why this verdict]

**If proceed, next steps:**
1. [Step 1]
2. [Step 2]

**If modify approach:**
- Change: [What to change]
- Reason: [Why change it]

## Risks Identified

- ⚠️ [Risk 1] - [Mitigation]
- ⚠️ [Risk 2] - [Mitigation]

## Code/Artifacts

- [Link to POC code]
- [Link to test results]
- [Link to benchmarks]

## Time Investment

- Setup: [X hours]
- Experimentation: [Y hours]
- Analysis: [Z hours]
- **Total:** [X+Y+Z hours]

**Was it worth it?** [Yes/No - brief reason]
```

---

## RFC Document

Use this template for request for comments:

```markdown
# RFC: [Title]

**RFC Number:** [Auto-assigned or manual]
**Date:** YYYY-MM-DD
**Author:** [Name/Team]
**Status:** [Draft | Review | Approved | Rejected | Superseded]
**Reviewers:** [List of required reviewers]
**Deadline:** [Feedback deadline]

## Summary

[2-3 sentence summary of the proposal]

## Motivation

### Problem
[What problem does this solve?]

### Why Now
[Why is this important to address now?]

### Context
[What background is needed to understand this?]

## Proposal

### High-Level Approach
[Overview of the solution]

### Detailed Design

#### Architecture
[Comprehensive architecture description]

#### Components
[Detailed component breakdown]

#### Data Flow
[How data moves through the system]

#### APIs/Interfaces
[Contract specifications]

#### Migration Path
[How we get from current to proposed]

## Impact Analysis

### Teams Affected
- **Team A:** [How they're impacted]
- **Team B:** [How they're impacted]

### Systems Affected
- **System A:** [What changes]
- **System B:** [What changes]

### Breaking Changes
- ⚠️ [Breaking change 1]
- ⚠️ [Breaking change 2]

### Migration Strategy
[How users/systems migrate to new approach]

## Trade-offs and Alternatives

### Chosen Approach Trade-offs
**Pros:**
- ✅ [Benefit 1]
- ✅ [Benefit 2]

**Cons:**
- ❌ [Cost 1]
- ❌ [Cost 2]

### Alternative 1: [Name]
- **Description:** [Brief]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]
- **Why not chosen:** [Reason]

### Alternative 2: [Name]
- **Description:** [Brief]
- **Pros:** [Benefits]
- **Cons:** [Drawbacks]
- **Why not chosen:** [Reason]

## Dependencies

### Required Before This
- [ ] [Dependency 1]
- [ ] [Dependency 2]

### Enables After This
- [ ] [Future work 1]
- [ ] [Future work 2]

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] |

## Success Metrics

[How we'll measure if this was successful]

- Metric 1: [Target]
- Metric 2: [Target]

## Timeline

- **Design Review:** [Date]
- **Approval Deadline:** [Date]
- **Implementation Start:** [Date]
- **Rollout:** [Date]

## Open Questions

1. [Question 1] - *Blocking or non-blocking?*
2. [Question 2] - *Assigned to: [Name]*
3. [Question 3] - *Due: [Date]*

## Appendix

### References
- [Related RFC]
- [External resource]
- [Research paper]

### Change Log
- YYYY-MM-DD: Initial draft
- YYYY-MM-DD: Incorporated feedback from [Reviewer]
- YYYY-MM-DD: Updated based on [Change]
```

---

## File Naming Conventions

### Features
```
docs/designs/YYYY-MM-DD-feature-name.md

Examples:
docs/designs/2024-01-15-user-notifications.md
docs/designs/2024-02-03-csv-export.md
```

### POCs
```
docs/pocs/YYYY-MM-DD-poc-name.md

Examples:
docs/pocs/2024-01-20-websocket-performance.md
docs/pocs/2024-02-10-graphql-federation.md
```

### RFCs
```
docs/rfcs/YYYY-MM-DD-rfc-title.md
docs/rfcs/NNNN-rfc-title.md  (if using RFC numbers)

Examples:
docs/rfcs/2024-01-25-authentication-overhaul.md
docs/rfcs/0042-authentication-overhaul.md
```

---

## Section Customization Guide

### When to Skip Sections

**Architecture** - Skip if:
- Simple single-component change
- No new components introduced

**Data Flow** - Skip if:
- UI-only change
- No data processing

**Error Handling** - Skip if:
- POC (defer to implementation)
- No error scenarios identified

**Alternatives** - Skip if:
- Only one viable approach
- POC (not decision document)

### When to Add Sections

**Security Considerations** - Add if:
- Authentication/authorization involved
- Sensitive data processed
- Public-facing API

**Performance Analysis** - Add if:
- Performance-critical feature
- Significant scale concerns
- User experience impact

**Compliance** - Add if:
- Regulatory requirements
- Privacy implications
- Industry standards

**Testing Strategy** - Add if:
- Complex testing needed
- RFC requiring test plan
- Novel testing approach

---

## Markdown Tips

### Diagrams with ASCII

```
┌─────────────┐     ┌─────────────┐
│   Client    │────>│   Server    │
└─────────────┘     └─────────────┘
        │                  │
        v                  v
┌─────────────┐     ┌─────────────┐
│   Storage   │<────│  Database   │
└─────────────┘     └─────────────┘
```

### Tables for Decisions

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A | Simple | Limited | ❌ |
| B | Flexible | Complex | ✅ |

### Callouts

```markdown
> **Note:** Important information

> **Warning:** Critical consideration

> **Tip:** Helpful suggestion
```

### Status Badges

- ✅ Complete
- ⏸️ In Progress
- ⏹️ Not Started
- ❌ Blocked
- 💡 Idea
- ⚠️ Risk
- ❓ Question
