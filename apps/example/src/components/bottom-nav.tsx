"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquareText, ShoppingBag, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

import { ClientOnly } from "@/components/client-only";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/reviews", label: "리뷰", icon: MessageSquareText },
  { href: "/cart", label: "장바구니", icon: ShoppingBag },
  { href: "/me", label: "마이", icon: User },
];

/** 장바구니 개수 뱃지. 수량이 늘어난 순간에만 살짝 튀는 애니메이션을 준다. */
function CartBadge() {
  const { totalCount } = useCart();
  const prevCountRef = usePrevRef(totalCount);
  const hasIncreased = totalCount > prevCountRef.current;

  if (totalCount === 0) return null;

  return (
    <span
      key={totalCount}
      className={cn(
        "bg-brand absolute -top-0.5 right-1/2 mr-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white",
        hasIncreased && "animate-in zoom-in-50 duration-300",
      )}
    >
      {totalCount}
    </span>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="bg-background/95 mx-auto w-full max-w-[430px] border-x border-t backdrop-blur">
        <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-ring/50 relative flex flex-col items-center gap-1 py-2.5 text-[11px] outline-none transition-colors focus-visible:ring-2",
                    isActive ? "text-brand font-semibold" : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <Icon className="size-5" />
                    {item.href === "/cart" ? (
                      <ClientOnly>
                        <CartBadge />
                      </ClientOnly>
                    ) : null}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
