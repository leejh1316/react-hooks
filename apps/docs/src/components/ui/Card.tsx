import clsx from "clsx";
import { forwardRef } from "react";

const Card = forwardRef<React.ComponentRef<"div">, React.ComponentPropsWithRef<"div">>(({ className, ...props }, forwardedRef) => {
  return <div ref={forwardedRef} className={clsx(className, "border-line-regular rounded-xl border")} {...props} />;
});
Card.displayName = "Card";

export { Card };
