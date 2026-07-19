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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공해요. "오늘 하루 보지 않기",
        "팝업 숨기기", "배너 스누즈", "일정 기간 숨기기" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, 옵션별 동작, 만료
        검사 시점·컴포넌트 간 동기화·SSR 같은 엣지 케이스를 반영한 코드를 작성해요.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-snooze/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식해요.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-snooze SKILL.md 원문 (훅 변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-snooze
description: >
  React에서 "오늘 하루 보지 않기", "일주일간 숨기기" 같은 스누즈(Snooze) 기능을 구현할 때 사용하는 훅이에요.
  팝업, 배너, 툴팁, 공지처럼 사용자가 일정 기간 숨길 수 있어야 하는 UI 요소 작업에는 반드시 이 스킬을 참고하세요.
  "오늘 하루 보지 않기", "다시 보지 않기", "팝업 숨기기", "배너 스누즈", "일정 기간 숨기기", "snooze" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-snooze

웹 스토리지(localStorage / sessionStorage)에 만료 시각을 저장해 팝업·배너 등을 일정 기간 숨기는 React 커스텀 훅이에요.
새로고침하거나 브라우저를 닫았다 열어도 숨김 상태가 유지되며, 만료 시각이 지나면 요소가 다시 노출돼요.

---

## 훅 시그니처

\`\`\`typescript
function useSnooze(options: UseSnoozeOptions): [boolean, () => void];

type UseSnoozeOptions = {
  key: string; // 만료 시각을 저장할 스토리지 key (필수)
  duration: "day" | number; // "day" = 24시간, 숫자 = 밀리초(ms) (필수)
  storageType?: "local" | "session"; // 기본값: "local"
  autoReactivate?: boolean; // 기본값: false
};
\`\`\`

반환값은 **\`[isActive, snooze]\` 튜플**이에요. \`UseSnoozeOptions\` 타입은 export되지 않으므로 위 시그니처를 참고하세요.

---

## 주요 동작

| 동작                 | 설명                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **스누즈 저장**      | \`snooze()\` 호출 시 만료 시각(현재 시각 + duration)을 스토리지에 저장, \`isActive\` → false |
| **초기 상태 판별**   | 마운트 시 스토리지를 읽어 판별: 값 없음 → true, 만료 지남 → true, 만료 전 → false        |
| **duration 정규화**  | \`"day"\` = 24시간(86,400,000ms), 숫자는 ms 그대로                                         |
| **자동 재활성화**    | \`autoReactivate: true\`면 만료 시각에 타이머를 걸어 재마운트 없이 자동 복귀               |
| **SSR 안전**         | window 없으면 스토리지 접근 안 함. 초기값 false, \`snooze()\`는 no-op                      |

---

## 기본 사용 예시

\`\`\`tsx
import { useSnooze } from "@leejaehyeok/use-snooze";

function NoticePopup() {
  const [isActive, snooze] = useSnooze({
    key: "notice-popup",
    duration: "day", // 24시간 동안 숨기기
  });

  if (!isActive) return null;

  return (
    <div role="dialog">
      <p>공지사항입니다.</p>
      <button onClick={snooze}>오늘 하루 보지 않기</button>
    </div>
  );
}
\`\`\`

---

## 옵션 활용

### duration — 숨김 기간

\`\`\`tsx
useSnooze({ key: "daily-banner", duration: "day" }); // 24시간
useSnooze({ key: "hourly-tooltip", duration: 1000 * 60 * 60 }); // 1시간
useSnooze({ key: "weekly-popup", duration: 1000 * 60 * 60 * 24 * 7 }); // 일주일
\`\`\`

### storageType — 유지 범위

- \`"local"\`(기본값): 브라우저를 닫았다 열어도 유지 → "오늘 하루 보지 않기"류에 사용
- \`"session"\`: 현재 탭에서만 유지, 탭을 닫으면 초기화 → "이번 방문 동안만 숨기기"류에 사용

### autoReactivate — 만료 시 자동 재활성화

\`\`\`tsx
// 페이지에 머무는 동안에도 만료 즉시 요소를 다시 보여줘야 하면 켜세요.
useSnooze({ key: "live-banner", duration: 5000, autoReactivate: true });
\`\`\`

---

## 주의사항 및 엣지 케이스

### 1. 만료 검사 시점

만료 여부는 **스토리지를 읽는 시점(마운트)** 에 검사돼요. \`autoReactivate\`가 꺼져 있으면
페이지에 머무는 동안 만료가 지나도 요소가 저절로 나타나지 않아요. 필요하면 \`autoReactivate: true\`를 사용하세요.

### 2. key 관리

- key는 스누즈 대상마다 고유해야 해요. 같은 key를 쓰면 스누즈 상태가 공유돼요.
- 다른 저장값과의 충돌을 피하려면 \`"app/feature/snooze-name"\`처럼 접두사를 붙이세요.

### 3. 컴포넌트 간 동기화 없음

스토리지만 공유될 뿐 상태가 자동 동기화되지는 않아요. 한 컴포넌트에서 \`snooze()\`해도
같은 key를 쓰는 **이미 마운트된** 다른 컴포넌트의 \`isActive\`는 바뀌지 않아요.
여러 곳에서 같은 스누즈 상태를 공유해야 하면 훅을 한 곳에서 호출해 props/context로 내려주세요.

### 4. key / storageType 변경

초기 상태는 마운트 시점에 한 번 계산되므로, 마운트 이후 key나 storageType이 바뀌어도
스토리지를 다시 읽지 않아요. 동적으로 바꿔야 하면 \`key\` prop 등으로 컴포넌트를 재마운트하세요.

### 5. SSR / 스토리지 사용 불가 환경

- 서버 렌더링 시 초기값은 \`false\`(숨김)예요. 클라이언트 마운트 후 실제 값으로 계산되므로 hydration 직후 요소가 나타날 수 있어요.
- 스토리지를 사용할 수 없으면 \`snooze()\`는 아무 동작도 하지 않아요(요소가 계속 노출돼요).

### 6. 만료값 정리

만료가 지나도 스토리지의 값은 자동 삭제되지 않아요(다시 \`snooze()\`하면 덮어써요).
완전히 초기화하려면 \`storage.removeItem(key)\`를 직접 호출하세요.
`;

export default SkillSection;
