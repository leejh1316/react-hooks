# browserStorage 유틸리티

훅 없이 스토리지를 직접 조작할 때 사용합니다. SSR과 Private 모드를 안전하게 처리합니다.

## Import

```ts
import { browserStorage } from "@leejaehyeok/use-browser-storage";
```

## 메서드

```ts
browserStorage.get(storageType, key, deserialize?)     // StorageResult<T>
browserStorage.set(storageType, key, value, serialize?) // StorageResult<string>
browserStorage.remove(storageType, key)                // StorageResult<void>
browserStorage.clear(storageType)                      // StorageResult<void>
browserStorage.has(storageType, key)                   // boolean
browserStorage.length(storageType)                     // number
browserStorage.key(storageType, index)                 // string | null
browserStorage.keys(storageType)                       // StorageResult<string[]>
browserStorage.subscribe(key, callback, deserialize?)  // () => void (unsubscribe)
```

`storageType`은 `"local"` 또는 `"session"`입니다.

## StorageResult 타입

모든 읽기/쓰기 함수는 `StorageResult<T>`를 반환합니다.

```ts
type StorageResult<T> = { success: true; value: T } | { success: false; error: StorageError };

type StorageError =
  | "NOT_FOUND" // 키가 존재하지 않음
  | "PARSE_ERROR" // 역직렬화 실패
  | "SERIALIZE_ERROR" // 직렬화 실패
  | "QUOTA_EXCEEDED" // 용량 초과
  | "UNAVAILABLE" // SSR 또는 Private 모드
  | "UNKNOWN";
```

## 사용 예시

```ts
// 읽기
const result = browserStorage.get<User>("local", "user");
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error); // "NOT_FOUND" | "PARSE_ERROR" | ...
}

// 쓰기
const setResult = browserStorage.set("local", "user", { name: "Alice" });
if (!setResult.success && setResult.error === "QUOTA_EXCEEDED") {
  // 용량 초과 처리
}

// 크로스탭 구독 (localStorage 전용)
const unsubscribe = browserStorage.subscribe<string>("theme", (event) => {
  if (event.success) {
    console.log("새 값:", event.newParsedValue);
  }
});
// 구독 해제
unsubscribe();
```

## 주의사항

- `subscribe`는 `window storage` 이벤트 기반으로, **값이 변경된 탭 자신에게는 발생하지 않습니다.**
- SSR 환경(`window === undefined`)에서는 모든 함수가 `UNAVAILABLE` 에러를 반환하고, `has`는 `false`, `length`는 `0`, `key`는 `null`을 반환합니다.
