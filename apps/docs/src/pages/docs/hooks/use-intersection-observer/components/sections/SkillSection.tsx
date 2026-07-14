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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "뷰포트에 들어올 때",
        "스크롤 감지", "Intersection Observer", "화면에 보일 때 실행", "요소 노출 감지" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해
        훅 시그니처, 타깃 지정 우선순위, once/reset/enable 동작, root: "container" 사용 조건 등을 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-intersection-observer/SKILL.md</InlineCode> 경로에 저장하면
        에이전트가 자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** packages/use-intersection-observer/skills/use-intersection-observer/SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-intersection-observer
description: >
  React 커스텀 훅 \`useIntersectionObserver\`의 사용법과 API를 설명하는 스킬.
  컴포넌트의 뷰포트 진입/이탈 감지, 스크롤 애니메이션 트리거, 무한 스크롤, lazy loading,
  요소 가시성 추적이 필요할 때 이 스킬을 참고하세요. "뷰포트에 들어올 때", "스크롤 감지",
  "Intersection Observer", "화면에 보일 때 실행", "요소 노출 감지" 같은 요구가 있으면
  반드시 이 스킬을 활용하세요.
---

# use-intersection-observer

\`IntersectionObserver\` API를 React 훅으로 감싼 유틸리티입니다.  
컨테이너 ref 하나만 연결하면 내부 타깃 요소의 뷰포트 진입·이탈을 감지합니다.

---

## 기본 시그니처

\`\`\`ts
function useIntersectionObserver(options?: IntersectionObserverOption): {
  setContainerRef: RefCallback<HTMLElement>;
  reset: () => void;
  isVisible: boolean;
  hasEntered: boolean;
  target: Element | null;
};
\`\`\`

---

## 옵션 (IntersectionObserverOption)

| 옵션             | 타입                              | 기본값                         | 설명                                                                                                    |
| ---------------- | --------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| \`root\`           | \`Element \\| "container" \\| null\`  | \`null\`                         | 교차 기준 루트. \`"container"\`로 설정하면 컨테이너 자신이 루트가 됩니다.                                 |
| \`rootMargin\`     | \`string\`                          | —                              | 루트 여백 (CSS margin 형식, 예: \`"0px 0px -100px 0px"\`)                                                 |
| \`threshold\`      | \`number \\| number[]\`              | —                              | 교차 비율 임계값 (0.0 ~ 1.0)                                                                            |
| \`once\`           | \`boolean\`                         | \`false\`                        | \`true\`이면 최초 진입 후 관찰을 중단합니다.                                                              |
| \`targetSelector\` | \`string\`                          | \`"[data-intersection-target]"\` | 컨테이너 내에서 관찰할 요소를 찾는 CSS 셀렉터. 해당하는 요소가 없으면 \`firstElementChild\`를 사용합니다. |
| \`onEntered\`      | \`(entry, observer) => void\`       | —                              | 요소가 뷰포트에 **진입**할 때 호출됩니다.                                                               |
| \`onExited\`       | \`(entry, observer) => void\`       | —                              | 요소가 뷰포트에서 **이탈**할 때 호출됩니다.                                                             |
| \`onChange\`       | \`(type, entry, observer) => void\` | —                              | 진입·이탈 모두에서 호출됩니다. \`type\`은 \`"enter"\` 또는 \`"exit"\`.                                        |

---

## 반환값

| 값                | 타입                       | 설명                                                                                 |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| \`setContainerRef\` | \`RefCallback<HTMLElement>\` | 관찰을 시작할 컨테이너 엘리먼트에 연결하는 ref 콜백                                  |
| \`isVisible\`       | \`boolean\`                  | 타깃이 현재 뷰포트 안에 있으면 \`true\`                                                |
| \`hasEntered\`      | \`boolean\`                  | 타깃이 한 번이라도 뷰포트에 진입한 적이 있으면 \`true\`                                |
| \`target\`          | \`Element \\| null\`          | 실제로 관찰 중인 DOM 엘리먼트. 최초 교차 이벤트 이전에는 \`null\`                      |
| \`reset\`           | \`() => void\`               | 관찰 상태를 초기화하고 다시 관찰을 시작합니다. \`once: true\`와 함께 쓸 때 유용합니다. |

---

## 타깃 지정 방식 (우선순위)

1. \`targetSelector\`에 매칭되는 요소가 **1개 이상** → 첫 번째 요소를 관찰
2. 매칭되는 요소가 없음 → 컨테이너의 \`firstElementChild\`를 관찰
3. 둘 다 없으면 \`console.warn\` 후 조기 반환 (관찰하지 않음)

> ⚠️ 셀렉터에 매칭되는 요소가 **2개 이상**이면 개발 환경에서 경고가 출력됩니다.

---

## 사용 예시

### 1. 기본 — 요소 가시성 감지

\`\`\`tsx
import { useIntersectionObserver } from "@leejaehyeok/useIntersectionObserver";

function FadeInSection() {
  const { setContainerRef, isVisible } = useIntersectionObserver();

  return (
    <div ref={setContainerRef} style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s" }}>
      <p>뷰포트에 진입하면 나타납니다.</p>
    </div>
  );
}
\`\`\`

> 타깃 셀렉터 미설정 시 \`firstElementChild\`(\`<p>\`)를 자동으로 관찰합니다.

---

### 2. once — 최초 진입 후 애니메이션 고정

\`\`\`tsx
function AnimatedCard() {
  const { setContainerRef, hasEntered } = useIntersectionObserver({ once: true });

  return (
    <div ref={setContainerRef}>
      <div className={hasEntered ? "slide-in" : "hidden"}>한 번만 애니메이션됩니다.</div>
    </div>
  );
}
\`\`\`

---

### 3. targetSelector — 특정 자식 요소 관찰

\`\`\`tsx
function CardList() {
  const { setContainerRef, isVisible } = useIntersectionObserver({
    targetSelector: ".observe-target",
    threshold: 0.5,
  });

  return (
    <div ref={setContainerRef}>
      <header>헤더 (관찰 안 함)</header>
      <main className="observe-target">{isVisible ? "보임" : "안 보임"}</main>
    </div>
  );
}
\`\`\`

---

### 4. 콜백 — 진입/이탈 시 사이드 이펙트

\`\`\`tsx
function TrackableSection() {
  const { setContainerRef } = useIntersectionObserver({
    onEntered: (entry) => {
      analytics.track("section_visible", { id: entry.target.id });
    },
    onExited: () => {
      console.log("섹션이 화면에서 사라졌습니다.");
    },
  });

  return (
    <section ref={setContainerRef} id="promo-banner">
      ...
    </section>
  );
}
\`\`\`

---

### 5. root: "container" — 컨테이너 기준 교차 감지

\`\`\`tsx
function ScrollableList() {
  const { setContainerRef, isVisible } = useIntersectionObserver({
    root: "container", // 컨테이너 자신이 스크롤 루트
    rootMargin: "0px",
    threshold: 1.0,
    targetSelector: ".last-item",
  });

  return (
    <div ref={setContainerRef} style={{ overflowY: "scroll", height: 300 }}>
      {items.map((item, i) => (
        <div key={item.id} className={i === items.length - 1 ? "last-item" : ""}>
          {item.name}
        </div>
      ))}
      {isVisible && <span>마지막 항목 도달 — 다음 페이지 로드</span>}
    </div>
  );
}
\`\`\`

---

### 6. reset — 관찰 재시작

\`\`\`tsx
function ReplayAnimation() {
  const { setContainerRef, hasEntered, reset } = useIntersectionObserver({ once: true });

  return (
    <div>
      <div ref={setContainerRef}>
        <div className={hasEntered ? "animate" : ""}> 콘텐츠 </div>
      </div>
      <button onClick={reset}>다시 재생</button>
    </div>
  );
}
\`\`\`

---

### 7. target — DOM 엘리먼트 직접 접근

\`\`\`tsx
function ScrollToTarget() {
  const { setContainerRef, target } = useIntersectionObserver();

  return (
    <div>
      <button onClick={() => target?.scrollIntoView({ behavior: "smooth", block: "center" })} disabled={!target}>
        대상으로 이동
      </button>
      <div ref={setContainerRef}>
        <div data-intersection-target>관찰 대상</div>
      </div>
    </div>
  );
}
\`\`\`

> \`target\`은 최초 교차 이벤트가 발생한 이후부터 DOM 엘리먼트를 가리킵니다.  
> 그 전에는 \`null\`이므로 옵셔널 체이닝(\`target?.\`)을 사용하세요.

---

## 내부 동작 요약

\`\`\`
setContainerRef 연결
        ↓
targetSelector 또는 firstElementChild 탐색
        ↓
IntersectionObserver 생성 & observe 시작
        ↓
교차 발생
  ├─ isIntersecting = true  → onEntered / onChange("enter") / state 업데이트
  │                           once: true이면 이후 unobserve
  └─ isIntersecting = false → onExited / onChange("exit") / state 업데이트
        ↓
컨테이너 언마운트 → observer.disconnect()
\`\`\`

---

## 주의 사항

- \`setContainerRef\`는 **RefCallback**이므로 \`useRef\`와 달리 함수로 전달해야 합니다.
- 동일 컨테이너에서 \`targetSelector\`가 여러 요소에 매칭되면 **첫 번째 요소만** 관찰됩니다.
- \`reset()\` 호출 시 컨테이너나 타깃이 없으면 경고가 출력되며 아무 동작도 하지 않습니다.
- \`root: "container"\` 사용 시 컨테이너에 \`overflow: scroll\` 또는 \`overflow: auto\`가 설정되어 있어야 올바르게 동작합니다.
`;

export default SkillSection;
