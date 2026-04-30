# @leejaehyeok/use-custom-event-state

[English](./README.md) | [한국어](./README-ko.md)

A React hook for syncing state across multiple components using the CustomEvent API. Share state between different parts of your app without prop drilling.

## 📦 Installation

```bash
npm install @leejaehyeok/use-custom-event-state
```

## 🚀 Quick Start

The hook returns a tuple with the current state and a dispatch function. Use the same key in multiple components to synchronize state across them.

```tsx
import React from "react";
import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

// Component A: Update the state
export function ComponentA() {
  const [count, setCount] = useCustomEventState("app-counter", 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Component B: Listen to the same state
export function ComponentB() {
  const [count, setCount] = useCustomEventState("app-counter", 0);

  return (
    <div>
      <p>Synced Count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

## 🧠 Key Features

- **Cross-Component State Sync:** Synchronize state across components using a simple key.
- **Event-Driven Updates:** Uses the browser's CustomEvent API for efficient communication.
- **Functional Updates:** Support for both direct values and function-based state updates.
- **Flexible Initialization:** Support for default values and function-based initialization.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-custom-event-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
