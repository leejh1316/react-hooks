import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const TypesSection = () => {
  return (
    <section>
      <Document.Heading1>API — 타입</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지가 export 하는 타입이에요. <InlineCode>PaginationItem</InlineCode>은 <InlineCode>type</InlineCode> 필드로 구분되는
        discriminated union이므로, <InlineCode>item.type === "page"</InlineCode>로 좁히면 <InlineCode>item.page</InlineCode>에 타입
        안전하게 접근할 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={TYPES_CODE} language="ts" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const TYPES_CODE = `// paginationRange 배열의 아이템 — type 필드로 구분되는 discriminated union
type PaginationItem =
  | {
      type: "page";
      page: number; // 페이지 번호
      key: string; // React 렌더링용 고유 키 (예: "page-3")
    }
  | {
      type: "ellipsis";
      key: string; // "left-ellipsis" | "right-ellipsis"
    };

// usePagination의 props
interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  siblings?: number; // 기본값: 1
  boundaries?: number; // 기본값: 1
  defaultPage?: number; // 기본값: 1
  currentPage?: number; // 전달하면 제어 모드로 동작
  onPageChange?: (page: number) => void;
}`;

export default TypesSection;
