import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const InstallSection = () => {
  return (
    <section>
      <Document.Heading1>설치</Document.Heading1>
      <Document.Paragraph mb={6}>
        <InlineCode>@leejaehyeok/use-throttle</InlineCode>은 npm에 배포된 독립 패키지로, 필요한 훅만 설치할 수 있습니다.{" "}
        <InlineCode>react {">"}= 18</InlineCode>을 peer dependency로 요구합니다.
      </Document.Paragraph>
      <CodeBlock code={INSTALL_CODE} language="bash" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const INSTALL_CODE = `npm install @leejaehyeok/use-throttle`;

export default InstallSection;
