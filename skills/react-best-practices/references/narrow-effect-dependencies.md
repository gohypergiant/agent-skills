# 1.3 Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

**❌ Incorrect: re-runs on any user field change**
```tsx
useEffect(() => {
  console.log(user.id);
}, [user])
```

**✅ Correct: re-runs only when id changes**
```tsx
useEffect(() => {
  console.log(user.id);
}, [user.id])
```

For derived state, compute outside effect:

**❌ Incorrect: runs on width=767, 766, 765...**
```tsx
useEffect(() => {
  if (width < 768) {
    enableMobileMode();
  }
}, [width])
```

**✅ Correct: runs only on boolean transition**
```tsx
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode();
  }
}, [isMobile])
```
