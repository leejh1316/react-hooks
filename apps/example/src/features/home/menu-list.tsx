"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { useIntersectionObserver, useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

import { MenuCard, MenuCardSkeleton } from "@/features/home/menu-card";
import type { MenuItem } from "@/lib/types";

const PAGE_SIZE = 5;

type MenuListProps = {
  items: MenuItem[];
  /** 값이 바뀌면 무한 스크롤 상태를 처음부터 다시 시작한다. (카테고리 / 검색어 전환) */
  resetKey: string;
  onSelect: (menu: MenuItem) => void;
};

/**
 * - useIntersectionObserver      : 목록 하단 sentinel이 보이면 다음 페이지를 이어붙이는 무한 스크롤
 * - useIntersectionObserverGroup : 카드 각각의 노출(impression)을 하나의 옵저버로 집계
 */
export function MenuList({ items, resetKey, onSelect }: MenuListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [resetKey]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const { setContainerRef: setSentinelRef, isVisible: isSentinelVisible } = useIntersectionObserver({
    enable: hasMore,
    rootMargin: "160px",
    onEntered: () => setIsLoadingMore(true),
  });

  const { setContainerRef: setListRef, states } = useIntersectionObserverGroup({
    keyAttribute: "data-menu-id",
    threshold: 0.6,
  });

  const seenCount = useMemo(() => Object.values(states).filter((state) => state.hasEntered).length, [states]);

  /** 가짜 네트워크 지연 후 다음 페이지 추가 */
  useEffect(() => {
    if (!isLoadingMore) return;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 420);

    return () => clearTimeout(timer);
  }, [isLoadingMore]);

  /** 로딩이 끝났는데도 sentinel이 계속 보이면(=화면이 아직 비어 있으면) 이어서 로드 */
  useEffect(() => {
    if (!isLoadingMore && hasMore && isSentinelVisible) setIsLoadingMore(true);
  }, [isLoadingMore, hasMore, isSentinelVisible]);

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground px-4 py-16 text-center text-sm">
        조건에 맞는 메뉴가 없어요.
        <br />
        다른 검색어나 카테고리를 선택해 보세요.
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="text-muted-foreground mb-2 flex items-center justify-between text-[11px]">
        <span>
          전체 <strong className="text-foreground font-semibold">{items.length}</strong>개
        </span>
        <span className="bg-muted flex items-center gap-1 rounded-full px-2 py-0.5">
          <Eye className="size-3" />
          노출 트래킹 {seenCount}/{visibleItems.length}
        </span>
      </div>

      <ul ref={setListRef} className="flex flex-col gap-2">
        {visibleItems.map((menu) => (
          <li key={menu.id}>
            <MenuCard menu={menu} onSelect={onSelect} />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div ref={setSentinelRef} className="py-3">
          {/*
            useIntersectionObserver는 컨테이너가 아니라 targetSelector에 해당하는 자식을 관찰한다.
            로딩 상태에 따라 아래 내용이 교체되어도 관찰 대상이 사라지지 않도록 빈 sentinel을 고정으로 둔다.
          */}
          <div data-intersection-target aria-hidden className="h-px w-full" />
          {isLoadingMore ? (
            <div className="flex flex-col gap-2">
              <MenuCardSkeleton />
              <MenuCardSkeleton />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoadingMore(true)}
              className="text-muted-foreground flex w-full items-center justify-center gap-1.5 py-2 text-xs"
            >
              <Loader2 className="size-3.5" />
              스크롤하면 자동으로 더 불러옵니다
            </button>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground py-6 text-center text-xs">모든 메뉴를 확인했어요 ☕</p>
      )}
    </div>
  );
}
