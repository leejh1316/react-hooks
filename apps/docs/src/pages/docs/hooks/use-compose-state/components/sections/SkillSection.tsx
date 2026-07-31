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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "setter 합성", "여러 상태
        함께 갱신", "외부 상태와 내부 상태 동기화", "제어 컴포넌트 상태 동기화" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅
        시그니처, 직접 값과 함수형 업데이트의 차이, 일반 콜백 합성 시의 주의점 등을 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-compose-state/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-compose-state SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-compose-state
description: >
  React에서 여러 개의 state setter를 하나로 합성해 함께 갱신할 때 사용하는 훅이에요.
  부모가 소유한 제어 상태와 컴포넌트 내부 상태, 로그·미리보기 같은 부가 상태를 한 번의 호출로 동기화해야 할 때 반드시 이 스킬을 참고하세요.
  "setter 합성", "compose state", "여러 상태 함께 갱신", "외부 상태와 내부 상태 동기화", "제어 컴포넌트 상태 동기화" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-compose-state

여러 개의 state setter를 하나의 setter로 합성하는 React 커스텀 훅이에요.
합성된 setter를 한 번 호출하면 전달한 모든 setter가 순서대로 호출되어 상태들이 함께 갱신돼요.
반환값의 타입은 useState의 setter와 같으므로 기존 setter를 쓰던 자리에 그대로 바꿔 넣을 수 있어요.

---

## 훅 시그니처

\`\`\`typescript
function useComposedState<S>(
  ...setters: React.Dispatch<React.SetStateAction<S>>[]
): React.Dispatch<React.SetStateAction<S>>;
\`\`\`

- 패키지 이름은 \`use-compose-state\`, 훅 이름은 \`useComposedState\`예요. (named export 1개)
- 옵션 객체는 없어요. 합성할 setter들을 인자로 나열하세요.
- 상태 타입 \`S\`는 전달한 setter들로부터 추론돼요. 모든 setter가 같은 타입을 공유해야 해요.
- 반환값은 빈 의존성 배열의 \`useCallback\`으로 메모이제이션되어 참조가 고정돼요.

---

## 주요 동작

| 동작                      | 설명                                                                            |
| ------------------------- | ------------------------------------------------------------------------------- |
| **여러 setter 합성**      | 반환된 setState 한 번 호출 → 전달한 순서대로 모든 setter 호출                   |
| **직접 값**               | \`setState(next)\` → 합성된 모든 상태가 같은 값이 됨                              |
| **함수형 업데이트**       | \`setState((prev) => next)\` → 각 setter가 자신의 이전 값에 함수를 적용           |
| **고정된 참조**           | 컴포넌트가 살아 있는 동안 동일 참조 — 의존성 배열 / memo props에 안전            |
| **최신 setter 목록 사용** | \`useLatestRef\`로 매 렌더링 갱신 — setter 개수·순서가 달라져도 최신 목록 사용    |
| **한 번의 리렌더링**      | React 18 자동 배칭으로 하나의 이벤트에서 발생한 갱신은 한 번에 처리              |

---

## 기본 사용 예시

\`\`\`tsx
import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

function QuantityPanel() {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [lastQuantity, setLastQuantity] = useState(1);

  // 세 개의 setter를 하나로 합성해요.
  const setQuantity = useComposedState(setOrderQuantity, setPreviewQuantity, setLastQuantity);

  return (
    <>
      <button onClick={() => setQuantity((prev) => prev + 1)}>수량 +1</button>
      <button onClick={() => setQuantity(1)}>초기화</button>
    </>
  );
}
\`\`\`

---

## 외부 상태 + 내부 상태 합성 패턴

\`\`\`tsx
type KeywordFieldProps = {
  // 부모가 useState로 만든 setter를 그대로 내려줘요.
  onKeywordChange: React.Dispatch<React.SetStateAction<string>>;
};

function KeywordField({ onKeywordChange }: KeywordFieldProps) {
  const [draft, setDraft] = useState("");

  // 부모의 상태와 내부 상태를 하나의 setter로 합성해요.
  const setKeyword = useComposedState(onKeywordChange, setDraft);

  return <input value={draft} onChange={(event) => setKeyword(event.target.value)} />;
}
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 모든 setter는 같은 상태 타입을 공유해야 해요

제네릭 \`S\`는 하나뿐이에요. 타입이 다른 상태를 함께 갱신해야 한다면 상태를 하나의 객체로 합치거나 훅을 타입별로 나누어 사용하세요.

### 2. 함수형 업데이트는 각 상태의 이전 값 기준이에요

합성된 상태들의 현재 값이 서로 다르면 함수형 업데이트의 결과도 각각 달라져요.
모든 상태를 같은 값으로 맞추려면 직접 값을 전달하세요.

\`\`\`tsx
// countA: 1, countB: 5 인 상태에서
setCount((prev) => prev + 1); // → 2, 6 (차이 유지)
setCount(10); // → 10, 10 (값 통일)
\`\`\`

### 3. SetStateAction을 처리하지 못하는 콜백은 감싸서 전달하세요

\`(value: S) => void\` 형태의 일반 콜백(예: \`onChange\`)에 함수형 업데이트를 전달하면 값 대신 업데이터 함수를 받게 돼요.
직접 값만 전달하거나, 업데이터를 값으로 풀어 주는 래퍼로 감싸세요.

\`\`\`tsx
const handleChange: React.Dispatch<React.SetStateAction<number>> = (next) => {
  onChange(typeof next === "function" ? next(count) : next);
};

const setAll = useComposedState(setCount, handleChange);
\`\`\`

### 4. 함수 자체를 상태로 저장할 때는 한 번 감싸세요

useState와 마찬가지로 전달한 함수는 항상 업데이터로 해석돼요: \`setState(() => myFunction)\`

### 5. 렌더링 도중에는 호출하지 마세요

setter 목록은 \`useLayoutEffect\`에서 갱신돼요. 이벤트 핸들러나 effect에서 호출하면 항상 최신 목록이 사용되지만,
렌더링 도중 호출하면 이전 렌더링의 setter 목록이 사용될 수 있어요.

### 6. 상태를 하나로 합칠 수 있다면 그 편이 나아요

이 훅은 부모가 소유한 상태나 다른 컴포넌트가 내려준 setter처럼, 애초에 하나로 합칠 수 없는 상태들을 함께 갱신하기 위한 도구예요.
한 컴포넌트 안에서 직접 만든 상태들이라면 상태를 하나로 두고 파생 값을 계산하는 편이 더 단순해요.
`;

export default SkillSection;
