"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "focus-visible:ring-ring/50 inline-flex h-6 w-10 shrink-0 items-center rounded-full border outline-none transition-colors focus-visible:ring-[3px]",
        checked ? "bg-brand border-transparent" : "bg-muted",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "bg-card pointer-events-none block size-5 rounded-full shadow transition-transform",
          checked ? "translate-x-[1.125rem]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export { Switch };
