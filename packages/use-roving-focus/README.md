# @leejaehyeok/use-roving-focus

[English](./README.md) | [한국어](./README-ko.md)

Accessible keyboard navigation with roving tabindex for React.

## 📦 Installation

```bash
npm install @leejaehyeok/use-roving-focus
```

## 🚀 Quick Start

1. Wrap your container with the bindings provided by the hook (`containerRef` and `handleKeyDown`).
2. Add the `data-roving-item` attribute (or your custom `itemSelector`) to all focusable items inside the container.

```tsx
import React from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

export default function App() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]", // Default
    orientation: "vertical", // 'horizontal' | 'vertical' | 'both'
    loop: true, // Wrap focus at bounds
  });

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onKeyDown={handleKeyDown}
      role="menu"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <button data-roving-item role="menuitem">
        Item 1
      </button>
      <button data-roving-item role="menuitem">
        Item 2
      </button>
      {/* Items with the basic 'disabled' HTML attribute are automatically skipped */}
      <button data-roving-item role="menuitem" disabled>
        Item 3
      </button>
      <button data-roving-item role="menuitem">
        Item 4
      </button>
    </div>
  );
}
```

## ⚙️ Options (`RovingFocusOptions`)

| Property          | Type                                   | Default                | Description                                                                                   |
| :---------------- | :------------------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------- |
| `itemSelector`    | `string`                               | `"[data-roving-item]"` | The CSS selector for finding focusable items in the container.                                |
| `orientation`     | `"horizontal" \| "vertical" \| "both"` | `"both"`               | The axis allowed for keyboard navigation.                                                     |
| `loop`            | `boolean`                              | `false`                | Whether focus loops around when reaching the start or end.                                    |
| `colSkipCount`    | `number`                               | `0`                    | Number of columns when using a grid structure. Useful for `vertical` navigation calculations. |
| `initialIndex`    | `number`                               | `0`                    | Start index of the primarily focused item.                                                    |
| `clickOnNavigate` | `boolean`                              | `false`                | Triggers a `.click()` event programmatically upon navigating to an item.                      |
| `scrollIntoView`  | `boolean \| ScrollIntoViewOptions`     | `false`                | Calls `.scrollIntoView()` natively to bring the focused element into view.                    |
| `enableHome`      | `boolean`                              | `true`                 | Enable `Home` key to jump to the first enabled item.                                          |
| `enableEnd`       | `boolean`                              | `true`                 | Enable `End` key to jump to the last enabled item.                                            |
| `onNavigate`      | `(detail: NavigationDetail) => void`   | `() => {}`             | Callback fired upon successful navigation.                                                    |
| `onUnderflow`     | `() => void`                           | `() => {}`             | Callback fired when attempting to navigate past the first item while `loop` is false.         |
| `onOverflow`      | `() => void`                           | `() => {}`             | Callback fired when attempting to navigate past the last item while `loop` is false.          |

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-roving-focus)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
