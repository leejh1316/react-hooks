# @leejaehyeok/use-focus-trap

[English](./README.md) | [한국어](./README-ko.md)

특정 컨테이너 내부에서만 포커스가 순환하도록(Trap) 만들어 주는 React 훅입니다. 모달, 다이얼로그 등에서 웹 접근성을 높이기 위해 유용하게 사용할 수 있습니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-focus-trap
```

## 🚀 빠른 시작

훅에서 반환된 `containerRef`를 포커스를 가두고자 하는 컨테이너 요소에 연결합니다. 해당 컨테이너 내에서 `Tab` 또는 `Shift + Tab` 키를 누르면 내부의 포커스 가능한 요소들 사이에서만 포커스가 순환합니다.

```tsx
import React, { useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>

      {isOpen && (
        <div ref={containerRef} role="dialog" aria-modal="true" style={{ padding: "24px", border: "1px solid black", marginTop: "16px" }}>
          <h2>포커스 트랩 모달</h2>
          <p>이 컨테이너 내부를 벗어나지 않고 포커스가 순환합니다.</p>

          <button>버튼 1</button>
          <button>버튼 2</button>
          {/* disabled 속성이 있는 요소는 올바르게 건너뜁니다 */}
          <button disabled>버튼 3 (비활성화)</button>

          <button onClick={() => setIsOpen(false)}>모달 닫기</button>
        </div>
      )}
    </div>
  );
}
```

### 초기 포커스 지정

CSS 셀렉터로 초기 포커스 대상을 지정할 수 있습니다. 매칭되는 요소가 없으면 첫 번째 포커스 가능 요소로, 그마저 없으면 컨테이너 자체로 포커스가 이동합니다.

```tsx
const containerRef = useFocusTrap({ initialFocusSelector: "#primary-action" });
```

## 🧩 API

### `useFocusTrap(options?)`

```ts
type FocusTrapOptions = {
  initialFocusSelector?: string; // 기본값: "[data-initial-focus]"
};

const containerRef = useFocusTrap(options);
```

**옵션**

- `initialFocusSelector`: 초기 포커스를 받을 요소를 지정하는 CSS 셀렉터입니다.

**반환값**

- `containerRef`: 포커스 트랩을 적용할 컨테이너 요소에 연결하는 콜백 ref입니다.

## 🧠 주요 기능(동작 방식)

- **초기 포커스:** 마운트 시 `initialFocusSelector`에 매칭되는 요소로 포커스를 이동하고, 없으면 첫 번째 포커스 가능 요소, 없으면 컨테이너로 이동합니다.
- **포커스 복원:** 언마운트되거나 ref가 변경되면 이전에 포커스되어 있던 요소로 되돌립니다.
- **포커스 순환 (Focus Loop):** 마지막 요소에서 `Tab`을 누르면 첫 번째 요소로, 첫 번째 요소에서 `Shift + Tab`을 누르면 마지막 요소로 포커스가 되돌아갑니다.
- **동적 DOM 감지:** 내부에 `MutationObserver`를 사용하여 자식 요소가 추가되거나 삭제되는 경우, 혹은 `disabled`나 `aria-hidden` 등 속성이 동적으로 변경되는 경우 포커스 가능한 요소 목록을 자동으로 실시간 업데이트합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-focus-trap)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
