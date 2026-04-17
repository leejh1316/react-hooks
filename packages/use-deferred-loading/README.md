# @leejaehyeok/use-deferred-loading

[English](./README.md) | [한국어](./README-ko.md)

A React hook that shows loading state only when loading persists longer than a specified delay. Prevents unnecessary UI flicker from short-lived loading states.

## 📦 Installation

```bash
npm install @leejaehyeok/use-deferred-loading
```

## 🚀 Quick Start

The hook takes a loading state and delay time, and returns true only when loading persists longer than the delay.

```tsx
import React, { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, 300);

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isDeferredLoading && <p>Loading...</p>}
      <button onClick={handleFetch} disabled={isLoading}>
        Fetch Data
      </button>
    </div>
  );
}
```

## 🧠 Behavior

- **Deferred Loading State:** When `isLoading` becomes true, `isDeferredLoading` only becomes true after the specified `delay` (default: 100ms).
- **Flicker Prevention:** Short-lived loading states don't trigger UI updates, preventing unnecessary spinner flicker.
- **Automatic Cleanup:** When `isLoading` becomes false, `isDeferredLoading` immediately becomes false and the timer is automatically cleared.

## ⚙️ Parameters

- `isLoading` (boolean): Whether the component is currently loading.
- `delay` (number, optional): Delay time in milliseconds before showing the loading state. Default is 100ms.

## 💡 Use Cases

- Prevent loading UI from showing during quick network requests
- Improve user experience in search results loading
- Avoid unnecessary spinner flicker during data fetching

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-throttle)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
