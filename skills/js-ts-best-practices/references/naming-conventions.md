# 1.1 Naming Conventions

## Descending Order Rule for Qualifiers

When combining measurements with qualifiers (min, max, avg) or units (ms, px, count), append them in **descending order of significance**. This creates natural autocomplete grouping and prevents scattered naming.

**❌ Incorrect: qualifier comes first**
```ts
const maxLatencyMs = 1000;
const minLatencyMs = 100;
const avgLatencyMs = 500;

// In autocomplete these appear scattered alphabetically:
// - avgLatencyMs
// - maxLatencyMs
// - minLatencyMs
```

**✅ Correct: qualifiers appended in descending order**
```ts
const latencyMsMax = 1000;
const latencyMsMin = 100;
const latencyMsAvg = 500;

// In autocomplete these group together naturally:
// - latencyMsAvg
// - latencyMsMax
// - latencyMsMin
```

**Why this matters**: Enables efficient discovery via autocomplete. Type `latency` and all related metrics appear together. The pattern scales:

```ts
// Cache metrics grouped by prefix
const cacheHitsCount = 0;
const cacheMissesCount = 0;
const cacheRatioPercent = 0;

// Timing metrics grouped by prefix
const renderTimeMs = 0;
const renderTimeMsMax = 0;
const renderTimeMsMin = 0;
```

## Boolean Prefixes

Prefix boolean variables and functions with `is`, `has`, `should`, or `can` to make their type obvious.

**❌ Incorrect: ambiguous type**
```ts
const visible = getVisibility();  // Function? Boolean? String?
const children = countChildren(); // Array? Number? Boolean?
```

**✅ Correct: unambiguous boolean**
```ts
const isVisible = getVisibility();
const hasChildren = countChildren() > 0;
```

**Why this matters**: Prevents type confusion and makes conditionals self-documenting:
```ts
if (hasChildren) { /* clear intent */ }
```
