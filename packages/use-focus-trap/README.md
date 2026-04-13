# @leejaehyeok/use-focus-trap

[English](./README.md) | [한국어](./README-ko.md)

A React hook for trapping focus within a specific container module, enhancing accessibility for modals, dialogs, and specific UI elements.

## 📦 Installation

```bash
npm install @leejaehyeok/use-focus-trap
```

## 🚀 Quick Start

Wrap your container with the `containerRef` provided by the hook. The focus will automatically cycle among the focusable elements inside the container when navigating via `Tab` or `Shift + Tab`.

```tsx
import React, { useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef } = useFocusTrap();

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          role="dialog"
          aria-modal="true"
          style={{ padding: "24px", border: "1px solid black", marginTop: "16px" }}
        >
          <h2>Focus Trap Modal</h2>
          <p>Focus is trapped within this container.</p>

          <button>Action 1</button>
          <button>Action 2</button>
          {/* Elements that are disabled are automatically skipped */}
          <button disabled>Action 3 (Disabled)</button>

          <button onClick={() => setIsOpen(false)}>Close Modal</button>
        </div>
      )}
    </div>
  );
}
```

## 🧠 Behavior

- **Focus Loop:** Pressing `Tab` on the last focusable element moves focus to the first one. Pressing `Shift + Tab` on the first element moves focus to the last one.
- **Dynamic Elements:** Uses `MutationObserver` internally to automatically re-calculate focusable elements whenever children are added/removed or their visibility/disabled status changes.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-focus-trap)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
