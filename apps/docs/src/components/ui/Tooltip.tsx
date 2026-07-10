import { Tooltip as TooltipPrimitive } from "@timeless-ui/react";
import clsx from "clsx";
import { forwardRef } from "react";

const TooltipContent = forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>((props, forwardRef) => {
  const { className, ...contentProps } = props;
  return (
    <TooltipPrimitive.Content
      ref={forwardRef}
      className={clsx(className, "border-line-light rounded-lg border shadow-md")}
      {...contentProps}
    />
  );
});
TooltipContent.displayName = "Tooltip.Content";

const Tooltip = {
  ...TooltipPrimitive,
  Content: TooltipContent,
};
export { Tooltip };
