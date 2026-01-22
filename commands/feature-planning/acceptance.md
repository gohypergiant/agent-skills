---
description: "Define feature requirements, acceptance criteria, and success metrics"
---

# Acceptance: Requirements Definition

## Mission

Understand the feature request and define clear acceptance criteria for success.

**Core Principle**: Zero code changes. Define WHAT needs to be built and WHAT "done" means.

**When Stuck**: Ask the user. If you get stuck or are unsure, ask the user to clarify.

**Key Philosophy**: Context is King. The plan must contain ALL information needed for implementation - patterns, mandatory reading, and documentation.

**Input**: Feature request as $ARGUMENTS
**Output**: Requirements section for plan in `.agents/acceptance/{feature-name}-requirements.md`

## Process

### Step 1: Feature Understanding

**Deep Feature Analysis:**
- Extract the core problem being solved
- Identify user value and business impact
- Determine feature type: [New Capability | Enhancement | Refactor | Bug Fix]
- Assess complexity: [Low | Medium | High]
- Map affected systems and components

### Step 2: Create/Refine User Story

```
As a <type of user>
I want to <action/goal>
So that <benefit/value>
```

**Clarify with user if:**
- User type is unclear
- Desired action is ambiguous
- Value proposition is undefined

### Step 3: Problem & Solution Statements

**Problem Statement:**
- What specific problem or opportunity does this address?
- Why does this problem matter?
- What are users unable to do currently?

**Solution Statement:**
- How will this feature solve the problem?
- What are the key capabilities?
- What is the high-level approach?

### Step 4: Feature Metadata

Document:
- **Feature Type**: New Capability | Enhancement | Refactor | Bug Fix
- **Estimated Complexity**: Low | Medium | High
- **Primary Systems Affected**: List components/packages
- **Dependencies**: External libraries or services required

### Step 5: Define Acceptance Criteria

Create **specific, measurable, testable** criteria:

**Functional Requirements:**
- [ ] What specific functionality must work?
- [ ] What user interactions must be supported?
- [ ] What data transformations must occur?

**Quality Requirements:**
- [ ] All validation commands pass with zero errors
- [ ] Unit test coverage ≥80%
- [ ] Code follows project conventions
- [ ] No regressions in existing functionality

**Integration Requirements:**
- [ ] Integrates with existing systems (list specific systems)
- [ ] Package exports configured correctly
- [ ] TypeScript types properly exported

**Performance Requirements (if applicable):**
- [ ] Meets response time requirements
- [ ] Handles expected load
- [ ] No memory leaks

**Documentation Requirements:**
- [ ] Code documentation (JSDoc, comments)
- [ ] User documentation (if user-facing)
- [ ] Storybook stories (if UI component)

### Step 6: Completion Checklist

Define the checklist for verifying completion:

```markdown
## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes
- [ ] No linting or type checking errors
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability
```

## Output Format

**File**: `.agents/acceptance/{kebab-case-feature-name}-requirements.md`

```markdown
# Acceptance: {feature-name}

Date: {timestamp}

## Feature Description

{1-2 paragraph description of feature, purpose, and user value}

## User Story

As a {user_type}
I want to {action}
So that {benefit}

## Problem Statement

{Specific problem or opportunity this addresses. Why it matters. What users can't do currently.}

## Solution Statement

{How this feature solves the problem. Key capabilities. High-level approach.}

## Feature Metadata

**Feature Type**: {New Capability | Enhancement | Refactor | Bug Fix}
**Estimated Complexity**: {Low | Medium | High}
**Primary Systems Affected**:
- {component/package 1}
- {component/package 2}

**Dependencies**:
- {library} ({version})
- {service} ({version})

---

## ACCEPTANCE CRITERIA

### Functional Requirements

- [ ] {Specific functionality 1}
- [ ] {Specific functionality 2}
- [ ] {Specific user interaction 1}
- [ ] {Specific data transformation 1}

### Quality Requirements

- [ ] All validation commands pass with zero errors
- [ ] Unit test coverage meets requirements (80%+)
- [ ] Code follows project conventions and patterns
- [ ] No regressions in existing functionality

### Integration Requirements

- [ ] Integrates with {system 1}
- [ ] Integrates with {system 2}
- [ ] Package exports configured correctly
- [ ] TypeScript types are properly exported

### Performance Requirements

- [ ] {Response time requirement}
- [ ] {Load handling requirement}
- [ ] {Memory/resource requirement}

### Documentation Requirements

- [ ] {Documentation type 1 completed}
- [ ] {Documentation type 2 completed}

---

## COMPLETION CHECKLIST

- [ ] All implementation tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes (unit + integration)
- [ ] No linting or type checking errors
- [ ] Manual testing confirms feature works correctly
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability
- [ ] {Any additional completion items}

---

## NOTES

### Initial Considerations

{Any early design decisions, constraints, or trade-offs to keep in mind}

### Success Definition

Feature is complete when all acceptance criteria are met and completion checklist is fully checked.
```

## Report to User

After completion:
- Requirements file path
- Feature summary
- Complexity assessment
- Number of acceptance criteria defined
- Ready for implementation planning: YES/NO
