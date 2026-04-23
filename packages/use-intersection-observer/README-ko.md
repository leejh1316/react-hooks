# @leejaehyeok/use-intersection-observer

[English](./README.md) | [한국어](./README-ko.md)

Intersection Observer API를 사용하여 요소의 화면 표시 여부를 감지하는 React 훅입니다. 단일 요소 추적을 위한 `useIntersectionObserver`와 여러 요소 추적을 위한 `useIntersectionObserverGroup` 두 개의 훅을 제공합니다. 지연 로딩, 무한 스크롤, 분석 추적, 스크롤 기반 애니메이션에 완벽합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-intersection-observer
```

## 🚀 빠른 시작

### 단일 요소 추적

하나의 요소 표시 여부를 추적합니다:

```tsx
import React from "react";
import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";

export function MyComponent() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({
    targetSelector: "[data-target]",
    onEntered: (entry) => console.log("화면에 나타남!"),
    onExited: (entry) => console.log("화면에서 벗어남!"),
  });

  return (
    <div ref={setContainerRef}>
      <div data-target>{isVisible ? "표시 중" : "숨겨짐"}</div>
    </div>
  );
}
```

### 여러 요소 추적

여러 요소의 표시 여부를 동시에 추적합니다:

```tsx
import React from "react";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

export function MyComponent() {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    keyAttribute: "data-key",
    onEntered: (key, entry) => console.log(`항목 ${key} 표시됨`),
  });

  return (
    <div ref={setContainerRef}>
      {["item-1", "item-2", "item-3"].map((key) => (
        <div key={key} data-key={key}>
          {states[key]?.isVisible ? "화면에 보임" : "화면 밖"}
        </div>
      ))}
    </div>
  );
}
```

## 🧠 주요 기능

- **단일/다중 추적:** 하나 또는 여러 개의 요소 추적을 위한 별도의 훅 제공.
- **생명주기 콜백:** `onEntered`, `onExited`, `onChange` 콜백으로 세밀한 제어 가능.
- **상태 추적:** 요소가 표시 중인지, 이전에 표시된 적이 있는지 알 수 있습니다.
- **Once 옵션:** `once: true`로 설정하여 첫 교차 후 자동 해제.
- **유연한 Root:** viewport 또는 스크롤 가능한 컨테이너를 교차 root로 사용 가능.
- **Reset 제어:** `reset()` 메서드로 관찰 상태를 프로그래밍 방식으로 초기화.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
