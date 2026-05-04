# @leejaehyeok/use-browser-storage

[English](./README.md) | [한국어](./README-ko.md)

React 애플리케이션에서 브라우저 스토리지(localStorage, sessionStorage)를 관리하기 위한 훅입니다. TTL 지원, 커스텀 직렬화, 크로스탭 동기화 등의 고급 기능을 제공하며, 상태를 쉽게 유지할 수 있게 해줍니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-browser-storage
```

## 🚀 빠른 시작

### localStorage 기본 사용법

```tsx
import React from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorage({
    key: "user-name",
    defaultValue: "",
  });

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="이름을 입력하세요" />
      <p>저장됨: {value}</p>
    </div>
  );
}
```

### 크로스탭 동기화

```tsx
import React from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorage({
    key: "user-theme",
    defaultValue: "light",
    subscribe: true, // 크로스탭 동기화 활성화
  });

  return (
    <div>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="light">밝음</option>
        <option value="dark">어두움</option>
      </select>
    </div>
  );
}
```

### TTL 지원 (자동 만료)

```tsx
import React from "react";
import { useLocalStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorageWithTTL({
    key: "session-token",
    defaultValue: "",
    ttl: ttl.hours(1), // 1시간 후 자동 만료
  });

  return <p>토큰: {value}</p>;
}
```

## 🎯 핵심 훅

### useBrowserStorage

localStorage와 sessionStorage를 모두 관리할 수 있는 기본 훅입니다.

```tsx
import { useBrowserStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useBrowserStorage({
  storageType: "local", // "local" | "session"
  key: "my-key",
  defaultValue: "initial",
  serialize: JSON.stringify, // 선택: 커스텀 직렬화 함수
  deserialize: JSON.parse, // 선택: 커스텀 역직렬화 함수
});
```

**파라미터:**

- `storageType`: `"local"` 또는 `"session"` - 어떤 스토리지를 사용할지
- `key`: 스토리지 항목의 고유 식별자
- `defaultValue`: 키가 존재하지 않을 때 반환되는 값
- `serialize`: (선택) 커스텀 직렬화 함수
- `deserialize`: (선택) 커스텀 역직렬화 함수

**반환값:**

- `value`: 현재 저장된 값
- `setValue`: 값을 업데이트하는 함수
- `removeValue`: 스토리지에서 항목을 제거하는 함수
- `dispatch`: 내부 dispatch 함수 (고급 사용)

### useBrowserStorageWithTTL

TTL(Time To Live) 만료 기능이 있는 `useBrowserStorage`입니다.

```tsx
import { useBrowserStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useBrowserStorageWithTTL({
  storageType: "local",
  key: "cached-data",
  defaultValue: null,
  ttl: ttl.minutes(30), // 30분 후 만료
});
```

**추가 파라미터:**

- `ttl`: (선택) 생존 시간(밀리초)

### useLocalStorage

크로스탭 동기화를 지원하는 localStorage 전용 간단한 훅입니다.

```tsx
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useLocalStorage({
  key: "my-key",
  defaultValue: "initial",
  subscribe: true, // 브라우저 탭 간 동기화 활성화
});
```

**파라미터:**

- `key`: 스토리지 항목의 고유 식별자
- `defaultValue`: 키가 존재하지 않을 때 반환되는 값
- `subscribe`: (선택) 크로스탭 동기화 활성화 (스토리지 이벤트 수신)
- `serialize`: (선택) 커스텀 직렬화 함수
- `deserialize`: (선택) 커스텀 역직렬화 함수

**주요 기능:** `subscribe`가 `true`이면, 다른 탭에서 같은 키에 대한 변경사항이 현재 탭에 자동으로 반영됩니다.

### useLocalStorageWithTTL

TTL 만료 기능이 있는 localStorage 훅입니다.

```tsx
import { useLocalStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useLocalStorageWithTTL({
  key: "auth-token",
  defaultValue: "",
  ttl: ttl.hours(24),
  subscribe: true,
});
```

### useSessionStorage

sessionStorage용 훅입니다 (탭을 닫으면 삭제됨).

```tsx
import { useSessionStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useSessionStorage({
  key: "my-key",
  defaultValue: "initial",
});
```

### useSessionStorageWithTTL

TTL 만료 기능이 있는 sessionStorage 훅입니다.

```tsx
import { useSessionStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useSessionStorageWithTTL({
  key: "page-scroll",
  defaultValue: 0,
  ttl: ttl.minutes(10),
});
```

## 🛠️ 유틸리티 함수

### browserStorage

스토리지에 직접 접근하기 위한 저수준 유틸리티 객체입니다.

```tsx
import { browserStorage } from "@leejaehyeok/use-browser-storage";

// 값 가져오기
const result = browserStorage.get("local", "my-key", JSON.parse);
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error); // "NOT_FOUND" | "PARSE_ERROR" | 등
}

// 값 설정하기
const setResult = browserStorage.set("local", "my-key", value, JSON.stringify);

// 값 제거하기
browserStorage.remove("local", "my-key");

// 모두 삭제하기
browserStorage.clear("local");

// 존재 여부 확인
const exists = browserStorage.has("local", "my-key");

// 항목 개수 확인
const count = browserStorage.length("local");

// 모든 키 가져오기
const keysResult = browserStorage.keys("local");
if (keysResult.success) {
  console.log(keysResult.value); // string[]
}

// 변경사항 구독하기
const unsubscribe = browserStorage.subscribe(
  "my-key",
  (event) => {
    if (event.success) {
      console.log("새로운 값:", event.newParsedValue);
    }
  },
  JSON.parse,
);
// unsubscribe() 호출로 구독 해제
```

**사용 가능한 메서드:**

- `get(storageType, key, deserialize)` - 키로 값 가져오기
- `set(storageType, key, value, serialize)` - 키로 값 설정
- `remove(storageType, key)` - 키로 값 제거
- `clear(storageType)` - 모든 항목 삭제
- `has(storageType, key)` - 키 존재 여부 확인
- `length(storageType)` - 항목 개수 확인
- `key(storageType, index)` - 인덱스로 키 가져오기
- `keys(storageType)` - 모든 키 가져오기
- `subscribe(key, callback, deserialize)` - 스토리지 변경 구독

### TTL 유틸리티

시간 단위를 밀리초로 변환하는 헬퍼 함수입니다.

```tsx
import { ttl } from "@leejaehyeok/use-browser-storage";

ttl.ms(5000); // 5000 밀리초
ttl.seconds(30); // 30초 = 30,000밀리초
ttl.minutes(5); // 5분 = 300,000밀리초
ttl.hours(1); // 1시간 = 3,600,000밀리초
ttl.days(7); // 7일 = 604,800,000밀리초
ttl.weeks(2); // 2주 = 1,209,600,000밀리초
```

### Serializers (직렬화 함수)

복잡한 데이터 타입을 위한 미리 준비된 직렬화 함수입니다.

```tsx
import { serializer } from "@leejaehyeok/use-browser-storage";

// Map 직렬화
const { value: myMap } = useLocalStorage({
  key: "my-map",
  defaultValue: new Map(),
  ...serializer.map(),
});

// Set 직렬화
const { value: mySet } = useLocalStorage({
  key: "my-set",
  defaultValue: new Set(),
  ...serializer.set(),
});

// Date 직렬화
const { value: myDate } = useLocalStorage({
  key: "my-date",
  defaultValue: new Date(),
  ...serializer.date(),
});

// URL 직렬화
const { value: myUrl } = useLocalStorage({
  key: "my-url",
  defaultValue: new URL("https://example.com"),
  ...serializer.url(),
});

// BigInt 직렬화
const { value: myBigInt } = useLocalStorage({
  key: "my-bigint",
  defaultValue: 0n,
  ...serializer.bigint(),
});
```

**사용 가능한 Serializer:**

- `serializer.map()` - Map 객체 직렬화
- `serializer.set()` - Set 객체 직렬화
- `serializer.date()` - Date 객체 직렬화
- `serializer.url()` - URL 객체 직렬화
- `serializer.bigint()` - BigInt 값 직렬화

## 🧠 주요 기능

- **유연한 스토리지:** localStorage와 sessionStorage 모두 지원
- **TTL 지원:** 저장된 값의 자동 만료
- **커스텀 직렬화:** 내장 직렬화 함수 또는 직접 작성 가능
- **크로스탭 동기화:** `subscribe` 옵션으로 브라우저 탭 간 상태 동기화
- **타입 안정성:** 완벽한 TypeScript 지원
- **에러 처리:** 상세한 에러 보고 (NOT_FOUND, PARSE_ERROR, QUOTA_EXCEEDED 등)
- **SSR 호환성:** 서버사이드 렌더링 환경에서 안전하게 처리

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-browser-storage)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
