# @leejaehyeok/use-controllable-state

[English](./README.md) | [한국어](./README-ko.md)

React의 제어 컴포넌트와 비제어 컴포넌트 패턴을 모두 지원하는 훅입니다. 외부에서 값을 제어할 수도 있고, 내부 상태로 관리할 수도 있으며, 불필요한 업데이트를 자동으로 방지합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-controllable-state
```

## 🚀 빠른 시작

훅은 현재 값과 setter 함수를 반환하며, 제어 모드와 비제어 모드를 모두 지원합니다.

```tsx
import React from "react";
import { useControllableState } from "@leejaehyeok/use-controllable-state";

// 비제어 모드
export function UncontrolledInput() {
  const [value, setValue] = useControllableState({
    defaultValue: "",
    onChange: (value) => console.log("변경됨:", value),
  });

  return <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="비제어" />;
}

// 제어 모드
export function ControlledInput({ value, onChange }) {
  const [state, setState] = useControllableState({
    value,
    onChange,
  });

  return <input value={state} onChange={(e) => setState(e.target.value)} placeholder="제어" />;
}
```

## 🧠 주요 기능

- **이중 모드 지원:** 제어 모드(외부 상태)와 비제어 모드(내부 상태) 간 전환이 매끄럽습니다.
- **자동 최적화:** `Object.is`를 이용한 값 비교로 불필요한 업데이트를 방지합니다.
- **onChange 콜백:** 상태 변경 시 부모 컴포넌트에 알립니다.
- **유연한 초기화:** 기본값 및 함수 기반 초기화를 지원합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-controllable-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
