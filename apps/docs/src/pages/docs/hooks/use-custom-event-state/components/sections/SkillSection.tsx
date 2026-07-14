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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "컴포넌트 간 상태 공유",
        "상태 동기화", "prop drilling 제거", "CustomEvent" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 동기화 범위,
        늦게 마운트된 컴포넌트의 초기값 등의 엣지 케이스를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-custom-event-state/SKILL.md</InlineCode> 경로에 저장하면
        에이전트가 자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-custom-event-state SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-custom-event-state
description: >
  React에서 Provider나 prop drilling 없이 여러 컴포넌트의 상태를 동기화할 때 사용하는 훅이에요.
  같은 key를 사용하는 컴포넌트들이 window CustomEvent를 통해 상태를 공유해요.
  "컴포넌트 간 상태 공유", "상태 동기화", "prop drilling 제거", "전역 상태", "CustomEvent",
  "마이크로 프론트엔드 상태 공유" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-custom-event-state

브라우저의 CustomEvent API로 같은 key를 사용하는 여러 컴포넌트의 상태를 동기화하는 React 커스텀 훅이에요.
useState와 동일한 [state, dispatch] 튜플을 반환하고, dispatch를 호출하면 window에 이벤트가 발행되어
같은 key를 구독 중인 모든 훅 인스턴스(자신 포함)의 상태가 함께 갱신돼요.

---

## 훅 시그니처

\`\`\`typescript
function useCustomEventState<S>(
  key: string,
  initialState: S | (() => S),
): readonly [S, React.Dispatch<React.SetStateAction<S>>];
\`\`\`

- \`key\`: 동기화할 상태를 식별하는 키. 내부적으로 \`@leejaehyeok/use-custom-event-state:\` 접두사가 붙어 이벤트 충돌을 방지해요.
- \`initialState\`: 초기값. 함수를 전달하면 lazy initializer로 첫 렌더링에서 한 번만 실행돼요.
- \`dispatch\`: useCallback으로 메모이제이션되어 key가 바뀌지 않는 한 참조가 유지돼요.

---

## 주요 동작

| 동작                | 설명                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| **상태 동기화**     | 같은 key의 모든 훅 인스턴스가 dispatch 한 번으로 함께 갱신 (자신 포함)  |
| **함수형 업데이트** | \`(prev) => next\` 전달 시 각 인스턴스가 자신의 이전 상태에 함수를 적용  |
| **지연 초기화**     | initialState에 함수 전달 시 첫 렌더링에서 한 번만 실행                  |
| **key 변경 대응**   | 이전 key 구독 해제 후 새 key 구독, 상태 값은 다음 dispatch까지 유지     |
| **동기화 범위**     | 같은 탭(페이지) 안에서만 동작, 서로 다른 React 루트 간에도 동기화 가능  |

---

## 기본 사용 예시

\`\`\`tsx
import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

function CounterA() {
  const [count, setCount] = useCustomEventState("counter", 0);

  return <button onClick={() => setCount((prev) => prev + 1)}>카운트: {count}</button>;
}

function CounterB() {
  // 같은 key를 사용하므로 Provider 없이 CounterA와 자동으로 동기화돼요.
  const [count, setCount] = useCustomEventState("counter", 0);

  return <button onClick={() => setCount(0)}>초기화 ({count})</button>;
}
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 늦게 마운트된 컴포넌트의 초기값

상태를 별도 저장소에 보관하지 않고 이벤트로만 전파하므로, dispatch 이후에 마운트된 컴포넌트는
이전에 발행된 값을 알 수 없어 자신의 initialState로 시작하고, 다음 dispatch부터 동기화돼요.

\`\`\`tsx
// ✅ 권장: 같은 key를 쓰는 컴포넌트는 같은 초기값을 상수로 공유
const COUNTER_KEY = "counter";
const COUNTER_INITIAL = 0;
\`\`\`

### 2. 같은 탭 안에서만 동기화

window CustomEvent 기반이므로 다른 탭·다른 창과는 동기화되지 않아요.
크로스탭 동기화나 새로고침 후 유지가 필요하면 \`@leejaehyeok/use-browser-storage\`를 사용하세요.

### 3. key는 안정적인 값 사용

렌더링마다 바뀌는 값을 key로 쓰면 구독이 계속 재설정돼요. 상수 또는 안정적인 식별자를 사용하세요.

### 4. 함수 자체를 상태로 저장하기

dispatch에 함수를 전달하면 항상 함수형 업데이트로 해석돼요.
함수 자체를 상태로 저장하려면 useState처럼 한 번 감싸서 전달하세요: \`setState(() => myFunction)\`

### 5. SSR 환경

dispatch와 이벤트 구독은 브라우저에서만 동작해요. 서버 렌더링 시에는 initialState가 그대로 사용되므로
hydration mismatch가 발생하지 않아요.
`;

export default SkillSection;
