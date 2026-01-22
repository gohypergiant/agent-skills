# 4.11 Additional Performance Concerns

## Issues

- String concatenation in loops (use array join)
- Regular expression creation in loops
- Synchronous I/O on hot paths
- Unnecessary async/await overhead
- try/catch in tight loops (deoptimization risk)
- Closures capturing large scopes
- Function bind/arrow functions in render paths

## Optimizations

- Batch string operations
- Compile regex once, reuse
- Use async I/O with proper batching
- Remove unnecessary async wrappers
- Move error handling outside hot loops
- Minimize closure scope
- Prebind functions outside loops/renders

## Examples

### String Building with Array Join

String concatenation creates new strings on each operation. Use array join for building strings in loops.

**❌ Incorrect: repeated string concatenation**
```ts
let result = '';
for (const item of items) {
  result += item.name + ', ';
}
```

**✅ Correct: array join**
```ts
const parts = [];
for (const item of items) {
  parts.push(item.name);
}
const result = parts.join(', ');
```

### Regular Expression in Loops

**❌ Incorrect: create regex each iteration**
```ts
for (const text of texts) {
  const matches = text.match(/\d+/g);
  process(matches);
}
```

**✅ Correct: compile once**
```ts
const digitRegex = /\d+/g;
for (const text of texts) {
  const matches = text.match(digitRegex);
  process(matches);
}
```

### Unnecessary Async Overhead

**❌ Incorrect: async wrapper with no await**
```ts
async function getUser(id) {
  return users.find(u => u.id === id);
}
```

**✅ Correct: synchronous function**
```ts
function getUser(id) {
  return users.find(u => u.id === id);
}
```

### try/catch in Tight Loops

**❌ Incorrect: error handling in loop**
```ts
for (let i = 0; i < items.length; i++) {
  try {
    process(items[i]);
  } catch (err) {
    logError(err);
  }
}
```

**✅ Correct: move error handling outside**
```ts
try {
  for (let i = 0; i < items.length; i++) {
    process(items[i]);
  }
} catch (err) {
  logError(err);
}

// Or handle errors in the called function
```

### Closures Capturing Large Scopes

**❌ Incorrect: capture entire context**
```ts
function createProcessor(largeConfig) {
  return function process(item) {
    return item.value * largeConfig.data.nested.multiplier;
  };
}
```

**✅ Correct: minimize closure scope**
```ts
function createProcessor(largeConfig) {
  const multiplier = largeConfig.data.nested.multiplier;
  return function process(item) {
    return item.value * multiplier;
  };
}
```

### Function Bind in Render Paths

**❌ Incorrect: create new function each render**
```ts
function Component({ items }) {
  return items.map(item => (
    <button onClick={() => handleClick(item.id)}>
      {item.name}
    </button>
  ));
}
```

**✅ Correct: prebind or use data attributes**
```ts
function Component({ items }) {
  const handleItemClick = (e) => {
    handleClick(e.target.dataset.id);
  };

  return items.map(item => (
    <button onClick={handleItemClick} data-id={item.id}>
      {item.name}
    </button>
  ));
}
```

### Async I/O on Hot Paths

**❌ Incorrect: synchronous blocking**
```ts
import { readFileSync } from 'fs';

function loadTemplate(name) {
  return readFileSync(`./templates/${name}.html`, 'utf-8');
}

// Called in request handler
app.get('/page', (req, res) => {
  const template = loadTemplate('home');
  res.send(template);
});
```

**✅ Correct: async with caching**
```ts
import { readFile } from 'fs/promises';

const templateCache = new Map();

async function loadTemplate(name) {
  if (!templateCache.has(name)) {
    const content = await readFile(`./templates/${name}.html`, 'utf-8');
    templateCache.set(name, content);
  }
  return templateCache.get(name);
}

app.get('/page', async (req, res) => {
  const template = await loadTemplate('home');
  res.send(template);
});
```

### Template Literals vs Array Join

For complex string building with many parts, array join can be more efficient than template literals.

**❌ Incorrect: multiple concatenations per iteration**
```ts
function buildHTML(items) {
  let html = '<ul>';
  for (const item of items) {
    html += '<li>' + item.name + '</li>';
  }
  html += '</ul>';
  return html;
}
```

**✅ Correct: array join (better for many items)**
```ts
function buildHTML(items) {
  const parts = ['<ul>'];
  for (const item of items) {
    parts.push('<li>', item.name, '</li>');
  }
  parts.push('</ul>');
  return parts.join('');
}
```

**Note**: For small iterations (<100 items) or simple concatenations, template literals are fine and more readable.
