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

## Scope

**Use this skill when:**
- Planning acceptance criteria for NEW features before implementation
- Defining requirements for significant enhancements
- Creating validation strategy for complex changes
- Starting feature development that needs clear success criteria

**Do NOT use this skill for:**
- Bug fixes (go directly to implementation)
- Trivial changes or small tweaks (over-planning wastes time)
- Features already implemented (use code review instead)
- Emergency hotfixes (speed over process)

After completing acceptance planning, proceed to **implementation planning** to define the HOW.

## NEVER Do When Defining Requirements

### Core Anti-Patterns (Enhanced)

- **NEVER start implementation during requirements definition** - Zero code changes. This phase defines WHAT needs to be built, not HOW. The moment you start coding, you're making HOW decisions that might not align with the WHAT. Requirements definition fails when you discover mid-implementation that "user can delete items" actually meant "soft delete with undo" not "hard delete with confirmation". Define the complete WHAT first, then plan the HOW.

- **NEVER omit context from requirements** - The plan must contain ALL information needed for implementation: patterns, mandatory reading, documentation. Context is king. When implementation starts weeks later or is handed to another developer, missing context forces them to reverse-engineer your thinking or make wrong assumptions. "Use the existing pattern" is useless without linking to that pattern. "Follow the API design" means nothing without specifying which API. Every assumption you hold must be explicitly documented.

- **NEVER leave acceptance criteria vague** - "Works correctly" is useless because it means different things to different stakeholders. A PM thinks "works correctly" means users can complete the task; QA thinks it means no crashes; developers think it means passes unit tests. This misalignment causes expensive rework when everyone discovers they built different things. Criteria must be specific, measurable, and testable so everyone validates against the same definition of "done".

- **NEVER assume feature type is obvious** - Explicitly classify: New Capability, Enhancement, Refactor, or Bug Fix. Different types need different considerations. A "new capability" needs comprehensive testing and documentation; an "enhancement" needs regression testing and migration paths; a "refactor" needs behavioral equivalence proofs. Assuming everyone knows which type leads to gaps—refactors shipped without enough testing, enhancements deployed without migration plans, new features lacking proper documentation.

- **NEVER skip user story validation** - If user type, action, or benefit is unclear, ask. Ambiguous user stories lead to wrong implementations. "As a user" is too vague—which user? Admin? End-user? Developer? "I want to manage items" could mean create, read, update, delete, search, filter, sort, or all of the above. "So that I can work faster" doesn't explain why speed matters or what the baseline is. Five minutes clarifying now prevents days of rebuilding when you discover the real user story.

- **NEVER forget to document dependencies** - External libraries, services, or systems must be identified upfront, not discovered during implementation. Finding out mid-sprint that you need a Redis instance, a third-party API key, or a database migration tool derails schedules and forces architecture compromises. Dependencies discovered late often can't be added cleanly—you've already built around their absence. Identify all dependencies before implementation planning begins.

- **NEVER skip complexity assessment** - Understanding if something is Low/Medium/High complexity affects planning, resourcing, and validation strategy. Marking a High complexity feature as Low leads to underestimation, missed deadlines, and inadequate testing. Complexity assessment isn't just effort estimation—it's risk assessment. High complexity features need more validation steps, more edge case coverage, more careful testing strategy. Getting this wrong means shipping fragile features that break in production.

### Expert-Level Anti-Patterns

- **NEVER write acceptance criteria as implementation details** - "Uses Redis for caching" is an implementation concern, not acceptance criteria. "Loads user dashboard within 200ms on repeat visits" is the acceptance criterion. Implementation details lock you into solutions before exploring trade-offs. Redis might not be the right choice—maybe browser localStorage suffices, or maybe you need a CDN. Acceptance criteria define observable behavior and measurable outcomes, not the internals. This gives implementation freedom to choose the best solution.

- **NEVER assume happy path covers edge cases** - Real-world failure modes (network timeouts, partial failures, race conditions) are where bugs hide. Edge cases aren't "nice to have"—they're where production breaks. Happy path testing shows the feature works when everything goes right. Production is where things go wrong: APIs timeout, databases lock, users click buttons twice, connections drop mid-request. If acceptance criteria only cover happy paths, you're accepting that the feature will fail in production. Edge cases must be explicit acceptance criteria, not implicit "we'll handle that later" assumptions.

- **NEVER confuse test coverage with quality** - 100% test coverage doesn't mean the feature works correctly—it means every line executed, not that every behavior is validated. You can have perfect coverage while missing critical edge cases, testing implementation instead of behavior, or writing tests that pass even when the feature is broken. Quality comes from testing the right things: user journeys, error recovery, boundary conditions, state transitions. Coverage is a metric, not a goal. Focus acceptance criteria on behavioral correctness, not coverage percentages.

- **NEVER over-specify UI details in acceptance criteria** - "Button must be #007bff blue with 8px border-radius" is over-specification that blocks design iteration. "Primary action button follows design system" is the right level. Acceptance criteria for UI should specify behavior (clickable, keyboard accessible, shows loading state) and semantic properties (primary vs secondary, destructive actions use warning colors), not exact pixel values or color codes. Over-specification creates brittle acceptance criteria that break with every design tweak and discourage polish.

- **NEVER test implementation instead of behavior** - "getUserFromDatabase() is called with correct parameters" tests implementation. "User profile displays current user's name and email" tests behavior. Implementation tests break when you refactor even though behavior is unchanged. They create false confidence—the function is called correctly but returns wrong data. Behavioral tests survive refactoring and catch real bugs. Acceptance criteria must focus on what users observe and experience, not internal function calls and data structure details.

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

### Red Flags That Signal Premature Requirements Definition

Watch for these warning signs that indicate you need more clarity before proceeding:

- **User says "just add a button"** but can't explain what it does or why users need it
- **Request is phrased as solution, not problem** - "Use library X" or "Add Redis caching" without explaining the underlying need
- **No one can articulate user value or business impact** - "It would be nice to have" or "Marketing wants it" without measurable benefit
- **"Make it like [competitor]"** without understanding why their approach works or if it fits your context
- **Requirements keep changing during the conversation** - Each answer spawns three new requirements, indicating unclear vision
- **User jumps to implementation details** - Talks about database schemas, API endpoints, UI components before defining what problem is being solved
- **"We'll figure it out later" responses** - Critical decisions deferred without acknowledging they're blockers

**If you see these red flags:** Stop and ask clarifying questions. Requirements definition fails when built on vague foundations. Better to spend 10 minutes clarifying now than waste days implementing the wrong thing.

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

**Problem Definition Quality Check:**

Before proceeding to Step 4, validate your problem statement against these tests:

| Question | Bad Signal | Good Signal |
|----------|------------|-------------|
| **Is it specific?** | "Users are frustrated" | "Users abandon checkout because payment takes >30s" |
| **Is it measurable?** | "Performance is bad" | "Dashboard load time is 5s, target is <1s" |
| **Is it root cause?** | "Users want a button" | "Users can't undo deletions, causing anxiety" |
| **Does it explain impact?** | "Feature X is missing" | "Without X, users manually copy-paste 50+ times/day" |

**Red flags that indicate weak problem definition:**
- Solution stated as problem ("We need Redis" vs "Caching is too slow")
- No user impact quantified ("Users complain" vs "Causes 20% abandonment")
- Assumes solution ("Add more servers" vs "System fails under peak load")
- No baseline stated ("Make it faster" vs "Currently 5s, need <1s")

If your problem statement has red flags, clarify with the user before continuing.

### Step 4: Feature Metadata

Document:
- **Feature Type**: New Capability | Enhancement | Refactor | Bug Fix
- **Estimated Complexity**: Low | Medium | High
- **Primary Systems Affected**: List components/packages
- **Dependencies**: External libraries or services required

**Complexity Assessment Guide:**

Assess complexity based on these dimensions (if ANY dimension is High, overall complexity is High):

| Dimension | Low | Medium | High |
|-----------|-----|--------|------|
| **Scope** | Single component, <3 files | Multiple components, 3-10 files | Cross-system, 10+ files |
| **Dependencies** | No new dependencies | 1-2 known libraries | New services, APIs, or unfamiliar tech |
| **Risk** | Isolated, easy to rollback | Affects multiple features | Data migration, breaking changes |
| **Unknowns** | Clear path, done before | Some uncertainty | Novel approach, research needed |
| **Testing** | Unit tests sufficient | Integration tests needed | E2E, performance, security testing required |

**Examples:**
- **Low:** Add validation to existing form field (isolated, known patterns, easy testing)
- **Medium:** Integrate third-party payment API (known tech, moderate dependencies, integration testing)
- **High:** Migrate database schema with zero downtime (data risk, cross-system, complex rollback, extensive testing)

**Why complexity matters:** High complexity features need more detailed acceptance criteria, more edge case coverage, phased rollout strategy, and comprehensive rollback plans. Low complexity features can have simpler criteria focused on core functionality.

### Step 5: Define Acceptance Criteria

Create **specific, measurable, testable** criteria using structured formats:

**Format for Functional Criteria (MANDATORY):**
```
Given [initial context/state]
When [action/trigger occurs]
Then [expected outcome]
And [additional outcomes]
```

**Example:**
```
Given user is viewing their item list with 5 items
When user clicks "Delete" on the third item and confirms deletion
Then the item is removed from the list
And the list shows 4 items
And a success message appears
And the deleted item ID is logged for audit
```

**Why this format:** Given/When/Then forces specificity. You can't be vague when you must state the initial context, exact trigger, and measurable outcome. This format also maps directly to automated test scenarios.

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
