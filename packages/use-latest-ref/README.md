# @leejaehyeok/use-latest-ref

[English](./README.md) | [한국어](./README-ko.md)

A React hook that returns a mutable ref object whose `.current` property is always up-to-date with the latest value passed to it. Useful for accessing the latest state or props in callbacks or asynchronous operations without including them in dependency arrays, thus avoiding unnecessary re-renders or effect re-runs.

## 📦 Installation

```bash
npm install @leejaehyeok/use-latest-ref
```

## 🚀 Quick Start

The hook takes a value and returns a React `RefObject` containing that value.

```tsx
import React, { useState, useEffect } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

export default function App() {
  const [count, setCount] = useState(0);
  const latestCount = useLatestRef(count);

  useEffect(() => {
    const interval = setInterval(() => {
      // Accessing the latest count without adding `count` to the dependency array
      console.log("Current count is:", latestCount.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect only runs on mount

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

## 🧠 Behavior

- **Always up-to-date:** Uses `useLayoutEffect` to synchronously update the `.current` value whenever the passed value changes, ensuring it's available before the browser paints.
- **Stable Instance:** the returned `ref` object is stable over the lifetime of the component, making it safe to use inside effects or callbacks without being a dependency.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-latest-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
