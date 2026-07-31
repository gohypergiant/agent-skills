# Skill Manager

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring agent skills. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

This is a comprehensive guide to agent skills for AI agents and LLMs. Each rule has a one-line summary here, with links to detailed examples in the `references/` folder. Load a reference file only when you need detailed implementation guidance for that rule.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to find the relevant guidance.
2. **Load references as needed**: Open detailed examples only when you are applying that rule.
3. **Use progressive loading**: Each reference file is self-contained and includes ❌/✅ examples.

This structure minimizes context usage while still providing complete implementation guidance when needed.

---

## Quick Reference

- [1.1 File System](#11-file-system) - Directory structure and naming conventions
- [1.2 SKILL.md](#12-skillmd) - Description field and keyword usage
- [1.3 AGENTS.md](#13-agentsmd) - Token efficiency and compression
- [1.4 Progressive Disclosure](#14-progressive-disclosure) - Context optimization
- [1.5 References](#15-references) - Example format and organization
- [1.6 Scripts](#16-scripts) - Bash conventions and error handling
- [1.7 Assets](#17-assets) - Templates and static resources

---

## 1. General

### 1.1 File System
Use kebab-case for directories/scripts, UPPERCASE for main files, keep references one level deep.
[View detailed examples](references/file-system.md)

### 1.2 SKILL.md
Write "Use when..." descriptions with triggering conditions only, never workflow summaries.
[View detailed examples](references/skill.md)

### 1.3 AGENTS.md
Provide rule summaries with reference links. Compress examples and remove redundancy.
[View detailed examples](references/agents.md)

### 1.4 Progressive Disclosure
Keep SKILL.md <500 lines, metadata ~100 tokens, load resources on-demand.
[View detailed examples](references/progressive-disclosure.md)

### 1.5 References
Use ❌/✅ examples, self-contained files, avoid duplication with SKILL.md.
[View detailed examples](references/references.md)

### 1.6 Scripts
Prefer bash. Use `set -e`, write messages to stderr, and write JSON output to stdout.
[View detailed examples](references/scripts.md)

### 1.7 Assets
Use static resources, templates, and data files for complex or repetitive tasks.
[View detailed examples](references/assets.md)
