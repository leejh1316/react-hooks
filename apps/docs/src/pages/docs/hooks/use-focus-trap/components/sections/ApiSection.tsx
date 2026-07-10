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
        패키지는 <InlineCode>useFocusTrap</InlineCode> 훅 하나를 named export 합니다.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>FocusTrapOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>useEffect</InlineCode> 기반이 아닌 <InlineCode>callback ref</InlineCode>를 반환하므로, ref가 연결/해제되는 시점에
        정확히 맞춰 트랩이 활성화/해제됩니다.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useFocusTrap } from "@leejaehyeok/use-focus-trap";`;

const SIGNATURE_CODE = `function useFocusTrap(options?: FocusTrapOptions): (node: HTMLElement | null) => void;

type FocusTrapOptions = {
  /** 초기 포커스 대상 CSS 선택자 (기본값: "[data-initial-focus]") */
  initialFocusSelector?: string;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useFocusTrap(options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "FocusTrapOptions",
    defaultValue: "{}",
    description: "포커스 트랩의 동작을 제어하는 옵션 객체입니다. 생략할 수 있습니다.",
  },
];

/** FocusTrapOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "initialFocusSelector",
    type: "string",
    defaultValue: '"[data-initial-focus]"',
    description:
      "트랩 활성화 시 처음 포커스할 요소를 찾는 CSS 선택자입니다. 매칭되는 요소가 없으면 첫 번째 포커스 가능 요소, 그것도 없으면 컨테이너 자체에 포커스합니다.",
  },
];

/** useFocusTrap 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "containerRef",
    type: "(node: HTMLElement | null) => void",
    description:
      "포커스를 가둘 컨테이너 요소에 연결하는 callback ref입니다. 요소에 연결되면 트랩이 활성화되고, 요소가 언마운트되면 트랩이 해제되며 이전 포커스가 복원됩니다.",
  },
];

export default ApiSection;
