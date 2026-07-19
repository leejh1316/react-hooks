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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "키보드 내비게이션",
        "roving tabindex", "방향키 이동", "메뉴/탭/그리드 접근성" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 옵션별
        동작, disabled 스킵 기준, 위젯 패턴별(메뉴·탭·그리드) 권장 조합과 WAI-ARIA 접근성 체크리스트를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-roving-focus/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-roving-focus SKILL.md 원문 (훅 변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-roving-focus
description: >
  React에서 roving tabindex 키보드 내비게이션을 구현할 때 사용하는 훅이에요.
  메뉴, 탭, 툴바, 그리드, 리스트박스처럼 여러 항목으로 이루어진 위젯에 방향키 이동을 붙여야 할 때 반드시 이 스킬을 참고하세요.
  "키보드 내비게이션", "roving tabindex", "방향키 이동", "화살표 키 포커스", "탭 접근성", "그리드 내비게이션" 등의 키워드가 나오면 이 스킬을 사용하세요.
  WAI-ARIA 접근성 가이드라인 준수가 필요한 컴포넌트 작업에도 적극적으로 활용하세요.
---

# use-roving-focus

WAI-ARIA roving tabindex 패턴을 구현한 React 커스텀 훅이에요.
활성 아이템 하나만 tabIndex 0을 갖고 나머지는 -1로 관리되어 그룹 전체가 하나의 Tab 스톱이 되고,
그룹 내부 이동은 방향키 / Home / End 키로 해요.
MutationObserver로 아이템 추가/제거를 감지해 목록과 tabIndex를 자동 갱신하고,
focusin 이벤트로 마우스 클릭 등 외부 포커스 이동도 활성 인덱스에 반영해요.

---

## 훅 시그니처

\`\`\`typescript
function useRovingFocus(options?: RovingFocusOptions): {
  containerRef: (node: HTMLElement | null) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
};

type RovingFocusOptions = {
  itemSelector?: string; // 아이템 CSS 선택자 (기본값: "[data-roving-item]")
  orientation?: "horizontal" | "vertical" | "both"; // 방향키 축 (기본값: "both")
  loop?: boolean; // 경계에서 순환 (기본값: false)
  colSkipCount?: number; // 그리드 열 수 — ↑/↓ 점프 폭 (기본값: 0)
  initialIndex?: number; // 초기 활성 인덱스 (기본값: 0, 마운트 시점에만 적용)
  clickOnNavigate?: boolean; // 이동 즉시 click() 호출 (기본값: false)
  scrollIntoView?: boolean | ScrollIntoViewOptions; // 자동 스크롤 (기본값: false)
  enableHome?: boolean; // Home 키 사용 (기본값: true)
  enableEnd?: boolean; // End 키 사용 (기본값: true)
  onNavigate?: (detail: NavigationDetail) => void; // 이동 성공 시 호출
  onUnderflow?: () => void; // loop: false에서 첫 아이템 경계 도달 시
  onOverflow?: () => void; // loop: false에서 마지막 아이템 경계 도달 시
};

interface NavigationDetail {
  activeIndex: number; // 새 활성 아이템 인덱스
  activeElement: HTMLElement; // 포커스된 아이템 요소
  direction: Direction; // "up" | "down" | "left" | "right" | "home" | "end"
  event: React.KeyboardEvent; // 원본 키보드 이벤트
}
\`\`\`

**containerRef(callback ref)와 handleKeyDown을 모두 컨테이너에 연결**하고,
각 아이템에 \`data-roving-item\` 속성(또는 커스텀 \`itemSelector\`)을 추가하세요.

---

## 기본 사용 예시

\`\`\`tsx
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function Menu() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical",
    loop: true,
  });

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="menu">
      <button data-roving-item role="menuitem">홈</button>
      <button data-roving-item role="menuitem">검색</button>
      {/* disabled 항목은 방향키 이동 시 자동으로 건너뛰어요 */}
      <button data-roving-item role="menuitem" disabled>알림</button>
      <button data-roving-item role="menuitem">설정</button>
    </div>
  );
}
\`\`\`

---

## 위젯 패턴별 권장 옵션 조합

| 패턴                  | 권장 옵션                                                     |
| --------------------- | ------------------------------------------------------------- |
| 세로 메뉴 / 리스트    | \`orientation: "vertical"\`, \`loop: true\`                       |
| 가로 툴바             | \`orientation: "horizontal"\`, \`loop: false\`                    |
| 탭 (자동 활성화)      | \`orientation: "horizontal"\`, \`loop: true\`, \`clickOnNavigate: true\` |
| 그리드 (N열)          | \`colSkipCount: N\`, \`loop: true\`                               |
| 스크롤 리스트박스     | \`orientation: "vertical"\`, \`scrollIntoView: { block: "nearest" }\` |

---

## 주요 동작

| 동작                 | 설명                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| **Roving tabindex**  | 활성 아이템만 tabIndex 0, 나머지 -1 → 그룹 전체가 하나의 Tab 스톱             |
| **방향키 이동**      | orientation 축의 방향키만 가로챔. colSkipCount > 0이면 ↑/↓가 열 수만큼 점프   |
| **disabled 스킵**    | disabled / aria-disabled="true" / aria-hidden="true" / hidden 아이템 건너뜀   |
| **Home / End**       | 첫 / 마지막 활성 아이템으로 즉시 이동 (enableHome / enableEnd로 끄기 가능)    |
| **경계 처리**        | loop: true면 순환, false면 멈추고 onUnderflow / onOverflow 호출               |
| **동적 아이템 감지** | MutationObserver(childList, subtree)로 아이템 목록·tabIndex 자동 갱신         |
| **외부 포커스 동기화** | focusin 이벤트로 마우스 클릭에 의한 포커스 이동도 활성 인덱스에 반영        |
| **입력 요소 보호**   | INPUT / TEXTAREA / contentEditable에서 발생한 방향키 이벤트는 가로채지 않음   |

---

## 주의사항 및 엣지 케이스

### 1. containerRef와 handleKeyDown을 모두 연결

\`\`\`tsx
// ✅ 두 바인딩 모두 필요해요
<div ref={containerRef} onKeyDown={handleKeyDown}>

// ❌ ref만 연결하면 tabIndex는 관리되지만 방향키가 동작하지 않아요
<div ref={containerRef}>
\`\`\`

### 2. initialIndex는 비제어 옵션

마운트 시점에만 적용돼요. 이후 값을 바꿔도 활성 인덱스는 갱신되지 않아요(의도된 동작).
활성 아이템을 외부에서 제어해야 하면 focus()를 직접 호출하세요.

### 3. 그리드에서 colSkipCount는 실제 열 수와 일치시키기

CSS 그리드의 열 수와 \`colSkipCount\`가 다르면 ↑/↓ 이동이 시각적 배치와 어긋나요.
반응형으로 열 수가 바뀌는 그리드라면 현재 열 수를 상태로 관리해 함께 갱신하세요.

### 4. 아이템 내부에 input이 있는 경우

포커스가 INPUT / TEXTAREA / contentEditable에 있으면 방향키를 가로채지 않아요.
커서 이동 등 기본 동작이 유지되므로 별도 처리가 필요 없어요.

### 5. 경계 콜백은 loop: false일 때만

\`loop: true\`면 경계에서 순환하므로 onUnderflow / onOverflow가 호출되지 않아요.

### 6. 모든 아이템이 disabled인 경우

이동 가능한 아이템을 찾지 못하면 포커스를 이동하지 않고 콜백도 호출하지 않아요.

---

## 접근성 체크리스트

roving tabindex를 올바르게 사용하려면 컴포넌트 레벨에서도 다음을 함께 구현해야 해요:

- [ ] 컨테이너에 적절한 role 지정 (\`menu\` / \`tablist\` / \`toolbar\` / \`grid\` / \`listbox\`)
- [ ] 아이템에 대응하는 role 지정 (\`menuitem\` / \`tab\` / \`gridcell\` / \`option\`)
- [ ] 탭 패턴이라면 \`aria-selected\`로 선택 상태 표시
- [ ] 선택과 포커스가 분리된 패턴(수동 활성화)이라면 Enter / Space 처리 추가 (이 훅의 범위 밖)
- [ ] 컨테이너에 \`aria-label\` 또는 \`aria-labelledby\`로 이름 제공
`;

export default SkillSection;
