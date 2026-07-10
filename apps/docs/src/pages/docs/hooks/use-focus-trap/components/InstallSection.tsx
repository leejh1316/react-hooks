import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { INSTALL_CODE } from "../constants/code";

const InstallSection = () => {
  return (
    <section>
      <Document.Heading1>설치</Document.Heading1>
      <Document.Paragraph>
        <InlineCode>@leejaehyeok/use-focus-trap</InlineCode>은 독립 패키지로 배포되어 필요한 훅만 설치할 수 있습니다.{" "}
        <InlineCode>react {">"}= 18</InlineCode>을 peer dependency로 요구합니다.
      </Document.Paragraph>
      <CodeBlock code={INSTALL_CODE} language="bash" />
    </section>
  );
};

export default InstallSection;
