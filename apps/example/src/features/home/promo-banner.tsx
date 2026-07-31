"use client";

import { Sparkles, X } from "lucide-react";
import { useSnooze } from "@leejaehyeok/use-snooze";

import { ClientOnly } from "@/components/client-only";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const PROMO_SNOOZE_KEY = "brewly/promo-banner";

/** useSnooze: '오늘 하루 보지 않기'를 누르면 24시간 동안 배너를 감춘다. (localStorage에 만료 시각 저장) */
function PromoBannerInner() {
  const [isActive, snooze] = useSnooze({
    key: PROMO_SNOOZE_KEY,
    duration: "day",
    storageType: "local",
  });
  const { showToast } = useToast();

  if (!isActive) return null;

  return (
    <div className="from-brand-soft to-accent relative mx-4 mt-3 overflow-hidden rounded-xl bg-gradient-to-r p-3.5">
      <div className="flex items-start gap-2.5">
        <Sparkles className="text-brand mt-0.5 size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">오늘의 혜택 · 아이스 음료 20% 할인</p>
          <p className="text-muted-foreground mt-0.5 text-xs">오후 2시부터 5시까지, 앱 주문 시 자동 적용됩니다.</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground -ml-2 mt-1 h-7 text-xs"
            onClick={() => {
              snooze();
              showToast("오늘 하루 이 배너를 표시하지 않습니다.");
            }}
          >
            오늘 하루 보지 않기
          </Button>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="배너 닫기" onClick={snooze} className="shrink-0">
          <X />
        </Button>
      </div>
    </div>
  );
}

export function PromoBanner() {
  return (
    <ClientOnly>
      <PromoBannerInner />
    </ClientOnly>
  );
}
