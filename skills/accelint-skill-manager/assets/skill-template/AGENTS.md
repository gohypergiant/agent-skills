# Skill Name

> **Note:**
> This document is mainly for agents and LLMs to follow when [condition for skill usage]. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Brief summary of what this skill provides and how it's organized. Explain that each rule includes one-line summaries with links to detailed examples in the `references/` folder.

**Token efficiency principle:** This guide maximizes knowledge delta by providing only expert-level insights Claude doesn't already know. All rules assume Claude understands standard concepts, libraries, and patterns. Focus is on non-obvious decisions, trade-offs, and edge cases.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant guidance
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

<!-- Add all rule sections here with brief summaries.
     This TOC is critical for agents to quickly find relevant rules without loading all references.
     Each entry should be 5-10 words max. -->

- [1.1 Rule Name](#11-rule-name) - Brief description (5-10 words)
- [1.2 Rule Name](#12-rule-name) - Brief description (5-10 words)
- [1.3 Rule Name](#13-rule-name) - Brief description (5-10 words)
<!-- Add more rules as needed -->

---

## 1. General

<!-- For simple skills: 3-5 rules may be sufficient
     For complex skills: Consider grouping into multiple sections:
       ## 1. General
       ## 2. Specific Domain Area
       ## 3. Advanced Patterns
-->

### 1.1 Rule Name
One-line summary of this rule (what it optimizes or prevents).
[View detailed examples](references/example.md)

### 1.2 Rule Name
One-line summary of this rule (what it optimizes or prevents).
[View detailed examples](references/example.md)

### 1.3 Rule Name
One-line summary of this rule (what it optimizes or prevents).
[View detailed examples](references/example.md)

<!-- ADVANCED PATTERNS (uncomment if needed):

### 1.4 Cross-Referencing Other Skills
When your skill depends on another skill, reference it explicitly:
[View detailed examples](references/cross-references.md)

Example inline guidance (for rules that don't need full reference file):

### 1.5 Short Rule Without Reference File
Brief rule that fits in 2-3 sentences. For rules that need ❌/✅ examples or detailed explanation, create a reference file instead. Only inline rules that are self-explanatory.

**❌ Incorrect: [description of why]**
```
Brief example of anti-pattern
```

**✅ Correct: [description of why]**
```
Brief example of correct pattern
```

TOKEN EFFICIENCY TIP:
- If a rule has 3+ examples, move to reference file
- If explanation is >5 lines, move to reference file
- Inline only simple, obvious rules

-->
