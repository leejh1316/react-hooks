"use client";

import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCount, formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

type MenuCardProps = {
  menu: MenuItem;
  onSelect: (menu: MenuItem) => void;
};

export function MenuCard({ menu, onSelect }: MenuCardProps) {
  return (
    <button
      type="button"
      data-menu-id={menu.id}
      onClick={() => onSelect(menu)}
      className="bg-card hover:bg-accent/40 focus-visible:ring-ring/50 flex w-full items-center gap-3 rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-2"
    >
      <span className="bg-brand-soft flex size-16 shrink-0 items-center justify-center rounded-lg text-3xl" aria-hidden>
        {menu.emoji}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold">{menu.name}</span>
          {menu.isNew ? (
            <Badge variant="brand" className="h-4 px-1.5 text-[10px]">
              NEW
            </Badge>
          ) : null}
          {menu.isBest ? (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
              BEST
            </Badge>
          ) : null}
        </span>

        <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs">{menu.description}</span>

        <span className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(menu.price)}</span>
          <span className="text-muted-foreground flex items-center gap-0.5 text-[11px]">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {menu.rating.toFixed(1)}
            <span className="text-muted-foreground/70">({formatCount(menu.reviewCount)})</span>
          </span>
        </span>
      </span>
    </button>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="bg-card flex w-full items-center gap-3 rounded-xl border p-3">
      <div className="bg-accent size-16 shrink-0 animate-pulse rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="bg-accent h-3.5 w-2/3 animate-pulse rounded" />
        <div className="bg-accent h-3 w-full animate-pulse rounded" />
        <div className="bg-accent h-3.5 w-1/3 animate-pulse rounded" />
      </div>
    </div>
  );
}
