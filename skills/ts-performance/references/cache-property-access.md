# 4.8 Cache Property Access and Variable Aliases

## Issues

- Unnecessary destructuring assignments
- Repeated property access that could be cached
- Intermediate variables with no semantic value
- Excessive parameter spreading
- Multiple property lookups in hot paths

## Optimizations

- Cache frequently accessed properties once
- Eliminate single-use aliases
- Direct property access when clearer
- Avoid destructuring for single property access

## Examples

### Cache Property Access in Loops

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

### Eliminate Single-Use Aliases

**❌ Incorrect: unnecessary intermediate**
```ts
function getUserName(user) {
  const name = user.name;
  return name;
}
```

**✅ Correct: direct access**
```ts
function getUserName(user) {
  return user.name;
}
```

### Unnecessary Destructuring

**❌ Incorrect: destructure for single property**
```ts
function process(data) {
  const { id } = data;
  return fetchUser(id);
}
```

**✅ Correct: direct access**
```ts
function process(data) {
  return fetchUser(data.id);
}
```

### Cache Repeated Property Access

**❌ Incorrect: multiple lookups**
```ts
function calculate(obj) {
  if (obj.config.settings.enabled) {
    return obj.config.settings.value * obj.config.settings.multiplier;
  }
  return obj.config.settings.default;
}
```

**✅ Correct: cache once**
```ts
function calculate(obj) {
  const settings = obj.config.settings;
  if (settings.enabled) {
    return settings.value * settings.multiplier;
  }
  return settings.default;
}
```

### Excessive Parameter Spreading

**❌ Incorrect: spread entire object**
```ts
function render({ id, name, email, address, phone, ...rest }) {
  return formatUser(id, name);
}
```

**✅ Correct: access needed properties**
```ts
function render(user) {
  return formatUser(user.id, user.name);
}
```
