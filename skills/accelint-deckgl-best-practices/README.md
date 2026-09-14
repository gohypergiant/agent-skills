# Deck.gl Best Practices

Expert skill for agents working on `deck.gl` visualizations, especially when performance, large datasets, layer lifecycles, rendering artifacts, or map-overlay behavior matter.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-deckgl-best-practices
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-deckgl-best-practices
```

## Usage

Use this skill when prompts mention deck.gl performance, layer rendering, large maps, or visual bugs.

**prompt**
```text
Review this deck.gl map component for performance problems. We have 500k points, hover is laggy, and someone suggested memoizing away new TextLayer() calls in render.
```

**prompt**
```text
Refactor this DeckGL view to use updateTriggers correctly and stop rebuilding data on every year change.
```

## What’s Included

- **SKILL.md** - Main expert workflow for diagnosing deck.gl update cost, rendering cost, and compositing issues
- **AGENTS.md** - Compact routing guide for agents
- **references/performance-patterns.md** - Data identity, updateTriggers, visibility, accessor, and streaming patterns
- **references/rendering-and-compositing.md** - Overdraw, picking, HiDPI, depth, blending, and mobile memory guidance

## Requirements

- Familiarity with `deck.gl` concepts such as layers and accessors
- Best suited for codebases using `@deck.gl/*` packages directly or through `DeckGL`

## Examples

### Example 1: Correct a mistaken review comment

```text
Someone says new TextLayer() inside React render causes excessive re-rendering. Review whether that's actually true in deck.gl.
```

Expected result: the agent explains deck.gl's identity diffing model, checks stable `id` and `data`, and avoids pointless React-only optimizations.

### Example 2: Fix dataset invalidation

```text
This ScatterplotLayer rebuilds when filters haven't changed. Audit the data and accessor patterns.
```

Expected result: the agent stabilizes `data`, uses `updateTriggers` where appropriate, and reduces accessor churn.

## Contributing

When updating this skill:

1. Keep the description field trigger-focused
2. Preserve the core assertion that render-time layer instantiation is normal when ids and props are stable
3. Prefer expert mental models over generic tutorials
4. Keep examples concrete and performance-oriented
5. Update `CHANGELOG.md` and `metadata.version` together

## Learn More

- Official performance guide: https://deck.gl/docs/developer-guide/performance
- Official tips and tricks: https://deck.gl/docs/developer-guide/tips-and-tricks
- Agent Skills Specification: https://agentskills.io/specification

## License

Apache-2.0
