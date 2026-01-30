---
name: accelint-feature-acceptance-planning
description: Use when users say "define acceptance criteria", "create requirements", "plan a feature", or when starting feature development. Defines requirements, acceptance criteria, and success metrics for features before implementation. Keywords: requirements, acceptance criteria, user story, feature planning, specifications.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# Feature Acceptance Planning

Define clear requirements and acceptance criteria for features before implementation.

## NEVER Do When Defining Requirements

- **NEVER start implementation during requirements definition** - Zero code changes. This phase defines WHAT needs to be built, not HOW.
- **NEVER omit context from requirements** - The plan must contain ALL information needed for implementation: patterns, mandatory reading, documentation. Context is king.
- **NEVER leave acceptance criteria vague** - "Works correctly" is useless. Criteria must be specific, measurable, and testable.
- **NEVER assume feature type is obvious** - Explicitly classify: New Capability, Enhancement, Refactor, or Bug Fix. Different types need different considerations.
- **NEVER skip user story validation** - If user type, action, or benefit is unclear, ask. Ambiguous user stories lead to wrong implementations.
- **NEVER forget to document dependencies** - External libraries, services, or systems must be identified upfront, not discovered during implementation.
- **NEVER skip complexity assessment** - Understanding if something is Low/Medium/High complexity affects planning, resourcing, and validation strategy.

## Before Defining Requirements, Ask

Apply these tests to ensure complete requirements:

### Value & Scope Clarity
- **What specific problem does this solve?** Requirements must articulate why this matters and what users can't do currently.
- **Is the feature type clear?** New capability needs different criteria than enhancement or refactor.
- **What systems are affected?** Knowing boundaries prevents scope creep and identifies integration points.

### Testability & Completion
- **Can each criterion be objectively verified?** "User can delete items" needs deletion confirmation, error handling, and UI feedback specified.
- **What does "done" look like?** Completion checklist must cover functionality, tests, validation, and quality bars.

### Dependencies & Constraints
- **What external dependencies exist?** Libraries, services, APIs must be identified before implementation starts.
- **Are there non-obvious constraints?** Performance requirements, compatibility needs, or integration requirements.

## Requirements Definition Process

Follow these 6 steps in order to create complete feature requirements:

**Copy this checklist to track progress:**

```
- [ ] Step 1: Feature Understanding - Analyze problem, value, and complexity
- [ ] Step 2: User Story - Create clear user story with validation
- [ ] Step 3: Problem & Solution - Document specific statements
- [ ] Step 4: Feature Metadata - Classify type, complexity, systems, dependencies
- [ ] Step 5: Acceptance Criteria - Define testable success criteria
- [ ] Step 6: Completion Checklist - Create verification checklist
```

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

## Freedom Calibration

**Calibrate guidance specificity to task fragility:**

| Task Type | Freedom Level | Guidance Format | Example |
|-----------|---------------|-----------------|---------|
| **Requirements Definition** | Low freedom | Exact template, specific steps, required sections | "Use exact output format with all sections" |
| **Criteria Writing** | Medium freedom | Guidelines with examples, must be testable | "Functional requirements must specify exact behavior" |
| **Problem Analysis** | High freedom | Principles for understanding, ask clarifying questions | "Extract core problem being solved" |

**The test:** "If requirements are incomplete, what's the consequence?"
- Missing acceptance criteria → Implementation uncertainty, scope creep, incomplete features
- Vague problem statement → Wrong solution built
- Unclear dependencies → Blocked implementation, mid-stream architecture changes

Requirements definition needs **low freedom** for structure and format, **medium freedom** for criteria specificity, and **high freedom** for problem understanding.

## Reporting to User

After completing requirements definition, report:
- Requirements file path
- Feature summary (1-2 sentences)
- Complexity assessment (Low/Medium/High)
- Number of acceptance criteria defined
- Ready for implementation planning: YES/NO (NO if clarifications still needed)

## Important Notes

- When stuck or unsure, ask the user to clarify. Better to ask than to make assumptions about requirements.
- The requirements document becomes the contract for implementation. Everything the implementation team needs must be in this document.
- If the feature request is too vague to create specific acceptance criteria, that's a sign to ask more questions before proceeding.
