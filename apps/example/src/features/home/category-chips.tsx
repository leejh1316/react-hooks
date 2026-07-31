"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { useOverflow } from "@leejaehyeok/use-overflow";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/menu-data";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  value: CategoryId;
  onChange: (category: CategoryId) => void;
};

/**
 * - useRovingFocus : ← → (펼친 상태에서는 ↑ ↓ 까지) 키로 칩 사이를 이동. 활성 칩만 tabIndex=0.
 * - useOverflow    : 칩이 컨테이너를 넘칠 때만 '전체' 버튼을 노출.
 * - useComposedRefs: 두 훅이 각각 돌려주는 ref를 하나의 엘리먼트에 연결.
 */
export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { containerRef: rovingRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: isExpanded ? "both" : "horizontal",
    loop: true,
    colSkipCount: 3,
    scrollIntoView: { block: "nearest", inline: "center" },
  });
  const { containerRef: overflowRef, isOverflow } = useOverflow();
  const composedRef = useComposedRefs<HTMLDivElement>(rovingRef, overflowRef);

  return (
    <div className="mt-3 flex items-start gap-2 px-4">
      <div
        ref={composedRef}
        onKeyDown={handleKeyDown}
        role="tablist"
        aria-label="메뉴 카테고리"
        aria-orientation="horizontal"
        className={cn("no-scrollbar min-w-0 flex-1 gap-1.5", isExpanded ? "flex flex-wrap" : "flex overflow-x-auto")}
      >
        {CATEGORIES.map((category) => {
          const isSelected = category.id === value;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              data-roving-item
              data-overflow-item
              aria-selected={isSelected}
              onClick={() => onChange(category.id)}
              className={cn(
                "focus-visible:ring-ring/50 shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2",
                isSelected ? "border-brand bg-brand font-medium text-white" : "bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {isOverflow || isExpanded ? (
        <Button
          variant="outline"
          size="icon"
          aria-label={isExpanded ? "카테고리 접기" : "카테고리 전체 보기"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="shrink-0 rounded-full"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ) : null}
    </div>
  );
}
