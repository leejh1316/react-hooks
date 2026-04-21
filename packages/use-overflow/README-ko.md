# @leejaehyeok/use-overflow

[English](./README.md) | [한국어](./README-ko.md)

`ResizeObserver`와 `MutationObserver`를 사용하여 컨테이너의 자식 요소들이 컨테이너 영역을 벗어나는지 (오버플로우) 감지하는 React 훅입니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-overflow
```

## 🚀 빠른 시작

컨테이너의 자식 요소가 범위를 초과하는지 감지합니다:

```tsx
import React from "react";
import { useOverflow } from "@leejaehyeok/use-overflow";

export function MyComponent() {
  const { containerRef, isOverflow } = useOverflow();

  return (
    <div>
      <div ref={containerRef} style={{ display: "flex", overflow: "hidden", width: "200px" }}>
        <div style={{ flexShrink: 0, width: "150px" }}>항목 1</div>
        <div style={{ flexShrink: 0, width: "150px" }}>항목 2</div>
      </div>
      {isOverflow && <p>콘텐츠가 오버플로우 되었습니다!</p>}
    </div>
  );
}
```

## 🧠 주요 기능

- **정확한 감지:** 마지막 자식 요소의 실제 위치를 측정하여 오버플로우를 감지합니다.
- **반응형:** `ResizeObserver` 및 `MutationObserver`를 사용하여 크기나 DOM 변경 시 자동으로 다시 계산합니다.
- **특정 항목 제한:** `data-overflow-item` 속성이 표시된 특정 하위 노드만 관찰할 수 있도록 지원합니다.
- **성능 최적화:** `requestAnimationFrame`을 사용하여 측정을 일괄 처리하고 observer를 자동으로 정리하여 메모리 누수를 방지합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-overflow)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
