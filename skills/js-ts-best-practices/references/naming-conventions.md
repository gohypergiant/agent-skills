# 1.1 Naming Conventions

## Overview

Use descriptive, meaningful names with complete words. Append qualifiers in descending order of significance. Prefix booleans with `is` or `has`.

## Examples

### Descriptive Names

**❌ Incorrect: non descriptive and meaning cannot be inferred**
```ts
const usrNm = /**/;
const a = /**/;
let data;
```

**✅ Correct: descriptive and meaningful**
```ts
const numberOfProducts = /**/;
const customerList = /**/;
const radarCrossSection = lookupCrossSection(entity.platformType);
```

For units and qualifiers append in descending order of significance.

**❌ Incorrect: max qualifier is not appended**
```ts
const maxLatencyMs = /**/;
```

**✅ Correct: qualifiers appended and in correct order**
```ts
const latencyMsMax = /**/;
const latencyMsMin = /**/;
```

For Booleans prefix with `is` or `has`.

**❌ Incorrect: no is or has prefix**
```ts
const visible = true;
const children = false;
```

**✅ Correct: contains is or has prefix**
```ts
const isVisible = true;
const hasChildren = false;
```
