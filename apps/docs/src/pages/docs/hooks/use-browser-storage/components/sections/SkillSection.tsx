import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const SkillSection = () => {
  return (
    <section>
      <Document.Heading1>Agent Skill</Document.Heading1>
      <Document.Paragraph>
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공합니다. "로컬스토리지",
        "localStorage", "sessionStorage", "탭 간 동기화", "TTL", "만료 시간" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 선택
        기준, 옵션·반환값 구조, serializer / ttl 헬퍼 활용, 에러 처리 동작 등의 내용을 반영한 코드를 작성합니다.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 세 파일을 각각의 경로에 그대로 복사해 저장하면 에이전트가 자동으로 인식합니다. SKILL.md가 본문이고, references의 두 문서는
        에이전트가 필요할 때만 추가로 읽는 참고 문서입니다.
      </Document.Paragraph>

      {/* SKILL.md */}
      <Document.Heading2>SKILL.md</Document.Heading2>
      <Document.Paragraph mb={6}>
        스킬 본문입니다. 훅 선택 기준, 공통 Options / 반환값, 사용 예시, 에러 처리 동작을 담고 있습니다.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" className="mb-8" />

      {/* references/browser-storage-util.md */}
      <Document.Heading2>references/browser-storage-util.md</Document.Heading2>
      <Document.Paragraph mb={6}>
        훅 없이 스토리지를 직접 조작하거나 <InlineCode>StorageResult</InlineCode> 타입을 다뤄야 할 때 에이전트가 참고하는 문서입니다.
      </Document.Paragraph>
      <CodeBlock code={BROWSER_STORAGE_UTIL_MD_CODE} language="md" className="mb-8" />

      {/* references/internals.md */}
      <Document.Heading2>references/internals.md</Document.Heading2>
      <Document.Paragraph mb={6}>
        레이어 구조, 같은 탭 내 동기화 메커니즘, TTL 저장 포맷 등 내부 동작을 설명하는 문서입니다.
      </Document.Paragraph>
      <CodeBlock code={INTERNALS_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-browser-storage SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
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

\`\`\`ts
import {
  useLocalStorage,
  useLocalStorageWithTTL,
  useSessionStorage,
  useSessionStorageWithTTL,
  browserStorage,
  ttl,
  serializer,
} from "@leejaehyeok/use-browser-storage";
\`\`\`

---

## 훅 선택 기준

| 상황                          | 훅                         |
| ----------------------------- | -------------------------- |
| 탭을 닫아도 유지, 만료 없음   | \`useLocalStorage\`          |
| 탭을 닫아도 유지, 만료 필요   | \`useLocalStorageWithTTL\`   |
| 탭을 닫으면 사라짐, 만료 없음 | \`useSessionStorage\`        |
| 탭을 닫으면 사라짐, 만료 필요 | \`useSessionStorageWithTTL\` |

크로스탭 동기화가 필요하면 \`useLocalStorage\` / \`useLocalStorageWithTTL\`에 \`subscribe: true\` 추가.
\`useSessionStorage\`는 브라우저 스펙상 크로스탭 동기화를 지원하지 않습니다.

---

## API

### 공통 Options

\`\`\`ts
type Options<T> = {
  key: string; // 스토리지 키 (필수)
  defaultValue: T; // 키 없거나 읽기 실패 시 반환값 (필수)
  subscribe?: boolean; // 크로스탭 동기화 (localStorage 전용, 기본 false)
  serialize?: (value: T) => string; // 커스텀 직렬화 (기본 JSON.stringify)
  deserialize?: (raw: string) => T; // 커스텀 역직렬화 (기본 JSON.parse)
  ttl?: number; // 만료 시간 ms (WithTTL 훅 전용)
};
\`\`\`

### 공통 반환값

\`\`\`ts
{
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>; // 함수형 업데이트 지원
  removeValue: () => void;                           // 키 삭제 후 defaultValue로 리셋
}
\`\`\`

---

## 사용 예시

### useLocalStorage

\`\`\`ts
const { value, setValue, removeValue } = useLocalStorage<{ count: number }>({
  key: "my-counter",
  defaultValue: { count: 0 },
});

// 함수형 업데이트
setValue((prev) => ({ count: prev.count + 1 }));

// 키 삭제 (defaultValue로 리셋)
removeValue();
\`\`\`

### useLocalStorageWithTTL

\`\`\`ts
const { value, setValue } = useLocalStorageWithTTL<string>({
  key: "auth-token",
  defaultValue: "",
  ttl: ttl.hours(1), // 1시간 후 자동 만료, 이후 조회시 제거됨
});
\`\`\`

### useSessionStorage

\`\`\`ts
const { value, setValue } = useSessionStorage<boolean>({
  key: "modal-seen",
  defaultValue: false,
});
\`\`\`

### 크로스탭 동기화

\`\`\`ts
// 탭 A, 탭 B 모두에 subscribe: true
const { value } = useLocalStorage({
  key: "theme",
  defaultValue: "light",
  subscribe: true,
});
// 탭 A에서 setValue("dark") → 탭 B의 value도 "dark"로 자동 갱신
\`\`\`

### 커스텀 직렬화 (Map, Set, Date 등)

JSON 기본 직렬화가 안 되는 타입에는 \`serializer\` 헬퍼를 사용하세요.

\`\`\`ts
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
\`\`\`

지원 타입: \`map\`, \`set\`, \`date\`, \`url\`, \`bigint\`

### ttl 헬퍼

- TTL 값을 ms 단위로 쉽게 계산하는 헬퍼 함수입니다. 예를 들어 \`ttl.hours(1)\`은 1시간을 ms로 변환합니다.

\`\`\`ts
ttl.ms(500); // 500ms
ttl.seconds(30); // 30초
ttl.minutes(5); // 5분
ttl.hours(1); // 1시간
ttl.days(7); // 7일
ttl.weeks(2); // 2주
\`\`\`

---

## 에러 처리 동작

- 쓰기 실패 시 \`console.error\`로 에러를 기록하고, **UI 상태는 낙관적으로 업데이트**됩니다. 새로고침하면 스토리지의 실제 값으로 돌아갑니다.
- SSR 또는 Private 모드에서는 \`UNAVAILABLE\` 에러와 함께 \`defaultValue\`가 사용됩니다. 별도 처리 없이 안전하게 동작합니다.
- TTL이 만료된 항목은 읽는 시점에 자동으로 삭제되고 \`defaultValue\`로 초기화됩니다.

---

## 참고 문서

- 훅 없이 스토리지를 직접 조작하거나 \`StorageResult\` 타입을 다뤄야 할 때 → \`references/browser-storage-util.md\`
- 레이어 구조, 같은 탭 내 동기화 메커니즘, TTL 저장 포맷 등 내부 동작이 궁금할 때 → \`references/internals.md\`
`;

/** use-browser-storage references/browser-storage-util.md 원문 (변경 시 함께 갱신하세요) */
const BROWSER_STORAGE_UTIL_MD_CODE = `# browserStorage 유틸리티

훅 없이 스토리지를 직접 조작할 때 사용합니다. SSR과 Private 모드를 안전하게 처리합니다.

## Import

\`\`\`ts
import { browserStorage } from "@leejaehyeok/use-browser-storage";
\`\`\`

## 메서드

\`\`\`ts
browserStorage.get(storageType, key, deserialize?)     // StorageResult<T>
browserStorage.set(storageType, key, value, serialize?) // StorageResult<string>
browserStorage.remove(storageType, key)                // StorageResult<void>
browserStorage.clear(storageType)                      // StorageResult<void>
browserStorage.has(storageType, key)                   // boolean
browserStorage.length(storageType)                     // number
browserStorage.key(storageType, index)                 // string | null
browserStorage.keys(storageType)                       // StorageResult<string[]>
browserStorage.subscribe(key, callback, deserialize?)  // () => void (unsubscribe)
\`\`\`

\`storageType\`은 \`"local"\` 또는 \`"session"\`입니다.

## StorageResult 타입

모든 읽기/쓰기 함수는 \`StorageResult<T>\`를 반환합니다.

\`\`\`ts
type StorageResult<T> = { success: true; value: T } | { success: false; error: StorageError };

type StorageError =
  | "NOT_FOUND" // 키가 존재하지 않음
  | "PARSE_ERROR" // 역직렬화 실패
  | "SERIALIZE_ERROR" // 직렬화 실패
  | "QUOTA_EXCEEDED" // 용량 초과
  | "UNAVAILABLE" // SSR 또는 Private 모드
  | "UNKNOWN";
\`\`\`

## 사용 예시

\`\`\`ts
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
\`\`\`

## 주의사항

- \`subscribe\`는 \`window storage\` 이벤트 기반으로, **값이 변경된 탭 자신에게는 발생하지 않습니다.**
- SSR 환경(\`window === undefined\`)에서는 모든 함수가 \`UNAVAILABLE\` 에러를 반환하고, \`has\`는 \`false\`, \`length\`는 \`0\`, \`key\`는 \`null\`을 반환합니다.
`;

/** use-browser-storage references/internals.md 원문 (변경 시 함께 갱신하세요) */
const INTERNALS_MD_CODE = `# 내부 동작

## 레이어 구조

\`\`\`
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
\`\`\`

\`useSessionStorage\`는 크로스탭 동기화가 없습니다.

---

## 같은 탭 내 동기화 — useStorageState

\`useCustomEventState\`를 사용해 커스텀 이벤트 버스를 구성합니다.
이벤트 키는 \`/use-browser-storage/{storageKey}\` 형식이며, **같은 탭 내에서 동일한 key를 사용하는 모든 훅 인스턴스가 자동으로 동기화**됩니다.

| 동작             | 흐름                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| \`setValue(next)\` | 스토리지에 실제 값 기록 → 커스텀 이벤트 발행 → 같은 탭 내 모든 구독자 업데이트 |
| \`setValue(fn)\`   | \`dispatch(prev => fn(prev))\` 형태로 함수형 업데이트 → 스토리지 기록            |
| 쓰기 실패 시     | \`console.error\` 기록, UI 상태는 낙관적 업데이트 유지                           |
| \`removeValue()\`  | \`storage.removeItem\` → \`defaultValue\`로 리셋                                   |

---

## 크로스탭 동기화 — useLocalStorage 전용

\`subscribe: true\`이면 내부적으로 \`useLocalStorageSubscribe\`가 호출되어
\`window.addEventListener("storage", ...)\` 이벤트로 다른 탭의 변경을 감지합니다.

\`\`\`
탭 A: setValue("dark")
  → localStorage.setItem("theme", '"dark"')
  → 탭 A에는 storage 이벤트 발생 안 함 (브라우저 스펙)
  → 탭 B에 storage 이벤트 발생
        → useLocalStorageSubscribe 콜백 → dispatch("dark") → 탭 B 리렌더
\`\`\`

> \`storage\` 이벤트는 **값이 변경된 탭 자신에게는 발생하지 않습니다.**
> 때문에 같은 탭 내 동기화는 \`useCustomEventState\`가, 크로스탭 동기화는 \`storage\` 이벤트가 분리해서 담당합니다.

---

## WithTTL 변형 — withTTL 래퍼

\`useBrowserStorageWithTTL\`은 \`withTTL(browserStorage)\`로 만들어진 래퍼를 getter/setter로 사용합니다.
내부적으로 실제 값을 아래 포맷으로 감싸서 저장합니다.

\`\`\`json
{ "value": "<직렬화된 원본 값>", "expiresAt": 1746700800000 }
\`\`\`

| 연산         | 동작                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| \`set\`        | \`expiresAt = Date.now() + ttl\` 계산 후 래퍼 객체 저장                                        |
| \`get\`        | \`Date.now() > expiresAt\`이면 키 즉시 삭제 후 \`NOT_FOUND\` 반환 → 훅이 \`defaultValue\`로 초기화 |
| \`ttl\` 미지정 | \`expiresAt: null\`로 저장, 만료 없이 영구 보관                                                |

커스텀 \`serialize\`/\`deserialize\`는 원본 값(\`value\` 필드)에만 적용됩니다. 래퍼 자체는 항상 \`JSON.stringify\`/\`JSON.parse\`로 처리됩니다.

---

## getter / setter 주입 패턴

\`useStorageState\`는 실제 스토리지 종류를 알지 못합니다. \`getter\`와 \`setter\`를 옵션으로 받아 상태 관리만 담당합니다.
이 덕분에 일반 스토리지와 TTL 스토리지를 같은 상태 코어 위에서 구현할 수 있습니다.

\`\`\`ts
BrowserStorageOptions<T> = {
  getter: () => StorageResult<T>       ← 읽기 전략 주입
  setter: (value: T) => StorageResult<string>  ← 쓰기 전략 주입
  ...공통 옵션
}
\`\`\`
`;

export default SkillSection;
