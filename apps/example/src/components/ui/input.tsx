import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentPropsWithoutRef<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input bg-card shadow-xs flex h-10 w-full min-w-0 rounded-md border px-3 py-1 text-sm outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
});

export { Input, type InputProps };
