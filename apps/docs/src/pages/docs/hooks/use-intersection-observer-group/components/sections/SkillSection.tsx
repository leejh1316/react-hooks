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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "여러 요소 관찰", "스크롤
        스파이", "리스트 아이템 진입 감지", "요소별 노출 트래킹" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 키 기반
        상태 맵 사용법, 동적 리스트 자동 감지, once/reset(key) 조합 등을 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-intersection-observer-group/SKILL.md</InlineCode> 경로에
        저장하면 에이전트가 자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** packages/use-intersection-observer/skills/use-intersection-observer-group/SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-intersection-observer-group
description: >
  React 프로젝트에서 \`useIntersectionObserverGroup\` 훅을 사용하는 코드를 작성할 때 반드시 이 스킬을 참조하라.
  여러 요소의 뷰포트 진입/이탈을 하나의 컨테이너 기준으로 한꺼번에 관찰하는 그룹 Intersection Observer 훅이다.
  스크롤 애니메이션, 무한 스크롤, 요소별 노출 트래킹, 리스트 아이템 진입 감지 등을 구현할 때 트리거된다.
  단일 요소 관찰이 아닌 "컨테이너 안의 여러 요소"를 키(key) 기반으로 추적해야 할 때 우선적으로 사용하라.
---

# useIntersectionObserverGroup

컨테이너 하나를 루트로 삼아, 그 안의 여러 자식 요소들의 뷰포트 진입/이탈 상태를 **키(key) 기반**으로 한꺼번에 관리하는 훅이다.
내부적으로 \`IntersectionObserver\`와 \`MutationObserver\`를 조합해, 동적으로 추가/제거되는 DOM 요소도 자동으로 감시한다.

---

## API

### 시그니처

\`\`\`ts
function useIntersectionObserverGroup(options?: IntersectionGroupOption): {
  setContainerRef: RefCallback<HTMLElement>;
  states: GroupStates;
  reset: (key?: string) => void;
};
\`\`\`

### 옵션 (\`IntersectionGroupOption\`)

| 옵션           | 타입                                   | 기본값                    | 설명                                                                                           |
| -------------- | -------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| \`root\`         | \`Element \\| "container" \\| null\`       | \`null\`                    | 뷰포트 기준 요소. \`"container"\` 전달 시 \`setContainerRef\`로 등록된 컨테이너 자체가 루트가 된다 |
| \`rootMargin\`   | \`string\`                               | \`"0px"\`                   | 루트 기준 여백 (CSS margin 형식)                                                               |
| \`threshold\`    | \`number \\| number[]\`                   | \`0\`                       | 요소가 얼마나 보여야 진입으로 판단할지 (0~1)                                                   |
| \`once\`         | \`boolean\`                              | \`false\`                   | \`true\`이면 진입 후 더 이상 관찰하지 않음                                                       |
| \`keyAttribute\` | \`string\`                               | \`"data-intersection-key"\` | 자식 요소에서 키를 읽어올 HTML 속성명                                                          |
| \`onEntered\`    | \`(key, entry, observer) => void\`       | -                         | 요소가 뷰포트에 진입했을 때 호출                                                               |
| \`onExited\`     | \`(key, entry, observer) => void\`       | -                         | 요소가 뷰포트에서 이탈했을 때 호출                                                             |
| \`onChange\`     | \`(key, type, entry, observer) => void\` | -                         | 진입/이탈 모두 감지하는 통합 콜백                                                              |

### 반환값

| 반환값            | 타입                                                                              | 설명                                            |
| ----------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| \`setContainerRef\` | \`RefCallback<HTMLElement>\`                                                        | 컨테이너 요소에 연결할 ref 콜백                 |
| \`states\`          | \`Record<string, { isVisible: boolean; hasEntered: boolean; target: Element \\| null }>\` | 각 키별 현재 상태                               |
| \`reset\`           | \`(key?: string) => void\`                                                          | 특정 키 또는 전체 상태를 초기화하고 재관찰 시작 |

#### \`states\` 상태 필드

| 필드         | 타입              | 설명                                                              |
| ------------ | ----------------- | ----------------------------------------------------------------- |
| \`isVisible\`  | \`boolean\`         | 현재 뷰포트에 보이고 있는지 여부                                  |
| \`hasEntered\` | \`boolean\`         | 한 번이라도 진입한 적이 있는지 여부                               |
| \`target\`     | \`Element \\| null\` | 실제로 관찰 중인 DOM 엘리먼트. 최초 교차 이벤트 이전에는 \`null\`   |

---

## 기본 사용 패턴

자식 요소에 \`data-intersection-key\` 속성으로 키를 지정하고,
컨테이너 요소에 \`setContainerRef\`를 연결한다.

\`\`\`tsx
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

function AnimatedList() {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    threshold: 0.2,
    once: true, // 한 번 진입 후 관찰 중단
  });

  const items = ["apple", "banana", "cherry"];

  return (
    <ul ref={setContainerRef}>
      {items.map((item) => (
        <li
          key={item}
          data-intersection-key={item}
          style={{
            opacity: states[item]?.isVisible ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

---

## 자주 쓰는 패턴

### 1. 스크롤 진입 애니메이션 (once)

\`\`\`tsx
const { setContainerRef, states } = useIntersectionObserverGroup({
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
  once: true,
});

// 자식 요소
<div data-intersection-key="hero-section" className={states["hero-section"]?.hasEntered ? "animate-in" : ""} />;
\`\`\`

### 2. 노출 트래킹 (콜백 방식)

\`\`\`tsx
useIntersectionObserverGroup({
  onEntered: (key, entry) => {
    analytics.track("impression", { section: key });
  },
  onExited: (key) => {
    analytics.track("exit", { section: key });
  },
});
\`\`\`

### 3. 컨테이너 자체를 스크롤 루트로 사용

\`\`\`tsx
// 모달, 사이드바 등 내부 스크롤 영역에서 사용할 때
const { setContainerRef, states } = useIntersectionObserverGroup({
  root: "container", // setContainerRef가 붙은 요소 자체가 루트
  threshold: 0.5,
});
\`\`\`

### 4. 커스텀 키 속성명 사용

\`\`\`tsx
const { setContainerRef, states } = useIntersectionObserverGroup({
  keyAttribute: "data-section-id", // 기본값인 "data-intersection-key" 대신 사용
});

// 자식 요소
<section data-section-id="intro">...</section>;
\`\`\`

### 5. 동적 리스트 (아이템 추가/제거 자동 감지)

MutationObserver가 내장되어 있어 별도 처리 없이 동작한다.

\`\`\`tsx
function DynamicList({ items }: { items: string[] }) {
  const { setContainerRef, states } = useIntersectionObserverGroup({ once: true });

  return (
    <div ref={setContainerRef}>
      {items.map((id) => (
        <Card key={id} data-intersection-key={id} visible={states[id]?.isVisible} />
      ))}
    </div>
  );
}
\`\`\`

### 6. 특정 아이템만 reset

\`\`\`tsx
const { setContainerRef, states, reset } = useIntersectionObserverGroup({ once: true });

// 특정 키만 초기화하고 다시 관찰
reset("hero-section");

// 전체 초기화
reset();
\`\`\`

### 7. target — DOM 엘리먼트 직접 접근

\`\`\`tsx
function ScrollableMenu() {
  const { setContainerRef, states } = useIntersectionObserverGroup();

  const scrollToSection = (key: string) => {
    states[key]?.target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <nav>
        {["intro", "features", "usage"].map((key) => (
          <button key={key} onClick={() => scrollToSection(key)} disabled={!states[key]?.target}>
            {key}
          </button>
        ))}
      </nav>
      <div ref={setContainerRef}>
        <section data-intersection-key="intro">...</section>
        <section data-intersection-key="features">...</section>
        <section data-intersection-key="usage">...</section>
      </div>
    </div>
  );
}
\`\`\`

> \`states[key]?.target\`은 해당 키의 최초 교차 이벤트 이후부터 DOM 엘리먼트를 가리킵니다.  
> 그 전에는 \`undefined\` 또는 \`null\`이므로 옵셔널 체이닝(\`states[key]?.target?.\`)을 사용하세요.

---

## 주의사항 및 엣지 케이스

### ⚠ \`keyAttribute\` 속성이 없는 요소

관찰 대상 요소에 \`data-intersection-key\` (또는 \`keyAttribute\`로 지정한 속성)이 없으면 콘솔에 경고가 출력되고 해당 요소는 무시된다.

\`\`\`tsx
// 잘못된 예 — 속성 누락
<div>관찰 안 됨</div>

// 올바른 예
<div data-intersection-key="section-1">관찰됨</div>
\`\`\`

### ⚠ \`setContainerRef\`는 \`ref\` prop에만 전달

\`RefCallback\` 타입이므로 \`useRef\`와 합성하려면 별도 처리가 필요하다.

\`\`\`tsx
// 직접 사용 (권장)
<div ref={setContainerRef}>...</div>;

// 다른 ref와 함께 써야 할 경우
const combinedRef = useCallback(
  (node: HTMLElement | null) => {
    setContainerRef(node);
    myRef.current = node;
  },
  [setContainerRef],
);
\`\`\`

### ⚠ \`reset\`은 컨테이너가 마운트된 이후에 호출

컨테이너가 없으면 콘솔 경고와 함께 early return된다. \`useEffect\` 내부 또는 이벤트 핸들러에서 사용할 것.

### ⚠ \`once: true\`와 \`reset\` 조합

\`once: true\` 상태에서 \`reset(key)\`를 호출하면 해당 키의 \`isTriggeredOnce\` 플래그가 초기화되어 다시 한 번 관찰이 가능해진다. 의도적인 재노출 로직에 활용할 수 있다.

---

## TypeScript 타입 참고

\`\`\`ts
type TargetState = {
  isVisible: boolean;
  hasEntered: boolean;
  target: Element | null;
};

type GroupStates = Record<string, TargetState>;
\`\`\`

\`states[key]\`는 해당 키가 아직 한 번도 관찰되지 않았다면 \`undefined\`일 수 있다. 옵셔널 체이닝(\`states[key]?.isVisible\`)을 항상 사용하라.
`;

export default SkillSection;
