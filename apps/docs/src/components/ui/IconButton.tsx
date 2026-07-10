import { Button as ButtonPrimitive } from "@timeless-ui/react";
import type { ButtonProps as ButtonPrimitiveProps } from "@timeless-ui/react";
import { forwardRef } from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import clsx from "clsx";

// TODO: lucide-react 아이콘의 DynamicIcon 적용 필요
export type IconButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "tiny";
export interface IconButtonProps extends ButtonPrimitiveProps {
  size?: IconButtonSize;
  name: IconName;
}

type SizeOption = {
  containerSize: string;
  iconSize: number;
};
const sizeMap: Record<IconButtonSize, SizeOption> = {
  xl: { containerSize: "w-[54px] h-[54px]", iconSize: 24 },
  lg: { containerSize: "w-12 h-12", iconSize: 24 },
  md: { containerSize: "w-[42px] h-[42px]", iconSize: 20 },
  sm: { containerSize: "w-9 h-9", iconSize: 20 },
  xs: { containerSize: "w-8 h-8", iconSize: 16 },
  tiny: { containerSize: "w-7 h-7", iconSize: 16 },
};

const IconButton = forwardRef<React.ComponentRef<typeof ButtonPrimitive>, IconButtonProps>((props, forwardedRef) => {
  const { name, size = "md", className, ...buttonProps } = props;
  const sizeOption = sizeMap[size];
  return (
    <ButtonPrimitive
      ref={forwardedRef}
      className={clsx(className, sizeOption.containerSize, "inline-flex cursor-pointer items-center justify-center")}
      {...buttonProps}
    >
      <DynamicIcon name={name} color="currentColor" size={sizeOption.iconSize} />
    </ButtonPrimitive>
  );
});
IconButton.displayName = "IconButton";

export default IconButton;
