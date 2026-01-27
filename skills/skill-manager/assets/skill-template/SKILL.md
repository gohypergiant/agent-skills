---
name: skill-name
description: Use when [specific triggering condition]. [Additional context about when this skill applies].
metadata:
  author: your-name
  version: "1.0"
---

# Skill Name

Brief introduction to what this skill provides.

## About [Domain/Tool/Workflow]

Context about the domain, tool, or workflow this skill addresses.

## When NOT to Use This Skill

<!-- Focus on scope boundaries, not just negations. Think about:
     - Task is about USING the tool/workflow, not CONFIGURING/CREATING it
     - Request is for general help, not domain-specific workflow
     - User wants to modify behavior/output, not the underlying architecture
     - Related but distinct domains (e.g., testing vs test infrastructure)
-->

Skip this skill when:
- [Exclusion criteria 1 - e.g., using vs configuring]
- [Exclusion criteria 2 - e.g., general help vs domain-specific]
- [Exclusion criteria 3 - e.g., behavior changes vs architecture changes]

## When to Activate This Skill

Use this skill when the task involves:

### Activation Category
- [Description of category sub item]
- [Description of category sub item]

## Example Trigger Phrases

This skill should activate when users say things like:

**Trigger Scenario:**
- ["A phrase or description a user would provide"]

## How to Use

<!-- Replace this entire section based on your skill's complexity.

     For SIMPLE skills (single script, straightforward workflow):
     - List direct steps users follow
     - Reference specific scripts or files to use
     - Keep it concise and action-oriented

     For COMPLEX skills (many rules, multiple reference files):
     - Use the progressive disclosure pattern below
     - Reference AGENTS.md for rule summaries
     - Load detailed references on-demand
-->

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Start with the Overview (AGENTS.md)

Read [AGENTS.md](AGENTS.md) for a concise overview of all rules with one-line summaries.

### 2. Load Specific Rules as Needed

When you identify a relevant optimization, load the corresponding reference file for detailed implementation guidance.

### 3. Apply the Pattern

Each reference file contains:
- Overview of the problem statement
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

## Important Notes

- [Critical consideration 1]
- [Critical consideration 2]
- [Best practice or warning]

## Additional Resources

- Reference files in `references/` for detailed guidance
- Scripts in `scripts/` for automation
- Templates in `assets/` for common patterns
