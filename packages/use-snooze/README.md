# @leejaehyeok/use-snooze

[English](./README.md) | [한국어](./README-ko.md)

A React hook to manage "snooze" functionality, allowing you to hide specific UI elements (like banners, popups, or tooltips) for a specified duration using `localStorage` or `sessionStorage`.

## 📦 Installation

```bash
npm install @leejaehyeok/use-snooze
```

## 🚀 Quick Start

The hook returns a tuple containing a boolean `isActive` representing visibility, and a `snooze` function to hide the component.

```tsx
import React from "react";
import { useSnooze } from "@leejaehyeok/use-snooze";

export default function App() {
  const [isActive, snooze] = useSnooze({
    key: "my-banner-snooze",
    duration: "day", // "day" or number in milliseconds
    storageType: "local", // "local" | "session"
  });

  if (!isActive) return null;

  return (
    <div style={{ padding: "16px", background: "lightblue" }}>
      <p>This is a promotional banner.</p>
      <button onClick={snooze}>Do not show today</button>
    </div>
  );
}
```

## 🧠 Behavior

- **Web Storage:** Uses `localStorage` or `sessionStorage` to persist the snooze expiration time across reloads.
- **Easy Duration:** Pass `"day"` to automatically set the duration to 24 hours, or pass a custom `number` in milliseconds.
- **Auto Reactivate (`autoReactivate`):** If true, the flag will automatically become active again as soon as the duration expires, without requiring a page reload.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-snooze)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
