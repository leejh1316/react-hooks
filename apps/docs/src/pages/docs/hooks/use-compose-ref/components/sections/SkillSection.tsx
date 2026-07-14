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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "ref 병합", "forwardRef 내부
        ref", "callback ref cleanup", "여러 ref 연결" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 함수형 ref 안정화,
        React 버전별 cleanup 동작 등의 내용을 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-compose-ref/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-compose-ref SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-compose-ref
description: >
  React에서 여러 개의 ref를 하나의 엘리먼트에 함께 연결해야 할 때 사용하는 훅이에요.
  forwardRef로 전달받은 외부 ref와 컴포넌트 내부 ref 병합, 객체형·함수형 ref 혼용,
  React 19 callback ref cleanup 처리가 필요할 때 반드시 이 스킬을 참고하세요.
  "ref 병합", "compose refs", "merge refs", "forwardRef 내부 ref", "callback ref cleanup" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-compose-ref

여러 개의 ref를 하나의 callback ref로 병합하는 React 커스텀 훅이에요.
객체형 ref(RefObject / MutableRefObject), 함수형 ref(RefCallback), null / undefined를 모두 지원하고,
React 19의 callback ref cleanup 함수도 자동으로 처리해요.

---

## Exports

\`\`\`typescript
// 훅 — 병합된 ref를 useCallback으로 메모이제이션해요.
function useComposedRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T>;

// 훅이 아닌 버전 — 메모이제이션이 없어요.
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T>;

// 저수준 유틸 — ref 하나에 값을 할당하고, callback ref의 cleanup을 반환해요.
function setRef<T>(ref: React.Ref<T> | undefined, value: T): void | (() => void);
\`\`\`

옵션 객체는 없어요. 병합할 ref들을 인자로 나열하세요.

---

## 주요 동작

| 동작                    | 설명                                                                              |
| ----------------------- | --------------------------------------------------------------------------------- |
| **여러 ref 병합**       | 전달한 모든 ref에 같은 엘리먼트를 순서대로 전파                                    |
| **모든 ref 유형 지원**  | 객체형·함수형 ref 혼용 가능, null / undefined는 안전하게 무시                      |
| **React 19 cleanup**    | callback ref가 반환한 cleanup을 해제 시 실행, cleanup 없는 ref는 null로 초기화     |
| **메모이제이션**        | 전달한 ref들의 참조가 유지되면 병합된 ref도 동일 참조 유지 — 불필요한 재연결 없음  |

---

## 기본 사용 예시 (forwardRef + 내부 ref)

\`\`\`tsx
import { forwardRef, useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

const FancyInput = forwardRef<HTMLInputElement, Props>((props, forwardedRef) => {
  const internalRef = useRef<HTMLInputElement>(null);

  // 부모가 전달한 ref와 내부 ref를 하나로 병합해요.
  const composedRef = useComposedRefs(internalRef, forwardedRef);

  return <input ref={composedRef} {...props} />;
});
\`\`\`

---

## React 19 cleanup 패턴

\`\`\`tsx
const observeRef = useCallback((el: HTMLDivElement) => {
  const observer = new ResizeObserver(handleResize);
  observer.observe(el);
  return () => observer.disconnect(); // 해제 시 실행돼요.
}, []);

const composedRef = useComposedRefs(objectRef, observeRef);
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 함수형 ref는 useCallback으로 안정화하세요

전달한 ref들이 의존성 배열로 사용돼요. 인라인 함수형 ref를 전달하면 렌더링마다
병합된 ref가 다시 생성되어 엘리먼트에 ref가 해제·재연결되는 과정이 반복돼요.

### 2. ref의 개수와 순서를 렌더링마다 유지하세요

의존성 배열의 길이가 바뀌면 안 되므로, 조건부로 ref를 빼는 대신 null / undefined를 전달하세요.

### 3. React 18 이하의 cleanup 동작

React 18 이하에서는 callback ref의 반환값(cleanup)이 무시되고, 해제 시 각 ref에 null이 전달돼요.
정리 로직이 필요하면 React 18에서는 null 분기에서 처리해야 해요.

### 4. 렌더링 밖에서는 composeRefs를 사용하세요

고차 컴포넌트, 클래스 컴포넌트 등 훅을 호출할 수 없는 곳에서는 composeRefs를 사용하고,
렌더링 안에서는 메모이제이션이 있는 useComposedRefs를 사용하세요.
`;

export default SkillSection;
