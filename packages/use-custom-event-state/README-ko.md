# @leejaehyeok/use-custom-event-state

[English](./README.md) | [한국어](./README-ko.md)

CustomEvent API를 사용하여 여러 컴포넌트 간 상태를 동기화하는 React 훅입니다. Props 드릴링 없이 앱의 다양한 부분에서 상태를 공유할 수 있습니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-custom-event-state
```

## 🚀 빠른 시작

훅은 현재 상태와 dispatch 함수를 반환합니다. 여러 컴포넌트에서 동일한 key를 사용하면 상태가 동기화됩니다.

```tsx
import React from "react";
import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

// 컴포넌트 A: 상태 업데이트
export function ComponentA() {
  const [count, setCount] = useCustomEventState("app-counter", 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}

// 컴포넌트 B: 동일한 상태 구독
export function ComponentB() {
  const [count, setCount] = useCustomEventState("app-counter", 0);

  return (
    <div>
      <p>동기화된 Count: {count}</p>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  );
}
```

## 🧠 주요 기능

- **크로스 컴포넌트 상태 동기화:** 간단한 key를 사용하여 컴포넌트 간 상태를 동기화합니다.
- **이벤트 기반 업데이트:** 브라우저의 CustomEvent API를 사용하여 효율적인 통신을 지원합니다.
- **함수형 업데이트:** 직접값과 함수 기반 상태 업데이트를 모두 지원합니다.
- **유연한 초기화:** 기본값 및 함수 기반 초기화를 지원합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-custom-event-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
