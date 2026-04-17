# @leejaehyeok/use-deferred-loading

[English](./README.md) | [한국어](./README-ko.md)

지정된 지연 시간 이상 로딩이 지속될 때만 로딩 상태를 나타내는 React 훅입니다. 짧은 로딩은 표시하지 않아 불필요한 로딩 UI 깜빡임을 방지합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-deferred-loading
```

## 🚀 빠른 시작

훅은 로딩 상태와 지연 시간을 받아서, 지연 시간 이상 로딩이 지속될 때만 true를 반환합니다.

```tsx
import React, { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, 300);

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isDeferredLoading && <p>로딩 중...</p>}
      <button onClick={handleFetch} disabled={isLoading}>
        데이터 조회
      </button>
    </div>
  );
}
```

## 🧠 동작 방식

- **지연된 로딩 상태:** `isLoading`이 true가 되면 지정된 `delay`(기본값: 100ms) 시간 후에만 `isDeferredLoading`을 true로 설정합니다.
- **깜빡임 방지:** 짧은 로딩은 표시하지 않아 UI의 불필요한 깜빡임을 방지합니다.
- **자동 정리:** `isLoading`이 false가 되면 즉시 `isDeferredLoading`도 false로 설정되고, 타이머는 자동으로 정리됩니다.

## ⚙️ 매개변수

- `isLoading` (boolean): 로딩 상태 여부
- `delay` (number, 선택사항): 로딩 표시 지연 시간(밀리초). 기본값은 100ms입니다.

## 💡 사용 사례

- 네트워크 요청이 빠르게 완료될 때 로딩 UI 표시 방지
- 검색 결과 로딩 시 사용자 경험 개선
- 데이터 페칭 중 불필요한 스피너 깜빡임 방지

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-throttle)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
