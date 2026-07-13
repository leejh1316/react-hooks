import { usePagination } from "@leejaehyeok/use-pagination";
import clsx from "clsx";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 옵션 조정 플레이그라운드
   totalItems / itemsPerPage / siblings / boundaries를
   슬라이더로 바꿔가며 paginationRange가 어떻게
   달라지는지 실시간으로 확인합니다
   ────────────────────────────────────────────── */

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const Slider = ({ label, value, min, max, step = 1, onChange }: SliderProps) => (
  <label className="flex flex-col gap-1">
    <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
      {label}: <span className="text-ink-primary">{value}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-ink-primary w-full cursor-pointer"
    />
  </label>
);

const OptionsPlaygroundDemo = () => {
  const [totalItems, setTotalItems] = useState(200);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [siblings, setSiblings] = useState(1);
  const [boundaries, setBoundaries] = useState(1);

  const { page, totalPages, setPage, paginationRange } = usePagination({
    totalItems,
    itemsPerPage,
    siblings,
    boundaries,
    defaultPage: 10, // 양쪽 생략 기호가 모두 보이도록 중간 페이지에서 시작
  });

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        <Slider label="totalItems" value={totalItems} min={10} max={500} step={10} onChange={setTotalItems} />
        <Slider label="itemsPerPage" value={itemsPerPage} min={5} max={50} step={5} onChange={setItemsPerPage} />
        <Slider label="siblings" value={siblings} min={0} max={3} onChange={setSiblings} />
        <Slider label="boundaries" value={boundaries} min={0} max={3} onChange={setBoundaries} />
      </div>

      <nav aria-label="페이지네이션 미리보기" className="flex flex-wrap items-center justify-center gap-1">
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
      </nav>

      <div className="border-line-regular font-code text-caption-1 text-ink-secondary w-full rounded-xl border p-4 leading-relaxed">
        <p>
          page: <span className="text-ink-primary font-semibold">{page}</span> · totalPages:{" "}
          <span className="text-ink-primary font-semibold">{totalPages}</span>
        </p>
        <p>paginationRange: [ {paginationRange.map((item) => (item.type === "page" ? item.page : "…")).join(", ")} ]</p>
      </div>

      <p className="text-caption-2 text-ink-tertiary select-none">
        마지막 페이지로 이동한 뒤 totalItems를 줄이면 현재 페이지가 마지막 페이지로 자동 보정되는 것도 확인해 보세요.
      </p>
    </div>
  );
};

export default OptionsPlaygroundDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const OPTIONS_PLAYGROUND_DEMO_CODE = `import { useState } from "react";
import { usePagination } from "@leejaehyeok/use-pagination";

const [totalItems, setTotalItems] = useState(200);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [siblings, setSiblings] = useState(1);
const [boundaries, setBoundaries] = useState(1);

// 옵션이 바뀌면 totalPages와 paginationRange가 자동으로 다시 계산됩니다.
// totalPages가 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 자동 보정됩니다.
const { page, totalPages, setPage, paginationRange } = usePagination({
  totalItems,
  itemsPerPage,
  siblings,
  boundaries,
});

// totalPages: 20, page: 10, siblings: 2, boundaries: 1일 때
// paginationRange:
// [1] … [8] [9] [10] [11] [12] … [20]
//  ↑        ↑    현재   ↑         ↑
//  boundaries    siblings         boundaries`;
