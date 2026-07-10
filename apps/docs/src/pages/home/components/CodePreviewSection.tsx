import { CODE_EXAMPLE, CODE_EXAMPLE_FILE_NAME } from "../constants/code-example";

const CodePreviewSection = () => {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="border-line-regular overflow-hidden rounded-xl border">
        {/* Window bar */}
        <div className="border-line-light flex items-center gap-2 border-b bg-neutral-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="text-caption-2 text-ink-disabled ml-2 font-medium">{CODE_EXAMPLE_FILE_NAME}</span>
        </div>
        {/* Code block */}
        <pre className="scrollbar-light overflow-x-auto bg-white p-5">
          <code className="font-code text-body-3 text-ink-secondary whitespace-pre leading-relaxed">{CODE_EXAMPLE}</code>
        </pre>
      </div>
    </section>
  );
};

export default CodePreviewSection;
