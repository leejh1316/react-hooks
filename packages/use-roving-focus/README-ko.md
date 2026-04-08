# @leejaehyeok/use-roving-focus

[English](./README.md) | [한국어](./README-ko.md)

React를 위한 키보드 네비게이션 훅입니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-roving-focus
```

## 🚀 빠른 시작

1. 컨테이너를 훅에서 반환된 바인딩 객체(`containerRef` 및 `handleKeyDown`)로 감쌉니다.
2. 컨테이너 내부의 포커스를 받을 수 있는 모든 아이템에 `data-roving-item` 속성(또는 커스텀 `itemSelector`)을 추가합니다.

```tsx
import React from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

export default function App() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]", // 기본값
    orientation: "vertical", // 'horizontal' | 'vertical' | 'both'
    loop: true, // 양끝단 도달 시 순환 여부
  });

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onKeyDown={handleKeyDown}
      role="menu"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <button data-roving-item role="menuitem">
        아이템 1
      </button>
      <button data-roving-item role="menuitem">
        아이템 2
      </button>
      {/* 기본 'disabled' 속성이 있는 아이템은 자동으로 포커스 이동을 건너뜁니다 */}
      <button data-roving-item role="menuitem" disabled>
        아이템 3
      </button>
      <button data-roving-item role="menuitem">
        아이템 4
      </button>
    </div>
  );
}
```

## ⚙️ 옵션 (`RovingFocusOptions`)

| 속성              | 타입                                   | 기본값                 | 설명                                                                                   |
| :---------------- | :------------------------------------- | :--------------------- | :------------------------------------------------------------------------------------- |
| `itemSelector`    | `string`                               | `"[data-roving-item]"` | 컨테이너 내에서 포커스 가능한 아이템을 찾기 위한 CSS 선택자입니다.                     |
| `orientation`     | `"horizontal" \| "vertical" \| "both"` | `"both"`               | 키보드 네비게이션을 허용할 축(방향)을 설정합니다.                                      |
| `loop`            | `boolean`                              | `false`                | 목록의 처음이나 끝에 도달했을 때 포커스를 반대편 끝으로 순환시킬지 여부입니다.         |
| `colSkipCount`    | `number`                               | `0`                    | 그리드 구조 사용 시 열(column)의 갯수입니다. `vertical` 네비게이션 계산 시 유용합니다. |
| `initialIndex`    | `number`                               | `0`                    | 처음 포커스를 받을 아이템의 인덱스입니다.                                              |
| `clickOnNavigate` | `boolean`                              | `false`                | 항목으로 이동할 때 프로그래밍 방식으로 해당 요소의 `.click()` 이벤트를 발생시킵니다.   |
| `scrollIntoView`  | `boolean \| ScrollIntoViewOptions`     | `false`                | 포커스된 요소가 화면에 보이도록 네이티브 `.scrollIntoView()`를 호출합니다.             |
| `enableHome`      | `boolean`                              | `true`                 | `Home` 키를 눌렀을 때 활성화된 첫 번째 아이템으로 이동할지 여부입니다.                 |
| `enableEnd`       | `boolean`                              | `true`                 | `End` 키를 눌렀을 때 활성화된 마지막 아이템으로 이동할지 여부입니다.                   |
| `onNavigate`      | `(detail: NavigationDetail) => void`   | `() => {}`             | 포커스 이동이 완료되면 호출되는 콜백입니다.                                            |
| `onUnderflow`     | `() => void`                           | `() => {}`             | `loop`가 false일 때 첫 번째 아이템 이전으로 이동하려 할 때 호출되는 콜백입니다.        |
| `onOverflow`      | `() => void`                           | `() => {}`             | `loop`가 false일 때 마지막 아이템 이후로 이동하려 할 때 호출되는 콜백입니다.           |

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-roving-focus)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
