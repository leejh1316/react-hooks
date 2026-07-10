import { Tooltip } from "@timeless-ui/react";
import type { TooltipRootProps } from "@timeless-ui/react";
import IconButton from "../ui/IconButton";
interface DescriptionTooltipProps extends Omit<TooltipRootProps, "children"> {
  description?: string;
}
const DescriptionTooltip = ({ description, ...props }: DescriptionTooltipProps) => {
  if (!description) {
    return null;
  }
  return (
    <Tooltip.Root placement="top" {...props}>
      <Tooltip.Trigger asChild>
        <IconButton name="info" size="tiny" className="rounded-md transition-colors hover:bg-neutral-100" />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.View className="z-50">
          <Tooltip.Content className="text-ink-secondary text-body-3 max-w-72 rounded-lg bg-white p-3 shadow-sm">
            {description}
          </Tooltip.Content>
        </Tooltip.View>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
DescriptionTooltip.displayName = "DescriptionTooltip";

export { DescriptionTooltip };
