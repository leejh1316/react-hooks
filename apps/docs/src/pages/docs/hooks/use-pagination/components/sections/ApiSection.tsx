import { CodeBlock, ParameterTable, ReturnTable, type ParameterTableRow, type ReturnTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const ApiSection = () => {
  return (
    <section>
      <Document.Heading1>API</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지는 <InlineCode>usePagination</InlineCode> 훅과 <InlineCode>UsePaginationProps</InlineCode>,{" "}
        <InlineCode>PaginationItem</InlineCode> 타입을 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>UsePaginationProps</Document.Heading3>
      <ParameterTable rows={PROPS_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        페이지 상태, 렌더링용 배열, 내비게이션 메서드를 담은 객체를 반환해요. 내비게이션 메서드는 모두{" "}
        <InlineCode>1 ~ totalPages</InlineCode> 범위를 벗어나지 않도록 자동 보정돼요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { usePagination } from "@leejaehyeok/use-pagination";
import type { UsePaginationProps, PaginationItem } from "@leejaehyeok/use-pagination";`;

const SIGNATURE_CODE = `function usePagination(props: UsePaginationProps): {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSkipNext: () => void;
  handleSkipPrevious: () => void;
  paginationRange: PaginationItem[];
  isFirstPage: boolean;
  isLastPage: boolean;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** usePagination(props) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "props",
    type: "UsePaginationProps",
    description: "페이지네이션의 동작을 설정하는 객체예요. totalItems와 itemsPerPage는 필수예요.",
  },
];

/** UsePaginationProps 필드 */
const PROPS_ROWS: ParameterTableRow[] = [
  {
    name: "totalItems",
    type: "number",
    description: "전체 항목 수예요. itemsPerPage와 함께 전체 페이지 수(totalPages) 계산에 사용돼요.",
  },
  {
    name: "itemsPerPage",
    type: "number",
    description: "한 페이지에 표시할 항목 수예요. totalPages = Math.ceil(totalItems / itemsPerPage)로 계산돼요.",
  },
  {
    name: "siblings",
    type: "number",
    defaultValue: "1",
    description:
      "현재 페이지 양옆에 표시할 페이지 수예요. 건너뛰기 내비게이션의 이동 폭(siblings × 2 + 1)에도 사용돼요.",
  },
  {
    name: "boundaries",
    type: "number",
    defaultValue: "1",
    description: "목록의 시작과 끝에 항상 표시할 페이지 수예요.",
  },
  {
    name: "defaultPage",
    type: "number",
    defaultValue: "1",
    description: "비제어 모드에서 사용할 초기 페이지예요. currentPage를 전달하면 무시돼요.",
  },
  {
    name: "currentPage",
    type: "number",
    description:
      "제어 모드에서 사용할 현재 페이지예요. 전달하면 훅이 내부 상태 대신 이 값을 사용하므로, onPageChange에서 외부 상태를 갱신해야 페이지가 변경돼요.",
  },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    description: "페이지가 변경될 때 새 페이지 번호와 함께 호출되는 콜백이에요. 제어/비제어 모드 모두에서 호출돼요.",
  },
];

/** usePagination 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "page",
    type: "number",
    description: "현재 페이지 번호예요. (1부터 시작)",
  },
  {
    name: "totalPages",
    type: "number",
    description: "전체 페이지 수예요. Math.ceil(totalItems / itemsPerPage)로 계산돼요.",
  },
  {
    name: "setPage",
    type: "Dispatch<SetStateAction<number>>",
    description: "특정 페이지로 이동하는 함수예요. setPage(5) 또는 setPage((prev) => prev + 1) 형태로 사용할 수 있어요.",
  },
  {
    name: "handleNext",
    type: "() => void",
    description: "다음 페이지로 이동해요. 마지막 페이지에서는 아무 동작도 하지 않아요.",
  },
  {
    name: "handlePrevious",
    type: "() => void",
    description: "이전 페이지로 이동해요. 첫 페이지에서는 아무 동작도 하지 않아요.",
  },
  {
    name: "handleSkipNext",
    type: "() => void",
    description: "siblings × 2 + 1 페이지만큼 앞으로 건너뛰어요. 범위를 벗어나면 마지막 페이지로 이동해요.",
  },
  {
    name: "handleSkipPrevious",
    type: "() => void",
    description: "siblings × 2 + 1 페이지만큼 뒤로 건너뛰어요. 범위를 벗어나면 첫 페이지로 이동해요.",
  },
  {
    name: "paginationRange",
    type: "PaginationItem[]",
    description:
      '렌더링할 페이지 아이템 배열이에요. type 필드("page" / "ellipsis")로 구분되며, 각 아이템은 React 렌더링용 고유 key를 포함해요.',
  },
  {
    name: "isFirstPage",
    type: "boolean",
    description: "현재 페이지가 첫 페이지인지 여부예요. 이전/건너뛰기 버튼 비활성화에 사용하세요.",
  },
  {
    name: "isLastPage",
    type: "boolean",
    description: "현재 페이지가 마지막 페이지인지 여부예요. 다음/건너뛰기 버튼 비활성화에 사용하세요.",
  },
];

export default ApiSection;
