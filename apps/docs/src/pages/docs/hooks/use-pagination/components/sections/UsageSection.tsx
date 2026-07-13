import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import BasicPaginationDemo, { BASIC_PAGINATION_DEMO_CODE } from "../demos/BasicPaginationDemo";
import OptionsPlaygroundDemo, { OPTIONS_PLAYGROUND_DEMO_CODE } from "../demos/OptionsPlaygroundDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        <InlineCode>totalItems</InlineCode>와 <InlineCode>itemsPerPage</InlineCode>를 전달하고, 반환된{" "}
        <InlineCode>paginationRange</InlineCode>를 순회하며 페이지 버튼과 생략 기호를 렌더링하세요. 각 아이템은{" "}
        <InlineCode>type</InlineCode> 필드(<InlineCode>"page"</InlineCode> / <InlineCode>"ellipsis"</InlineCode>)로 구분되고, React 렌더링에
        바로 사용할 수 있는 고유 <InlineCode>key</InlineCode>를 포함합니다.
      </Document.Paragraph>

      {/* 기본 사용법 데모 */}
      <Document.Heading2>기본 사용법</Document.Heading2>
      <Document.Paragraph mb={6}>
        페이지 버튼과 생략 기호, 이전/다음(<InlineCode>‹</InlineCode> / <InlineCode>›</InlineCode>) 및 건너뛰기(
        <InlineCode>«</InlineCode> / <InlineCode>»</InlineCode>) 버튼을 모두 사용하는 예시입니다. <InlineCode>isFirstPage</InlineCode> /{" "}
        <InlineCode>isLastPage</InlineCode>로 양 끝에서 버튼을 비활성화합니다.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <BasicPaginationDemo />
      </PreviewContainer>
      <CodeBlock code={BASIC_PAGINATION_DEMO_CODE} className="mb-8" />

      {/* 옵션 조정 플레이그라운드 데모 */}
      <Document.Heading2>옵션 조정 플레이그라운드</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>totalItems</InlineCode>와 <InlineCode>itemsPerPage</InlineCode>는 전체 페이지 수를 결정하고,{" "}
        <InlineCode>siblings</InlineCode>는 현재 페이지 양옆에 표시할 페이지 수, <InlineCode>boundaries</InlineCode>는 시작과 끝에 항상
        표시할 페이지 수입니다. 아래 데모에서 네 값을 슬라이더로 바꿔가며 <InlineCode>paginationRange</InlineCode>가 어떻게 달라지는지
        확인해 보세요. 마지막 페이지로 이동한 뒤 <InlineCode>totalItems</InlineCode>를 줄이면 현재 페이지가 마지막 페이지로 자동 보정되는
        동작도 확인할 수 있습니다.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <OptionsPlaygroundDemo />
      </PreviewContainer>
      <CodeBlock code={OPTIONS_PLAYGROUND_DEMO_CODE} className="mb-8" />

      {/* 건너뛰기 내비게이션 */}
      <Document.Heading2>건너뛰기 내비게이션</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>handleSkipNext</InlineCode> / <InlineCode>handleSkipPrevious</InlineCode>는 한 번에{" "}
        <InlineCode>siblings × 2 + 1</InlineCode> 페이지씩 이동합니다. 현재 보이는 페이지 묶음(siblings 윈도우)이 통째로 넘어가는 이동
        폭이며, 범위를 벗어나면 첫/마지막 페이지로 보정됩니다.
      </Document.Paragraph>
      <CodeBlock code={SKIP_NAVIGATION_CODE} className="mb-8" />

      {/* 제어 모드 */}
      <Document.Heading2>제어 모드</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>currentPage</InlineCode>와 <InlineCode>onPageChange</InlineCode>를 전달하면 페이지 상태를 외부에서 제어할 수 있습니다.
        URL 쿼리 파라미터와 동기화하거나, 페이지 변경 시 서버에 데이터를 요청하는 서버 사이드 페이지네이션에 유용합니다.
      </Document.Paragraph>
      <CodeBlock code={CONTROLLED_MODE_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const SKIP_NAVIGATION_CODE = `const { handleSkipNext, handleSkipPrevious } = usePagination({
  totalItems: 200,
  itemsPerPage: 10,
  siblings: 2, // 건너뛰기 이동 폭 = 2 × 2 + 1 = 5페이지
});

// 현재 7페이지라면
handleSkipNext(); // → 12페이지
handleSkipPrevious(); // → 2페이지 (범위를 벗어나면 1페이지로 보정)`;

const CONTROLLED_MODE_CODE = `import { useState } from "react";
import { usePagination } from "@leejaehyeok/use-pagination";

function ProductList() {
  const [page, setPage] = useState(1);

  const { paginationRange, handleNext, handlePrevious, isFirstPage, isLastPage } = usePagination({
    totalItems: 200,
    itemsPerPage: 10,
    currentPage: page, // 외부 상태로 페이지 제어 (제어 모드)
    onPageChange: setPage, // 내비게이션 메서드 호출 시 외부 상태 갱신
  });

  // page가 바뀔 때마다 해당 페이지 데이터를 요청합니다.
  const { data } = useQuery(["products", page], () => fetchProducts({ page, limit: 10 }));

  return (
    <>
      <ProductGrid items={data} />
      {/* paginationRange 렌더링은 기본 사용법과 동일합니다 */}
    </>
  );
}`;

export default UsageSection;
