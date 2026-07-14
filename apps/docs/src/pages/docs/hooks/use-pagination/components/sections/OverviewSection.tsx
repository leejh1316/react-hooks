import { BehaviorTable, type BehaviorTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const OverviewSection = () => {
  return (
    <section>
      <Document.Heading1>개요</Document.Heading1>
      <Document.Paragraph mb={8}>
        <InlineCode>usePagination</InlineCode>은 페이지네이션 로직을 제공하는 headless 훅이에요. 훅을 호출하면 렌더링할 페이지 번호 배열{" "}
        <InlineCode>paginationRange</InlineCode>와 이전/다음/건너뛰기 내비게이션 메서드, 상태
        헬퍼를 반환해요. UI를 포함하지 않으므로 어떤 디자인의 페이지네이션 컴포넌트든 자유롭게 구축할 수 있어요.{" "}
        <InlineCode>totalItems</InlineCode>와 <InlineCode>itemsPerPage</InlineCode>만 전달하면 전체 페이지 수가 자동 계산되고, 페이지가
        많아지면 <InlineCode>siblings</InlineCode> / <InlineCode>boundaries</InlineCode> 설정에 따라 생략 기호(ellipsis)가 자동으로
        삽입돼요.
      </Document.Paragraph>

      <Document.Heading2>주요 동작</Document.Heading2>
      <BehaviorTable rows={BEHAVIOR_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Behavior Data
   ────────────────────────────────────────────── */

/** 훅의 주요 동작 요약 */
const BEHAVIOR_ROWS: BehaviorTableRow[] = [
  {
    name: "페이지 범위 계산",
    description:
      "현재 페이지 양옆에 siblings개, 시작과 끝에 boundaries개의 페이지를 항상 표시하고, 그 사이의 생략된 구간에는 ellipsis 아이템을 자동으로 삽입해요.",
  },
  {
    name: "전체 페이지 표시",
    description:
      "표시할 슬롯 수(siblings × 2 + boundaries × 2 + 3)가 전체 페이지 수 이상이면 생략 기호 없이 모든 페이지를 표시해요.",
  },
  {
    name: "범위 클램핑",
    description:
      "handleNext / handlePrevious는 1 ~ totalPages 범위를 벗어나지 않고, handleSkipNext / handleSkipPrevious는 siblings × 2 + 1 페이지씩 이동하되 범위를 벗어나면 첫/마지막 페이지로 보정돼요.",
  },
  {
    name: "페이지 자동 보정",
    description:
      "totalItems나 itemsPerPage 변경으로 전체 페이지 수가 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 자동 이동해요. (예: 목록 필터링으로 항목 수가 줄어든 경우)",
  },
  {
    name: "제어 / 비제어 모드",
    description:
      "currentPage를 전달하면 외부 상태로 페이지를 제어하는 제어 모드로, 생략하면 defaultPage에서 시작하는 비제어 모드로 동작해요. 두 모드 모두 페이지 변경 시 onPageChange가 호출돼요.",
  },
  {
    name: "렌더링 키 제공",
    description: 'paginationRange의 모든 아이템은 React 렌더링에 바로 사용할 수 있는 고유 key를 포함해요. (예: "page-3", "left-ellipsis")',
  },
];

export default OverviewSection;
