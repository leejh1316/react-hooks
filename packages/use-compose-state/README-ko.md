# @leejaehyeok/use-compose-state

[English](./README.md) | [한국어](./README-ko.md)

여러 개의 state setter를 하나의 통합된 setter로 합성하는 React 훅입니다. 외부 제어 state, 내부 state, 그리고 부가적인 state 값들을 한 번에 동기화할 수 있습니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-compose-state
```

## 🚀 빠른 시작

여러 개의 state setter를 하나의 setter로 합성하여 함께 업데이트할 수 있습니다:

```tsx
import React, { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

export function MyComponent() {
  // 외부 제어 state
  const [externalState, setExternalState] = useState(0);

  // 내부 state
  const [internalState, setInternalState] = useState(0);

  // 부가적인 state
  const [additionalState, setAdditionalState] = useState(0);

  // 여러 개의 setter를 하나로 합성
  const composedSetState = useComposedState(setExternalState, setInternalState, setAdditionalState);

  return (
    <div>
      <button onClick={() => composedSetState((prev) => (typeof prev === "number" ? prev + 1 : 0))}>모두 증가: {externalState}</button>
    </div>
  );
}
```

## 🧠 주요 기능

- **여러 State Setter 합성:** 여러 개의 state setter를 하나의 통합된 setter로 합성합니다.
- **동기화:** 모든 합성된 setter를 동시에 하나의 값으로 업데이트합니다.
- **함수형 업데이트:** 표준 React state setter처럼 직접 값과 함수형 업데이트를 모두 지원합니다.
- **타입 안전:** 제네릭 타입 추론을 지원하는 완전한 TypeScript 지원.
- **유연한 상태 관리:** 외부 제어 state와 내부 state를 함께 세밀하게 관리할 수 있습니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-compose-state)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
