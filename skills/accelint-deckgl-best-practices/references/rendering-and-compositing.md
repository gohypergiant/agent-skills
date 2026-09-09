# Rendering and Compositing

## 1. Diagnose render cost separately from update cost

If interaction is slow only after prop/data changes, investigate attribute regeneration first. If FPS is low even when data is stable, investigate rendering cost.

## 2. Watch fragment overdraw

A layer can be "small enough" by item count and still be slow because each item covers too many pixels. Large radii, thick strokes, translucent overlap, and dense scenes increase fragment shader work.

**Heuristic:** if counts look reasonable but zoomed-in or large markers tank FPS, inspect overdraw before rewriting data flow.

## 3. Disable expensive features when UX does not require them

### Picking

**❌ Incorrect: leaving every layer pickable by habit**
```ts
new ScatterplotLayer({
  id: 'background-points',
  data,
  pickable: true
})
```

**✅ Correct: enable picking only where interaction exists**
```ts
new ScatterplotLayer({
  id: 'background-points',
  data,
  pickable: false
})
```

### High-DPI rendering

`useDevicePixels` is on by default and can significantly raise fragment cost on Retina/high-DPI displays. Lower it in performance-sensitive views after confirming the visual trade-off is acceptable.

## 4. Use per-layer GPU parameters for rendering control

**Example:** disable depth comparison for 2D overlays that should always draw cleanly.

```ts
new ScatterplotLayer({
  id: 'overlay',
  data,
  parameters: {
    depthCompare: 'always'
  }
})
```

## 5. Fix z-fighting with depth settings, not data changes

If non-extruded or layered geometry flickers because multiple surfaces share depth, change depth behavior.

- Disable depth testing when 3D depth ordering is unnecessary.
- Use `polygonOffset` when the conflict is between layers rather than within one layer.

## 6. Use CSS compositing when browser blending is the issue

Because deck.gl renders in a transparent overlay, final composition with the basemap can be affected by browser CSS blending.

**Useful defaults from official guidance:**

```css
.overlays canvas {
  mix-blend-mode: multiply;
}

.deckgl-parent {
  isolation: isolate;
}
```

- `mix-blend-mode: multiply` can preserve dark map labels better.
- `isolation: isolate` prevents the blend mode from affecting sibling UI.

## 7. Mobile memory trade-offs are explicit

On constrained mobile devices, deck.gl exposes experimental controls that trade features/perf for lower memory use:

```ts
new Deck({
  _pickable: false,
  _typedArrayManagerProps: isMobile ? {overAlloc: 1, poolSize: 0} : null
})
```

Use these when mobile reloads, browser restarts, or memory pressure dominate.

## 8. Know the practical limits before proposing architecture

Official guidance highlights these useful constraints:

- Many basic layers stay fluid around ~1M items on strong laptops, but degrade by ~10M items.
- Browser allocation ceilings can become a hard stop somewhere between ~10M and ~100M items depending on layer/data shape.
- Picking distinguishes up to 16M items per layer.
- Only 256 layers can be pickable.
- deck.gl can handle many layers, but it is not intended for thousands of layers.
