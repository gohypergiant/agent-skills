# YAML generation safety

Use this reference when you prepare the preview or final `openspec/config.yaml`.

## Quoting requirements

Quote values that start with YAML-significant characters or that would otherwise parse ambiguously.

Characters and patterns that commonly need quotes:
- `|`, `>`, `"`, `'`, `(`, `)`, `[`, `]`, `{`, `}`, `*`, `&`, `!`, `%`, `@`, `` ` ``
- values containing an unescaped colon that would read like a key/value split
- command examples that contain embedded quotes

Examples:

```yaml
❌ description: (internal) auth module
✅ description: "(internal) auth module"

❌ tag: [PKG:auth]
✅ tag: "[PKG:auth]"

❌ pattern: some|other
✅ pattern: "some|other"

❌ note: Time: 5pm
✅ note: "Time: 5pm"

✅ command: 'npm run "test:unit"'
✅ command: "npm run 'test:unit'"
```

## Multi-line strings

Use block scalars for multi-line content.

```yaml
context: |
  Line 1
  Line 2
  Line 3
```

Use folded blocks only when newlines should collapse into spaces.

## Indentation rules

- Use spaces only, never tabs
- Keep indentation consistent, typically 2 spaces per level
- Indent block-scalar contents relative to their key
- Keep sibling list items aligned

## List safety

```yaml
rules:
  proposal:
    - Keep proposals under 100 lines
    - Include scope boundaries

  tasks:
    - "Tag with [PKG:name] format"
    - 'Use "Test:" prefix for validation'
```

## Validation checklist

After writing the file, verify:
1. No tabs are present
2. Special-character-leading values are quoted
3. Indentation is consistent
4. List items align correctly under their parent keys
5. Quotes are balanced and intentionally chosen
6. The YAML is conceptually parseable with no stray brackets or unmatched quotes
