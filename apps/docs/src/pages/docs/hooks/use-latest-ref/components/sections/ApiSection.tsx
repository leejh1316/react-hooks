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
        패키지는 <InlineCode>useLatestRef</InlineCode> 훅 하나를 named export 합니다. 별도의 옵션 객체는 받지 않는 단일 인자 훅입니다.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        전달한 값의 최신 상태를 담고 있는 <InlineCode>RefObject</InlineCode>를 반환합니다. 객체 자체의 참조는 컴포넌트 생명주기 동안
        바뀌지 않으며, 값이 변경될 때마다 <InlineCode>useLayoutEffect</InlineCode>에서 <InlineCode>.current</InlineCode>가 동기적으로
        갱신됩니다.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />

      {/* 주의사항 */}
      <Document.Heading2>주의사항</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>ref.current</InlineCode>는 렌더링 이후 실행되는 콜백(이펙트, 타이머, 이벤트 핸들러 등)에서 읽어야 합니다. 렌더링 도중에
        읽으면 이전 렌더링의 값이 반환될 수 있고, 값이 바뀌어도 리렌더링이 일어나지 않으므로 화면에 표시할 값으로는 사용할 수 없습니다.
        화면에 표시해야 하는 값은 <InlineCode>useState</InlineCode>를 그대로 사용하세요.
      </Document.Paragraph>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useLatestRef } from "@leejaehyeok/use-latest-ref";`;

const SIGNATURE_CODE = `function useLatestRef<T>(value: T): React.RefObject<T>;`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useLatestRef(value) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "value",
    type: "T",
    description:
      "최신 상태로 유지할 값입니다. 상태, props, 콜백 함수 등 어떤 타입이든 전달할 수 있으며, 값이 바뀔 때마다 반환된 ref의 current가 갱신됩니다.",
  },
];

/** useLatestRef 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "ref",
    type: "React.RefObject<T>",
    description:
      "항상 최신 value를 담고 있는 ref 객체입니다. 참조가 안정적이므로 의존성 배열에 넣어도 재실행을 일으키지 않으며, 콜백 안에서 ref.current로 최신 값을 읽으세요.",
  },
];

export default ApiSection;
