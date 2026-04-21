# @leejaehyeok/use-overflow

[English](./README.md) | [한국어](./README-ko.md)

A React hook to detect if the children of a container overflow its boundaries using `ResizeObserver` and `MutationObserver`.

## 📦 Installation

```bash
npm install @leejaehyeok/use-overflow
```

## 🚀 Quick Start

Detect if a container's children exceed its width:

```tsx
import React from "react";
import { useOverflow } from "@leejaehyeok/use-overflow";

export function MyComponent() {
  const { containerRef, isOverflow } = useOverflow();

  return (
    <div>
      <div ref={containerRef} style={{ display: "flex", overflow: "hidden", width: "200px" }}>
        <div style={{ flexShrink: 0, width: "150px" }}>Item 1</div>
        <div style={{ flexShrink: 0, width: "150px" }}>Item 2</div>
      </div>
      {isOverflow && <p>Content is overflowing!</p>}
    </div>
  );
}
```

## 🧠 Key Features

- **Accurate Detection:** Detects overflow by measuring the actual position of the last child node relative to the container.
- **Responsive:** Automatically recalculates on size (`ResizeObserver`) or DOM changes (`MutationObserver`).
- **Targeted Items:** Optionally mark specific child nodes with a `data-overflow-item` attribute to limit observation only to them.
- **Performance Optimized:** Uses `requestAnimationFrame` to batch measurements and prevents memory leaks by automatically cleaning up observers.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-overflow)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
