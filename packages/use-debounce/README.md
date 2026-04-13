# @leejaehyeok/use-debounce

[English](./README.md) | [한국어](./README-ko.md)

A React hook for debouncing function calls, ensuring they are only executed after a specified delay without any new calls. Useful for optimizing performance on frequent events like search inputs, window resizing, or API fetching.

## 📦 Installation

```bash
npm install @leejaehyeok/use-debounce
```

## 🚀 Quick Start

The hook returns a `debounce` function along with `cancel` and `flush` methods to control the timer.

```tsx
import React, { useState } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";

export default function App() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const { debounce, cancel, flush } = useDebounce((val: string) => setDebouncedValue(val), 500, { leading: false, trailing: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounce(e.target.value);
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} placeholder="Type to search..." />
      <p>Current Value: {value}</p>
      <p>Debounced Value: {debouncedValue}</p>

      <button onClick={cancel}>Cancel</button>
      <button onClick={flush}>Flush</button>
    </div>
  );
}
```

## 🧠 Behavior

- **Debounce:** The function is executed only after `wait` milliseconds have elapsed since the last time it was invoked.
- **Options (`leading` / `trailing`):** Fine-grained control to specify whether the function should be invoked on the leading edge (`leading: true`) or the trailing edge (`trailing: true`).
- **`cancel` & `flush`:** Provides utility methods to cancel pending invocations (`cancel`) or execute them immediately (`flush`).

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-debounce)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
