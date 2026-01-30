# 4.1 Named Imports

Always used named imports from the `react` library.

**❌ Incorrect: default import**
```ts
import React from 'react';
```

**✅ Correct: named imports**
```ts
import { useEffect, useState } from 'react';
```

**❌ Incorrect: wildcard import**
```ts
import * as React from 'react';
```

**✅ Correct: named imports**
```ts
import { useEffect, useState } from 'react';
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use named imports. This is an import syntax requirement, not a runtime optimization.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
