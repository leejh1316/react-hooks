"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { BellRing, Check, Eye, Moon, RotateCcw, Sun, TriangleAlert } from "lucide-react";
import { browserStorage, useLocalStorage } from "@leejaehyeok/use-browser-storage";
import { useDebounce } from "@leejaehyeok/use-debounce";

import { BottomSheet } from "@/components/bottom-sheet";
import { ClientOnly } from "@/components/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/hooks/use-cart";
import { useRecentViewed } from "@/hooks/use-recent-viewed";
import { useTheme, THEME_STORAGE_KEY } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { PROMO_SNOOZE_KEY } from "@/features/home/promo-banner";
import { RECENT_KEYWORD_KEY } from "@/features/home/search-bar";
import { REVIEW_PAGE_STORAGE_KEY } from "@/features/reviews/reviews-screen";
import { RECENT_VIEWED_KEY } from "@/hooks/use-recent-viewed";
import { CART_STORAGE_KEY } from "@/hooks/use-cart";
import { MENU_ITEMS } from "@/lib/menu-data";
import { formatPrice } from "@/lib/format";

const NICKNAME_KEY = "brewly/nickname";
const NOTIFY_KEY = "brewly/notify";

const DEMO_STORAGE_KEYS = [
  { type: "local" as const, key: CART_STORAGE_KEY },
  { type: "local" as const, key: RECENT_KEYWORD_KEY },
  { type: "local" as const, key: NICKNAME_KEY },
  { type: "local" as const, key: NOTIFY_KEY },
  { type: "local" as const, key: THEME_STORAGE_KEY },
  { type: "local" as const, key: PROMO_SNOOZE_KEY },
  { type: "session" as const, key: REVIEW_PAGE_STORAGE_KEY },
  { type: "session" as const, key: RECENT_VIEWED_KEY },
];

function SettingRow({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="bg-brand-soft text-brand flex size-8 shrink-0 items-center justify-center rounded-full">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {action}
    </div>
  );
}

function MeInner() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { totalCount, totalPrice } = useCart();
  const { recentIds, clearRecentViewed } = useRecentViewed();

  const { value: nickname, setValue: setNickname } = useLocalStorage<string>({
    key: NICKNAME_KEY,
    defaultValue: "브루리 회원",
  });
  const { value: isNotifyOn, setValue: setNotifyOn } = useLocalStorage<boolean>({
    key: NOTIFY_KEY,
    defaultValue: true,
  });

  const [draftNickname, setDraftNickname] = useState(nickname);
  const [isSaved, setIsSaved] = useState(false);
  const [isResetSheetOpen, setIsResetSheetOpen] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);

  /** 입력이 멈추면 500ms 뒤 자동 저장 */
  const { debounce: saveNickname } = useDebounce(
    (value: string) => {
      setNickname(value.trim() || "브루리 회원");
      setIsSaved(true);
    },
    500,
    { leading: false },
  );

  useEffect(() => {
    if (!isSaved) return;
    const timer = setTimeout(() => setIsSaved(false), 1600);
    return () => clearTimeout(timer);
  }, [isSaved]);

  const readSnoozeState = useCallback(() => {
    const result = browserStorage.get<number>("local", PROMO_SNOOZE_KEY);
    setSnoozeUntil(result.success ? result.value : null);
  }, []);

  useEffect(() => {
    readSnoozeState();
  }, [readSnoozeState]);

  const recentMenus = recentIds
    .map((id) => MENU_ITEMS.find((menu) => menu.id === id))
    .filter((menu): menu is (typeof MENU_ITEMS)[number] => Boolean(menu));

  const isSnoozing = snoozeUntil !== null && snoozeUntil > Date.now();

  return (
    <div className="px-4 py-4">
      <section className="bg-card rounded-xl border p-4">
        <div className="flex items-center gap-3">
          <span className="bg-brand-soft flex size-12 items-center justify-center rounded-full text-2xl" aria-hidden>
            🧑‍🍳
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{nickname}</p>
            <p className="text-muted-foreground text-xs">브루리 골드 · 스탬프 7 / 10</p>
          </div>
          <Badge variant="brand">GOLD</Badge>
        </div>

        <div className="mt-4">
          <label htmlFor="nickname" className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs">
            닉네임
            {isSaved ? (
              <span className="text-brand animate-in fade-in flex items-center gap-0.5">
                <Check className="size-3" />
                자동 저장됨
              </span>
            ) : null}
          </label>
          <Input
            id="nickname"
            value={draftNickname}
            maxLength={12}
            onChange={(event) => {
              setDraftNickname(event.target.value);
              saveNickname(event.target.value);
            }}
          />
          <p className="text-muted-foreground mt-1 text-[11px]">입력을 멈추면 500ms 뒤 자동 저장됩니다. (useDebounce)</p>
        </div>

        <div className="bg-muted/60 mt-4 flex items-center justify-between rounded-lg px-3 py-2 text-xs">
          <span className="text-muted-foreground">장바구니</span>
          <span>
            {totalCount}개 · <strong>{formatPrice(totalPrice)}</strong>
          </span>
        </div>
      </section>

      <section className="bg-card mt-3 rounded-xl border px-4 py-1">
        <SettingRow
          icon={theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          title="다크 모드"
          description="localStorage에 저장 · 다른 탭과 동기화"
          action={<Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label="다크 모드" />}
        />
        <Separator />
        <SettingRow
          icon={<BellRing className="size-4" />}
          title="혜택 알림"
          description="신메뉴 · 할인 소식을 받아봅니다"
          action={
            <Switch
              checked={isNotifyOn}
              onCheckedChange={(checked) => {
                setNotifyOn(checked);
                showToast(checked ? "혜택 알림을 켰어요." : "혜택 알림을 껐어요.");
              }}
              aria-label="혜택 알림"
            />
          }
        />
        <Separator />
        <SettingRow
          icon={<Eye className="size-4" />}
          title="프로모션 배너"
          description={isSnoozing ? `${new Date(snoozeUntil!).toLocaleString("ko-KR")}까지 숨김` : "현재 노출 중"}
          action={
            <Button
              variant="outline"
              size="sm"
              disabled={!isSnoozing}
              onClick={() => {
                browserStorage.remove("local", PROMO_SNOOZE_KEY);
                readSnoozeState();
                showToast("홈에서 배너가 다시 표시됩니다.");
              }}
            >
              다시 보기
            </Button>
          }
        />
      </section>

      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">최근 본 메뉴</h2>
          {recentMenus.length > 0 ? (
            <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs" onClick={clearRecentViewed}>
              지우기
            </Button>
          ) : null}
        </div>

        {recentMenus.length === 0 ? (
          <p className="text-muted-foreground bg-card rounded-xl border px-4 py-6 text-center text-xs">
            아직 없어요.{" "}
            <Link href="/" className="text-brand underline">
              메뉴를 둘러보세요.
            </Link>
          </p>
        ) : (
          <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {recentMenus.map((menu) => (
              <li key={menu.id} className="bg-card w-24 shrink-0 rounded-xl border p-2 text-center">
                <div className="bg-brand-soft mb-1.5 flex h-14 items-center justify-center rounded-lg text-2xl" aria-hidden>
                  {menu.emoji}
                </div>
                <p className="truncate text-[11px] font-medium">{menu.name}</p>
                <p className="text-muted-foreground text-[10px]">{formatPrice(menu.price)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button variant="outline" className="mt-5 w-full" onClick={() => setIsResetSheetOpen(true)}>
        <RotateCcw />
        데모 데이터 초기화
      </Button>

      <BottomSheet
        open={isResetSheetOpen}
        onClose={() => setIsResetSheetOpen(false)}
        title="데모 데이터를 초기화할까요?"
        description="이 앱이 저장한 local / sessionStorage 값을 모두 지웁니다."
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setIsResetSheetOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              data-initial-focus
              onClick={() => {
                DEMO_STORAGE_KEYS.forEach(({ type, key }) => browserStorage.remove(type, key));
                window.location.reload();
              }}
            >
              초기화
            </Button>
          </div>
        }
      >
        <div className="py-3">
          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            장바구니 · 최근 검색어 · 닉네임 · 테마 · 배너 스누즈 · 최근 본 메뉴가 모두 지워집니다.
          </p>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-1 font-mono text-[11px]">
            {DEMO_STORAGE_KEYS.map(({ type, key }) => (
              <li key={`${type}:${key}`} className="bg-muted/60 rounded px-2 py-1">
                {type} · {key}
              </li>
            ))}
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
}

export function MeScreen() {
  return (
    <ClientOnly
      fallback={
        <div className="flex flex-col gap-3 px-4 py-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      }
    >
      <MeInner />
    </ClientOnly>
  );
}
