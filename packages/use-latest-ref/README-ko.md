# @leejaehyeok/use-latest-ref

[English](./README.md) | [한국어](./README-ko.md)

전달된 최신 값을 항상 유지하는 ref 객체를 반환하는 React 훅입니다. 이 훅을 사용하면 useEffect나 useCallback의 의존성(dependency) 배열에 특정 상태나 props를 포함하지 않고도, 콜백이나 비동기 작업 내에서 항상 최신 값에 접근할 수 있어 불필요한 재렌더링이나 Effect 재실행을 방지할 수 있습니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-latest-ref
```

## 🚀 빠른 시작

이 훅은 단일 값을 인자로 받아 해당 값을 포함하는 React `RefObject`를 반환합니다.

```tsx
import React, { useState, useEffect } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

export default function App() {
  const [count, setCount] = useState(0);
  const latestCount = useLatestRef(count);

  useEffect(() => {
    const interval = setInterval(() => {
      // count를 의존성 배열에 넣지 않고도 최신 값에 접근할 수 있습니다.
      console.log("현재 카운트:", latestCount.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // 빈 배열이므로 마운트될 때만 한 번 실행됩니다.

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>증가</button>
    </div>
  );
}
```

## 🧠 주요 기능(동작 방식)

- **항상 최신 상태 유지:** `useLayoutEffect`를 사용하여 전달된 값이 변경될 때마다 동기적으로 `.current` 값을 업데이트합니다. 이를 통해 브라우저가 화면을 그리기 전에 항상 최신 값이 반영됩니다.
- **안정적인 참조:** 반환된 `ref` 객체는 컴포넌트 생명주기 동안 동일한 참조를 유지하므로, Effect나 콜백 함수 내에서 의존성 걱정 없이 안전하게 사용할 수 있습니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-latest-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
