# 3.4 Error Messages

For users make error messages clear, empathetic, and actionable.

**❌ Incorrect: ambiguous and not human friendly**
```ts
alert('Error 500: Internal Server Error');
```

**✅ Correct: descriptive and human friendly**
```ts
alert(
  'We\'re having trouble connecting to our server.\n' +
  'Please check your internet connection and try again.'
);
```

For developers make error messages specific, include values, and explain assumptions.

**❌ Incorrect: ambiguous and lacking value**
```ts
assert(typeof count === 'number', 'Type error');
```

**✅ Correct: specific and includes value**
```ts
assert(
  typeof count === 'number',
  `Expected 'count' to be a number, but got type '${typeof count}'`
);
```
