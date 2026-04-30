# @leejaehyeok/use-compose-state

[English](./README.md) | [한국어](./README-ko.md)

A React hook for composing multiple state setters into a single unified state setter. Synchronize external-controlled state, internal state, and additional state values in a single call.

## 📦 Installation

```bash
npm install @leejaehyeok/use-compose-state
```

## 🚀 Quick Start

Compose multiple state setters into a single setter that updates all of them together:

```tsx
import React, { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

export function MyComponent() {
  // External controlled state
  const [externalState, setExternalState] = useState(0);

  // Internal state
  const [internalState, setInternalState] = useState(0);

  // Additional state
  const [additionalState, setAdditionalState] = useState(0);

  // Compose multiple setters into one
  const composedSetState = useComposedState(setExternalState, setInternalState, setAdditionalState);

  return (
    <div>
      <button onClick={() => composedSetState((prev) => (typeof prev === "number" ? prev + 1 : 0))}>Increment All: {externalState}</button>
    </div>
  );
}
```

## 🧠 Key Features

- **Multiple State Setters:** Compose any number of state setters into a single unified setter.
- **Synchronization:** Updates all composed setters simultaneously with a single value.
- **Functional Updates:** Supports both direct values and functional updates like standard React state setters.
- **Type Safe:** Full TypeScript support with generic type inference.
- **Flexible State Management:** Manage external-controlled and internal state together seamlessly.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
