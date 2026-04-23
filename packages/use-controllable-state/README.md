# @leejaehyeok/use-controllable-state

[English](./README.md) | [한국어](./README-ko.md)

A React hook for managing both controlled and uncontrolled component patterns seamlessly. Supports external value control, internal state management, and event callbacks with automatic optimization to prevent unnecessary updates.

## 📦 Installation

```bash
npm install @leejaehyeok/use-controllable-state
```

## 🚀 Quick Start

The hook returns a tuple with the current value and a setter function, supporting both controlled and uncontrolled modes.

```tsx
import React from "react";
import { useControllableState } from "@leejaehyeok/use-controllable-state";

// Uncontrolled mode
export function UncontrolledInput() {
  const [value, setValue] = useControllableState({
    defaultValue: "",
    onChange: (value) => console.log("Changed:", value),
  });

  return <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Uncontrolled" />;
}

// Controlled mode
export function ControlledInput({ value, onChange }) {
  const [state, setState] = useControllableState({
    value,
    onChange,
  });

  return <input value={state} onChange={(e) => setState(e.target.value)} placeholder="Controlled" />;
}
```

## 🧠 Key Features

- **Dual Mode Support:** Seamlessly switch between controlled (external state) and uncontrolled (internal state) patterns.
- **Automatic Optimization:** Prevents unnecessary updates by comparing values using `Object.is`.
- **onChange Callback:** Notify parent components of state changes.
- **Flexible Initialization:** Support for default values and function-based initialization.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-controllable-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
