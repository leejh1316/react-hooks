# @leejaehyeok/use-debounce

[English](./README.md) | [한국어](./README-ko.md)

함수 호출을 지연(Debounce)시켜 지정된 시간 동안 추가 호출이 발생하지 않을 때만 실행되도록 하는 React 훅입니다. 검색어 입력, 윈도우 리사이징, API 연속 호출 등 빈번하게 발생하는 이벤트의 성능을 최적화하는 데 유용합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-debounce
```

## 🚀 빠른 시작

훅은 `debounce` 함수와 타이머를 제어할 수 있는 `cancel`, `flush` 메서드를 반환합니다.

```tsx
import React, { useState } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";

export default function App() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const { debounce, cancel, flush } = useDebounce((val: string) => setDebouncedValue(val), 500, { leading: false, trailing: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounce(e.target.value);
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} placeholder="검색어 입력..." />
      <p>현재 값: {value}</p>
      <p>디바운스된 값: {debouncedValue}</p>

      <button onClick={cancel}>취소 (Cancel)</button>
      <button onClick={flush}>즉시 실행 (Flush)</button>
    </div>
  );
}
```

## 🧠 주요 기능(동작 방식)

- **지연 실행 (Debounce):** 지정된 `wait` 시간 동안 추가적인 호출이 없어야 마지막으로 전달된 인자로 함수가 실행됩니다.
- **옵션 제어 (`leading` / `trailing`):** 첫 호출 시 즉시 실행할지(`leading: true`), 지연 시간 후 마지막 호출을 실행할지(`trailing: true`) 세밀하게 제어할 수 있습니다.
- **`cancel` & `flush`:** 대기 중인 함수 호출을 취소(`cancel`)하거나 즉시 실행(`flush`)할 수 있는 유틸리티 함수를 제공합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-debounce)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
