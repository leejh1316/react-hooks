"use client";

import Link from "next/link";
import { Bell, MapPin, ShoppingBag } from "lucide-react";

import { ClientOnly } from "@/components/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

function CartCountBadge() {
  const { totalCount } = useCart();

  if (totalCount === 0) return null;

  return <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 text-[10px] leading-none">{totalCount}</Badge>;
}

export function AppHeader() {
  const isScrolled = useScrolled(32);

  return (
    <header
      className={cn("bg-background/90 sticky top-0 z-30 border-b backdrop-blur transition-all duration-300", isScrolled ? "py-2" : "py-3")}
    >
      <div className="flex items-center gap-2 px-4">
        <div className="min-w-0 flex-1">
          <div className={cn("flex items-center gap-1 overflow-hidden transition-all", isScrolled ? "h-0 opacity-0" : "h-4 opacity-100")}>
            <MapPin className="text-brand size-3" />
            <span className="text-muted-foreground truncate text-[11px]">서울 강남구 테헤란로 · 브루리 역삼점</span>
          </div>
          <h1 className={cn("font-semibold tracking-tight transition-all", isScrolled ? "text-base" : "text-lg")}>
            Brewly <span className="text-brand">☕</span>
          </h1>
        </div>

        <Button variant="ghost" size="icon" aria-label="알림">
          <Bell />
        </Button>

        <Button variant="ghost" size="icon" aria-label="장바구니" asChild className="relative">
          <Link href="/cart">
            <ShoppingBag />
            <ClientOnly>
              <CartCountBadge />
            </ClientOnly>
          </Link>
        </Button>
      </div>
    </header>
  );
}
