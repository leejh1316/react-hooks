"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { BottomSheet } from "@/components/bottom-sheet";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useRecentViewed } from "@/hooks/use-recent-viewed";
import { useToast } from "@/hooks/use-toast";
import { formatCount, formatPrice } from "@/lib/format";
import type { MenuItem, TemperatureOption } from "@/lib/types";
import { cn } from "@/lib/utils";

const TEMPERATURE_OPTIONS: { id: TemperatureOption; label: string; extra: number }[] = [
  { id: "ice", label: "ICE", extra: 0 },
  { id: "hot", label: "HOT", extra: 0 },
];

type MenuDetailSheetProps = {
  menu: MenuItem | null;
  onClose: () => void;
};

export function MenuDetailSheet({ menu, onClose }: MenuDetailSheetProps) {
  const [option, setOption] = useState<TemperatureOption>("ice");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { pushRecentViewed } = useRecentViewed();

  const menuId = menu?.id;

  /** 상세를 열어본 메뉴는 '최근 본 메뉴'(sessionStorage)에 기록한다. */
  useEffect(() => {
    if (!menuId) return;
    pushRecentViewed(menuId);
  }, [menuId, pushRecentViewed]);

  if (!menu) return null;

  const totalPrice = menu.price * quantity;

  const handleAddToCart = () => {
    addItem(menu, option, quantity);
    showToast(`${menu.name} ${quantity}개를 담았어요.`, "success");
    onClose();
  };

  return (
    <BottomSheet open={Boolean(menu)} onClose={onClose} title={menu.name} description={menu.description}>
      <div className="pb-2">
        <div className="bg-brand-soft mb-4 flex h-36 items-center justify-center rounded-xl text-6xl" aria-hidden>
          {menu.emoji}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {menu.isNew ? <Badge variant="brand">NEW</Badge> : null}
          {menu.isBest ? <Badge variant="secondary">BEST</Badge> : null}
          {menu.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-muted-foreground">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <strong className="text-foreground">{menu.rating.toFixed(1)}</strong>
          <span>· 리뷰 {formatCount(menu.reviewCount)}개</span>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">온도 선택</p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPERATURE_OPTIONS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-initial-focus={index === 0 ? "" : undefined}
                onClick={() => setOption(item.id)}
                aria-pressed={option === item.id}
                className={cn(
                  "focus-visible:ring-ring/50 rounded-lg border py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2",
                  option === item.id ? "border-brand bg-brand text-white" : "bg-card text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold">수량</p>
          {/* 비제어 모드: 내부 상태로 동작하고 변경 값만 onChange로 전달받는다. */}
          <QuantityStepper defaultValue={1} onChange={setQuantity} max={10} />
        </div>

        <div className="bg-muted/60 mt-5 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">
            {formatPrice(menu.price)} × {quantity}
          </span>
          <strong className="text-base">{formatPrice(totalPrice)}</strong>
        </div>

        <Button size="lg" className="mb-2 mt-4 w-full" onClick={handleAddToCart}>
          {formatPrice(totalPrice)} 담기
        </Button>
      </div>
    </BottomSheet>
  );
}
