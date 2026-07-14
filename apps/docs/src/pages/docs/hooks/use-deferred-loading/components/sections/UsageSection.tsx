import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import DeferredLoadingDemo, { DEFERRED_LOADING_DEMO_CODE } from "../demos/DeferredLoadingDemo";
import NoDeferredLoadingDemo from "../demos/NoDeferredLoadingDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        useDeferredLoading 적용 전후의 차이를 직접 비교해 보세요. 미적용 데모는 빠른 요청에서도 스피너가 순간 나타났다 사라지며 깜빡이지만,
        적용 데모는 빠른 요청에서 스피너를 아예 표시하지 않고 느린 요청에서는 스피너가 최소 표시 시간만큼 자연스럽게 유지돼요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>지연된 로딩 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>isLoading</InlineCode>을 그대로 스피너에 연결했을 때의 동작을 보여주는 예시예요.{" "}
        <InlineCode>빠른 요청 (80ms)</InlineCode> 버튼을 눌러보세요. 요청이 80ms 만에 끝나는데도 스피너가 순간 나타났다 사라지면서 화면이
        깜빡여요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoDeferredLoadingDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>지연된 로딩 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 UI에 useDeferredLoading을 적용한 예시예요(<InlineCode>delay: 300</InlineCode>,{" "}
        <InlineCode>minDisplayDuration: 500</InlineCode>). <InlineCode>빠른 요청 (80ms)</InlineCode>은 delay(300ms)보다 먼저 끝나므로
        스피너가 아예 표시되지 않고 결과만 갱신돼요. <InlineCode>느린 요청 (1200ms)</InlineCode>은 300ms 후에 스피너가 나타나고, 한 번
        나타난 스피너는 500ms 이상 유지돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <DeferredLoadingDemo />
      </PreviewContainer>
      <CodeBlock code={DEFERRED_LOADING_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>기본 사용법</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 관리 중인 로딩 상태를 첫 번째 인자로 전달하고, 반환된 <InlineCode>isDeferredLoading</InlineCode>을{" "}
        <InlineCode>isLoading</InlineCode> 대신 스피너 렌더링 조건으로 사용하면 돼요. 옵션을 생략하면 기본값(
        <InlineCode>delay: 100</InlineCode>, <InlineCode>minDisplayDuration: 300</InlineCode>)이 적용돼요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 옵션 조정 */}
      <Document.Heading2>delay와 minDisplayDuration 조정하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>delay</InlineCode>는 "이 시간보다 짧은 로딩은 표시하지 않겠다"는 기준이고, <InlineCode>minDisplayDuration</InlineCode>은
        "한 번 표시한 스피너는 이 시간 이상 유지하겠다"는 기준이에요. 응답이 대체로 빠른 API라면 <InlineCode>delay</InlineCode>를 늘려
        스피너 표시 빈도를 줄이고, 스피너 깜빡임이 거슬린다면 <InlineCode>minDisplayDuration</InlineCode>을 늘려 부드럽게 만들 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={OPTIONS_CODE} className="mb-8" />

      {/* 데이터 페칭 라이브러리와 함께 사용 */}
      <Document.Heading2>데이터 페칭 라이브러리와 함께 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        첫 번째 인자는 어떤 boolean이든 받을 수 있으므로, TanStack Query 같은 데이터 페칭 라이브러리가 제공하는 로딩 상태를 그대로 연결할 수
        있어요.
      </Document.Paragraph>
      <CodeBlock code={QUERY_USAGE_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

function UserList() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading);

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
      {/* isLoading 대신 isDeferredLoading을 사용해요 */}
      {isDeferredLoading && <p>로딩 중...</p>}
      <button onClick={fetchUsers} disabled={isLoading}>
        사용자 목록 조회
      </button>
    </div>
  );
}`;

const OPTIONS_CODE = `// 300ms보다 짧은 로딩은 표시하지 않고,
// 한 번 표시된 스피너는 최소 500ms 동안 유지해요.
const isDeferredLoading = useDeferredLoading(isLoading, {
  delay: 300,
  minDisplayDuration: 500,
});`;

const QUERY_USAGE_CODE = `import { useQuery } from "@tanstack/react-query";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

function SearchResults({ keyword }: { keyword: string }) {
  const { data, isFetching } = useQuery({
    queryKey: ["search", keyword],
    queryFn: () => searchApi(keyword),
  });

  // 캐시 히트 등으로 빠르게 끝나는 refetch에서는 스피너가 표시되지 않아요.
  const isDeferredLoading = useDeferredLoading(isFetching, { delay: 200 });

  if (isDeferredLoading) return <Spinner />;
  return <ResultList data={data} />;
}`;

export default UsageSection;
