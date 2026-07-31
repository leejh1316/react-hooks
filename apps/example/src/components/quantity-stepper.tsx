"use client";

import { Minus, Plus } from "lucide-react";
import { useControllableState } from "@leejaehyeok/use-controllable-state";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  /** 값을 넘기면 제어 모드, 넘기지 않으면 내부 상태(비제어)로 동작한다. */
  value?: number;
  defaultValue?: number;
  onChange?: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "default";
  label?: string;
};

/**
 * - useControllableState : 제어 / 비제어를 하나의 컴포넌트로 지원 (상세 시트는 비제어, 장바구니는 제어)
 * - usePrevRef : 직전 수량과 비교해 숫자가 올라갔는지 내려갔는지 방향 애니메이션을 결정
 */
export function QuantityStepper({
  value,
  defaultValue = 1,
  onChange,
  min = 1,
  max = 20,
  size = "default",
  label = "수량",
}: QuantityStepperProps) {
  const [quantity, setQuantity] = useControllableState<number>({ value, defaultValue, onChange });
  const prevQuantityRef = usePrevRef(quantity);

  const direction = quantity > prevQuantityRef.current ? "up" : quantity < prevQuantityRef.current ? "down" : "none";

  const decrease = () => setQuantity((prev) => Math.max(min, prev - 1));
  const increase = () => setQuantity((prev) => Math.min(max, prev + 1));

  const buttonSize = size === "sm" ? "icon-sm" : "icon";

  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <Button variant="outline" size={buttonSize} aria-label="수량 줄이기" onClick={decrease} disabled={quantity <= min}>
        <Minus />
      </Button>

      <span
        className={cn("relative overflow-hidden text-center tabular-nums", size === "sm" ? "w-7 text-sm" : "w-9 text-base font-medium")}
      >
        <span
          key={quantity}
          className={cn(
            "animate-in fade-in block duration-200",
            direction === "up" && "slide-in-from-bottom-2",
            direction === "down" && "slide-in-from-top-2",
          )}
        >
          {quantity}
        </span>
      </span>

      <Button variant="outline" size={buttonSize} aria-label="수량 늘리기" onClick={increase} disabled={quantity >= max}>
        <Plus />
      </Button>
    </div>
  );
}
