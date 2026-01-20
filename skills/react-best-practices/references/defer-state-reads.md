# 1.1 Defer State Reads

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.

**❌ Incorrect: subscribes to all searchParams changes**
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**✅ Correct: reads on demand, no subscription**
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still defer state reads when appropriate. The compiler cannot infer that you don't need to subscribe to state changes.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
