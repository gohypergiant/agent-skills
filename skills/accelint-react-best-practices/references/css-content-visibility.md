# 2.2 CSS content-visibility for Long Lists

Apply content-visibility: auto to defer off-screen rendering.

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use CSS `content-visibility`. This is a CSS optimization, not a React code optimization.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
