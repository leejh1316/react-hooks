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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공합니다. "stale closure", "최신 값
        참조", "의존성 배열 제거", "콜백 안정화" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, ref 읽기 시점, props 콜백
        안정화 패턴 등의 내용을 반영한 코드를 작성합니다.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-latest-ref/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식합니다.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-latest-ref SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-latest-ref
description: >
  React에서 항상 최신 값을 담는 ref가 필요할 때 사용하는 훅입니다.
  setInterval / setTimeout / 이벤트 리스너의 stale closure 방지, useEffect·useCallback 의존성 배열 축소,
  props 콜백 안정화 등이 필요할 때 반드시 이 스킬을 참고하세요.
  "stale closure", "최신 값 참조", "의존성 배열 제거", "콜백 안정화", "latest ref" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-latest-ref

전달된 값의 최신 상태를 항상 유지하는 ref 객체를 반환하는 React 커스텀 훅입니다.
useLayoutEffect로 값이 바뀔 때마다 \`ref.current\`를 동기적으로 갱신하며, ref 객체 자체의 참조는 컴포넌트 생명주기 동안 바뀌지 않습니다.

---

## 훅 시그니처

\`\`\`typescript
function useLatestRef<T>(value: T): React.RefObject<T>;
\`\`\`

옵션은 없습니다. 최신으로 유지할 값 하나를 전달하고, 콜백 안에서 \`ref.current\`로 읽으세요.

---

## 주요 동작

| 동작                   | 설명                                                                          |
| ---------------------- | ----------------------------------------------------------------------------- |
| **항상 최신 값 유지**  | useLayoutEffect로 값 변경 시 \`ref.current\`를 동기적으로 갱신                  |
| **안정적인 참조**      | 반환된 ref는 생명주기 동안 동일한 참조 유지 — 의존성 배열에 넣어도 재실행 없음 |
| **리렌더링 없음**      | \`ref.current\` 갱신은 리렌더링을 일으키지 않음                                 |
| **stale closure 방지** | 오래 살아남는 클로저에서 등록 시점이 아닌 실행 시점의 최신 값을 읽음           |

---

## 기본 사용 예시

\`\`\`tsx
import { useEffect, useState } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

function AutoSave() {
  const [draft, setDraft] = useState("");
  const latestDraftRef = useLatestRef(draft);

  useEffect(() => {
    // draft가 바뀌어도 인터벌은 다시 만들지 않습니다.
    const id = setInterval(() => saveDraft(latestDraftRef.current), 5000);
    return () => clearInterval(id);
  }, []);

  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />;
}
\`\`\`

---

## props 콜백 안정화 패턴

\`\`\`tsx
const latestOnActionRef = useLatestRef(onAction);

// 참조가 바뀌지 않지만 실행 시에는 항상 최신 onAction이 호출됩니다.
const stableOnAction = useCallback(() => {
  latestOnActionRef.current();
}, []);
\`\`\`

memo로 감싼 자식에 \`stableOnAction\`을 전달하면 부모가 렌더링돼도 자식이 재렌더링되지 않습니다.

---

## 주의사항 및 엣지 케이스

### 1. 렌더링 중에 ref.current를 읽지 마세요

\`ref.current\`는 렌더링이 끝난 뒤(useLayoutEffect 이후) 갱신됩니다.
렌더링 도중 읽으면 이전 렌더링의 값이 반환될 수 있습니다. 이펙트, 타이머, 이벤트 핸들러 안에서만 읽으세요.

### 2. 화면에 표시할 값에는 사용하지 마세요

\`ref.current\` 갱신은 리렌더링을 일으키지 않으므로 JSX에 표시할 값은 useState를 사용하세요.

### 3. 함수도 값처럼 전달할 수 있습니다

상태뿐 아니라 콜백 함수도 전달할 수 있습니다. 매 렌더링마다 새로 생성되는 함수를 넣어도
ref 참조는 안정적으로 유지되고, 호출 시점에는 최신 함수가 실행됩니다.

### 4. 관련 훅

- 값이 바뀔 때 함수 실행 빈도를 제어하려면 \`@leejaehyeok/use-debounce\` / \`@leejaehyeok/use-throttle\`을 사용하세요.
- 이전 렌더링의 값이 필요하면 \`@leejaehyeok/use-prev-ref\`를 사용하세요.
`;

export default SkillSection;
