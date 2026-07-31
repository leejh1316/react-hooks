"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Star } from "lucide-react";
import { usePagination } from "@leejaehyeok/use-pagination";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { useSessionStorage } from "@leejaehyeok/use-browser-storage";

import { ClientOnly } from "@/components/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { REVIEWS } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;
export const REVIEW_PAGE_STORAGE_KEY = "brewly/review-page";

const RATING_FILTERS = [
  { id: "all", label: "전체", min: 0 },
  { id: "high", label: "4.5점 이상", min: 4.5 },
  { id: "mid", label: "4점 이상", min: 4 },
  { id: "low", label: "3.5점 이상", min: 3.5 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`별점 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((score) => (
        <Star
          key={score}
          className={cn("size-3", score <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
        />
      ))}
    </span>
  );
}

function ReviewsInner() {
  const [filterId, setFilterId] = useState("all");

  /** 탭을 옮겨 다녀도 마지막으로 보던 페이지를 기억한다. (세션 한정) */
  const { value: storedPage, setValue: setStoredPage } = useSessionStorage<number>({
    key: REVIEW_PAGE_STORAGE_KEY,
    defaultValue: 1,
  });

  const filteredReviews = useMemo(() => {
    const filter = RATING_FILTERS.find((item) => item.id === filterId) ?? RATING_FILTERS[0];
    return REVIEWS.filter((review) => review.rating >= filter.min);
  }, [filterId]);

  /** 제어 모드: 현재 페이지를 sessionStorage 상태로 관리한다. */
  const {
    page,
    totalPages,
    setPage,
    handleNext,
    handlePrevious,
    handleSkipNext,
    handleSkipPrevious,
    paginationRange,
    isFirstPage,
    isLastPage,
  } = usePagination({
    totalItems: filteredReviews.length,
    itemsPerPage: ITEMS_PER_PAGE,
    siblings: 1,
    boundaries: 1,
    currentPage: storedPage,
    onPageChange: setStoredPage,
  });

  const prevPageRef = usePrevRef(page);
  const prevPage = prevPageRef.current;

  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "horizontal",
    loop: true,
  });

  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 380);
    return () => clearTimeout(timer);
  }, [page, filterId]);

  const showSkeleton = useDeferredLoading(isPageLoading, { delay: 500, minDisplayDuration: 500 });

  const pageReviews = filteredReviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">
          리뷰 <span className="text-brand">{filteredReviews.length}</span>
        </h2>
        <span className="text-muted-foreground text-[11px]">
          {page} / {totalPages} 페이지
          {prevPage !== page ? (
            <span className="text-brand ml-1">
              ({prevPage} → {page})
            </span>
          ) : null}
        </span>
      </div>

      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto"
        role="group"
        aria-label="평점 필터"
      >
        {RATING_FILTERS.map((filter) => {
          const isSelected = filter.id === filterId;

          return (
            <button
              key={filter.id}
              type="button"
              data-roving-item
              aria-pressed={isSelected}
              onClick={() => {
                setFilterId(filter.id);
                setPage(1);
              }}
              className={cn(
                "focus-visible:ring-ring/50 shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs outline-none transition-colors focus-visible:ring-2",
                isSelected ? "border-brand bg-brand font-medium text-white" : "bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {showSkeleton ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl border p-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-1.5 h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {pageReviews.map((review) => (
            <li key={review.id} className="bg-card rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-soft text-brand flex size-7 items-center justify-center rounded-full text-[11px] font-semibold">
                    {review.author.slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-xs font-medium">{review.author}</p>
                    <Stars rating={review.rating} />
                  </div>
                </div>
                <span className="text-muted-foreground text-[11px]">{review.createdAt}</span>
              </div>

              <p className="mt-2 text-xs leading-relaxed">{review.content}</p>

              <Badge variant="secondary" className="mt-2 text-[10px]">
                {review.menuName}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <nav className="mt-5 flex items-center justify-center gap-1" aria-label="리뷰 페이지네이션">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="처음 페이지 방향으로 건너뛰기"
          onClick={handleSkipPrevious}
          disabled={isFirstPage}
        >
          <ChevronsLeft />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="이전 페이지" onClick={handlePrevious} disabled={isFirstPage}>
          <ChevronLeft />
        </Button>

        {paginationRange.map((item) =>
          item.type === "ellipsis" ? (
            <span key={item.key} className="text-muted-foreground w-7 text-center text-xs">
              …
            </span>
          ) : (
            <Button
              key={item.key}
              variant={item.page === page ? "default" : "ghost"}
              size="icon-sm"
              aria-current={item.page === page ? "page" : undefined}
              onClick={() => setPage(item.page)}
              className="text-xs"
            >
              {item.page}
            </Button>
          ),
        )}

        <Button variant="ghost" size="icon-sm" aria-label="다음 페이지" onClick={handleNext} disabled={isLastPage}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="마지막 페이지 방향으로 건너뛰기" onClick={handleSkipNext} disabled={isLastPage}>
          <ChevronsRight />
        </Button>
      </nav>
    </div>
  );
}

export function ReviewsScreen() {
  return (
    <ClientOnly
      fallback={
        <div className="flex flex-col gap-2 px-4 py-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      }
    >
      <ReviewsInner />
    </ClientOnly>
  );
}
