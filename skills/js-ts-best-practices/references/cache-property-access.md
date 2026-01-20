# 4.8 Cache Property Access in Loops

Cache object property lookups in hot paths.

**❌ Incorrect: 3 lookups × N iterations**
```ts
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value);
}
```

**✅ Correct: 1 lookup total**
```ts
const value = obj.config.settings.value;
const len = arr.length;

for (let i = 0; i < len; i++) {
  process(value);
}
```
