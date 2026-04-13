# @leejaehyeok/use-snooze

[English](./README.md) | [한국어](./README-ko.md)

'하루 동안 보지 않기', '일주일간 숨기기'와 같은 스누즈(Snooze) 기능을 쉽게 구현할 수 있도록 도와주는 React 훅입니다. 웹 스토리지(`localStorage` / `sessionStorage`)를 사용하여 일정 기간 동안 팝업, 배너, 툴팁 등의 UI 요소를 손쉽게 숨길 수 있습니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-snooze
```

## 🚀 빠른 시작

훅은 요소 노출 여부를 나타내는 `isActive`와 요소를 숨기는 `snooze` 함수를 튜플 형태로 반환합니다.

```tsx
import React from "react";
import { useSnooze } from "@leejaehyeok/use-snooze";

export default function App() {
  const [isActive, snooze] = useSnooze({
    key: "my-banner-snooze",
    duration: "day", // "day" 또는 밀리초(ms) 단위의 숫자
    storageType: "local", // "local" | "session"
  });

  if (!isActive) return null;

  return (
    <div style={{ padding: "16px", background: "lightblue" }}>
      <p>프로모션 배너입니다.</p>
      <button onClick={snooze}>오늘 하루 보지 않기</button>
    </div>
  );
}
```

## 🧠 주요 기능(동작 방식)

- **웹 스토리지 기반:** `localStorage` 또는 `sessionStorage`를 활용하여 새로고침하거나 브라우저를 닫았다 열어도 숨김 상태가 유지됩니다.
- **직관적인 시간 설정:** `duration`에 `"day"`를 입력하면 24시간으로 자동 설정되며, 밀리초 단위 숫자를 직접 지정할 수도 있습니다.
- **자동 활성화 (`autoReactivate`):** 옵션을 `true`로 설정하면 설정된 만료 기간이 끝났을 때 페이지 새로고침 없이도 즉시 요소가 다시 나타나게 처리합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-snooze)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
