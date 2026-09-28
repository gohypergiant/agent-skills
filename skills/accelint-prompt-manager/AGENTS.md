# Prompt Manager — Quick Reference

Use this guide to turn vague prompts into optimized, actionable prompts. It highlights non-obvious patterns, hard-won insights, and systematic optimization techniques.

## How to Use This Guide

Follow this sequence:
1. **Start with `SKILL.md`** — Run the 4-step workflow for any prompt optimization.
2. **Use this guide for quick lookup** — Check patterns, frameworks, and techniques here first.
3. **Load details on demand** — Read specific `references/` files only when needed.

## Quick Reference

### Anti-Patterns (NEVER Do)

**Fabrication Techniques** — MoE/ToT/GoT make Claude invent fake personas instead of deepening reasoning → `references/credit-killing-patterns.md#fabrication`

**CoT on Reasoning Models** — Claude 4.5+ has native extended thinking, adding "think step-by-step" degrades quality → `references/credit-killing-patterns.md#cot`

**Framework Name Pollution** — Never output "Using CO-STAR..." or label sections with methodology → `references/credit-killing-patterns.md#naming`

**Context-Free Optimization** — Prompts for Claude Code differ from ChatGPT/API calls, context determines strategy → `references/credit-killing-patterns.md#context`

**Vague Success Criteria** — "Better", "comprehensive", "clean" lack measurability, pin to objective outcomes → `references/credit-killing-patterns.md#criteria`

**Missing Creative Constraints** — Without boundaries, creative tasks produce inconsistent results → `references/credit-killing-patterns.md#constraints`

**Lost-in-the-Middle** — Models weaken attention on middle sections of long prompts, place critical info at start/end → `references/credit-killing-patterns.md#context-positioning`

**Ambiguous Pronouns** — "It/this/that" become unclear in multi-step workflows, use specific nouns → `references/credit-killing-patterns.md#pronouns`

### Frameworks

**When to Use Which:**
- **CO-STAR** → Structured output, specific format needs (format-driven)
- **RISEN** → Multi-step procedures, workflows (process-driven)
- **RODES** → Needs examples for clarity, style matching (example-driven)

**Application Rule:** Route user intent through the framework structure silently. Never expose the methodology in the output.

→ Full details: `references/frameworks.md`

### Optimization Techniques

**5 safe techniques** improve prompt quality without adding risk:
1. **Specificity Injection** — Replace vague terms with concrete criteria
2. **Constraint Addition** — Define boundaries for creative freedom
3. **Context Positioning** — Critical info at start/end, not middle
4. **Pronoun Elimination** — Replace "it/this/that" with specific nouns
5. **Success Criteria Definition** — Pin to measurable outcomes

→ Detailed examples: `references/safe-techniques.md`

### Complexity Assessment

**Simple:** Single objective, <3 steps, no ambiguity → Execute directly
**Moderate:** Some ambiguity, 3-5 steps, few dependencies → Proceed with monitoring
**Complex:** >3 interdependent decisions OR >5 sequential steps → Recommend plan mode

→ Full criteria: `references/complexity-detection.md`

### Plan Mode Triggers

**Always recommend plan mode when:**
- >3 interdependent decisions that affect each other
- >5 sequential steps requiring coordination
- Significant ambiguity with cascading implications
- User asks "how should I approach this?"

→ Detailed triggers: `references/plan-mode-triggers.md`

### Ambiguity Patterns

**Common Vague Terms:**
- "Comprehensive" → All edge cases [+time] vs common scenarios [balanced] vs overview [+speed]
- "Fast" → Response time, development time, or execution time?
- "Simple" → Minimal code, easy to understand, or few dependencies?
- "Clean" → Follows standards, minimal complexity, or well-documented?

**Resolution Pattern:** Present 2-3 interpretation options with implications. Then let the user decide.

→ Full catalog: `references/ambiguity-examples.md`

### Template Selection

**12 Task-Type Templates:**
- **Analytical** — Data analysis, metrics, research
- **Creative** — Writing, design, ideation
- **Debugging** — Error investigation, root cause analysis
- **Documentation** — README, API docs, guides
- **Exploration** — Codebase discovery, pattern finding
- **Implementation** — Feature building, coding
- **Planning** — Architecture, approach design
- **Refactoring** — Code improvement, restructuring
- **Review** — Code review, quality assessment
- **Security** — Vulnerability analysis, threat modeling
- **Testing** — Test writing, QA, validation
- **Troubleshooting** — System issues, incident response

→ Selection logic: `references/template-selection.md`
→ Full templates: `assets/prompt-templates/`

### Optimization Examples

**Before/After Transformations:**
- Vague request → Specific, constrained prompt
- Ambiguous multi-step → Clear sequential workflow
- Missing context → Fully specified execution environment
- Generic goal → Measurable success criteria

→ Full examples: `references/optimization-examples.md`

## Workflow Summary

```
Step 0: Verify Intent
  ↓ Confirm prompt optimization, or stop and hand task execution back to the user
Step 1: Intake & Assessment
  ↓ Extract intent, calibrate skill level, detect complexity
Step 2: Pattern Detection
  ↓ Identify credit-killing patterns, ambiguities, trade-offs
Step 3: Framework Selection & Optimization
  ↓ Apply CO-STAR/RISEN/RODES silently, use safe techniques
Step 4: Validation & Handoff
  ↓ Quality checks, flag remaining ambiguities, deliver the optimized prompt, then offer post-delivery options
```

## Important Context

**Model-Specific:** Claude 4.5+ uses native extended thinking, and GPT-4 uses internal CoT. Optimization strategies differ by model family.

**Token Economy:** System prompts multiply by API call count. Progressive disclosure reduces base cost.

**Security:** Validate user inputs, use delimiters, and never allow user content to override system instructions.

**Conversation Continuity:** Keep optimization guidance internally consistent across extended conversations so later prompt revisions do not contradict earlier decisions.