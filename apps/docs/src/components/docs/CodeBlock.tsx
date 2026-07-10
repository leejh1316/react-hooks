import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Card } from "../ui/Card";
import clsx from "clsx";
import { CopyButton } from "../ui/CopyButton";

interface CodeBlockProps extends React.ComponentProps<"div"> {
  code: string;
  language?: string;
}
const CodeBlock = ({ code, language = "tsx", className, ...props }: CodeBlockProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    codeToHtml(code, {
      lang: "tsx",
      theme: "one-dark-pro",
    }).then((html) => {
      setHighlightedCode(html);
    });
  }, [code, language]);

  return (
    <Card className={clsx(className, "scrollbar-dark! text-body-4 bg-[#282c34] p-5 tracking-normal")} {...props}>
      <div className="mb-1 flex items-center justify-between">
        <span className="font-code text-ink-tertiary text-caption-2 select-none font-semibold">{language.toUpperCase()}</span>
        <CopyButton
          text={code}
          size="xs"
          className="text-icon-tertiary hover:text-icon-white hover:bg-icon-tertiary/10 rounded-md transition-colors"
        />
      </div>
      <div className="overflow-x-auto pb-2">
        <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </div>
    </Card>
  );
};

CodeBlock.displayName = "CodeBlock";
export { CodeBlock };
