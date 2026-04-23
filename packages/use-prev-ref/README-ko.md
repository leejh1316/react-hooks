# @leejaehyeok/use-prev-ref

[English](./README.md) | [한국어](./README-ko.md)

이전 렌더링 사이클의 값을 저장하고 반환하는 React 훅입니다. 현재 값과 이전 값을 비교하거나, 값의 변화를 추적하거나, 값의 전환에 따른 커스텀 로직을 구현할 때 유용합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-prev-ref
```

## 🚀 빠른 시작

훅은 값을 받아서 이전 렌더링에서의 값을 반환합니다.

```tsx
import React, { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

export default function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevRef(count);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => console.log(prevCount.current)}>이전 카운트</button>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

## 🧠 동작 방식

- **이전 값 추적:** 이전 렌더링 사이클의 값을 반환합니다.
- **제네릭 타입 지원:** 숫자, 문자열, 객체 등 모든 타입의 값을 지원하며 완전한 TypeScript 지원을 제공합니다.
- **Cleanup 함수:** `useEffect` cleanup 함수를 사용하여 ref를 업데이트하므로, 이전 값은 항상 현재 값보다 한 렌더링 뒤에 있습니다.

## ⚠️ 주의사항

**JSX 구성요소에서의 직접 렌더링은 권장하지 않습니다.** 값으로 접근할 때만 사용하세요.

훅의 업데이트 타이밍이 한 렌더링 사이클 늦기 때문에:

- ✅ **권장:** 이전 값에 비동기 또는 동적으로 접근할 때(예: 이벤트 핸들러, 조건문, 사이드 이펙트)는 정상적으로 작동합니다.
- ❌ **비권장:** JSX에서 이전 값을 직접 렌더링하면 2단계 전의 값이 표시됩니다.

```tsx
// ✅ 좋음: 로직에서 prevCount 접근
if (prevCount !== count) {
  console.log("Value changed");
}

// ❌ 나쁨: JSX에서 prevCount 직접 렌더링
<p>{prevCount}</p>; // 2단계 전의 값이 표시됨
```

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-prev-ref)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
