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
        패키지는 <InlineCode>useDeferredLoading</InlineCode> 훅 하나를 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>DeferredLoadingOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        지연 및 최소 표시 시간이 반영된 로딩 상태를 <InlineCode>boolean</InlineCode>으로 반환해요. 스피너, 스켈레톤 등 로딩 UI의 렌더링
        조건에 <InlineCode>isLoading</InlineCode> 대신 이 값을 사용하면 돼요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";`;

const SIGNATURE_CODE = `function useDeferredLoading(isLoading: boolean, options?: DeferredLoadingOptions): boolean;

type DeferredLoadingOptions = {
  /** 로딩 상태를 표시하기까지의 지연 시간(ms) (기본값: 100) */
  delay?: number;
  /** 로딩 상태가 한 번 표시된 후 최소 유지 시간(ms) (기본값: 300) */
  minDisplayDuration?: number;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useDeferredLoading(isLoading, options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "isLoading",
    type: "boolean",
    defaultValue: "-",
    description: "원본 로딩 상태예요. useState로 관리하는 값이든 데이터 페칭 라이브러리가 제공하는 값이든 어떤 boolean이든 전달할 수 있어요.",
  },
  {
    name: "options",
    type: "DeferredLoadingOptions",
    defaultValue: "{}",
    description: "지연 시간과 최소 표시 시간을 제어하는 옵션 객체예요. 생략할 수 있어요.",
  },
];

/** DeferredLoadingOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "delay",
    type: "number",
    defaultValue: "100",
    description:
      "isLoading이 true가 된 후 isDeferredLoading을 true로 전환하기까지 대기하는 시간(ms)이에요. 이 시간보다 먼저 로딩이 끝나면 isDeferredLoading은 true가 되지 않아요.",
  },
  {
    name: "minDisplayDuration",
    type: "number",
    defaultValue: "300",
    description:
      "isDeferredLoading이 한 번 true가 된 후 최소한 유지되는 시간(ms)이에요. 로딩이 이보다 먼저 끝나도 남은 시간만큼 true 상태가 유지돼요.",
  },
];

/** useDeferredLoading 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "isDeferredLoading",
    type: "boolean",
    description:
      "지연된 로딩 상태예요. 로딩이 delay 이상 지속될 때만 true가 되고, 한 번 true가 되면 minDisplayDuration 이상 유지된 후 false로 돌아가요.",
  },
];

export default ApiSection;
