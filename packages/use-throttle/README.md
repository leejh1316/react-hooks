# @leejaehyeok/use-throttle

[English](./README.md) | [한국어](./README-ko.md)

A React hook for throttling function calls, ensuring they are executed at most once in a specified time period. Useful for optimizing performance on frequent events like scrolling, window resizing, or rapid button clicking.

## 📦 Installation

```bash
npm install @leejaehyeok/use-throttle
```

## 🚀 Quick Start

The hook returns a `throttle` function along with `cancel` and `flush` methods to control the timer.

```tsx
import React, { useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

export default function App() {
  const [value, setValue] = useState(0);
  const [throttledValue, setThrottledValue] = useState(0);

  const { throttle, cancel, flush } = useThrottle((val: number) => setThrottledValue(val), 500);

  const handleScroll = (e: any) => {
    // Increase value continuously
    setValue(prev => prev + 1);
    throttle(value + 1);
  };

  return (
    <div onScroll={handleScroll} style={{ height: '200px', overflowY: 'scroll' }}>
      <div style={{ height: '1000px' }}>
        <p>Current Value: {value}</p>
        <p>Throttled Value: {throttledValue}</p>

        <button onClick={cancel}>Cancel</button>
        <button onClick={flush}>Flush</button>
      </div>
    </div>
  );
}
```

## 🧠 Behavior

- **Throttle:** The function is executed at most once every `wait` milliseconds.
- **Options (`leading` / `trailing`):** Fine-grained control to specify whether the function should be invoked on the leading edge (`leading: true`) or the trailing edge (`trailing: true`).
- **`cancel` & `flush`:** Provides utility methods to cancel pending invocations (`cancel`) or execute them immediately (`flush`).

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-throttle)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
