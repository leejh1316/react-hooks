import { CodeBlock, ParameterTable, ReturnTable } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { OPTION_ROWS, PARAMETER_ROWS, RETURN_ROWS } from "../constants/api";
import { IMPORT_CODE, SIGNATURE_CODE } from "../constants/code";

const ApiSection = () => {
  return (
    <section>
      <Document.Heading1>API</Document.Heading1>
      <Document.Paragraph>
        패키지는 <InlineCode>useFocusTrap</InlineCode> 훅 하나를 named export 합니다.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>FocusTrapOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>useEffect</InlineCode> 기반이 아닌 <InlineCode>callback ref</InlineCode>를 반환하므로, ref가 연결/해제되는 시점에
        정확히 맞춰 트랩이 활성화/해제됩니다.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

export default ApiSection;
