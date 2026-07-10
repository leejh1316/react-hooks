# React Custom Hooks 라이브러리

> **모노레포** 구조로 제작한 React Custom Hook 패키지 모음입니다.  
> 각 훅은 독립 패키지(`@leejaehyeok/*`)로 분리되어 있으며, 재사용성과 관심사 분리를 목표로 설계하였습니다.

---

## 목차

1. [상태 관리](#1-상태-관리)
   - [useControllableState](#usecontrollablestate)
   - [useCustomEventState](#usecustomeventstate)
   - [useComposedState](#usecomposedstate)
   - [usePagination](#usepagination)
2. [성능 최적화](#2-성능-최적화)
   - [useDebounce](#usedebounce)
   - [useThrottle](#usethrottle)
   - [useDeferredLoading](#usedeferredloading)
3. [DOM / 브라우저 API](#3-dom--브라우저-api)
   - [useIntersectionObserver](#useintersectionobserver)
   - [useIntersectionObserverGroup](#useintersectionobservergroup)
   - [useOverflow](#useoverflow)
   - [useFocusTrap](#usefocustrap)
   - [useRovingFocus](#userovingfocus)
4. [스토리지](#4-스토리지)
   - [useBrowserStorage / useLocalStorage / useSessionStorage](#usebrowserstorage--uselocalstorage--usesessionstorage)
   - [useSnooze](#usesnooze)
5. [Ref 유틸리티](#5-ref-유틸리티)
   - [useLatestRef](#uselatestref)
   - [usePrevRef](#useprevref)
   - [useComposeRef](#usecomposeref)

---

## 1. 상태 관리

### `useControllableState`

**제어(Controlled) · 비제어(Uncontrolled) 컴포넌트 패턴을 하나의 인터페이스로 통합하는 훅**

컴포넌트 라이브러리에서 자주 사용하는 패턴으로, 외부에서 `value`를 전달하면 제어 모드로, 전달하지 않으면 내부 상태로 동작합니다. MUI, Radix UI 등 오픈소스 UI 라이브러리에서 사용하는 방식을 직접 구현하였습니다.

| 옵션 | 타입 | 설명 |
|---|---|---|
| `value` | `T \| undefined` | 외부에서 주입하는 제어 값 |
| `defaultValue` | `T \| (() => T)` | 비제어 모드의 초기값 |
| `onChange` | `(value: T) => void` | 값 변경 시 호출되는 콜백 |

**핵심 구현 포인트**
- `useRef`로 최초 마운트 시점의 제어 여부를 고정 → 이후 `value`가 `undefined`가 되어도 제어 모드 유지
- `Object.is`로 동일 값 업데이트 시 `onChange` 재호출 방지
- 함수형 업데이트 `(prev) => next` 형태 지원

---

### `useCustomEventState`

**브라우저 `CustomEvent`를 이용해 컴포넌트 트리 외부에서 상태를 공유하는 훅**

React Context 없이 `key` 문자열만으로 전역 상태처럼 사용할 수 있습니다. 마이크로 프론트엔드 환경이나 portal 외부의 컴포넌트 간 통신에 유용합니다.

```ts
const [count, dispatch] = useCustomEventState('counter', 0);

// 어느 컴포넌트에서나 동일 key로 상태를 공유
dispatch((prev) => prev + 1);
```

**핵심 구현 포인트**
- `window.dispatchEvent` / `window.addEventListener`로 pub-sub 구현
- `event.detail`로 값 및 함수형 업데이트 전달
- 언마운트 시 이벤트 리스너 자동 해제

---

### `useComposedState`

**여러 개의 `setState`를 하나의 dispatcher로 합성하는 훅**

동일한 상태를 여러 컴포넌트가 구독해야 할 때, 각각의 setter를 하나로 묶어 한 번의 호출로 모두 업데이트합니다.

```ts
const [stateA, setStateA] = useState(0);
const [stateB, setStateB] = useState(0);

const setAll = useComposedState(setStateA, setStateB);
setAll(10); // setStateA(10), setStateB(10) 동시 호출
```

**핵심 구현 포인트**
- `useLatestRef`로 setter 배열의 stale closure 방지
- 함수형 업데이트 형태도 각 setter에 올바르게 전달

---

### `usePagination`

**페이지네이션 UI에 필요한 모든 상태와 로직을 캡슐화한 훅**

총 아이템 수, 페이지당 아이템 수를 기반으로 페이지 범위 계산, 생략 부호(ellipsis) 표시, 페이지 이동 핸들러를 제공합니다.

```ts
const {
  page, totalPages, setPage,
  handleNext, handlePrevious,
  handleSkipNext, handleSkipPrevious,
  paginationRange,
  isFirstPage, isLastPage
} = usePagination({ totalItems: 100, itemsPerPage: 10, siblings: 1, boundaries: 1 });
```

**핵심 구현 포인트**
- `useControllableState` 기반 → 제어/비제어 모드 모두 지원
- `siblings`, `boundaries` 파라미터로 표시 범위 동적 계산
- `[1 … 4 5 6 … 10]` 형태의 ellipsis 렌더링 데이터 생성
- `totalItems` 변경 시 현재 페이지가 범위를 초과하면 자동 조정

---

## 2. 성능 최적화

### `useDebounce`

**함수 호출을 지연시켜 빠른 연속 호출 중 불필요한 실행을 억제하는 훅**

검색 자동완성, 창 크기 변경 이벤트 등에 사용하며, `leading` / `trailing` 옵션으로 첫 호출 즉시 실행 여부와 마지막 호출 실행 여부를 개별 제어합니다.

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `leading` | `true` | 첫 호출 즉시 실행 여부 |
| `trailing` | `true` | 대기 시간 후 마지막 호출 실행 여부 |

```ts
const { debounce, cancel, flush } = useDebounce(handleSearch, 300);
```

**핵심 구현 포인트**
- `callbackRef`로 클로저 문제 없이 최신 함수 참조 유지
- `flush()` : 대기 중인 호출 즉시 실행
- `cancel()` : 대기 중인 호출 취소
- 언마운트 시 타이머 자동 정리

---

### `useThrottle`

**일정 시간 간격으로 함수 실행 횟수를 제한하는 훅**

스크롤, 마우스 이동 등 고빈도 이벤트에 사용합니다. `leading` / `trailing` 옵션으로 실행 시점을 제어하며, 재귀 타이머 방식으로 trailing 호출을 안정적으로 처리합니다.

```ts
const { throttle, cancel, flush } = useThrottle(handleScroll, 100);
```

**핵심 구현 포인트**
- 재귀 `setTimeout` 루프로 trailing 호출 시 다음 throttle 주기 자동 연장
- `lastArgs`로 throttle 주기 중 마지막 인자를 저장하여 trailing에 전달
- `flush()`, `cancel()` 메서드 제공

---

### `useDeferredLoading`

**로딩 상태를 지연 표시하여 짧은 로딩에는 스피너를 노출하지 않는 훅**

네트워크 응답이 빠른 경우 스피너가 반짝이는 UX 문제를 방지합니다. 또한 최소 표시 시간을 보장하여 스피너가 너무 짧게 보이는 문제도 해결합니다.

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `delay` | `100ms` | 로딩 표시를 시작하기까지의 지연 시간 |
| `minDisplayDuration` | `300ms` | 로딩 표시 최소 유지 시간 |

```ts
const isDeferredLoading = useDeferredLoading(isLoading, { delay: 100, minDisplayDuration: 300 });
```

**핵심 구현 포인트**
- `delay` 이내에 로딩이 끝나면 스피너 미노출
- 노출된 스피너는 `minDisplayDuration`이 지날 때까지 유지
- 두 타이머(`delayTimer`, `minDurationTimer`)를 독립적으로 관리하여 경쟁 조건 방지

---

## 3. DOM / 브라우저 API

### `useIntersectionObserver`

**단일 요소의 뷰포트 진입/이탈을 감지하는 훅**

무한 스크롤, 이미지 지연 로딩, 스크롤 애니메이션 트리거 등에 활용합니다.

```ts
const { setContainerRef, isVisible, hasEntered, reset } = useIntersectionObserver({
  once: true,
  onEntered: (entry) => console.log('entered!'),
  threshold: 0.5,
});
```

| 반환값 | 설명 |
|---|---|
| `setContainerRef` | 컨테이너에 연결할 callback ref |
| `isVisible` | 현재 뷰포트 내 노출 여부 |
| `hasEntered` | 한 번이라도 진입한 적 있는지 여부 |
| `reset` | 관찰 상태 초기화 |

**핵심 구현 포인트**
- `once` 옵션: 최초 진입 후 자동 `unobserve` → 불필요한 관찰 비용 제거
- `targetSelector`로 컨테이너 내 특정 자식 요소만 관찰 가능
- `enable` 옵션으로 조건부 관찰 활성화/비활성화

---

### `useIntersectionObserverGroup`

**여러 요소를 하나의 `IntersectionObserver`로 그룹 감시하는 훅**

리스트 아이템 각각의 노출 여부를 key 기반으로 추적하며, `MutationObserver`와 결합하여 동적으로 추가/제거되는 요소도 자동으로 관찰합니다.

```ts
const { setContainerRef, states } = useIntersectionObserverGroup({ keyAttribute: 'data-item-key' });

// states: { 'item-1': { isVisible, hasEntered, target }, 'item-2': {...}, ... }
```

**핵심 구현 포인트**
- 단일 `IntersectionObserver` 인스턴스로 다수 요소 관찰 → 성능 효율화
- `MutationObserver`로 DOM 변경 감지 → 동적 요소 자동 등록/해제
- `reset(key?)`: 특정 key 혹은 전체 상태 초기화

---

### `useOverflow`

**컨테이너 내 자식 요소가 가로로 넘치는지 감지하는 훅**

반응형 레이아웃에서 오버플로우 메뉴(더보기 버튼) 노출 여부 결정 등에 사용합니다.

```ts
const { containerRef, isOverflow } = useOverflow();
```

**핵심 구현 포인트**
- `ResizeObserver`로 컨테이너 및 자식 크기 변화 실시간 감지
- `MutationObserver`로 자식 요소 추가/제거 감지 및 동적 관찰 등록
- `requestAnimationFrame`으로 측정 시점을 레이아웃 완료 이후로 지연 → 정확한 크기 측정
- `[data-overflow-item]` 속성 기반으로 특정 자식만 선택적 측정 가능

---

### `useFocusTrap`

**포커스를 특정 컨테이너 내부에 가두는 접근성(Accessibility) 훅**

모달, 다이얼로그, 드로어 등에서 Tab 키 탐색 시 포커스가 컨테이너 밖으로 나가지 않도록 합니다. WAI-ARIA 가이드라인의 Focus Trap 패턴을 구현합니다.

```ts
const containerRef = useFocusTrap({ initialFocusSelector: '[data-initial-focus]' });

return <div ref={containerRef}>...</div>;
```

**핵심 구현 포인트**
- `MutationObserver`로 동적으로 추가/제거되는 포커스 가능 요소 목록 실시간 갱신
- `Shift+Tab` 처리로 역방향 순환 지원
- 컨테이너 마운트 시 이전 포커스 요소 저장 → 언마운트 시 복원 (UX 유지)
- `[data-initial-focus]` 속성으로 초기 포커스 타겟 지정 가능

---

### `useRovingFocus`

**방향키로 포커스를 이동시키는 Roving Focus 패턴 훅**

툴바, 탭 목록, 그리드 등 복합 위젯에서 WAI-ARIA의 `roving tabindex` 패턴을 구현합니다. 활성 요소만 `tabIndex=0`, 나머지는 `tabIndex=-1`로 관리합니다.

```ts
const { containerRef, handleKeyDown } = useRovingFocus({
  itemSelector: '[data-roving-item]',
  orientation: 'horizontal',
  loop: true,
});
```

| 옵션 | 설명 |
|---|---|
| `orientation` | `'horizontal'` / `'vertical'` / `'both'` |
| `loop` | 끝에서 처음으로 순환 여부 |
| `colSkipCount` | 그리드 레이아웃에서 열 수 기반 상하 이동 |
| `scrollIntoView` | 포커스 이동 시 스크롤 동반 여부 |
| `enableHome` / `enableEnd` | Home / End 키 활성화 |

**핵심 구현 포인트**
- `MutationObserver`로 아이템 목록 동기화 → 동적 렌더링 대응
- `focusin` 이벤트로 마우스 클릭 등 외부 포커스 변경도 동기화
- disabled 요소를 건너뛰는 탐색 알고리즘 구현
- `onNavigate`, `onUnderflow`, `onOverflow` 콜백으로 확장 가능

---

## 4. 스토리지

### `useBrowserStorage` / `useLocalStorage` / `useSessionStorage`

**`localStorage` / `sessionStorage`를 React 상태처럼 다루는 훅 패밀리**

직렬화/역직렬화, TTL(만료 시간), 탭 간 동기화(`storage` 이벤트)를 지원합니다.

```ts
// localStorage 사용 (탭 간 동기화 포함)
const { value, dispatch } = useLocalStorage({
  key: 'theme',
  defaultValue: 'light',
  subscribe: true, // 다른 탭에서의 변경도 반영
});

// TTL 적용
const { value, dispatch } = useLocalStorageWithTTL({
  key: 'session-token',
  defaultValue: null,
  ttl: 1000 * 60 * 30, // 30분
});
```

**핵심 구현 포인트**
- 커스텀 `serialize` / `deserialize` 함수 주입 가능 → JSON 외 포맷 대응
- TTL 래퍼(`withTTL`)를 적용하여 만료 시간 기반 자동 무효화
- `useLocalStorage`는 `storage` 이벤트 구독으로 다른 탭의 변경 사항 동기화
- `useBrowserStorage` → `useLocalStorage` / `useSessionStorage` 계층 구조로 공통 로직 재사용

---

### `useSnooze`

**"다시 보지 않기" · "나중에 다시 알림" 기능을 위한 훅**

팝업, 공지, 배너 등을 일정 기간 동안 숨기는 스누즈 기능을 제공합니다.

```ts
const [isActive, snooze] = useSnooze({
  key: 'notice-banner',
  duration: 'day',           // 'day' 또는 ms 단위 숫자
  storageType: 'local',
  autoReactivate: true,      // 기간 만료 시 자동 재활성화
});
```

**핵심 구현 포인트**
- `localStorage` / `sessionStorage` 선택 가능
- 스누즈 만료 시간을 스토리지에 저장 → 페이지 새로고침 후에도 유지
- `autoReactivate: true` 시 `setTimeout`으로 만료 시점에 자동 상태 복원

---

## 5. Ref 유틸리티

### `useLatestRef`

**항상 최신 값을 가리키는 ref를 반환하는 유틸리티 훅**

이벤트 핸들러나 콜백 내부에서 stale closure 문제를 방지하기 위해 사용합니다.

```ts
const latestOnChange = useLatestRef(onChange);

// 이벤트 핸들러에서 항상 최신 onChange 호출
const handler = useCallback(() => {
  latestOnChange.current?.();
}, []); // 의존성 배열 불필요
```

**핵심 구현 포인트**
- `useLayoutEffect`를 사용하여 렌더링 직후, 브라우저 페인트 이전에 ref 갱신
- 의존성 배열 없이 콜백을 메모이제이션할 수 있게 해주는 기반 훅

---

### `usePrevRef`

**직전 렌더링의 값을 ref로 반환하는 유틸리티 훅**

값이 변경되기 전 이전 값과 비교하거나 애니메이션 방향 결정 등에 사용합니다.

```ts
const prevPage = usePrevRef(currentPage);

// prevPage.current: 이전 페이지 번호
// currentPage: 현재 페이지 번호
```

**핵심 구현 포인트**
- `useEffect`의 cleanup 함수에서 값 업데이트 → 다음 렌더링 시작 전에 이전 값 보존

---

### `useComposeRef`

**여러 개의 ref를 하나의 callback ref로 합성하는 훅**

외부에서 주입받은 ref와 내부에서 사용하는 ref를 동시에 연결해야 하는 컴포넌트 라이브러리 개발 시 필수적입니다.

```ts
const internalRef = useRef<HTMLDivElement>(null);

// 외부 ref와 내부 ref를 동시에 연결
const composedRef = useComposedRefs(internalRef, externalRef);

return <div ref={composedRef} />;
```

**핵심 구현 포인트**
- `RefObject`, `MutableRefObject`, callback ref, `null` 등 모든 ref 타입 지원
- React 19의 callback ref cleanup 반환값 처리
- cleanup이 있는 경우 각 ref의 cleanup 함수 실행, 없는 경우 `null`로 초기화

---

## 기술 스택 및 설계 원칙

- **언어**: TypeScript (strict 모드)
- **환경**: React 18+, React 19 호환
- **패키지 구조**: 모노레포 (각 hook이 독립 npm 패키지)
- **접근성**: WAI-ARIA 가이드라인 기반 (FocusTrap, RovingFocus)

### 공통 설계 원칙

| 원칙 | 적용 방식 |
|---|---|
| **Stale Closure 방지** | `useLatestRef`로 콜백 최신 참조 유지 |
| **메모리 누수 방지** | Observer, 이벤트 리스너, 타이머 언마운트 시 자동 정리 |
| **제어/비제어 통합** | `useControllableState` 기반 상태 관리 |
| **성능 최적화** | `useCallback`, `useMemo`, `requestAnimationFrame` 활용 |
| **타입 안전성** | 제네릭과 유니온 타입으로 강한 타입 추론 지원 |
