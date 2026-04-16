import { useState } from "react";
import { usePagination } from "@leejaehyeok/use-pagination";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";
import type { PaginationItem } from "@leejaehyeok/use-pagination";

// 공통 페이지네이션 UI 컴포넌트
function PaginationBar({
  items,
  page,
  totalPages,
  onPage,
  onPrev,
  onNext,
  onSkipPrev,
  onSkipNext,
  isFirstPage,
  isLastPage,
  showSkip = false,
}: {
  items: PaginationItem[];
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSkipPrev?: () => void;
  onSkipNext?: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  showSkip?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {showSkip && onSkipPrev && (
        <button
          onClick={onSkipPrev}
          disabled={isFirstPage}
          className="px-2 py-1.5 text-xs font-mono border rounded-md transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="앞으로 점프"
        >
          «
        </button>
      )}
      <button
        onClick={onPrev}
        disabled={isFirstPage}
        className="px-2.5 py-1.5 text-xs font-mono border rounded-md transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {items.map((item) =>
        item.type === "page" ? (
          <button
            key={item.key}
            onClick={() => onPage(item.page)}
            aria-current={item.page === page ? "page" : undefined}
            className={[
              "min-w-[2rem] px-2 py-1.5 text-xs font-mono border rounded-md transition-colors duration-100 cursor-pointer",
              item.page === page
                ? "bg-indigo-500 border-indigo-500 text-white font-bold"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
            ].join(" ")}
          >
            {item.page}
          </button>
        ) : (
          <span
            key={item.key}
            className="min-w-[2rem] px-2 py-1.5 text-xs text-center text-gray-400 dark:text-gray-500"
          >
            …
          </span>
        )
      )}

      <button
        onClick={onNext}
        disabled={isLastPage}
        className="px-2.5 py-1.5 text-xs font-mono border rounded-md transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="다음 페이지"
      >
        ›
      </button>
      {showSkip && onSkipNext && (
        <button
          onClick={onSkipNext}
          disabled={isLastPage}
          className="px-2 py-1.5 text-xs font-mono border rounded-md transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="뒤로 점프"
        >
          »
        </button>
      )}

      <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
        {page} / {totalPages}
      </span>
    </div>
  );
}

// 1. 기본 사용법
function BasicDemo() {
  const pagination = usePagination({ totalItems: 100, itemsPerPage: 10 });

  return (
    <DemoSection
      title="기본 사용법"
      description="totalItems와 itemsPerPage만 전달하면 됩니다. siblings=1, boundaries=1이 기본값으로 적용됩니다."
    >
      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
      />
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400">
        <span className="text-indigo-500">page</span>: {pagination.page}
        {"  "}
        <span className="text-indigo-500">totalPages</span>: {pagination.totalPages}
        {"  "}
        <span className="text-indigo-500">isFirstPage</span>: {String(pagination.isFirstPage)}
        {"  "}
        <span className="text-indigo-500">isLastPage</span>: {String(pagination.isLastPage)}
      </div>
    </DemoSection>
  );
}

// 2. siblings & boundaries 커스터마이징
function CustomRangeDemo() {
  const [siblings, setSiblings] = useState(1);
  const [boundaries, setBoundaries] = useState(1);
  const [totalItems, setTotalItems] = useState(200);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pagination = usePagination({ totalItems, itemsPerPage, siblings, boundaries });

  return (
    <DemoSection
      title="Siblings & Boundaries 설정"
      description="siblings는 현재 페이지 양옆에 표시할 페이지 수, boundaries는 처음/끝에 항상 표시할 페이지 수입니다."
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            siblings: <strong className="text-indigo-500">{siblings}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={3}
            value={siblings}
            onChange={(e) => setSiblings(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            boundaries: <strong className="text-indigo-500">{boundaries}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={3}
            value={boundaries}
            onChange={(e) => setBoundaries(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            totalItems: <strong className="text-indigo-500">{totalItems}</strong>
          </span>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={totalItems}
            onChange={(e) => setTotalItems(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            itemsPerPage: <strong className="text-indigo-500">{itemsPerPage}</strong>
          </span>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>

      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
      />

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400 leading-relaxed">
        paginationRange: [{" "}
        {pagination.paginationRange.map((item) =>
          item.type === "page" ? item.page : "…"
        ).join(", ")}{" "}
        ]
      </div>
    </DemoSection>
  );
}

// 3. 점프 이동 (Skip)
function SkipDemo() {
  const pagination = usePagination({
    totalItems: 300,
    itemsPerPage: 10,
    siblings: 1,
  });
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((prev) => [msg, ...prev.slice(0, 7)]);

  const handleSkipNext = () => {
    pagination.handleSkipNext();
    addLog(`handleSkipNext() → ${Math.min(pagination.page + pagination.totalPages, 30)}페이지 방향 점프`);
  };

  const handleSkipPrev = () => {
    pagination.handleSkipPrevious();
    addLog(`handleSkipPrevious() → 이전 점프`);
  };

  return (
    <DemoSection
      title="페이지 점프 (Skip)"
      description="handleSkipNext / handleSkipPrevious는 siblings * 2 + 1 단위로 페이지를 건너뜁니다. 긴 목록에서 빠른 탐색에 유용합니다."
    >
      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        onSkipPrev={handleSkipPrev}
        onSkipNext={handleSkipNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
        showSkip
      />
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        «/» 버튼이 점프 이동입니다. jumpStep = siblings × 2 + 1 ={" "}
        <strong className="text-indigo-500">3</strong>
      </p>

      <ul className="mt-3 min-h-[4rem] text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">«/» 버튼을 클릭하면 점프 로그가 나타납니다.</li>
        )}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 4. 제어 모드 (Controlled)
function ControlledDemo() {
  const [externalPage, setExternalPage] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const pagination = usePagination({
    totalItems: 150,
    itemsPerPage: 10,
    currentPage: externalPage,
    onPageChange: (p) => {
      setExternalPage(p);
      setLog((prev) => [
        `[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] onPageChange(${p})`,
        ...prev.slice(0, 7),
      ]);
    },
  });

  return (
    <DemoSection
      title="제어 모드 (Controlled)"
      description="currentPage prop과 onPageChange를 전달하면 페이지 상태를 외부에서 제어합니다. 외부 입력 또는 URL 쿼리 파라미터와 연동하는 패턴에 적합합니다."
    >
      <div className="flex items-center gap-3 mb-5">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          외부 페이지 직접 설정:
        </label>
        <input
          type="number"
          min={1}
          max={pagination.totalPages}
          value={externalPage}
          onChange={(e) => {
            const val = Math.min(Math.max(1, Number(e.target.value)), pagination.totalPages);
            setExternalPage(val);
          }}
          className="w-20 px-2 py-1 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
        />
        <span className="text-xs text-gray-400">/ {pagination.totalPages}</span>
      </div>

      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
      />

      <ul className="mt-4 min-h-[4rem] text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && <li className="text-gray-400">페이지를 이동하면 onPageChange 로그가 나타납니다.</li>}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 5. 실제 목록 예시
const DUMMY_ITEMS = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: `항목 ${i + 1}`,
  description: `이것은 ${i + 1}번째 항목의 설명입니다.`,
}));

function ListDemo() {
  const ITEMS_PER_PAGE = 5;
  const pagination = usePagination({
    totalItems: DUMMY_ITEMS.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentItems = DUMMY_ITEMS.slice(
    (pagination.page - 1) * ITEMS_PER_PAGE,
    pagination.page * ITEMS_PER_PAGE
  );

  return (
    <DemoSection
      title="실제 목록 연동 예시"
      description="totalItems=47, itemsPerPage=5 목록을 페이지네이션으로 나눠 보여주는 예시입니다."
    >
      <ul className="mb-5 space-y-2">
        {currentItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span className="text-xs font-mono text-indigo-400 w-6 text-right shrink-0">
              #{item.id}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
      />

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        전체 {DUMMY_ITEMS.length}개 항목 중{" "}
        {(pagination.page - 1) * ITEMS_PER_PAGE + 1}–
        {Math.min(pagination.page * ITEMS_PER_PAGE, DUMMY_ITEMS.length)}번 표시
      </p>
    </DemoSection>
  );
}

// 6. totalItems 변경 시 페이지 자동 보정
function DynamicTotalDemo() {
  const [totalItems, setTotalItems] = useState(100);
  const pagination = usePagination({ totalItems, itemsPerPage: 10 });

  return (
    <DemoSection
      title="동적 totalItems 변경"
      description="totalItems가 변경되어 현재 페이지가 범위를 벗어나면 자동으로 마지막 페이지로 조정됩니다."
    >
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          totalItems: <strong className="text-indigo-500 font-mono">{totalItems}</strong>
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setTotalItems((v) => Math.max(10, v - 10))}>
            −10
          </Button>
          <Button size="sm" variant="cancel" onClick={() => setTotalItems((v) => v + 10)}>
            +10
          </Button>
          <Button size="sm" variant="danger" onClick={() => setTotalItems(100)}>
            초기화
          </Button>
        </div>
      </div>

      <PaginationBar
        items={pagination.paginationRange}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPage={pagination.setPage}
        onPrev={pagination.handlePrevious}
        onNext={pagination.handleNext}
        isFirstPage={pagination.isFirstPage}
        isLastPage={pagination.isLastPage}
      />

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400">
        <span className="text-indigo-500">page</span>: {pagination.page}
        {"  "}
        <span className="text-indigo-500">totalPages</span>: {pagination.totalPages}
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        마지막 페이지로 이동한 후 totalItems를 줄여보세요.
      </p>
    </DemoSection>
  );
}

export function UsePaginationPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-pagination"
        description="페이지 번호, 생략 기호(ellipsis), 이전/다음/점프 이동을 포함하는 페이지네이션 상태를 관리합니다. 제어/비제어 모드를 모두 지원합니다."
      />
      <BasicDemo />
      <CustomRangeDemo />
      <SkipDemo />
      <ControlledDemo />
      <ListDemo />
      <DynamicTotalDemo />
    </div>
  );
}
