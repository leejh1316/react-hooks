# @leejaehyeok/use-compose-ref

[English](./README.md) | [한국어](./README-ko.md)

여러 개의 ref를 하나의 callback ref로 합성하는 React 훅입니다. 모든 ref 타입(함수형, 객체형, null)을 지원하며 React 19의 cleanup 함수를 자동으로 처리합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-compose-ref
```

## 🚀 빠른 시작

여러 개의 ref를 하나의 callback ref로 합성하여 함께 관리할 수 있습니다:

```tsx
import React, { useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

export function MyComponent() {
  const internalRef = useRef<HTMLDivElement>(null);
  const externalRef = useRef<HTMLDivElement>(null);

  // 여러 개의 ref를 하나로 합성
  const composedRef = useComposedRefs(internalRef, externalRef, (el) => {
    console.log("요소:", el);
  });

  return <div ref={composedRef}>콘텐츠</div>;
}
```

## 🧠 주요 기능

- **모든 Ref 타입 지원:** MutableRefObject, RefCallback, null 모두 지원합니다.
- **자동 정리 처리:** React 19의 callback ref 정리 함수를 자동으로 관리합니다.
- **간단한 API:** `useComposedRefs` 훅으로 여러 ref를 쉽게 합성할 수 있습니다.
- **유연한 Ref 병합:** 충돌 없이 여러 개의 ref를 병합합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
