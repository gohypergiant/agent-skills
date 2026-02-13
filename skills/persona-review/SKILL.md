---
description: Evaluate Figma designs from operator persona perspectives. Use when reviewing UX for specific user roles (e.g., air-surveillance-tech, weapons-director). Analyzes cognitive load, communication patterns, pain points, and system visibility. Works with Figma MCP (desktop/URL) and Outline docs.
keywords: figma, persona, review, ux, operator, design critique, user experience, evaluation
version: 1.0
invocations:
  - keyword: persona-review
    type: user-invocable
    arguments:
      - name: persona
        type: string
        description: Persona identifier (e.g., air-surveillance-tech)
        required: true
      - name: figma_url
        type: string
        description: Optional Figma URL (defaults to current Figma MCP desktop selection)
        required: false
mcp_servers:
  - figma_mcp
  - outline
---

# Persona-Based Design Review

Evaluate Figma designs from the perspective of specific operator personas, providing structured UX critique aligned with their responsibilities, pain points, and operational context.

## Instructions

See [instructions.md](instructions.md) for the complete evaluation framework and persona profiles.
