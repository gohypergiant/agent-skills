# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-26

### Added
- Initial release of `accelint-deckgl-best-practices`
- Core workflow for diagnosing deck.gl performance issues by separating data invalidation, accessor cost, rendering cost, and compositing issues
- Explicit guidance that instantiating layers during render, such as `new TextLayer()`, is normally safe because deck.gl diffs layers by stable `id` and props
- Reference guide for stable `data`, `updateTriggers`, `visible`, scale props, streaming chunks, async iterables, and binary/external attribute escalation
- Reference guide for overdraw, picking, `useDevicePixels`, depth settings, CSS blending, isolation, and mobile memory controls

### Rationale
- Created this skill to capture deck.gl-specific performance knowledge that is easy for general React or TypeScript guidance to get wrong
- Prevents a common false positive in code review: blaming `new Layer()` calls in render instead of the real causes of expensive updates such as unstable `data` references or broad invalidation
- Grounds the skill in official deck.gl guidance so agents can make better trade-offs around large datasets, GPU costs, and browser compositing behavior

### Version
- Initial release at 1.0.0
