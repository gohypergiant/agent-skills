# 4.1 Named Imports

Always used named imports from the `react` library.

**❌ Incorrect: default import**
```ts
import React from 'react';
```

**❌ Incorrect: wildcard import**
```ts
import * as React from 'react';
```

**✅ Correct: named imports**
```ts
import { useEffect, useState } from 'react';
```
