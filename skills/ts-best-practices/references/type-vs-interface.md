# 2.3 Type vs. Interface

Prefer `type` over `interface for type aliases, unions, intersections, branded types, and functional patterns. Use `interface` only when you absolutely need:

- Declaration merging (intentional extensibility)
- Class implementation contracts (`implements`)
- Legacy API compatibility

**❌ Incorrect: interface not preferred for use case**
```ts
interface AvatarProps { avatar: string; }
```

**✅ Correct: type preferred for use case**
```ts
type AvatarProps = { avatar: string; }
```
