import { forwardRef, useCallback, useRef, useState } from "react";
import IconButton, { IconButtonProps } from "../ui/IconButton";
import { Tooltip } from "@timeless-ui/react";
import { IconName } from "lucide-react/dynamic";

interface CopyButtonProps extends Omit<IconButtonProps, "name"> {
  text: string;
}
type CopyStatus = "idle" | "copied" | "error";
const iconName: Record<CopyStatus, IconName> = {
  idle: "copy",
  copied: "check",
  error: "circle-x",
};
const CopyButton = forwardRef<React.ComponentRef<typeof IconButton>, CopyButtonProps>((props, forwardedRef) => {
  const { text, ...iconButtonProps } = props;
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch (error) {
      setCopyStatus("error");
    } finally {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [text]);

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton aria-label="copy button" ref={forwardedRef} name={iconName[copyStatus]} onClick={handleCopy} {...iconButtonProps} />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.View>
          <Tooltip.Content className="text-ink-primary text-caption-1 rounded-md bg-white px-3 py-1.5 text-xs font-semibold shadow-md">
            {copyStatus === "idle" && "클릭하여 복사하기"}
            {copyStatus === "copied" && "복사 완료!"}
            {copyStatus === "error" && "복사 실패"}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.View>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
});
CopyButton.displayName = "CopyButton";

export { CopyButton };
