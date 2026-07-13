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
      <CodeBlock code={INSTALL_CODE} language="bash" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const INSTALL_CODE = `npm install @leejaehyeok/use-throttle`;

export default InstallSection;
