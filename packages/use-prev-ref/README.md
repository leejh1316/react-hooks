# @leejaehyeok/use-prev-ref

[English](./README.md) | [한국어](./README-ko.md)

A React hook that stores and returns the previous value of a prop or state. Useful for comparing current and previous values, tracking changes, or implementing custom logic based on value transitions.

## 📦 Installation

```bash
npm install @leejaehyeok/use-prev-ref
```

## 🚀 Quick Start

The hook takes a value and returns the previous value from the last render.

```tsx
import React, { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

export default function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevRef(count);

  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={() => console.log(prevCount.current)}>Previous Count</button>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## 🧠 Behavior

- **Previous Value Tracking:** Returns the value from the previous render cycle.
- **Generic Type Support:** Supports any value type (numbers, strings, objects, etc.) with full TypeScript support.
- **Cleanup Function:** Uses `useEffect` cleanup function to update the ref, ensuring the previous value is always one render behind the current value.

## ⚠️ Caution

**Not recommended for direct JSX rendering.** Use only when accessing the value programmatically.

Due to the one-render-cycle delay in the hook's update timing:

- ✅ **Recommended:** Accessing the previous value asynchronously or dynamically (e.g., in event handlers, conditions, or side effects) works correctly.
- ❌ **Not Recommended:** Rendering the previous value directly in JSX will display the value from two renders ago, not one render ago.

```tsx
// ✅ Good: Access prevCount in logic
if (prevCount !== count) {
  console.log("Value changed");
}

// ❌ Bad: Don't render prevCount directly in JSX
<p>{prevCount}</p>; // Shows the value from 2 renders ago
```

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-prev-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
