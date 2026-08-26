---
name: accelint-deckgl-best-practices
description: Use when writing, reviewing, refactoring, or debugging deck.gl visualizations, especially when users mention deck.gl, DeckGL, layers, ScatterplotLayer, TextLayer, GeoJsonLayer, updateTriggers, pickable, useDevicePixels, z-fighting, map overlays, large datasets, stutter, pan/zoom lag, GPU memory pressure, or layer rendering performance.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Deck.gl Best Practices

Expert guidance for building and reviewing deck.gl layers with the right mental model for layer diffing, data updates, GPU cost, and browser/compositing behavior.

## NEVER Do Deck.gl

- **NEVER assume `new SomeLayer()` inside render is itself a performance bug** - deck.gl diffs the new layer instance against the previous layer by `id` and props. Re-instantiating `new TextLayer()` or `new ScatterplotLayer()` during React render is normal and does **not** by itself cause excessive redraws or GPU churn when `id`, `data`, and relevant props are stable.
- **NEVER recreate `data` arrays on every render unless the data truly changed** - deck.gl shallow-compares `data`; a new array reference invalidates attribute regeneration and can force expensive CPU + GPU buffer work across the full layer.
- **NEVER transform stable source data into per-render derived rows when `updateTriggers` can isolate the changed accessor** - changing `data` refreshes all attributes, while `updateTriggers` can invalidate only `getRadius`, `getFillColor`, or other affected accessors.
- **NEVER toggle frequently-used layers by adding/removing them when `visible` would work** - removal discards internal layer state and generated buffers; flipping `visible` preserves them and makes re-showing cheap.
- **NEVER put expensive logic or fresh object allocation inside hot accessors** - accessors run per object during attribute generation. `Object.values`, `Math.max(...values)`, or returning fresh color arrays per row multiplies CPU cost and GC pressure by dataset size.
- **NEVER use function accessors for constants** - `getFillColor: () => [255, 0, 0]` is dramatically more expensive than a constant value because it builds per-row attributes instead of uploading one uniform-like constant.
- **NEVER animate by recomputing per-row accessor output if a `*Scale` prop can express the change** - prefer `radiusScale`, similar scale props, and cheap uniform-style updates over re-running `getRadius` for every object on every animation frame.
- **NEVER append incremental chunks into one growing array without considering chunked layers or async iterables** - concatenating data can cause full-buffer rebuilds for previously loaded rows; chunk-per-layer or async iterable patterns avoid recomputing old chunks.
- **NEVER leave `pickable` enabled on layers that do not need interaction** - pickable layers render into the off-screen picking buffer during interaction, adding avoidable work.
- **NEVER ignore fragment cost** - a layer can have acceptable item count but still render poorly if point radii, fills, or overdraw explode total drawn pixels.
- **NEVER default to HiDPI rendering on performance-constrained views without checking impact** - `useDevicePixels` can multiply fragment workload roughly 4x on Retina/high-DPI displays.
- **NEVER treat browser compositing issues like pure WebGL issues** - deck.gl overlays sit in browser DOM/CSS composition too, so visual blending problems may need `mix-blend-mode`, `isolation`, depth settings, or per-layer GPU parameters rather than layer-data changes.

## Before Changing Deck.gl Code, Ask

Apply these tests before optimizing or refactoring:

### Data Identity and Invalidation
- **Did the underlying dataset change, or only the interpretation of stable rows?** If rows are stable and only a visual encoding changes, prefer `updateTriggers` or scale props over rebuilding `data`.
- **Is the current slowdown caused by layer updates or by frame rendering?** Buffer regeneration points to `data` / accessor invalidation; poor steady-state FPS points to fragment overdraw, picking cost, or device-pixel pressure.
- **Is a shallow data change accidental?** Inline `filter`, `map`, `concat`, or object recreation in render often looks harmless in React but is expensive in deck.gl.

### Layer Lifecycle and Diffing
- **Is the layer `id` stable?** deck.gl's identity diffing relies on stable ids. New instances with the same `id` are usually fine; unstable ids force replacement.
- **Would `visible` preserve buffers better than conditional mounting?** If a layer is toggled repeatedly, hide it instead of removing it.
- **Is this a React concern or a deck.gl concern?** React re-rendering and deck.gl layer regeneration are related but not identical; creating a fresh layer instance in render is acceptable if props remain stable.

### Data Volume and Transport
- **Are we pushing enough data that JSON/object materialization is the bottleneck?** For very large or frequently changing datasets, consider binary data, worker-precomputed attributes, or external attributes.
- **Is data arriving incrementally?** If yes, prefer async iterables or chunked layers over repeatedly concatenating one giant array.
- **Are we approaching known practical ceilings?** Browser allocation limits, mobile memory pressure, and picking limits should shape architecture before micro-optimizing code.

### Rendering and Compositing
- **Is the cost in vertices or fragments?** Large counts stress vertex work; large radii/overlap stress fragment work.
- **Does the view need picking, Retina pixels, or depth testing?** Disable expensive defaults when the UX does not require them.
- **Is the artifact actually blending or z-fighting?** CSS `mix-blend-mode`, `isolation`, `parameters`, and `polygonOffset` may be the right fix.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Use the decision workflow below to identify whether the problem is caused by data churn, accessor cost, rendering cost, or browser compositing.

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for the compact rule index and quick routing between update, rendering, and compositing issues.

### 3. Load Specific References as Needed
- Data churn / layer invalidation → [references/performance-patterns.md](references/performance-patterns.md)
- Rendering artifacts / compositing / mobile constraints → [references/rendering-and-compositing.md](references/rendering-and-compositing.md)

## Deck.gl Review and Optimization Workflow

### 1. Classify the complaint correctly
Use this routing first:

| Symptom | Most likely cause | Default response |
|---|---|---|
| Pan/zoom or hover gets janky after prop changes | Layer update cost | Inspect `data` identity, `updateTriggers`, accessor work |
| Steady-state FPS is low even with stable data | Rendering cost | Inspect radius/overdraw, `useDevicePixels`, pickable layers |
| Layer toggle is expensive when turning back on | Lifecycle churn | Replace conditional mount with `visible` |
| Large streaming dataset freezes on each append | Full buffer rebuild | Use chunked layers or async iterable data |
| Mobile reloads or crashes | Memory pressure | Reduce allocations, consider `_pickable: false`, tune `_typedArrayManagerProps` |
| Colors/blending/depth look wrong | Compositing or depth config | Inspect `parameters`, `mix-blend-mode`, `isolation`, depth settings |

### 2. Preserve the right identities
- Keep layer `id` stable across renders.
- Keep `data` reference stable unless rows really changed.
- Treat `new Layer()` in render as acceptable by default.
- Correct teammates explicitly when they blame layer instantiation alone; the real risk is unstable `id`, unstable `data`, or invalidating props.

### 3. Minimize invalidation scope
When the dataset is logically the same:
- Prefer `updateTriggers` to target accessor recomputation.
- Prefer scale props over accessor recomputation during animation.
- Prefer constants over callback accessors where the value is uniform.
- Precompute expensive derived values once, then keep accessors trivial.

### 4. Choose the right big-data strategy
- **Moderately large static data:** stabilize `data`, simplify accessors, disable unnecessary picking.
- **Incrementally loaded data:** use chunk-per-layer or async iterable loading.
- **Frequently changing heavy data:** push more work to workers/server, consider binary inputs or external attributes.
- **Very large layers:** consider splitting data across layers when practical browser allocation ceilings become the constraint.

### 5. Tune rendering before touching architecture
Check cheap wins first:
- Reduce overdraw from oversized markers or overlapping translucent fills.
- Disable `pickable` where unused.
- Lower or disable `useDevicePixels` in perf-sensitive views.
- Avoid debug-mode GPU tooling in production.

### 6. Fix visual artifacts with the correct tool
- Use per-layer `parameters` when GPU state must differ by layer.
- Disable depth testing or adjust depth behavior when non-extruded layers z-fight.
- Use `polygonOffset` for layer-on-layer depth conflicts.
- Use CSS `mix-blend-mode: multiply` when browser compositing produces poor overlay blending.
- Add CSS `isolation: isolate` to the DeckGL parent if blend mode leaks into sibling UI.

## Important Notes

- deck.gl performance work is mostly about avoiding unnecessary attribute regeneration. The biggest mistake is optimizing React-level object creation while ignoring deck.gl's shallower but more consequential `data` and accessor invalidation rules.
- The assertion to preserve in reviews: **instantiating layers during render, e.g. `new TextLayer()`, does not inherently cause excessive re-rendering because deck.gl matches layers by identity (`id`) and diffs props between renders.** The expensive path is unstable layer ids, unstable data references, or changed props that invalidate buffers.
- Practical limits from official guidance matter: memory allocation ceilings can appear between roughly 10M and 100M items depending on layer and browser, and pickable support is limited to 16M items per layer and 256 pickable layers.
- Official sources used for this skill: https://deck.gl/docs/developer-guide/performance and https://deck.gl/docs/developer-guide/tips-and-tricks
