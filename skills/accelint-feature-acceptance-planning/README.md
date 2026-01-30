# Feature Acceptance Planning

Define clear requirements and acceptance criteria for features before implementation.

## What This Skill Does

This skill guides agents through creating comprehensive feature requirements documents that define:
- User stories and problem/solution statements
- Feature metadata (type, complexity, affected systems)
- Specific, measurable, testable acceptance criteria
- Completion checklists for verification

## When to Use

Use this skill when:
- Starting feature development and need requirements definition
- User asks to "define acceptance criteria" or "create requirements"
- Planning a feature before implementation
- Converting feature requests into structured specifications

## What It Provides

**Process Guidance:**
- 6-step requirements definition workflow
- Template for structured requirements documents
- Guidelines for creating testable acceptance criteria

**Output:**
- Requirements document in `.agents/acceptance/{feature-name}-requirements.md`
- Complete acceptance criteria covering functionality, quality, integration, performance, and documentation

## Key Principles

1. **Zero code changes** - Requirements phase defines WHAT, not HOW
2. **Context is king** - All information needed for implementation must be in the requirements
3. **Testable criteria** - Every acceptance criterion must be specific and verifiable
4. **Complete metadata** - Type, complexity, systems, and dependencies documented upfront

## Usage Example

```bash
User: "Define acceptance criteria for adding dark mode support"

Agent follows 6-step process:
1. Analyzes problem, value, complexity
2. Creates user story
3. Documents problem/solution statements
4. Classifies feature metadata
5. Defines specific acceptance criteria
6. Creates completion checklist

Outputs: .agents/acceptance/dark-mode-support-requirements.md
```

## Structure

This is a single-file skill with no additional references or scripts:
- `SKILL.md` - Complete requirements definition workflow

## License

Apache-2.0
