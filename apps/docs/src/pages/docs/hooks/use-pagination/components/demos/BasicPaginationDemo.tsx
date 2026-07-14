import { usePagination } from "@leejaehyeok/use-pagination";
import clsx from "clsx";

/* ──────────────────────────────────────────────
   Demo: usePagination 기본 사용
   paginationRange를 렌더링하고 이전/다음/건너뛰기
   내비게이션과 상태 헬퍼를 함께 사용해요
   ────────────────────────────────────────────── */

const TOTAL_ITEMS = 137;
const ITEMS_PER_PAGE = 10;

const navButtonClass =
  "border-line-regular text-ink-secondary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40";

const BasicPaginationDemo = () => {
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
    totalItems: TOTAL_ITEMS,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-body-3 text-ink-secondary select-none">
        전체 {TOTAL_ITEMS}개 항목 · 페이지당 {ITEMS_PER_PAGE}개 — 현재 페이지 <span className="text-ink-primary font-semibold">{page}</span>{" "}
        / {totalPages}
      </p>

      <nav aria-label="페이지네이션" className="flex flex-wrap items-center justify-center gap-1">
        <button aria-label="건너뛰어 이전으로" onClick={handleSkipPrevious} disabled={isFirstPage} className={navButtonClass}>
          «
        </button>
        <button aria-label="이전 페이지" onClick={handlePrevious} disabled={isFirstPage} className={navButtonClass}>
          ‹
        </button>

        {paginationRange.map((item) =>
          item.type === "page" ? (
            <button
              key={item.key}
              onClick={() => setPage(item.page)}
              aria-current={item.page === page ? "page" : undefined}
              className={clsx(
                "text-body-3 h-9 min-w-9 cursor-pointer rounded-lg px-2 transition-colors",
                item.page === page ? "bg-ink-primary text-ink-white font-semibold" : "text-ink-secondary hover:bg-neutral-100",
              )}
            >
              {item.page}
            </button>
          ) : (
            <span key={item.key} className="text-ink-tertiary flex h-9 w-9 items-center justify-center select-none">
              …
            </span>
          ),
        )}

        <button aria-label="다음 페이지" onClick={handleNext} disabled={isLastPage} className={navButtonClass}>
          ›
        </button>
        <button aria-label="건너뛰어 다음으로" onClick={handleSkipNext} disabled={isLastPage} className={navButtonClass}>
          »
        </button>
      </nav>
    </div>
  );
};

export default BasicPaginationDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const BASIC_PAGINATION_DEMO_CODE = `import { usePagination } from "@leejaehyeok/use-pagination";

function Pagination() {
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
    totalItems: 137, // 전체 항목 수
    itemsPerPage: 10, // 페이지당 항목 수 → totalPages는 자동 계산 (14)
  });

  return (
    <nav aria-label="페이지네이션">
      <button onClick={handleSkipPrevious} disabled={isFirstPage}>«</button>
      <button onClick={handlePrevious} disabled={isFirstPage}>‹</button>

      {paginationRange.map((item) =>
        item.type === "page" ? (
          // item.key는 React 렌더링용 고유 키로 바로 사용할 수 있어요.
          <button key={item.key} onClick={() => setPage(item.page)} aria-current={item.page === page ? "page" : undefined}>
            {item.page}
          </button>
        ) : (
          <span key={item.key}>…</span>
        ),
      )}

      <button onClick={handleNext} disabled={isLastPage}>›</button>
      <button onClick={handleSkipNext} disabled={isLastPage}>»</button>
    </nav>
  );
}`;
