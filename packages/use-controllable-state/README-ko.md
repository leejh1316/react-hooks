# @leejaehyeok/use-throttle

[English](./README.md) | [한국어](./README-ko.md)

함수 호출을 스로틀링(Throttle)하여 지정된 시간 내에 최대 한 번만 실행되도록 하는 React 훅입니다. 스크롤, 윈도우 리사이징, 빈번한 버튼 클릭 등 자주 발생하는 이벤트의 성능 최적화에 유용합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-throttle
```

## 🚀 빠른 시작

훅은 `throttle` 함수와 타이머를 제어할 수 있는 `cancel`, `flush` 메서드를 반환합니다.

```tsx
import React, { useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

export default function App() {
  const [value, setValue] = useState(0);
  const [throttledValue, setThrottledValue] = useState(0);

  const { throttle, cancel, flush } = useThrottle((val: number) => setThrottledValue(val), 500);

  const handleScroll = (e: any) => {
    setValue((prev) => prev + 1);
    throttle(value + 1);
  };

  return (
    <div onScroll={handleScroll} style={{ height: "200px", overflowY: "scroll" }}>
      <div style={{ height: "1000px" }}>
        <p>현재 값: {value}</p>
        <p>스로틀링된 값: {throttledValue}</p>

        <button onClick={cancel}>취소 (Cancel)</button>
        <button onClick={flush}>즉시 실행 (Flush)</button>
      </div>
    </div>
  );
}
```

## 🧠 주요 기능(동작 방식)

- **스로틀링 (Throttle):** 아무리 빈번하게 호출되더라도, 함수가 `wait` 시간당 최대 한 번씩만 실행됩니다.
- **옵션 제어 (`leading` / `trailing`):** 첫 호출 시 즉시 실행할지(`leading: true`), 지연 시간 후 마지막에 남은 호출을 실행할지(`trailing: true`) 세밀하게 제어할 수 있습니다.
- **`cancel` & `flush`:** 대기 중인 함수 호출을 취소(`cancel`)하거나 즉시 실행(`flush`)할 수 있는 유틸리티 함수를 제공합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-throttle)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
