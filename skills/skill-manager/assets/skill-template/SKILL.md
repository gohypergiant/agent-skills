---
name: skill-name
description: Use when users say "[trigger phrase 1]", "[trigger phrase 2]", or when [specific scenario]. [WHAT this skill does]. [Additional trigger keywords for searchability].
#
# CRITICAL: The description field determines if this skill gets activated.
# Must answer THREE questions:
#   1. WHAT: What does this skill do? (functionality)
#   2. WHEN: In what situations should it be used? (trigger scenarios with "Use when...")
#   3. KEYWORDS: What terms should trigger this skill? (action verbs, file types, domain terms)
#
# ✅ GOOD: "Use when users say 'create X', 'build Y', or when working with .ext files for purpose A, purpose B, or purpose C"
# ❌ BAD:  "Helps with various tasks" (vague, no triggers, no keywords)
#
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# Skill Name

Brief introduction to what this skill provides (1-2 sentences maximum).

## NEVER Do [Domain-Specific Anti-Patterns]

<!-- CRITICAL: This section is half of expert knowledge.
     Good anti-patterns are SPECIFIC with WHY (non-obvious reasons).
     Bad anti-patterns are vague warnings like "be careful" or "avoid errors".

     Ask yourself: "Would an expert say 'yes, I learned this the hard way'?"

     Include 5-8 specific anti-patterns with concrete reasons.
-->

- **NEVER [specific anti-pattern 1]** - [Why this fails / non-obvious consequence]. [Example if helpful].
- **NEVER [specific anti-pattern 2]** - [Concrete reason from experience].
- **NEVER [specific anti-pattern 3]** - [What happens when violated].
- **NEVER [generic mistake in this domain]** - [Why experts avoid this].
- **NEVER [common beginner error]** - [Non-obvious reason it's problematic].

<!-- Examples from real skills:
     - NEVER write tutorials explaining basics - Claude knows standard concepts. Focus on expert-only knowledge.
     - NEVER use Inter/Roboto fonts - Overused in AI-generated designs, lacks originality.
     - NEVER edit OOXML directly without unpacking first - XML structure breaks, file corrupts.
-->

## Before [Domain Action], Ask

<!-- CRITICAL: Teach THINKING PATTERNS, not just procedures.
     This transforms agents from "following steps" to "making expert decisions".

     Format: "Before [action], ask yourself:"
     Include 3-5 key questions experts ask before acting.
     These should shape HOW agents think about the problem.
-->

Apply these tests before [performing key domain action]:

### [Expert Thinking Framework 1]
- **[Key Question]?** [Guidance on what to consider]. [Consequence if ignored].
- **[Key Question]?** [How experts think about this]. [Example if needed].

### [Expert Thinking Framework 2]
- **[Key Question]?** [Critical consideration]. [Trade-off to understand].
- **[Key Question]?** [Decision criteria]. [What to optimize for].

### [Expert Thinking Framework 3]
- **[Key Question]?** [Edge case consideration]. [When standard approach fails].

<!-- Examples from real skills:
     "Before Creating a Skill, Ask:"
     - Does this capture what takes experts years to learn?
     - Am I explaining TO Claude or arming Claude?

     "Before Designing, Ask:"
     - What makes this memorable vs generic?
     - What extreme aesthetic direction fits the purpose?
-->

## How to Use

<!-- Choose ONE structure based on skill complexity:

     OPTION A - For SIMPLE skills (<100 lines, single workflow, no references):
     Delete this section and put direct instructions here. Example:
     "Run `scripts/process.sh <input>` to process files. See examples in `assets/`."

     OPTION B - For COMPLEX skills (rules, references, multiple scenarios):
     Use progressive disclosure pattern below.

     NEVER mix both - either direct instructions OR progressive disclosure.
-->

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the [workflow/decision tree/process] below for [domain task].

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for [specific type of guidance: file conventions / optimization rules / architectural patterns].

### 3. Load Specific Examples as Needed
When [specific scenario], load corresponding reference files for ❌/✅ examples:
- [Scenario 1] → Load [reference-file-1.md](references/reference-file-1.md)
- [Scenario 2] → Load [reference-file-2.md](references/reference-file-2.md)

## [Main Workflow / Decision Tree / Process]

<!-- This is the CORE of your skill. Choose format based on task type:

     For PHASED WORKFLOWS (Process pattern ~200 lines):
     - Step-by-step numbered workflow
     - Include checklist for tracking progress
     - "Skip this step only when..." guidance

     For DECISION TREES (Tool pattern ~300 lines):
     - Table format: "Scenario | Approach | Fallback"
     - If/then logic with clear branches
     - Error handling and edge cases

     For CREATIVE GUIDANCE (Mindset pattern ~50 lines):
     - Principles over procedures
     - High freedom with examples
     - Focus on taste and judgment

     Include DOMAIN-SPECIFIC procedures Claude wouldn't know.
     NEVER include generic procedures (open file, edit, save).
-->

[Your workflow/decision tree/creative guidance here]

## Freedom Calibration

<!-- ONLY include this section if your skill needs to teach agents how to calibrate freedom.
     Most skills don't need this - it's for meta-skills or skills that work across task types.

     If your skill is ONLY creative → Don't include (just use high freedom throughout)
     If your skill is ONLY fragile ops → Don't include (just use low freedom throughout)
     If your skill spans multiple task types → Include this table
-->

**Calibrate guidance specificity to task fragility:**

| Task Type | Freedom Level | Guidance Format | Example |
|-----------|---------------|-----------------|---------|
| **Creative/Design** | High freedom | Principles, thinking patterns, anti-patterns | "[Creative principle]" |
| **Analysis/Review** | Medium freedom | Guidelines with examples, decision frameworks | "Priority: [ordered list]" |
| **File Operations** | Low freedom | Exact scripts, specific steps, no variation | "Use exact command: `[cmd]`" |

**The test:** "If the agent makes a mistake, what's the consequence?"
- High consequence (corruption, data loss) → Low freedom with precise scripts
- Medium consequence (suboptimal result, style issues) → Medium freedom with examples
- Low consequence (aesthetic choices, multiple valid approaches) → High freedom with principles

## Important Notes

<!-- Only include NON-OBVIOUS critical considerations.
     NEVER include obvious reminders like "test your code" or "handle errors".
     Think: "What do experts know that isn't written elsewhere?"
-->

- [Critical non-obvious consideration that affects success]
- [Edge case that's easy to miss]
- [Domain-specific constraint or requirement]

<!-- DELETE "Additional Resources" section - it's redundant with "How to Use" section.
     Progressive disclosure is already explained above.
-->
