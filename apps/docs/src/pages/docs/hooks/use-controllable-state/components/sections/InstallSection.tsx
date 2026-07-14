import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";

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

const INSTALL_CODE = `npm install @leejaehyeok/use-controllable-state`;

export default InstallSection;
