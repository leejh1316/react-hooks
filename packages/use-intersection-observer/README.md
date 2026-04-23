# @leejaehyeok/use-compose-ref

[English](./README.md) | [한국어](./README-ko.md)

A React hook for composing multiple refs into a single callback ref. Supports all ref types (functions, objects, null) and provides React 19 cleanup function support for flexible ref management.

## 📦 Installation

```bash
npm install @leejaehyeok/use-compose-ref
```

## 🚀 Quick Start

Compose multiple refs into a single callback ref that manages all of them together:

```tsx
import React, { useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

export function MyComponent() {
  const internalRef = useRef<HTMLDivElement>(null);
  const externalRef = useRef<HTMLDivElement>(null);

  // Compose multiple refs into one
  const composedRef = useComposedRefs(internalRef, externalRef, (el) => {
    console.log("Element:", el);
  });

  return <div ref={composedRef}>Content</div>;
}
```

## 🧠 Key Features

- **Multiple Ref Types:** Supports all ref types - MutableRefObject, RefCallback, and null.
- **Automatic Cleanup:** Handles React 19 cleanup functions for callback refs automatically.
- **Simple API:** Easy composing of multiple refs with `useComposedRefs` hook.
- **Flexible Ref Merging:** Combine any number of refs without conflict.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
