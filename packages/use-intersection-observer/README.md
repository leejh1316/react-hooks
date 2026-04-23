# @leejaehyeok/use-intersection-observer

[English](./README.md) | [한국어](./README-ko.md)

React hooks for observing element visibility using the Intersection Observer API. Provides two hooks: `useIntersectionObserver` for tracking a single element and `useIntersectionObserverGroup` for tracking multiple elements. Perfect for lazy loading, infinite scroll, analytics tracking, and scroll-based animations.

## 📦 Installation

```bash
npm install @leejaehyeok/use-intersection-observer
```

## 🚀 Quick Start

### Single Element Tracking

Track the visibility of a single element:

```tsx
import React, { useRef } from "react";
import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";

export function MyComponent() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({
    targetSelector: "[data-target]",
    onEntered: (entry) => console.log("Entered!"),
    onExited: (entry) => console.log("Exited!"),
  });

  return (
    <div ref={setContainerRef}>
      <div data-target>{isVisible ? "Visible" : "Hidden"}</div>
    </div>
  );
}
```

### Multiple Elements Tracking

Track visibility of multiple elements:

```tsx
import React from "react";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

export function MyComponent() {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    keyAttribute: "data-key",
    onEntered: (key, entry) => console.log(`Item ${key} entered`),
  });

  return (
    <div ref={setContainerRef}>
      {["item-1", "item-2", "item-3"].map((key) => (
        <div key={key} data-key={key}>
          {states[key]?.isVisible ? "In view" : "Out of view"}
        </div>
      ))}
    </div>
  );
}
```

## 🧠 Key Features

- **Single & Multiple Elements:** Track one or many elements with dedicated hooks.
- **Lifecycle Callbacks:** `onEntered`, `onExited`, and `onChange` callbacks for full control.
- **State Tracking:** Know if elements are visible or have been entered.
- **Once Option:** Auto-unobserve after first intersection with `once: true`.
- **Flexible Root:** Use the viewport or a scrollable container as the intersection root.
- **Reset Control:** Reset observation state programmatically with `reset()` method.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
