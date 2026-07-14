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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "제어 컴포넌트", "비제어
        컴포넌트", "controlled/uncontrolled", "value/defaultValue/onChange 패턴" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅
        시그니처, 모드 결정 규칙, 제어 모드에서의 value 갱신 책임, Object.is 비교 같은 엣지 케이스를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-controllable-state/SKILL.md</InlineCode> 경로에 저장하면
        에이전트가 자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-controllable-state SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-controllable-state
description: >
  React에서 제어(controlled) 모드와 비제어(uncontrolled) 모드를 모두 지원하는 컴포넌트를 만들 때 사용하는 훅이에요.
  value / defaultValue / onChange props를 받는 재사용 컴포넌트(입력, 셀렉트, 토글, 아코디언, 별점 등)를 구현해야 할 때 반드시 이 스킬을 참고하세요.
  "제어 컴포넌트", "비제어 컴포넌트", "controlled/uncontrolled", "controllable state", "defaultValue 패턴" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-controllable-state

하나의 컴포넌트가 제어 모드(외부 상태)와 비제어 모드(내부 상태)를 모두 지원하도록 상태를 관리하는 React 커스텀 훅이에요.
\`Object.is\` 비교로 값이 실제로 변경될 때만 상태를 갱신하고 \`onChange\`를 호출해요.

---

## 훅 시그니처

\`\`\`typescript
function useControllableState<T>(options: ControllableStateOptions<T>): readonly [T, Dispatch<SetStateAction<T>>];

type ControllableStateOptions<T> = {
  value?: T; // 외부에서 제어하는 값. undefined가 아니면 제어 모드
  defaultValue?: T | (() => T); // 비제어 모드의 초기값. 함수 전달 시 lazy 초기화
  onChange?: (value: T) => void; // 값이 실제로 변경될 때 호출되는 콜백
};
\`\`\`

반환값은 \`useState\`와 동일한 형태의 **\`[value, setValue]\` 튜플**이에요.

---

## 주요 동작

| 동작                     | 설명                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **모드 결정**            | 첫 렌더에서 \`value !== undefined\`면 제어 모드, 아니면 비제어 모드로 **고정**            |
| **제어 모드**            | \`value\`를 그대로 반환, \`setValue\`는 내부 상태를 바꾸지 않고 \`onChange\`만 호출        |
| **비제어 모드**          | 내부 \`useState\`로 값 관리, \`setValue\` 시 내부 상태 갱신 후 \`onChange\` 호출           |
| **불필요한 업데이트 방지** | \`Object.is\` 비교로 값이 같으면 상태 갱신·\`onChange\` 호출 모두 생략                    |
| **함수형 업데이트**      | \`setValue((prev) => next)\` 지원, \`prev\`에는 현재 최신 값 전달                          |
| **안정된 참조**          | \`setValue\`는 메모이제이션되어 참조 불변, \`onChange\`는 ref로 관리되어 항상 최신 콜백 호출 |

---

## 기본 사용 예시 (재사용 컴포넌트 만들기)

\`\`\`tsx
import { useControllableState } from "@leejaehyeok/use-controllable-state";

type RatingProps = {
  value?: number; // 전달하면 제어 모드
  defaultValue?: number; // 비제어 모드의 초기값
  onChange?: (value: number) => void;
};

function Rating({ value, defaultValue = 0, onChange }: RatingProps) {
  const [rating, setRating] = useControllableState({ value, defaultValue, onChange });

  return (
    <div>
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} onClick={() => setRating(score)}>
          {score <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
\`\`\`

---

## 두 가지 모드로 사용하기

\`\`\`tsx
// 비제어 모드 — 컴포넌트가 스스로 상태를 관리해요.
<Rating defaultValue={3} onChange={(value) => console.log(value)} />;

// 제어 모드 — 부모가 상태를 소유하고, onChange로 value를 직접 갱신해야 해요.
function ReviewForm() {
  const [rating, setRating] = useState(0);
  return <Rating value={rating} onChange={setRating} />;
}
\`\`\`

---

## 함수형 업데이트와 lazy 초기화

\`\`\`tsx
const [count, setCount] = useControllableState({
  defaultValue: () => computeExpensiveInitialValue(), // 첫 렌더에서 한 번만 실행
});

setCount((prev) => prev + 1); // prev에는 현재 최신 값이 전달돼요
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 마운트 이후 제어 ↔ 비제어 전환 금지

모드는 **첫 렌더에서 고정**돼요. 마운트 후 \`value\`를 undefined로 바꾸거나, undefined였다가 값을
전달해도 모드는 바뀌지 않고 의도치 않은 동작이 발생해요. 처음부터 하나의 모드를 정해서 사용하세요.

### 2. 제어 모드에서는 부모가 value를 갱신해야 해요

제어 모드의 \`setValue\`는 \`onChange\`만 호출하고 내부 상태를 바꾸지 않아요.
부모가 \`onChange\`에서 \`value\`를 갱신하지 않으면 화면이 변하지 않아요.

\`\`\`tsx
// ❌ onChange 없이 value만 전달 — 클릭해도 화면이 바뀌지 않아요
<Rating value={3} />

// ✅ value와 onChange를 함께 전달하세요
<Rating value={rating} onChange={setRating} />
\`\`\`

### 3. Object.is 비교 기준을 이해하세요

원시값은 같은 값이면 \`onChange\`가 생략되지만, 객체·배열은 **참조**로 비교해요.
같은 참조를 다시 전달하면 내부 필드가 바뀌어도 무시되고, 새 참조는 내용이 같아도 항상 변경으로 간주돼요.
객체 상태는 불변성을 지켜 새 객체로 갱신하세요.

### 4. 같은 이벤트 핸들러에서 setValue를 연속 호출하지 마세요

내부적으로 최신 값을 ref에 보관하고 렌더링 이후에 갱신하기 때문에, 하나의 핸들러에서
\`setValue\`를 여러 번 호출하면 두 번째 호출의 \`prev\`가 아직 이전 값이에요.
누적이 필요하면 한 번의 호출로 합쳐서 갱신하세요.

### 5. setValue는 의존성 배열에 안전해요

\`setValue\`는 참조가 변하지 않으므로 \`useEffect\` / \`useCallback\` 의존성에 넣어도 재실행을 유발하지 않아요.
\`onChange\`도 ref로 관리되므로 인라인 함수를 그대로 전달해도 돼요.
`;

export default SkillSection;
