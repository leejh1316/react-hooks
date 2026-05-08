---
name: use-browser-storage
description: >
  브라우저 스토리지(localStorage / sessionStorage)를 React 상태처럼 사용하는 훅 모음.
  "로컬스토리지", "세션스토리지", "브라우저 스토리지", "localStorage", "sessionStorage",
  "storage 저장", "탭 간 동기화", "크로스탭", "TTL", "만료 시간", "캐시 만료",
  "스토리지 훅" 같은 표현이 나오면 반드시 이 skill을 참고하세요.
  SSR 안전 처리, TTL 만료, 커스텀 직렬화, 크로스탭 동기화를 모두 지원합니다.
---

# use-browser-storage

## 엔트리 포인트

```ts
import {
  useLocalStorage,
  useLocalStorageWithTTL,
  useSessionStorage,
  useSessionStorageWithTTL,
  browserStorage,
  ttl,
  serializer,
} from "@leejaehyeok/use-browser-storage";
```

---

## 훅 선택 기준

| 상황                          | 훅                         |
| ----------------------------- | -------------------------- |
| 탭을 닫아도 유지, 만료 없음   | `useLocalStorage`          |
| 탭을 닫아도 유지, 만료 필요   | `useLocalStorageWithTTL`   |
| 탭을 닫으면 사라짐, 만료 없음 | `useSessionStorage`        |
| 탭을 닫으면 사라짐, 만료 필요 | `useSessionStorageWithTTL` |

크로스탭 동기화가 필요하면 `useLocalStorage` / `useLocalStorageWithTTL`에 `subscribe: true` 추가.
`useSessionStorage`는 브라우저 스펙상 크로스탭 동기화를 지원하지 않습니다.

---

## API

### 공통 Options

```ts
type Options<T> = {
  key: string; // 스토리지 키 (필수)
  defaultValue: T; // 키 없거나 읽기 실패 시 반환값 (필수)
  subscribe?: boolean; // 크로스탭 동기화 (localStorage 전용, 기본 false)
  serialize?: (value: T) => string; // 커스텀 직렬화 (기본 JSON.stringify)
  deserialize?: (raw: string) => T; // 커스텀 역직렬화 (기본 JSON.parse)
  ttl?: number; // 만료 시간 ms (WithTTL 훅 전용)
};
```

### 공통 반환값

```ts
{
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>; // 함수형 업데이트 지원
  removeValue: () => void;                           // 키 삭제 후 defaultValue로 리셋
}
```

---

## 사용 예시

### useLocalStorage

```ts
const { value, setValue, removeValue } = useLocalStorage<{ count: number }>({
  key: "my-counter",
  defaultValue: { count: 0 },
});

// 함수형 업데이트
setValue((prev) => ({ count: prev.count + 1 }));

// 키 삭제 (defaultValue로 리셋)
removeValue();
```

### useLocalStorageWithTTL

```ts
const { value, setValue } = useLocalStorageWithTTL<string>({
  key: "auth-token",
  defaultValue: "",
  ttl: ttl.hours(1), // 1시간 후 자동 만료, 이후 조회시 제거됨
});
```

### useSessionStorage

```ts
const { value, setValue } = useSessionStorage<boolean>({
  key: "modal-seen",
  defaultValue: false,
});
```

### 크로스탭 동기화

```ts
// 탭 A, 탭 B 모두에 subscribe: true
const { value } = useLocalStorage({
  key: "theme",
  defaultValue: "light",
  subscribe: true,
});
// 탭 A에서 setValue("dark") → 탭 B의 value도 "dark"로 자동 갱신
```

### 커스텀 직렬화 (Map, Set, Date 등)

JSON 기본 직렬화가 안 되는 타입에는 `serializer` 헬퍼를 사용하세요.

```ts
useLocalStorage({
  key: "scores",
  defaultValue: new Map<string, number>(),
  ...serializer.map<string, number>(),
});

useLocalStorage({
  key: "visited",
  defaultValue: new Set<string>(),
  ...serializer.set<string>(),
});

useLocalStorage({
  key: "last-login",
  defaultValue: new Date(),
  ...serializer.date(),
});
```

지원 타입: `map`, `set`, `date`, `url`, `bigint`

### ttl 헬퍼

- TTL 값을 ms 단위로 쉽게 계산하는 헬퍼 함수입니다. 예를 들어 `ttl.hours(1)`은 1시간을 ms로 변환합니다.

```ts
ttl.ms(500); // 500ms
ttl.seconds(30); // 30초
ttl.minutes(5); // 5분
ttl.hours(1); // 1시간
ttl.days(7); // 7일
ttl.weeks(2); // 2주
```

---

## 에러 처리 동작

- 쓰기 실패 시 `console.error`로 에러를 기록하고, **UI 상태는 낙관적으로 업데이트**됩니다. 새로고침하면 스토리지의 실제 값으로 돌아옵니다.
- SSR 또는 Private 모드에서는 `UNAVAILABLE` 에러와 함께 `defaultValue`가 사용됩니다. 별도 처리 없이 안전하게 동작합니다.
- TTL이 만료된 항목은 읽는 시점에 자동으로 삭제되고 `defaultValue`로 초기화됩니다.

---

## 참고 문서

- 훅 없이 스토리지를 직접 조작하거나 `StorageResult` 타입을 다뤄야 할 때 → `references/browser-storage-util.md`
- 레이어 구조, 같은 탭 내 동기화 메커니즘, TTL 저장 포맷 등 내부 동작이 궁금할 때 → `references/internals.md`
