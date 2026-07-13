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
        이 패키지는 Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공합니다. "페이지네이션",
        "pagination", "페이지 번호", "무한 목록 페이징" 같은 키워드가 등장하면 에이전트가 이 스킬을 참고해 훅 시그니처, siblings /
        boundaries 범위 계산 규칙, 제어/비제어 모드, 접근성 체크리스트를 반영한 코드를 작성합니다.
      </Document.Paragraph>
      <Document.Paragraph mb={6}>
        아래 스니펫을 그대로 복사해 프로젝트의 <InlineCode>.claude/skills/use-pagination/SKILL.md</InlineCode> 경로에 저장하면 에이전트가
        자동으로 인식합니다.
      </Document.Paragraph>
      <CodeBlock code={SKILL_MD_CODE} language="md" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

/** use-pagination SKILL.md 원문 (변경 시 함께 갱신하세요) */
const SKILL_MD_CODE = `---
name: use-pagination
description: >
  React에서 페이지네이션 UI를 구축할 때 사용하는 headless 훅입니다.
  게시판, 상품 목록, 검색 결과 등 페이지 번호 기반 내비게이션이 필요할 때 반드시 이 스킬을 참고하세요.
  "페이지네이션", "pagination", "페이지 번호", "페이지 이동", "서버 사이드 페이징" 등의 키워드가 나오면 이 스킬을 사용하세요.
---

# use-pagination

페이지네이션 UI 구축에 필요한 모든 로직을 제공하는 headless React 훅입니다.
siblings / boundaries 설정 기반으로 렌더링할 페이지 배열을 계산하고, 생략 기호(ellipsis)를 자동 삽입하며,
제어/비제어 모드를 모두 지원합니다. UI는 포함하지 않으므로 어떤 디자인에도 적용할 수 있습니다.

---

## 훅 시그니처

\`\`\`typescript
function usePagination(props: UsePaginationProps): {
  page: number; // 현재 페이지 (1부터 시작)
  totalPages: number; // Math.ceil(totalItems / itemsPerPage)
  setPage: Dispatch<SetStateAction<number>>; // 특정 페이지로 이동
  handleNext: () => void; // 다음 페이지 (마지막 페이지에서는 무시)
  handlePrevious: () => void; // 이전 페이지 (첫 페이지에서는 무시)
  handleSkipNext: () => void; // siblings × 2 + 1 페이지 앞으로 (범위 초과 시 마지막 페이지)
  handleSkipPrevious: () => void; // siblings × 2 + 1 페이지 뒤로 (범위 초과 시 첫 페이지)
  paginationRange: PaginationItem[]; // 렌더링할 페이지 아이템 배열
  isFirstPage: boolean; // 첫 페이지 여부
  isLastPage: boolean; // 마지막 페이지 여부
};

interface UsePaginationProps {
  totalItems: number; // 전체 항목 수 (필수)
  itemsPerPage: number; // 페이지당 항목 수 (필수)
  siblings?: number; // 현재 페이지 양옆에 표시할 페이지 수 (기본값: 1)
  boundaries?: number; // 시작/끝에 항상 표시할 페이지 수 (기본값: 1)
  defaultPage?: number; // 비제어 모드 초기 페이지 (기본값: 1)
  currentPage?: number; // 전달하면 제어 모드로 동작
  onPageChange?: (page: number) => void; // 페이지 변경 콜백
}

type PaginationItem =
  | { type: "page"; page: number; key: string } // key 예: "page-3"
  | { type: "ellipsis"; key: string }; // key: "left-ellipsis" | "right-ellipsis"
\`\`\`

---

## 주요 동작

| 동작                  | 설명                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **페이지 범위 계산**  | 현재 페이지 양옆 siblings개 + 양 끝 boundaries개를 표시하고 생략 구간에 ellipsis 삽입       |
| **전체 페이지 표시**  | 슬롯 수(siblings × 2 + boundaries × 2 + 3) ≥ totalPages이면 생략 없이 전체 표시             |
| **범위 클램핑**       | 모든 내비게이션 메서드가 1 ~ totalPages 범위를 벗어나지 않도록 자동 보정                    |
| **페이지 자동 보정**  | totalPages가 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 자동 이동                   |
| **제어/비제어 모드**  | currentPage 전달 시 제어 모드, 생략 시 defaultPage 기반 비제어 모드                         |

---

## 기본 사용 예시

\`\`\`tsx
import { usePagination } from "@leejaehyeok/use-pagination";

function Pagination() {
  const { page, setPage, handleNext, handlePrevious, paginationRange, isFirstPage, isLastPage } = usePagination({
    totalItems: 137,
    itemsPerPage: 10,
  });

  return (
    <nav aria-label="페이지네이션">
      <button onClick={handlePrevious} disabled={isFirstPage}>이전</button>

      {paginationRange.map((item) =>
        item.type === "page" ? (
          <button key={item.key} onClick={() => setPage(item.page)} aria-current={item.page === page ? "page" : undefined}>
            {item.page}
          </button>
        ) : (
          <span key={item.key}>…</span>
        ),
      )}

      <button onClick={handleNext} disabled={isLastPage}>다음</button>
    </nav>
  );
}
\`\`\`

---

## 제어 모드 (서버 사이드 페이지네이션)

\`\`\`tsx
const [page, setPage] = useState(1);

const pagination = usePagination({
  totalItems: data?.totalCount ?? 0,
  itemsPerPage: 10,
  currentPage: page, // 외부 상태로 페이지 제어
  onPageChange: setPage, // 내비게이션 메서드 호출 시 외부 상태 갱신
});

// page가 바뀔 때마다 해당 페이지 데이터를 요청
const { data } = useQuery(["items", page], () => fetchItems({ page, limit: 10 }));
\`\`\`

---

## siblings / boundaries 규칙

\`totalPages = 20\`, \`page = 10\` 기준:

| siblings | boundaries | 결과                                  |
| -------- | ---------- | ------------------------------------- |
| 1        | 1          | 1 … 9 10 11 … 20                      |
| 2        | 1          | 1 … 8 9 10 11 12 … 20                 |
| 1        | 2          | 1 2 … 9 10 11 … 19 20                 |
| 0        | 1          | 1 … 10 … 20                           |

- 현재 페이지가 앞쪽/뒤쪽에 가까우면 해당 방향의 ellipsis는 생략됩니다. (예: 1 2 3 4 5 … 20)
- 슬롯 수(siblings × 2 + boundaries × 2 + 3)가 totalPages 이상이면 모든 페이지가 표시됩니다.

---

## 주의사항 및 엣지 케이스

### 1. key는 아이템에 포함된 값을 사용

\`paginationRange\`의 각 아이템은 고유 \`key\`를 포함합니다. 배열 인덱스 대신 \`item.key\`를 사용하세요.

### 2. 제어 모드에서는 onPageChange가 필수

\`currentPage\`만 전달하고 \`onPageChange\`에서 외부 상태를 갱신하지 않으면 페이지가 바뀌지 않습니다.

### 3. totalItems가 동적으로 줄어드는 경우

필터링 등으로 \`totalPages\`가 줄어 현재 페이지가 범위를 벗어나면 훅이 마지막 페이지로 자동 보정하고
\`onPageChange\`도 호출됩니다. 별도의 보정 로직을 작성하지 마세요.

### 4. totalItems가 0인 경우

\`totalPages\`가 0이 되고 \`paginationRange\`는 빈 배열이 됩니다.
빈 목록 상태의 UI는 컴포넌트 레벨에서 분기하세요.

---

## 접근성 체크리스트

- [ ] 페이지네이션 컨테이너에 \`<nav aria-label="페이지네이션">\` 사용
- [ ] 현재 페이지 버튼에 \`aria-current="page"\` 지정
- [ ] 이전/다음/건너뛰기 아이콘 버튼에 \`aria-label\` 제공
- [ ] 첫/마지막 페이지에서 \`isFirstPage\` / \`isLastPage\`로 버튼 \`disabled\` 처리
- [ ] 생략 기호(…)는 클릭할 수 없는 요소(\`<span>\`)로 렌더링
`;

export default SkillSection;
