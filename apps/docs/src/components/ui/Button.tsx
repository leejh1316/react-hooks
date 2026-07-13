import { Button as ButtonPrimitive } from "@timeless-ui/react";
import type { ButtonProps as ButtonPrimitiveProps } from "@timeless-ui/react";
import { forwardRef } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends ButtonPrimitiveProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "bg-ink-primary text-ink-white font-semibold transition-opacity hover:opacity-85",
  secondary: "border-line-regular text-ink-secondary border font-medium transition-colors hover:bg-neutral-50",
};

const sizeMap: Record<ButtonSize, string> = {
  md: "px-4 py-2",
  lg: "px-5 py-2.5",
};

const Button = forwardRef<React.ComponentRef<typeof ButtonPrimitive>, ButtonProps>((props, forwardedRef) => {
  const { variant = "primary", size = "md", className, ...buttonProps } = props;
  return (
    <ButtonPrimitive
      ref={forwardedRef}
      className={clsx("text-body-3 cursor-pointer rounded-lg", variantMap[variant], sizeMap[size], className)}
      {...buttonProps}
    />
  );
});
Button.displayName = "Button";

export { Button };
