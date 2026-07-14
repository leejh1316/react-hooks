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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "로딩 스피너 깜빡임",
        "지연된 로딩", "deferred loading", "스켈레톤 최소 표시 시간" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처,
        delay·minDisplayDuration 옵션 튜닝, 타이밍 시나리오, 버튼 disabled 처리 같은 엣지 케이스를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-deferred-loading/SKILL.md</InlineCode> 경로에 저장하면
        에이전트가 자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-deferred-loading SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-deferred-loading
description: >
  React에서 로딩 스피너/스켈레톤의 깜빡임(flicker)을 방지할 때 사용하는 훅이에요.
  빠르게 끝나는 요청에서 로딩 UI가 순간 나타났다 사라지는 문제를 해결해야 할 때 반드시 이 스킬을 참고하세요.
  "로딩 깜빡임", "스피너 깜빡임", "deferred loading", "지연된 로딩", "최소 표시 시간", "스켈레톤 UX" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-deferred-loading

로딩이 지정된 지연 시간(\`delay\`) 이상 지속될 때만 로딩 상태를 true로 반환하고,
한 번 true가 되면 최소 표시 시간(\`minDisplayDuration\`)을 보장하는 React 커스텀 훅이에요.
짧은 로딩은 아예 표시하지 않고, 표시된 스피너는 순간 사라지지 않도록 해서 로딩 UI 깜빡임을 방지해요.

---

## 훅 시그니처

\`\`\`typescript
function useDeferredLoading(isLoading: boolean, options?: DeferredLoadingOptions): boolean;

type DeferredLoadingOptions = {
  delay?: number; // 로딩 상태를 표시하기까지의 지연 시간(ms) (기본값: 100)
  minDisplayDuration?: number; // 로딩 상태가 한 번 표시된 후 최소 유지 시간(ms) (기본값: 300)
};
\`\`\`

반환값은 **지연된 로딩 상태(boolean)**예요. 스피너/스켈레톤 렌더링 조건에 \`isLoading\` 대신 이 값을 사용하세요.

---

## 주요 동작

| 동작                    | 설명                                                                              |
| ----------------------- | --------------------------------------------------------------------------------- |
| **표시 지연**           | \`isLoading\`이 true가 된 후 \`delay\`(기본 100ms)가 지나야 true로 전환             |
| **깜빡임 방지**         | \`delay\` 안에 로딩이 끝나면 한 번도 true가 되지 않음 (스피너 미표시)              |
| **최소 표시 시간 보장** | 한 번 true가 되면 \`minDisplayDuration\`(기본 300ms) 이상 유지된 후 false로 전환   |
| **타이머 자동 정리**    | \`isLoading\`/옵션 변경, 언마운트 시 내부 타이머 자동 정리                         |

---

## 타이밍 시나리오

\`delay: 300\`, \`minDisplayDuration: 500\` 기준:

| 로딩 시간 | 스피너 표시                                             |
| --------- | -------------------------------------------------------- |
| 80ms      | 표시 안 됨 (delay보다 먼저 끝남)                         |
| 400ms     | 300ms 시점에 표시 → 800ms 시점에 사라짐 (최소 500ms 보장) |
| 2000ms    | 300ms 시점에 표시 → 2000ms 시점에 사라짐                 |

---

## 기본 사용 예시

\`\`\`tsx
import { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

function UserList() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, { delay: 300, minDisplayDuration: 500 });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/users");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 스피너 렌더링 조건에는 isDeferredLoading을 사용해요 */}
      {isDeferredLoading && <p>로딩 중...</p>}
      {/* 실제 로딩 여부가 필요한 곳(disabled 등)에는 원본 isLoading을 사용해요 */}
      <button onClick={fetchUsers} disabled={isLoading}>
        사용자 목록 조회
      </button>
    </div>
  );
}
\`\`\`

---

## 데이터 페칭 라이브러리와 함께 사용

첫 번째 인자는 어떤 boolean이든 받을 수 있어요.

\`\`\`tsx
const { data, isFetching } = useQuery({ queryKey: ["search", keyword], queryFn: () => searchApi(keyword) });

// 캐시 히트 등으로 빠르게 끝나는 refetch에서는 스피너가 표시되지 않아요.
const isDeferredLoading = useDeferredLoading(isFetching, { delay: 200 });
\`\`\`

---

## 옵션 튜닝 가이드

- **delay**: "이 시간보다 짧은 로딩은 표시하지 않는다"는 기준이에요.
  - 응답이 대체로 빠른 API(캐시, 로컬 검색 등)일수록 크게 (200~500ms)
  - 사용자가 로딩을 인지해야 하는 무거운 작업은 작게 (0~100ms)
- **minDisplayDuration**: "한 번 표시한 스피너는 이 시간 이상 유지한다"는 기준이에요.
  - 스피너가 나타났다 바로 사라지는 게 거슬리면 늘리세요 (300~700ms 권장)

---

## 주의사항 및 엣지 케이스

### 1. 스피너 조건과 실제 로딩 여부를 구분하세요

\`isDeferredLoading\`은 **표시용** 상태예요. 버튼 \`disabled\`, 중복 요청 방지 등
실제 로딩 여부가 필요한 로직에는 원본 \`isLoading\`을 사용하세요.

### 2. 스피너가 실제 응답보다 늦게 사라질 수 있어요

\`minDisplayDuration\` 보장 때문에 로딩이 끝난 뒤에도 스피너가 잠시 유지될 수 있어요.
이는 의도된 동작이에요. 응답 완료 즉시 화면을 전환해야 한다면 \`minDisplayDuration: 0\`을 사용하세요.

### 3. 짧은 로딩에서는 로딩 UI가 아예 표시되지 않아요

\`delay\`보다 먼저 끝난 로딩은 \`isDeferredLoading\`이 한 번도 true가 되지 않아요.
"로딩 중"임을 반드시 보여줘야 하는 요구사항이라면 \`delay: 0\`을 사용하거나 이 훅을 사용하지 마세요.

### 4. 옵션을 동적으로 변경하지 마세요

\`delay\`, \`minDisplayDuration\`이 변경되면 내부 타이머가 정리되고 effect가 재실행돼요.
렌더링마다 값이 바뀌지 않도록 상수 또는 안정된 값으로 전달하세요.

### 5. React의 useDeferredValue와 달라요

이름이 비슷하지만 React 내장 \`useDeferredValue\`(값 업데이트 우선순위 지연)와는 용도가 달라요.
이 훅은 로딩 UI의 표시 타이밍(깜빡임 방지)을 제어해요.
`;

export default SkillSection;
