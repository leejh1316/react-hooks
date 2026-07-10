import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { DEMO_CODE } from "../constants/code";
import FocusTrapDemo from "./FocusTrapDemo";

const DemoSection = () => {
  return (
    <section>
      <Document.Heading1>데모</Document.Heading1>
      <Document.Paragraph>
        다이얼로그를 연 뒤 <InlineCode>Tab</InlineCode> / <InlineCode>Shift+Tab</InlineCode>을 눌러보세요. 포커스가 다이얼로그 내부에서만
        순환합니다. 이름 입력에 <InlineCode>data-initial-focus</InlineCode>가 지정되어 있어 열리는 즉시 이름 입력으로 포커스가 이동하고,
        다이얼로그를 닫으면 "다이얼로그 열기" 버튼으로 포커스가 복원됩니다.
      </Document.Paragraph>
      <PreviewContainer>
        <FocusTrapDemo />
      </PreviewContainer>

      <Document.Heading2>데모 코드</Document.Heading2>
      <CodeBlock code={DEMO_CODE} />
    </section>
  );
};

export default DemoSection;
