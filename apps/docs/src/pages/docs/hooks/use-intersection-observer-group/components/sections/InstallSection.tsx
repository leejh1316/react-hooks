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
        <InlineCode>useIntersectionObserverGroup</InlineCode>은 <InlineCode>@leejaehyeok/use-intersection-observer</InlineCode> 패키지에
        포함되어 있어요.
      </Document.Paragraph>
      <CodeBlock code={INSTALL_CODE} language="bash" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const INSTALL_CODE = `npm install @leejaehyeok/use-intersection-observer`;

export default InstallSection;
