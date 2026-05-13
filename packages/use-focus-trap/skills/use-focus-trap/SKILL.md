---
name: use-focus-trap
description: >
  React에서 포커스 트랩(Focus Trap)을 구현할 때 사용하는 훅입니다.
  모달, 다이얼로그, 드로어, 팝오버 등 특정 컨테이너 내부로 키보드 포커스를 가두어야 할 때 반드시 이 스킬을 참고하세요.
  "포커스 트랩", "모달 접근성", "Tab 순환", "키보드 내비게이션", "aria 포커스 관리" 등의 키워드가 나오면 이 스킬을 사용하세요.
  WAI-ARIA 접근성 가이드라인 준수가 필요한 컴포넌트 작업에도 적극적으로 활용하세요.
---

# use-focus-trap

특정 컨테이너(예: 모달, 다이얼로그) 내에서 Tab / Shift+Tab 포커스가 순환하도록 하는 React 커스텀 훅입니다.
DOM 변화를 MutationObserver로 감지하여 포커스 가능한 요소 목록을 동적으로 유지하며, 언마운트 시 이전 포커스를 자동 복원합니다.

---

## 훅 시그니처

```typescript
function useFocusTrap(options?: FocusTrapOptions): (node: HTMLElement | null) => void;

type FocusTrapOptions = {
  initialFocusSelector?: string; // 초기 포커스 대상 CSS 선택자 (기본값: "[data-initial-focus]")
};
```

반환값은 **callback ref** 입니다. `ref={containerRef}` 형태로 컨테이너 엘리먼트에 연결하세요.

---

## 주요 동작

| 동작               | 설명                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **초기 포커스**    | `initialFocusSelector`에 매칭되는 요소 → 없으면 첫 번째 포커스 가능 요소 → 없으면 컨테이너 자체 |
| **Tab 순환**       | 마지막 요소에서 Tab → 첫 번째 요소로 이동                                                       |
| **Shift+Tab 순환** | 첫 번째 요소에서 Shift+Tab → 마지막 요소로 이동                                                 |
| **동적 DOM 감지**  | `MutationObserver`로 포커스 가능 요소 목록 자동 갱신                                            |
| **포커스 복원**    | 컨테이너 언마운트 시, 트랩 진입 전 포커스 위치로 자동 복원                                      |

---

## 기본 사용 예시

```tsx
import { useFocusTrap } from "./useFocusTrap";

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const containerRef = useFocusTrap();

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" ref={containerRef}>
      <h2>모달 제목</h2>
      <input type="text" placeholder="입력" />
      <button onClick={onClose}>닫기</button>
    </div>
  );
}
```

---

## 초기 포커스 커스터마이징

### 방법 1: `data-initial-focus` 속성 (기본값)

```tsx
<div ref={containerRef}>
  <input type="text" />
  <button data-initial-focus>여기에 먼저 포커스</button>
</div>
```

### 방법 2: `initialFocusSelector` 옵션

```tsx
const containerRef = useFocusTrap({ initialFocusSelector: "#confirm-button" });

<div ref={containerRef}>
  <input type="text" />
  <button id="confirm-button">확인</button>
</div>;
```

---

## 포커스 가능 요소 기준

**1단계 셀렉터 쿼리 → 2단계 JS 필터** 두 단계로 동작합니다.

### 1단계: CSS 셀렉터 (`querySelectorAll`)

모든 셀렉터에 `:not([tabindex="-1"])`가 포함되어 있습니다.

| 셀렉터                               | 비고                                          |
| ------------------------------------ | --------------------------------------------- |
| `a[href]`                            | href 있는 링크                                |
| `button`                             | `disabled` 없음                               |
| `input`, `textarea`, `select`        | `disabled` 없음 (모든 type 포함)              |
| `input[type="range/checkbox/radio"]` | `disabled` 없음 (`input`과 중복, 명시적 포함) |
| `[contenteditable]`                  | `contenteditable="false"` 제외                |
| `details > summary`                  | details 자체에 `tabindex="-1"` 없어야 함      |
| `details:not(:has(> summary))`       | summary 없는 details 자체, 동일 조건          |
| `[tabindex]`                         | 양수 및 `0` 포함                              |

### 2단계: JS 필터

셀렉터를 통과한 요소를 아래 조건으로 추가 필터링합니다.
모두 **자신뿐 아니라 조상 요소까지** `closest()`로 확인합니다.

| 조건                   | 설명                                              |
| ---------------------- | ------------------------------------------------- |
| `[inert]`              | 자신 또는 조상에 `inert` 속성 있으면 제외         |
| `[aria-hidden="true"]` | 자신 또는 조상에 `aria-hidden="true"` 있으면 제외 |
| `[hidden]`             | 자신 또는 조상에 `hidden` 속성 있으면 제외        |
| `display: none`        | `getComputedStyle` 기준, 계산된 스타일로 판단     |
| `visibility: hidden`   | 동일, `getComputedStyle` 기준                     |
| `aria-disabled="true"` | 자신에 `aria-disabled="true"` 있으면 제외         |

---

## MutationObserver 감시 속성

다음 속성 변화 시 포커스 가능 요소 목록이 자동으로 갱신됩니다:

- `disabled`
- `aria-hidden`
- `aria-disabled`
- `hidden`
- `inert`
- `tabindex`
- 자식 노드 추가/제거 (`childList`, `subtree`)

---

## 주의사항 및 엣지 케이스

### 1. 조건부 렌더링 패턴

```tsx
// ✅ 권장: 컨테이너 자체를 조건부 렌더링
{
  isOpen && <div ref={containerRef}>...</div>;
}

// ⚠️ 주의: display:none은 포커스 트랩이 해제되지 않음
// 반드시 DOM에서 제거하거나 null을 반환하세요.
```

### 2. 포커스 가능 요소가 없는 경우

컨테이너 내에 포커스 가능한 요소가 전혀 없으면 컨테이너 자체(`node`)에 포커스됩니다.
컨테이너에 `tabindex="-1"` 또는 `tabindex="0"`을 추가해 두는 것을 권장합니다.

```tsx
<div ref={containerRef} tabIndex={-1} role="dialog">
  {/* 포커스 가능 요소가 동적으로 로드되는 경우 */}
</div>
```

### 3. 중첩 포커스 트랩

중첩 모달 등 여러 트랩이 동시에 활성화되면 의도치 않은 동작이 발생할 수 있습니다.
중첩이 필요한 경우, 부모 트랩을 먼저 비활성화(언마운트)하거나 별도의 스택 관리 로직을 추가하세요.

### 4. Portal과 함께 사용

`createPortal`로 렌더링된 컴포넌트도 동일하게 동작합니다. `ref`가 실제 DOM 노드를 가리키므로 Portal 여부와 무관합니다.

```tsx
createPortal(
  <div ref={containerRef} role="dialog">
    ...
  </div>,
  document.body,
);
```

### 5. 애니메이션 / 지연 렌더링

컨테이너가 마운트될 때 내부 요소가 아직 렌더링되지 않았다면, `MutationObserver`가 이후 추가된 요소를 자동 감지합니다.
단, 초기 포커스는 마운트 시점의 요소를 기준으로 설정되므로 필요 시 `initialFocusSelector`로 명시적으로 지정하세요.

---

## 접근성 체크리스트

포커스 트랩을 올바르게 사용하려면 컴포넌트 레벨에서도 다음을 함께 구현해야 합니다:

- [ ] `role="dialog"` 또는 `role="alertdialog"` 지정
- [ ] `aria-modal="true"` 지정
- [ ] `aria-labelledby` 또는 `aria-label`로 제목 연결
- [ ] `Escape` 키로 닫기 기능 구현 (이 훅의 범위 밖)
- [ ] 닫기 버튼 제공
- [ ] 배경 스크롤 잠금 (`overflow: hidden`) 고려

---
