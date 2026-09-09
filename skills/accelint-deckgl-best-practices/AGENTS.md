# Deck.gl Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when writing, reviewing, refactoring, or debugging deck.gl code. Humans may also find it useful, but guidance here is optimized for fast routing and low-context expert decisions.

---

## Abstract

Compact expert guide for deck.gl performance, diffing, rendering, and compositing decisions. Each rule includes a one-line summary with links to detailed examples in `references/` so agents can load only the guidance needed for the current bottleneck.

---

## How to Use This Guide

1. **Start here**: classify whether the issue is update cost, rendering cost, or compositing
2. **Load references as needed**: open the relevant reference file for implementation details and examples
3. **Preserve the deck.gl mental model**: new layer instances are normal; unstable data and invalidation scope are the usual problem

---

## Quick Reference

- [1.1 Layer Identity Diffing](#11-layer-identity-diffing) - New layer instances are usually fine
- [1.2 Data Identity](#12-data-identity) - Stable data prevents full buffer rebuilds
- [1.3 Targeted Invalidation](#13-targeted-invalidation) - Use `updateTriggers` and scale props
- [1.4 Layer Visibility](#14-layer-visibility) - Prefer `visible` over mount churn
- [1.5 Accessor Cost](#15-accessor-cost) - Keep accessors trivial and allocation-free
- [1.6 Streaming and Big Data](#16-streaming-and-big-data) - Chunk layers or use async iterables
- [1.7 Rendering Cost](#17-rendering-cost) - Watch fragments, DPI, and picking
- [1.8 Compositing and Depth](#18-compositing-and-depth) - Fix artifacts with GPU/CSS controls
- [1.9 Mobile Memory Controls](#19-mobile-memory-controls) - Trade features for memory on constrained devices

---

## 1. General

### 1.1 Layer Identity Diffing
Do not flag `new TextLayer()` or `new ScatterplotLayer()` inside render as a standalone performance bug; deck.gl diffs layer instances by stable `id` and props.
[View detailed examples](references/performance-patterns.md)

### 1.2 Data Identity
A fresh `data` array reference triggers expensive attribute regeneration even when row contents are logically unchanged.
[View detailed examples](references/performance-patterns.md)

### 1.3 Targeted Invalidation
When only a visual encoding changes, use `updateTriggers` or `*Scale` props instead of rebuilding data.
[View detailed examples](references/performance-patterns.md)

### 1.4 Layer Visibility
Use `visible` for frequently toggled layers so internal state and buffers survive.
[View detailed examples](references/performance-patterns.md)

### 1.5 Accessor Cost
Accessor CPU cost scales with row count; avoid expensive computation and per-row allocation inside accessors.
[View detailed examples](references/performance-patterns.md)

### 1.6 Streaming and Big Data
For incremental loading, avoid repeated whole-array concatenation when chunked layers or async iterables fit.
[View detailed examples](references/performance-patterns.md)

### 1.7 Rendering Cost
Low FPS with stable data often means fragment overdraw, Retina pixel cost, or unnecessary picking.
[View detailed examples](references/rendering-and-compositing.md)

### 1.8 Compositing and Depth
Some visual bugs are CSS/browser or GPU-state problems, not layer-data problems.
[View detailed examples](references/rendering-and-compositing.md)

### 1.9 Mobile Memory Controls
On constrained mobile devices, `_pickable` and `_typedArrayManagerProps` can reduce memory at feature/runtime trade-off.
[View detailed examples](references/rendering-and-compositing.md)
