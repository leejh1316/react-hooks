"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck, Loader2, ShoppingBag, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

import { BottomSheet } from "@/components/bottom-sheet";
import { ClientOnly } from "@/components/client-only";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const DELIVERY_FEE = 0;

function CartInner() {
  const router = useRouter();
  const { lines, updateQuantity, removeItem, clearCart, totalCount, totalPrice } = useCart();
  const { showToast } = useToast();

  const [isOrdering, setIsOrdering] = useState(false);
  const [isDoneSheetOpen, setIsDoneSheetOpen] = useState(false);
  const [isClearSheetOpen, setIsClearSheetOpen] = useState(false);

  /** 결제 금액이 늘었는지 줄었는지 직전 값과 비교해서 표시 */
  const prevTotalRef = usePrevRef(totalPrice);
  const diff = totalPrice - prevTotalRef.current;

  /** 주문 처리가 짧게 끝나면 스피너를 띄우지 않는다. */
  const isOrderLoading = useDeferredLoading(isOrdering, { delay: 120, minDisplayDuration: 400 });

  const handleOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setIsDoneSheetOpen(true);
    }, 900);
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <ShoppingBag className="text-muted-foreground/50 size-12" />
        <p className="mt-4 text-sm font-medium">장바구니가 비어 있어요</p>
        <p className="text-muted-foreground mt-1 text-xs">마음에 드는 메뉴를 담아보세요.</p>
        <Button asChild className="mt-5">
          <Link href="/">메뉴 보러 가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          담은 메뉴 <span className="text-brand">{totalCount}</span>
        </h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs" onClick={() => setIsClearSheetOpen(true)}>
          <Trash2 />
          전체 삭제
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {lines.map((line) => (
          <li key={`${line.id}-${line.option}`} className="bg-card flex items-center gap-3 rounded-xl border p-3">
            <span className="bg-brand-soft flex size-14 shrink-0 items-center justify-center rounded-lg text-2xl" aria-hidden>
              {line.emoji}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium">{line.name}</p>
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] uppercase">
                  {line.option}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">{formatPrice(line.price)}</p>

              <div className="mt-2 flex items-center justify-between">
                {/* 제어 모드: 장바구니 상태가 곧 스테퍼의 값이 된다. */}
                <QuantityStepper
                  size="sm"
                  min={1}
                  max={20}
                  value={line.quantity}
                  onChange={(quantity) => updateQuantity(line.id, line.option, quantity)}
                />
                <div className="flex items-center gap-1">
                  <strong className="text-sm">{formatPrice(line.price * line.quantity)}</strong>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`${line.name} 삭제`}
                    onClick={() => {
                      removeItem(line.id, line.option);
                      showToast(`${line.name}을(를) 삭제했어요.`);
                    }}
                  >
                    <Trash2 className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-card mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">주문 금액</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">배달비</span>
          <span>{DELIVERY_FEE === 0 ? "무료" : formatPrice(DELIVERY_FEE)}</span>
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">결제 예정 금액</span>
          <div className="flex items-center gap-2">
            {diff !== 0 ? (
              <span
                key={totalPrice}
                className={cn(
                  "animate-in fade-in flex items-center gap-0.5 text-[11px] font-medium duration-300",
                  diff > 0 ? "text-brand slide-in-from-bottom-1" : "slide-in-from-top-1 text-blue-500",
                )}
              >
                {diff > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {diff > 0 ? "+" : ""}
                {formatPrice(diff)}
              </span>
            ) : null}
            <strong className="text-brand text-lg">{formatPrice(totalPrice + DELIVERY_FEE)}</strong>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-4 w-full" onClick={handleOrder} disabled={isOrdering}>
        {isOrderLoading ? <Loader2 className="animate-spin" /> : null}
        {isOrderLoading ? "주문 처리 중…" : `${formatPrice(totalPrice + DELIVERY_FEE)} 주문하기`}
      </Button>

      <BottomSheet
        open={isDoneSheetOpen}
        onClose={() => setIsDoneSheetOpen(false)}
        title="주문이 완료되었어요"
        description="약 12분 후 픽업 가능합니다."
        footer={
          <Button
            size="lg"
            className="w-full"
            data-initial-focus
            onClick={() => {
              clearCart();
              setIsDoneSheetOpen(false);
              showToast("주문이 접수되었습니다. ☕", "success");
              router.push("/");
            }}
          >
            확인
          </Button>
        }
      >
        <div className="flex flex-col items-center py-6">
          <CircleCheck className="text-brand size-14" />
          <p className="mt-4 text-sm font-medium">브루리 역삼점에서 준비 중이에요</p>
          <p className="text-muted-foreground mt-1 text-xs">
            주문번호 A-{String(Math.floor(totalPrice % 1000)).padStart(3, "0")} · 총 {totalCount}잔
          </p>
        </div>
      </BottomSheet>

      <BottomSheet
        open={isClearSheetOpen}
        onClose={() => setIsClearSheetOpen(false)}
        title="장바구니를 비울까요?"
        description="담은 메뉴가 모두 삭제됩니다."
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setIsClearSheetOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              data-initial-focus
              onClick={() => {
                clearCart();
                setIsClearSheetOpen(false);
                showToast("장바구니를 비웠어요.", "danger");
              }}
            >
              비우기
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground py-4 text-sm">
          {lines.length}개 메뉴 · {formatPrice(totalPrice)} 상당의 항목이 삭제됩니다.
        </p>
      </BottomSheet>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export function CartScreen() {
  return (
    <ClientOnly fallback={<CartSkeleton />}>
      <CartInner />
    </ClientOnly>
  );
}
