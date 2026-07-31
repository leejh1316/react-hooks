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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "이전 값", "previous value",
        "값 변화 감지", "이전 props와 비교" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 읽는 시점별 동작 차이, 렌더링 중
        읽으면 안 되는 이유 같은 엣지 케이스를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-prev-ref/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-prev-ref SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-prev-ref
description: >
  React에서 직전 렌더링 사이클의 값을 추적할 때 사용하는 훅이에요.
  현재 값과 이전 값을 비교해 변화 방향을 판단하거나, 이전 선택으로 되돌리거나, 값 전환에 따라 사이드 이펙트를 실행해야 할 때 반드시 이 스킬을 참고하세요.
  "이전 값", "previous value", "usePrevious", "값 변화 감지", "이전 props와 비교" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-prev-ref

직전 렌더링 사이클의 값을 ref에 담아 두는 React 커스텀 훅이에요.
\`useEffect\`의 cleanup에서 ref를 갱신하므로, **커밋이 끝난 뒤(이벤트 핸들러 · useEffect · 비동기 콜백)** 읽어야 정확한 1단계 이전 값을 얻을 수 있어요.

---

## 훅 시그니처

\`\`\`typescript
function usePrevRef<T>(value: T): React.MutableRefObject<T>;
\`\`\`

- named export 1개예요. 옵션 객체는 없어요.
- 반환값은 ref 객체이므로 \`.current\`로 읽어요. 상태가 아니라 리렌더링을 유발하지 않아요.
- 첫 렌더링에서는 \`.current\`가 \`undefined\`가 아니라 전달한 값 자체예요.
- 내부 \`useEffect\`의 의존성이 \`[value]\`라서 \`Object.is\` 비교로 변화를 판단해요.

---

## 읽는 시점별 동작 (가장 중요)

| 읽는 시점                     | 결과                | 비고                                        |
| ----------------------------- | ------------------- | ------------------------------------------- |
| **이벤트 핸들러**             | ✅ 1단계 이전 값    | 권장 사용처                                 |
| **useEffect**                 | ✅ 1단계 이전 값    | 커밋에서 cleanup이 effect보다 먼저 실행됨   |
| **비동기 콜백**               | ✅ 1단계 이전 값    | setTimeout, fetch 응답 등                   |
| **렌더링 중 (JSX·본문)**      | ❌ 2단계 이전 값    | cleanup 실행 전 — 첫 변경에서만 우연히 일치 |
| **useLayoutEffect**           | ❌ 2단계 이전 값    | passive cleanup이 layout effect보다 늦음    |

---

## 기본 사용 예시

\`\`\`tsx
import { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

function PlanSelector() {
  const [plan, setPlan] = useState("Basic");
  const prevPlanRef = usePrevRef(plan);

  // 이벤트 핸들러에서 읽으면 정확히 직전 선택이 담겨 있어요.
  const restore = () => setPlan(prevPlanRef.current);

  return (
    <>
      <button onClick={() => setPlan("Pro")}>Pro</button>
      <button onClick={restore}>직전 선택으로 되돌리기</button>
    </>
  );
}
\`\`\`

---

## useEffect에서 변화 감지

\`\`\`tsx
const [volume, setVolume] = useState(50);
const prevVolumeRef = usePrevRef(volume);

useEffect(() => {
  const prevVolume = prevVolumeRef.current;
  if (prevVolume === volume) return;

  console.log(volume > prevVolume ? "증가" : "감소");
}, [volume, prevVolumeRef]);
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 렌더링 중에는 읽지 마세요

\`\`\`tsx
// ❌ 2단계 이전 값이 표시돼요.
<p>이전 값: {prevRef.current}</p>
\`\`\`

화면에 이전 값을 그려야 한다면 useEffect에서 읽은 값을 상태로 옮기세요.

\`\`\`tsx
const [prevKeyword, setPrevKeyword] = useState(keyword);

useEffect(() => {
  setPrevKeyword(prevKeywordRef.current); // effect 시점의 값은 정확해요.
}, [keyword, prevKeywordRef]);
\`\`\`

### 2. useLayoutEffect에서도 아직 갱신 전이에요

이전 값 비교 로직은 \`useLayoutEffect\`가 아니라 \`useEffect\`에 두세요.

### 3. 값이 바뀌지 않으면 갱신되지 않아요

의존성 비교(\`Object.is\`) 기준이라 \`.current\`는 "직전에 달랐던 값"을 가리켜요.
객체·배열은 내용이 같아도 참조가 바뀌면 갱신되므로, 필요한 필드만 원시값으로 전달하는 편이 안전해요: \`usePrevRef(user.id)\`

### 4. 첫 렌더링에는 이전 값이 없어요

\`useRef(value)\`로 초기화되므로 첫 렌더링에서는 현재 값과 같아요.
\`undefined\`로 최초 실행을 구분할 수 없으니 필요하면 별도 플래그를 사용하세요.

### 5. 리렌더링을 유발하지 않아요

ref이므로 \`.current\`가 갱신돼도 화면은 다시 그려지지 않아요. UI를 바꿔야 한다면 상태로 옮기세요.

### 6. \`.current\`에 직접 쓰지 마세요

\`MutableRefObject\`라 대입은 가능하지만 훅이 다음 갱신 때 덮어써요. 읽기 전용으로만 사용하세요.
`;

export default SkillSection;
