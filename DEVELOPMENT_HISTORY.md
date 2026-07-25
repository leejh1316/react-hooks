# React Hooks 개발내역

> `packages/`에 구현된 훅 패키지와 `apps/docs`에 구축한 문서 사이트를 기준으로 정리한 개발내역 문서입니다.
> 기준일: 2026-07-25 · 기준 브랜치: `claude/hooks-development-docs-vgo6nc`

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [개발 현황 요약](#2-개발-현황-요약)
3. [패키지 개발내역](#3-패키지-개발내역)
   - [3.1 상태 관리](#31-상태-관리)
   - [3.2 성능 최적화](#32-성능-최적화)
   - [3.3 DOM · 접근성](#33-dom--접근성)
   - [3.4 스토리지](#34-스토리지)
   - [3.5 Ref 유틸리티](#35-ref-유틸리티)
4. [문서 사이트(apps/docs) 개발내역](#4-문서-사이트appsdocs-개발내역)
5. [데모 앱(apps/demo) 개발내역](#5-데모-앱appsdemo-개발내역)
6. [Agent Skill 개발내역](#6-agent-skill-개발내역)
7. [패키지 의존성 관계](#7-패키지-의존성-관계)
8. [개발 타임라인](#8-개발-타임라인)
9. [공통 설계 원칙과 구현 패턴](#9-공통-설계-원칙과-구현-패턴)
10. [남은 작업](#10-남은-작업)

---

## 1. 프로젝트 개요

`@leejaehyeok/*` 네임스페이스로 배포하는 React 커스텀 훅 모음입니다. 훅 하나당 독립 npm 패키지로 분리한 pnpm 워크스페이스 모노레포로 구성했습니다.

### 리포지토리 구조

```
react-hooks/
├── apps/
│   ├── demo/                 # 훅 동작 검증용 데모 앱 (GitHub Pages 배포)
│   └── docs/                 # 문서 사이트 (Vercel 배포)
├── packages/
│   ├── use-browser-storage/  # 훅 패키지 16개
│   ├── use-compose-ref/
│   └── ...
├── tsconfig.base.json        # 공유 TS 설정
├── pnpm-workspace.yaml       # apps/*, packages/*
└── package.json              # 워크스페이스 루트 스크립트
```

### 기술 스택

| 구분 | 내용 |
| --- | --- |
| 언어 | TypeScript (strict) |
| 런타임 | React `>=18` (peerDependency), 데모 앱은 React 19 |
| 패키지 매니저 | pnpm workspace |
| 빌드 | Vite library mode (`es` + `cjs`), `vite-plugin-dts`로 `.d.ts` 생성 |
| 문서 앱 | React 18 · React Router 7 · Tailwind CSS 4 · Shiki · Floating UI · lucide-react |
| 데모 앱 | React 19 · React Router 7 · Tailwind CSS 4 |
| 포매팅 | Prettier + `prettier-plugin-tailwindcss` (루트 일괄 적용) |

### 빌드 · 배포 파이프라인

| 대상 | 방식 |
| --- | --- |
| 패키지 | `pnpm build:packages` → 각 패키지 `vite build` (ESM/CJS + 타입 선언) |
| 데모 앱 | `.github/workflows/deploy.yml` — `main` push 시 패키지 빌드 → 데모 빌드 → GitHub Pages 배포 |
| 문서 앱 | `apps/docs/vercel.json` — 루트로 이동해 `build:packages` 후 `build:docs`, SPA rewrite 설정, 변경 없으면 빌드 스킵(`ignoreCommand`) |

개발 시에는 `apps/*/vite.config.ts`의 alias로 패키지 `src`를 직접 참조하도록 구성해, 패키지를 매번 빌드하지 않고도 즉시 반영되게 했습니다.

---

## 2. 개발 현황 요약

| 항목 | 수량 |
| --- | --- |
| 훅 패키지 | 16개 |
| 공개 훅 | 17개 (`use-intersection-observer`가 훅 2개 제공) |
| 문서 페이지 (`apps/docs`) | 14개 |
| 데모 페이지 (`apps/demo`) | 17개 |
| Agent Skill | 4개 |

### 패키지별 상태

| 패키지 | 버전 | 공개 API | docs 페이지 | Skill |
| --- | --- | --- | --- | --- |
| `use-browser-storage` | 0.1.0 | `useLocalStorage`, `useLocalStorageWithTTL`, `useSessionStorage`, `useSessionStorageWithTTL`, `browserStorage`, `ttl`, `serializer` | ✅ | ✅ |
| `use-compose-ref` | 0.1.0 | `useComposedRefs`, `composeRefs`, `setRef` | ✅ | — |
| `use-compose-state` | 0.1.0 | `useComposedState` | — | — |
| `use-controllable-state` | 0.1.0 | `useControllableState` | ✅ | — |
| `use-custom-event-state` | 0.1.0 | `useCustomEventState` | ✅ | — |
| `use-debounce` | 0.1.0 | `useDebounce` | ✅ | — |
| `use-deferred-loading` | 0.2.0 | `useDeferredLoading` | ✅ | — |
| `use-focus-trap` | 0.2.1 | `useFocusTrap` | ✅ | ✅ |
| `use-intersection-observer` | 0.3.0 | `useIntersectionObserver`, `useIntersectionObserverGroup` | ✅ (2페이지) | ✅ (2개) |
| `use-latest-ref` | 0.1.0 | `useLatestRef` | ✅ | — |
| `use-overflow` | 0.1.0 | `useOverflow` | — | — |
| `use-pagination` | 0.1.0 | `usePagination` | ✅ | — |
| `use-prev-ref` | 0.1.0 | `usePrevRef` | — | — |
| `use-roving-focus` | 0.1.4 | `useRovingFocus` | ✅ | — |
| `use-snooze` | 0.1.0 | `useSnooze` | ✅ | — |
| `use-throttle` | 0.1.0 | `useThrottle` | ✅ | — |

> 문서 페이지 미작성: `use-compose-state`, `use-overflow`, `use-prev-ref` (데모 앱에는 3개 모두 존재)

---

## 3. 패키지 개발내역

### 3.1 상태 관리

#### `useControllableState` — `@leejaehyeok/use-controllable-state` (0.1.0)

제어(Controlled) · 비제어(Uncontrolled) 컴포넌트 패턴을 하나의 인터페이스로 통합한 훅입니다. `value`가 주어지면 제어 모드, 아니면 내부 `useState`로 동작합니다.

```ts
const [value, setValue] = useControllableState({ value, defaultValue, onChange });
```

**구현 내역**

- 제어 여부(`isControlled`)를 `useRef`로 **최초 마운트 시점에 고정** → 렌더 도중 `value`가 `undefined`로 바뀌어도 모드가 흔들리지 않음
- `Object.is(prev, next)` 비교로 값이 그대로일 때 `onChange` 재호출 차단
- `valueRef` / `onChangeRef`를 두어 `setValue`를 의존성 없는(`[]`) `useCallback`으로 고정 → 자식에 내려도 리렌더 유발 없음
- `(prev) => next` 함수형 업데이트를 제어 모드에서도 동일하게 지원 (최신 값은 `valueRef`에서 읽음)
- `defaultValue`는 lazy initializer(`() => T`) 형태 지원

#### `useCustomEventState` — `@leejaehyeok/use-custom-event-state` (0.1.0)

`window`의 `CustomEvent`를 pub-sub 채널로 사용해, Provider 없이 `key` 문자열만으로 컴포넌트 간 상태를 동기화하는 훅입니다.

```ts
const [count, dispatch] = useCustomEventState("counter", 0);
dispatch((prev) => prev + 1); // 같은 key를 쓰는 모든 컴포넌트가 갱신
```

**구현 내역**

- 이벤트 이름을 `@leejaehyeok/use-custom-event-state:{key}`로 네임스페이싱해 외부 이벤트와 충돌 방지
- `event.detail`에 값과 함수형 업데이터를 모두 실어 보내고, 수신 측에서 `typeof === "function"` 분기로 처리
- 초기값 lazy initializer 지원, 언마운트 시 리스너 자동 해제
- Context 없이 트리 밖(포털·마이크로 프론트엔드) 컴포넌트와도 상태 공유 가능 — 이후 `use-browser-storage`의 동기화 계층으로 재사용됨

#### `useComposedState` — `@leejaehyeok/use-compose-state` (0.1.0)

여러 `setState`를 하나의 dispatcher로 합성합니다.

```ts
const setAll = useComposedState(setStateA, setStateB);
setAll(10); // 두 setter 모두 호출
```

**구현 내역**

- 가변 인자로 받은 setter 배열을 `useLatestRef`에 보관 → 렌더마다 배열 참조가 바뀌어도 stale closure 없이 의존성 `[]` 유지
- 함수형 업데이트를 각 setter에 `(prev) => next` 형태 그대로 전달해 개별 상태의 최신값 기준으로 계산되도록 처리

#### `usePagination` — `@leejaehyeok/use-pagination` (0.1.0)

페이지네이션 UI에 필요한 상태·계산·핸들러를 모두 제공하는 headless 훅입니다.

```ts
const { page, totalPages, setPage, handleNext, handlePrevious, handleSkipNext, handleSkipPrevious, paginationRange, isFirstPage, isLastPage } =
  usePagination({ totalItems: 100, itemsPerPage: 10, siblings: 1, boundaries: 1 });
```

**구현 내역**

- 내부 상태를 `useControllableState`로 구성 → `currentPage` / `onPageChange`를 주면 제어 모드, 없으면 `defaultPage` 기반 비제어 모드
- `siblings`(현재 페이지 좌우 개수), `boundaries`(양 끝 고정 개수)로 4가지 케이스(전체 표시 / 오른쪽 생략 / 왼쪽 생략 / 양쪽 생략)를 분기 계산
- 렌더링용 데이터를 `PaginationItem = PageItem | EllipsisItem` 판별 유니온으로 반환하고 각 항목에 React `key`까지 포함 → 소비 측에서 분기만 하면 됨
- `handleSkipNext` / `handleSkipPrevious`의 점프 폭을 `siblings * 2 + 1`로 계산해 화면에 보이는 페이지 묶음 단위로 이동
- `totalPages` 변경 시 현재 페이지가 범위를 벗어나면 자동 보정 (`useEffect`)

### 3.2 성능 최적화

#### `useDebounce` — `@leejaehyeok/use-debounce` (0.1.0)

```ts
const { debounce, cancel, flush } = useDebounce(handleSearch, 300, { leading: true, trailing: true });
```

**구현 내역**

- `leading` / `trailing` 옵션을 독립 제어 (기본값 둘 다 `true`)
- 원본 함수를 `callbackRef`에 보관 → `debounce` 참조를 유지하면서도 항상 최신 함수 실행
- `lastArgsRef`로 마지막 호출 인자를 보관해 `flush()` 시 그대로 재현
- `cancel()`은 타이머와 인자를 함께 정리, `useEffect(() => cancel, [cancel])`로 언마운트 시 자동 취소
- 반환 타입을 `as const`로 고정해 구조 분해 시 타입 추론 유지

#### `useThrottle` — `@leejaehyeok/use-throttle` (0.1.0)

```ts
const { throttle, cancel, flush } = useThrottle(handleScroll, 100);
```

**구현 내역**

- **재귀 `setTimeout` 루프** 방식: 대기 구간이 끝나는 시점에 `lastArgs`가 남아 있으면 trailing 실행 후 다음 주기를 다시 예약, 없으면 타이머 종료
  → `Date.now()` 비교 방식 대비 trailing 호출이 누락되거나 중복되는 경계 케이스를 제거
- leading 실행 직후 `lastArgs`를 비워 같은 인자가 두 번 실행되지 않도록 처리
- `useDebounce`와 동일한 `{ fn, cancel, flush }` 반환 형태로 API 일관성 확보

#### `useDeferredLoading` — `@leejaehyeok/use-deferred-loading` (0.2.0)

짧은 로딩에서 스피너가 깜빡이는 문제와, 스피너가 너무 짧게 보였다 사라지는 문제를 함께 해결합니다.

```ts
const isDeferredLoading = useDeferredLoading(isLoading, { delay: 100, minDisplayDuration: 300 });
```

**구현 내역**

- `delay`(기본 100ms) 이내에 로딩이 끝나면 스피너를 아예 표시하지 않음
- 한 번 표시된 스피너는 `showTime` 기준 경과 시간을 계산해 `minDisplayDuration`(기본 300ms)이 지날 때까지 유지
- `delayTimer` / `minDurationTimer` 두 타이머를 각각의 ref로 분리 관리해 로딩 on/off가 빠르게 반복될 때의 경쟁 조건 방지

### 3.3 DOM · 접근성

#### `useIntersectionObserver` — `@leejaehyeok/use-intersection-observer` (0.3.0)

단일 요소의 뷰포트 진입/이탈을 감지합니다.

```ts
const { setContainerRef, isVisible, hasEntered, target, reset } = useIntersectionObserver({
  once: true,
  threshold: 0.5,
  onEntered: (entry, observer) => {},
});
```

**구현 내역**

- 옵션 타입 `IntersectionBaseOptions`가 표준 `IntersectionObserverInit`을 확장(`Omit<_, "root">` + 자체 `root`)하도록 설계해, 네이티브 옵션(`threshold`, `rootMargin`)을 그대로 전달 가능
- `root: "container"` 지정 시 ref로 받은 컨테이너 자신을 루트로 사용
- 관찰 대상은 `targetSelector`(기본 `[data-intersection-target]`)로 지정, 없으면 `firstElementChild`로 폴백. 대상이 없거나 2개 이상이면 개발 모드에서 경고 출력
- `once: true`면 진입 이후 이탈 시점에 `unobserve` → 불필요한 관찰 비용 제거
- `enable`, `onEntered` / `onExited` / `onChange` 콜백을 모두 `useLatestRef`로 감싸 옵저버 재생성 없이 최신 값 참조
- `reset()`으로 `hasEntered`를 포함한 관찰 상태를 초기화하고 재관찰

#### `useIntersectionObserverGroup` — 같은 패키지

여러 요소를 **하나의** `IntersectionObserver` 인스턴스로 그룹 감시합니다.

```ts
const { setContainerRef, states, reset } = useIntersectionObserverGroup({ keyAttribute: "data-intersection-key" });
// states: { "item-1": { isVisible, hasEntered, target }, ... }
```

**구현 내역**

- 인스턴스를 하나만 만들고 key 속성(기본 `data-intersection-key`) 기준으로 상태 맵을 관리 → 리스트 길이에 비례해 옵저버가 늘어나지 않음
- `MutationObserver`를 함께 붙여 DOM에 추가/제거되는 항목을 자동 `observe` / `unobserve`하고, 제거된 key는 상태 맵에서도 삭제 → 무한 스크롤·동적 리스트 대응
- 추가된 노드 자신이 key 속성을 가진 경우와 하위에 가진 경우를 모두 수집
- 이탈 시 `hasEntered`는 이전 상태를 보존(`oldState?.hasEntered ?? false`)
- `reset(key?)` — key를 주면 해당 항목만, 없으면 전체 재관찰

#### `useOverflow` — `@leejaehyeok/use-overflow` (0.1.0)

컨테이너 안의 자식이 가로로 넘치는지 감지합니다. "더보기" 메뉴 노출 판단 등에 사용합니다.

```ts
const { containerRef, isOverflow } = useOverflow();
```

**구현 내역**

- 관찰 3종을 조합: 컨테이너용 `ResizeObserver`, 자식용 `ResizeObserver`, 자식 추가/제거 감지용 `MutationObserver`
- `MutationObserver → requestAnimationFrame → 레이아웃 → ResizeObserver` 순서를 전제로, mutation 발생 시 rAF로 측정을 미뤄 레이아웃 확정 이후의 정확한 값을 읽음
- `[data-overflow-item]` 표시가 하나라도 있으면 표시된 요소만, 없으면 전체 자식을 측정 대상으로 삼는 marked-item 전략
- 마지막 자식의 `right` 좌표를 컨테이너 기준으로 환산해 폭 초과 여부 판단, 값이 같으면 상태 갱신을 건너뛰어 리렌더 억제
- 언마운트 및 ref 해제 시 rAF·옵저버 전부 정리

#### `useFocusTrap` — `@leejaehyeok/use-focus-trap` (0.2.1)

모달·다이얼로그·드로어에서 포커스를 컨테이너 안에 가두는 접근성 훅입니다.

```tsx
const containerRef = useFocusTrap({ initialFocusSelector: "[data-initial-focus]" });
return <div ref={containerRef}>...</div>;
```

**구현 내역**

- 훅이 **callback ref 하나만** 반환하는 형태 → `<div ref={containerRef}>` 연결만으로 동작, 별도 활성화 API 불필요
- `getFocusableElements` 유틸 자체 구현: 링크·버튼·입력·`contenteditable`·`details > summary`·명시적 `tabindex` 등을 선택자로 수집한 뒤,
  `inert` / `aria-hidden="true"` / `hidden` 조상, `display:none` · `visibility:hidden`, `aria-disabled="true"`를 필터링해 **실제로 포커스 가능한 요소만** 남김
- `MutationObserver`로 `childList` · `subtree`와 `disabled`, `aria-hidden`, `aria-disabled`, `hidden`, `inert`, `tabindex` 속성 변화를 추적해 목록을 실시간 갱신
- Tab / Shift+Tab이 경계에 도달하면 `preventDefault` 후 반대편 끝으로 순환
- 마운트 시 `document.activeElement`를 저장했다가 해제 시 복원 → 모달을 닫으면 트리거 버튼으로 포커스가 돌아감
- 초기 포커스 우선순위: `initialFocusSelector` 요소 → 첫 포커스 가능 요소 → 컨테이너 자신

#### `useRovingFocus` — `@leejaehyeok/use-roving-focus` (0.1.4)

WAI-ARIA의 roving tabindex 패턴 구현체입니다. 활성 항목만 `tabIndex=0`, 나머지는 `-1`로 유지합니다.

```ts
const { containerRef, handleKeyDown } = useRovingFocus({ orientation: "horizontal", loop: true });
```

**옵션**

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `itemSelector` | `[data-roving-item]` | 항목 선택자 |
| `orientation` | `both` | `horizontal` / `vertical` / `both` |
| `loop` | `false` | 경계에서 순환 여부 |
| `colSkipCount` | `0` | 그리드 열 수 (상하 이동 폭) |
| `initialIndex` | `0` | 초기 활성 인덱스 |
| `clickOnNavigate` | `false` | 이동 시 `click()` 발생 (자동 활성화 탭) |
| `scrollIntoView` | `false` | `true` 또는 `ScrollIntoViewOptions` |
| `enableHome` / `enableEnd` | `true` | Home / End 키 사용 |
| `onNavigate` / `onUnderflow` / `onOverflow` | — | 이동·경계 초과 콜백 |

**구현 내역**

- `MutationObserver`로 항목 목록을 동기화하고, 동기화 직후 `tabIndex`를 일괄 재계산 → 동적 렌더링 대응
- `focusin` 리스너로 마우스 클릭 등 키보드 외 포커스 변경도 활성 인덱스에 반영
- `isDisabledElement` 검사로 비활성 항목을 건너뛰며 이동, 최대 시도 횟수를 방향별로 제한해(수직은 `ceil(total / cols)`) 전부 disabled인 경우의 무한 루프 방지
- 그리드 순환 시 열(column)을 유지하도록 인덱스를 계산 — 위로 넘치면 같은 열의 마지막 행, 아래로 넘치면 같은 열의 첫 행
- `INPUT` / `TEXTAREA` / `contentEditable` 요소에서는 방향키를 가로채지 않음
- 콜백 3종을 `useLatestRef`로 감싸 `handleKeyDown` 참조를 안정적으로 유지

### 3.4 스토리지

#### `use-browser-storage` — `@leejaehyeok/use-browser-storage` (0.1.0)

`localStorage` / `sessionStorage`를 React 상태처럼 다루는 훅 패밀리입니다. 이 리포지토리에서 가장 계층이 깊은 패키지입니다.

```ts
const { value, setValue, removeValue } = useLocalStorage({ key: "theme", defaultValue: "light", subscribe: true });

const { value, setValue } = useLocalStorageWithTTL({ key: "token", defaultValue: null, ttl: ttl.minutes(30) });
```

**아키텍처**

```
useLocalStorage / useSessionStorage (+ WithTTL)
        └─ useBrowserStorage / useBrowserStorageWithTTL   ← getter/setter 주입
                └─ useStorageState                        ← 상태 + 동기화 계층
                        └─ useCustomEventState            ← 같은 탭 내 인스턴스 동기화
        utils: browserStorage (저수용 CRUD) · withTTL (데코레이터) · serializer
```

**구현 내역**

- **`StorageResult<T>` 판별 유니온**으로 실패를 예외 대신 값으로 반환. 에러 코드는 `NOT_FOUND` / `PARSE_ERROR` / `SERIALIZE_ERROR` / `QUOTA_EXCEEDED` / `UNAVAILABLE` / `UNKNOWN` 6종
- `getStorage`를 `try/catch` + `typeof window` 가드로 감싸 SSR·프라이빗 모드에서도 throw 없이 `UNAVAILABLE` 반환
- `QuotaExceededError` / `NS_ERROR_DOM_QUOTA_REACHED`를 구분해 용량 초과를 별도 코드로 식별
- **`withTTL` 데코레이터**: 기존 `browserStorage`를 감싸 `{ value, expiresAt }` 래퍼로 저장하고, 조회 시 만료되었으면 자동 삭제 후 `NOT_FOUND` 반환. `ttl.ms/seconds/minutes/hours/days/weeks` 헬퍼 제공
- getter/setter를 상위 훅에서 주입하는 구조라 일반 저장과 TTL 저장이 `useStorageState` 하나를 공유
- 같은 탭 내 여러 인스턴스는 `useCustomEventState` 기반으로 즉시 동기화, 다른 탭은 `useLocalStorage`의 `subscribe: true`일 때 `storage` 이벤트 구독으로 반영 (`browserStorage.subscribe`가 `newValue`/`oldValue`까지 역직렬화해 전달)
- `serializer` 프리셋으로 `Map` / `Set` / `Date` / `URL` / `bigint` 등 JSON으로 왕복이 안 되는 타입 지원, 직접 `serialize`/`deserialize` 주입도 가능
- 저수준 유틸 `browserStorage`(`get`/`set`/`remove`/`clear`/`has`/`length`/`key`/`keys`/`subscribe`)를 별도로 export해 훅 없이도 사용 가능

#### `useSnooze` — `@leejaehyeok/use-snooze` (0.1.0)

"오늘 하루 보지 않기" 류의 스누즈 기능을 웹 스토리지 기반으로 구현합니다.

```ts
const [isActive, snooze] = useSnooze({ key: "notice-banner", duration: "day", storageType: "local", autoReactivate: true });
```

**구현 내역**

- 스토리지에 **만료 시각(timestamp)** 을 저장하는 방식이라 새로고침·재방문 이후에도 상태 유지
- 초기 상태를 `useState`의 lazy initializer에서 계산해 첫 페인트에 배너가 깜빡이지 않음
- `duration: "day"`는 24시간으로 정규화, 숫자는 ms로 그대로 사용
- `autoReactivate: true`면 남은 시간만큼 `setTimeout`을 걸어 만료 시점에 자동 재활성화, 이미 만료된 경우 즉시 활성화
- `typeof window` 가드로 SSR 안전

### 3.5 Ref 유틸리티

#### `useLatestRef` — `@leejaehyeok/use-latest-ref` (0.1.0)

항상 최신 값을 담은 ref를 반환합니다. 이 리포지토리에서 가장 널리 재사용되는 기반 훅입니다.

**구현 내역**

- `useLayoutEffect`로 갱신 → 렌더 직후·페인트 이전에 값이 반영되므로, 같은 커밋에서 실행되는 다른 `useEffect`나 이벤트 핸들러가 이전 값을 읽지 않음
- 이 훅 덕분에 `useRovingFocus`, `useIntersectionObserver`, `useComposedState`, `use-browser-storage` 등에서 콜백을 의존성 배열에 넣지 않고도 stale closure 없이 최신 콜백 호출 가능

#### `usePrevRef` — `@leejaehyeok/use-prev-ref` (0.1.0)

직전 렌더의 값을 ref로 보관합니다.

**구현 내역**

- `useEffect`의 **cleanup 함수**에서 값을 갱신 → 다음 렌더의 effect가 실행되기 직전에만 덮어쓰이므로, 렌더 도중과 effect 시점 모두에서 "이전 값"이 안전하게 유지됨

#### `useComposedRefs` — `@leejaehyeok/use-compose-ref` (0.1.0)

여러 ref를 하나의 callback ref로 합성합니다.

```tsx
const composedRef = useComposedRefs(internalRef, forwardedRef);
return <div ref={composedRef} />;
```

**구현 내역**

- `RefObject` · `MutableRefObject` · callback ref · `null` · `undefined` 전부 처리하는 `setRef` 유틸 분리
- **React 19의 callback ref cleanup 반환값 지원**: 각 ref의 반환값을 모아 두었다가, 하나라도 cleanup 함수가 있으면 합성 ref도 cleanup을 반환. 이때 cleanup이 있는 ref는 해당 함수를 호출하고, 없는 ref는 `null`로 초기화해 두 방식이 섞여도 누수 없이 정리
- 훅과 별개로 순수 함수 `composeRefs`도 export해 훅 밖(클래스·유틸)에서도 사용 가능

---

## 4. 문서 사이트(apps/docs) 개발내역

`react-hooks-docs` — 훅 사용법을 설명하고 실제 동작을 확인할 수 있는 문서 사이트입니다. Vercel에 배포됩니다.

### 구조

```
apps/docs/src/
├── router/router.tsx          # PAGE_ROUTES 선언 → 라우트/사이드바/인덱스 자동 생성
├── components/
│   ├── layout/                # DocsLayout, Header, Sidebar, OnThisPage
│   ├── docs/                  # 문서 전용 빌딩 블록
│   └── ui/                    # Button, Card, Table, Tooltip, CopyButton, Document 등
├── pages/
│   ├── home/                  # Hero / Features / CodePreview / GettingStarted / CTA
│   └── docs/
│       ├── DocsIndexPage.tsx
│       └── hooks/<hook-name>/
│           ├── Use<Hook>Page.tsx
│           └── components/
│               ├── demos/     # 미적용/적용 비교 데모
│               └── sections/  # Overview / Install / Usage / Api / Skill ...
└── styles/                    # color, typography, spacing, scrollbar, anime
```

### 개발 내역

- **라우트 단일 선언**: `PAGE_ROUTES`에 경로·컴포넌트·표시명·한 줄 요약을 함께 선언하고, 여기서 React Router 라우트와 사이드바·인덱스 페이지 카드를 파생시킴 → 문서 추가 시 수정 지점이 한 곳
- **페이지 템플릿 고정**: 모든 훅 문서가 `Overview → Install → Usage(데모+스니펫) → API → Agent Skill` 순서를 따르도록 규칙화. `apps/docs/README.md`에 이 규칙을 문서 생성 프롬프트로 남겨 페이지 간 일관성을 유지
- **문서 전용 컴포넌트 세트** 구축: `PropsTable`, `ParameterTable`, `ReturnTable`, `AttributeTable`, `BehaviorTable`, `CssPropertyTable`, `CodeBlock`(Shiki 하이라이팅 + 복사), `PreviewContainer`, `DocsPagination`
- **비교 데모 패턴**: 훅 미적용/적용을 나란히 보여주는 데모를 표준으로 삼음 (`NoThrottleDemo` ↔ `ThrottleDemo`, `NoFocusTrapDemo` ↔ `FocusTrapDemo` 등). `use-roving-focus`, `use-snooze`, `use-pagination`은 옵션을 직접 바꿔보는 플레이그라운드 데모까지 추가
- **자체 훅으로 문서 사이트를 구현(도그푸딩)**: 헤더 메뉴에 `useFocusTrap`, 사이드바 내비게이션에 `useRovingFocus`를 적용해 접근성 훅을 실사용으로 검증. 문서 앱은 워크스페이스 패키지 16개를 모두 의존성으로 연결
- **레이아웃**: `DocsLayout` + `OnThisPage`(현재 문서 목차), `BreakableCamelCase`로 긴 훅 이름의 줄바꿈 처리
- **배포**: `vercel.json`에서 모노레포 루트로 올라가 패키지를 먼저 빌드하고 SPA rewrite 적용, 관련 없는 변경 시 빌드 스킵

### 작성된 문서 페이지 (14)

`useBrowserStorage` · `useComposedRefs` · `useControllableState` · `useCustomEventState` · `useDebounce` · `useDeferredLoading` · `useFocusTrap` · `useIntersectionObserver` · `useIntersectionObserverGroup` · `useLatestRef` · `usePagination` · `useRovingFocus` · `useSnooze` · `useThrottle`

---

## 5. 데모 앱(apps/demo) 개발내역

`demo` — 훅 동작을 빠르게 확인하기 위한 검증용 앱으로, GitHub Pages에 배포됩니다.

- FSD(Feature-Sliced Design) 기반 폴더 구성: `app` / `pages` / `features` / `entities` / `shared`
- 훅별 페이지 17개 보유 — 문서 사이트에 아직 페이지가 없는 `use-compose-state`, `use-overflow`, `use-prev-ref`도 여기서는 확인 가능
- `features/`에 재사용 데모(`focus-trap-demos`, `roving-focus-demos`, `use-latest-ref-demos`) 분리
- React 19 환경에서 동작하므로, React 18 기반인 문서 앱과 함께 **양쪽 React 메이저 버전에서 패키지가 동작하는지 검증**하는 역할도 겸함 (`useComposedRefs`의 React 19 cleanup 처리 등)

---

## 6. Agent Skill 개발내역

AI 에이전트가 훅을 정확히 사용하도록 `SKILL.md` 형태의 스킬 문서를 패키지에 동봉했습니다.

| 스킬 | 위치 | 구성 |
| --- | --- | --- |
| `use-focus-trap` | `packages/use-focus-trap/skills/use-focus-trap/` | SKILL.md |
| `use-browser-storage` | `packages/use-browser-storage/skills/use-browser-storage/` | SKILL.md + `references/browser-storage-util.md`, `references/internals.md` |
| `use-intersection-observer` | `packages/use-intersection-observer/skills/use-intersection-observer/` | SKILL.md |
| `use-intersection-observer-group` | `packages/use-intersection-observer/skills/use-intersection-observer-group/` | SKILL.md |

- frontmatter의 `description`에 트리거 키워드(예: "포커스 트랩", "모달 접근성", "탭 간 동기화", "TTL")를 한국어로 나열해 자연어 요청에서 스킬이 선택되도록 작성
- 본문은 훅 시그니처 → 옵션 → 사용 패턴 → 주의사항 순으로 구성
- 각 문서 페이지의 `SkillSection`에서 해당 SKILL.md를 복사할 수 있게 노출

---

## 7. 패키지 의존성 관계

```
use-latest-ref (기반)
├── use-compose-state
├── use-intersection-observer
├── use-roving-focus
└── use-browser-storage
        └── use-custom-event-state

use-controllable-state
└── use-pagination

독립: use-compose-ref · use-debounce · use-deferred-loading · use-focus-trap ·
     use-overflow · use-prev-ref · use-snooze · use-throttle
```

- 워크스페이스 내부 의존은 모두 `workspace:*`로 연결
- 모든 패키지가 `react`를 `peerDependencies(">=18")`로만 선언 → 중복 React 인스턴스 방지
- `use-latest-ref`가 5개 패키지의 기반이 되고, `use-browser-storage`는 `use-latest-ref` + `use-custom-event-state`를 조합 — 훅을 훅으로 재사용하는 계층 구조

---

## 8. 개발 타임라인

커밋 이력 기준 주요 흐름입니다. (현재 클론은 shallow clone이라 2026-05-13 이전 이력은 포함되어 있지 않습니다.)

| 시기 | 작업 |
| --- | --- |
| ~2026-05-13 | 훅 패키지 초기 개발, Agent Skill 도입 |
| 2026-05-18 | `use-intersection-observer` v0.2.0 — `enable` 옵션 추가, target element 노출 |
| 2026-07-10 | **문서 앱 신규 구축**(DOCS APP INIT) · 홈 페이지 구성 · 패키지 16개 연결 · Prettier 설정 · 헤더 메뉴에 `useFocusTrap` 적용 · `use-focus-trap` 문서 1호 작성 |
| 2026-07-13 | 문서 공통 컴포넌트(Button 등) 정비, 데모 컴포넌트화 · `useThrottle` / `useDebounce` / `useBrowserStorage` / `usePagination` 문서 추가 |
| 2026-07-14 | `useLatestRef` / `useDeferredLoading` / `useComposedRefs` / `useControllableState` / `useCustomEventState` / `useIntersectionObserver` / `useIntersectionObserverGroup` 문서 추가 · 헤더·사이드바 키보드 내비게이션 연결 · `use-roving-focus` 타입·초기화 로직 수정 · Vercel 배포 설정 · 텍스트 줄바꿈 처리 |
| 2026-07-15 | `use-overflow` 개선 과제 정리 |
| 2026-07-19 | `use-roving-focus` 진입점 수정 · `useRovingFocus` / `useSnooze` 문서 추가 |

문서 앱 착수(7/10) 이후 약 열흘 동안 14개 문서 페이지를 완성했고, 문서를 작성하면서 발견한 문제를 훅 쪽에 역으로 반영(`use-roving-focus` 초기화·타입·진입점 수정)한 흐름이 확인됩니다.

---

## 9. 공통 설계 원칙과 구현 패턴

| 원칙 | 적용 방식 | 적용 대상 |
| --- | --- | --- |
| **Headless** | 상태·로직만 제공하고 마크업/스타일은 소비 측에 위임 | `usePagination`, `useRovingFocus`, 전 훅 |
| **Stale closure 방지** | 콜백·옵션을 `useLatestRef`에 보관하고 의존성 배열은 비움 | `useRovingFocus`, `useIntersectionObserver`, `useComposedState`, `use-browser-storage` |
| **callback ref 중심** | `useEffect` 대신 callback ref에서 옵저버·리스너를 등록/해제 | `useFocusTrap`, `useRovingFocus`, `useOverflow`, `useIntersectionObserver` |
| **동적 DOM 대응** | `MutationObserver`로 대상 목록을 실시간 동기화 | `useFocusTrap`, `useRovingFocus`, `useOverflow`, `useIntersectionObserverGroup` |
| **정리(cleanup) 보장** | 타이머·옵저버·이벤트 리스너·rAF를 언마운트 및 ref 해제 시 모두 해제 | 전 훅 |
| **오류를 값으로** | 예외 대신 `StorageResult` 판별 유니온 반환 | `use-browser-storage` |
| **SSR 안전** | `typeof window` 가드 + `try/catch` | `use-browser-storage`, `useSnooze` |
| **제어/비제어 통합** | `useControllableState`를 상태 기반 훅의 토대로 사용 | `usePagination` |
| **타입 안전성** | 제네릭, 판별 유니온, `as const` 반환, `Omit`으로 옵션 파생 | 전 훅 |
| **API 일관성** | 유사 훅은 동일한 반환 형태 유지(`{ fn, cancel, flush }`, `{ setContainerRef, reset, ... }`) | debounce/throttle, intersection 계열 |
| **접근성** | WAI-ARIA 패턴(Focus Trap, Roving Tabindex) 준수 | `useFocusTrap`, `useRovingFocus` |

---

## 10. 남은 작업

### 문서

- 문서 페이지 미작성 훅 3종 추가: `useComposedState`, `useOverflow`, `usePrevRef`
- 루트 `README.md`의 버전 표가 실제 `package.json`과 어긋남 (`use-roving-focus` 0.1.1 → 실제 0.1.4). `use-overflow`는 표에 누락
- `apps/docs/README.md`의 "현재 작성된 문서 - Hook: 7" 표기가 실제 14개와 불일치

### 훅

- `useOverflow` (소스 내 TODO)
  - 수직/수평 오버플로우 구분
  - marked-item 전략 재검토
  - 전체 자식에 대한 불필요한 측정 제거
- `useRovingFocus`: `initialIndex`가 의도적으로 비제어(prop 변경 후 미갱신)이므로, 제어 모드 필요 시 별도 API 설계 필요
- `useIntersectionObserver`: 개발 모드 경고 분기가 `process.env.NODE_ENV`의 존재 여부만 검사하고 있어 값 비교(`!== "production"`)로 다듬을 여지 있음

### 인프라

- 테스트 코드 부재 — 특히 타이머 기반(`useDebounce`, `useThrottle`, `useDeferredLoading`)과 키보드 내비게이션(`useRovingFocus`) 훅은 회귀 테스트 가치가 큼
- 패키지 배포 자동화(변경 감지 → 버전 범프 → npm publish) 미구성
