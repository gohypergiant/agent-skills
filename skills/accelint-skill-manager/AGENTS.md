# Skill Manager

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring agent skills. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for agent skills, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant optimizations
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

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
Provide rule summaries with reference links, compress examples, eliminate redundancy.
[View detailed examples](references/agents.md)

### 1.4 Progressive Disclosure
Keep SKILL.md <500 lines, metadata ~100 tokens, load resources on-demand.
[View detailed examples](references/progressive-disclosure.md)

### 1.5 References
Use ❌/✅ examples, self-contained files, avoid duplication with SKILL.md.
[View detailed examples](references/references.md)

### 1.6 Scripts
Bash preferred, use set -e, stderr for messages, stdout for JSON output.
[View detailed examples](references/scripts.md)

### 1.7 Assets
Static resources, templates, data files for complex/repetitive tasks.
[View detailed examples](references/assets.md)
