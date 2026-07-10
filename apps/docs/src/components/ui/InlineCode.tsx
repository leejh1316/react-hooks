import clsx from "clsx";
import { ComponentProps } from "react";
const InlineCode = ({ className, ...props }: ComponentProps<"code">) => {
  return (
    <code
      data-inline-code
      className={clsx(className, "font-code text-primary-500 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[0.875em]")}
      {...props}
    />
  );
};
InlineCode.displayName = "InlineCode";

export { InlineCode };
