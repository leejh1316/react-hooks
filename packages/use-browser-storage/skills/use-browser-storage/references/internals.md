# 내부 동작

## 레이어 구조

```
useLocalStorage / useLocalStorageWithTTL
        │
        ├─ useLocalStorageSubscribe          ← 크로스탭 구독 (subscribe: true 시 활성)
        │        └─ browserStorage.subscribe ← window "storage" 이벤트
        │
        └─ useBrowserStorage / useBrowserStorageWithTTL
                 │  getter/setter 를 조합해 useStorageState에 주입
                 │  WithTTL 변형은 withTTL(browserStorage) 래퍼 사용
                 │
                 └─ useStorageState          ← 상태 관리 코어
                          └─ useCustomEventState ← 같은 탭 내 동기화 이벤트 버스

useSessionStorage / useSessionStorageWithTTL
        └─ useBrowserStorage / useBrowserStorageWithTTL
                 └─ useStorageState
                          └─ useCustomEventState
```

`useSessionStorage`는 크로스탭 동기화가 없습니다.

---

## 같은 탭 내 동기화 — useStorageState

`useCustomEventState`를 사용해 커스텀 이벤트 버스를 구성합니다.  
이벤트 키는 `/use-browser-storage/{storageKey}` 형식이며, **같은 탭 내에서 동일한 key를 사용하는 모든 훅 인스턴스가 자동으로 동기화**됩니다.

| 동작             | 흐름                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| `setValue(next)` | 스토리지에 실제 값 기록 → 커스텀 이벤트 발행 → 같은 탭 내 모든 구독자 업데이트 |
| `setValue(fn)`   | `dispatch(prev => fn(prev))` 형태로 함수형 업데이트 → 스토리지 기록            |
| 쓰기 실패 시     | `console.error` 기록, UI 상태는 낙관적 업데이트 유지                           |
| `removeValue()`  | `storage.removeItem` → `defaultValue`로 리셋                                   |

---

## 크로스탭 동기화 — useLocalStorage 전용

`subscribe: true`이면 내부적으로 `useLocalStorageSubscribe`가 호출되어  
`window.addEventListener("storage", ...)` 이벤트로 다른 탭의 변경을 감지합니다.

```
탭 A: setValue("dark")
  → localStorage.setItem("theme", '"dark"')
  → 탭 A에는 storage 이벤트 발생 안 함 (브라우저 스펙)
  → 탭 B에 storage 이벤트 발생
        → useLocalStorageSubscribe 콜백 → dispatch("dark") → 탭 B 리렌더
```

> `storage` 이벤트는 **값이 변경된 탭 자신에게는 발생하지 않습니다.**  
> 때문에 같은 탭 내 동기화는 `useCustomEventState`가, 크로스탭 동기화는 `storage` 이벤트가 분리해서 담당합니다.

---

## WithTTL 변형 — withTTL 래퍼

`useBrowserStorageWithTTL`은 `withTTL(browserStorage)`로 만들어진 래퍼를 getter/setter로 사용합니다.  
내부적으로 실제 값을 아래 포맷으로 감싸서 저장합니다.

```json
{ "value": "<직렬화된 원본 값>", "expiresAt": 1746700800000 }
```

| 연산         | 동작                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| `set`        | `expiresAt = Date.now() + ttl` 계산 후 래퍼 객체 저장                                        |
| `get`        | `Date.now() > expiresAt`이면 키 즉시 삭제 후 `NOT_FOUND` 반환 → 훅이 `defaultValue`로 초기화 |
| `ttl` 미지정 | `expiresAt: null`로 저장, 만료 없이 영구 보관                                                |

커스텀 `serialize`/`deserialize`는 원본 값(`value` 필드)에만 적용됩니다. 래퍼 자체는 항상 `JSON.stringify`/`JSON.parse`로 처리됩니다.

---

## getter / setter 주입 패턴

`useStorageState`는 실제 스토리지 종류를 알지 못합니다. `getter`와 `setter`를 옵션으로 받아 상태 관리만 담당합니다.  
이 덕분에 일반 스토리지와 TTL 스토리지를 같은 상태 코어 위에서 구현할 수 있습니다.

```ts
BrowserStorageOptions<T> = {
  getter: () => StorageResult<T>       ← 읽기 전략 주입
  setter: (value: T) => StorageResult<string>  ← 쓰기 전략 주입
  ...공통 옵션
}
```
