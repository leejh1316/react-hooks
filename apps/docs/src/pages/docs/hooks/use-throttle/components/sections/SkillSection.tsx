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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공합니다. "스로틀", "throttle",
        "이벤트 성능 최적화", "호출 빈도 제한" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, leading / trailing 옵션
        조합, cancel·flush 활용, 디바운스와의 차이 등의 내용을 반영한 코드를 작성합니다.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-throttle/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식합니다.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-throttle SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-throttle
description: >
  React에서 함수 호출을 스로틀링(Throttle)할 때 사용하는 훅입니다.
  스크롤, 윈도우 리사이징, 마우스 이동, 빈번한 버튼 클릭 등 자주 발생하는 이벤트의 실행 빈도를 제한해야 할 때 반드시 이 스킬을 참고하세요.
  "스로틀", "throttle", "호출 빈도 제한", "이벤트 성능 최적화", "연타 방지" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-throttle

함수 호출을 스로틀링하여 지정된 시간(\`wait\`)당 최대 한 번만 실행되도록 하는 React 커스텀 훅입니다.
콜백을 ref에 보관해 stale closure를 방지하며, 언마운트 시 대기 중인 타이머를 자동 정리합니다.

---

## 훅 시그니처

\`\`\`typescript
function useThrottle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: ThrottleOptions,
): {
  throttle: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
};

type ThrottleOptions = {
  leading?: boolean; // 첫 호출 즉시 실행 여부 (기본값: true)
  trailing?: boolean; // 마지막 호출을 제한 시간 후에 실행할지 여부 (기본값: true)
};
\`\`\`

원본 함수 대신 반환된 \`throttle\`을 호출하세요. 인자는 원본 함수로 그대로 전달됩니다.

---

## 주요 동작

| 동작               | 설명                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| **스로틀링**       | \`throttle\`을 아무리 자주 호출해도 원본 함수는 \`wait\`당 최대 한 번 실행     |
| **leading 실행**   | \`leading: true\`(기본값)이면 첫 호출 시 즉시 실행                           |
| **trailing 실행**  | \`trailing: true\`(기본값)이면 마지막 호출을 \`wait\` 경과 후 마지막 인자로 실행 |
| **최신 콜백 참조** | 콜백을 ref에 보관해 리렌더링 이후에도 최신 함수 실행 (stale closure 방지) |
| **자동 정리**      | 언마운트 시 대기 중인 타이머 자동 취소                                    |

---

## 기본 사용 예시

\`\`\`tsx
import { useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  // scrollY 반영이 200ms당 최대 한 번으로 제한됩니다.
  const { throttle } = useThrottle((y: number) => setScrollY(y), 200);

  return (
    <div onScroll={(e) => throttle(e.currentTarget.scrollTop)} style={{ height: 300, overflowY: "scroll" }}>
      <p>스크롤 위치: {scrollY}px</p>
      <div style={{ height: 2000 }} />
    </div>
  );
}
\`\`\`

---

## leading / trailing 옵션 조합

| leading | trailing | 동작                                                             |
| ------- | -------- | ---------------------------------------------------------------- |
| true    | true     | (기본값) 첫 호출 즉시 실행 + 마지막 호출 지연 실행               |
| true    | false    | 첫 호출만 즉시 실행, 제한 시간 내 나머지 호출 무시 (연타 방지)   |
| false   | true     | 즉시 실행 없이 제한 시간마다 마지막 호출만 실행                  |
| false   | false    | ⚠️ 원본 함수가 전혀 실행되지 않음 — 사용 금지                    |

\`\`\`tsx
// 버튼 연타 방지: 첫 클릭만 즉시 실행
const { throttle } = useThrottle(submit, 1000, { trailing: false });

// 일정 간격으로 최종 상태만 반영
const { throttle } = useThrottle(sync, 200, { leading: false });
\`\`\`

---

## cancel / flush

\`\`\`tsx
const { throttle, cancel, flush } = useThrottle(save, 500);

cancel(); // 대기 중인 trailing 호출과 마지막 인자를 폐기 (언마운트 시 자동 호출됨)
flush(); // 대기 중인 trailing 호출이 있으면 기다리지 않고 마지막 인자로 즉시 실행
\`\`\`

- \`flush\`는 대기 중인 trailing 호출이 없으면 아무 동작도 하지 않습니다.
- 페이지 이탈 직전 마지막 입력을 반드시 저장해야 할 때 \`flush\`를 사용하세요.

---

## 주의사항 및 엣지 케이스

### 1. 값이 아닌 함수를 스로틀링합니다

이 훅은 "스로틀링된 값"이 아니라 "스로틀링된 함수"를 반환합니다.
상태 값 자체를 지연시키고 싶다면 스로틀링된 함수 안에서 \`setState\`를 호출하세요.

### 2. 인자는 마지막 호출 기준

trailing 실행 시 제한 시간 동안 마지막으로 전달된 인자가 사용됩니다. 중간 호출의 인자는 버려집니다.

### 3. wait / 옵션 변경

\`wait\`, \`leading\`, \`trailing\`이 변경되면 \`throttle\` 함수가 새로 생성됩니다.
이미 예약된 타이머는 이전 설정으로 완료되므로, 동적으로 자주 바꾸는 사용은 피하세요.

### 4. 디바운스와의 차이

- **스로틀**: 이벤트가 계속 발생해도 일정 간격으로 꾸준히 실행 (스크롤 진행률 표시 등)
- **디바운스**: 이벤트가 멈춘 뒤 한 번만 실행 (검색어 자동완성 등)
- 이벤트가 멈춘 뒤 한 번만 실행하려면 \`@leejaehyeok/use-debounce\`를 사용하세요.
`;

export default SkillSection;
