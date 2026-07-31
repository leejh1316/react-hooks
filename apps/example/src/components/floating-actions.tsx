"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Braces } from "lucide-react";

import { BottomSheet } from "@/components/bottom-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrolled } from "@/hooks/use-scrolled";
import { HOOK_USAGE } from "@/lib/hook-usage";
import { cn } from "@/lib/utils";

/** 화면 우측 하단 플로팅 버튼: 맨 위로 이동 + 현재 화면에서 사용한 훅 목록 */
export function FloatingActions() {
  const pathname = usePathname();
  const isScrolled = useScrolled(240);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const usages = HOOK_USAGE[pathname] ?? [];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30">
        <div className="mx-auto flex w-full max-w-[430px] flex-col items-end gap-2 px-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="맨 위로 이동"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
              "pointer-events-auto rounded-full shadow-md transition-all duration-200",
              isScrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            )}
          >
            <ArrowUp />
          </Button>

          <Button
            size="sm"
            aria-label="이 화면에서 사용한 훅 보기"
            onClick={() => setIsSheetOpen(true)}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <Braces />훅 {usages.length}
          </Button>
        </div>
      </div>

      <BottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="이 화면에서 사용한 훅"
        description={`${pathname} 화면 · @leejaehyeok/* 패키지`}
      >
        <ul className="flex flex-col gap-2 pb-4">
          {usages.map((usage) => (
            <li key={usage.name} className="bg-muted/50 rounded-lg border px-3 py-2.5">
              <Badge variant="brand" className="font-mono text-[11px]">
                {usage.name}
              </Badge>
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{usage.where}</p>
            </li>
          ))}
          {usages.length === 0 ? (
            <li className="text-muted-foreground py-6 text-center text-sm">이 화면에 등록된 훅 정보가 없습니다.</li>
          ) : null}
        </ul>
      </BottomSheet>
    </>
  );
}
