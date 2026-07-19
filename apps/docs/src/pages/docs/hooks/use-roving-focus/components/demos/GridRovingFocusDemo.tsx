import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

/* ──────────────────────────────────────────────
   Demo: colSkipCount 그리드 내비게이션
   4열 그리드에서 ↑/↓가 열 단위(4칸)로 점프해
   2차원 이동처럼 동작해요
   ────────────────────────────────────────────── */

const COL_COUNT = 4;

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝", "🍍", "🥑", "🍅", "🥕", "🌽", "🥦", "🍆", "🥔"];

const GridRovingFocusDemo = () => {
  const { containerRef, handleKeyDown } = useRovingFocus({
    colSkipCount: COL_COUNT,
    loop: true,
  });

  return (
    <div className="flex w-full max-w-xs flex-col items-stretch gap-4">
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label="과일 그리드"
        className="border-line-regular grid grid-cols-4 gap-1 rounded-xl border p-2"
      >
        {EMOJIS.map((emoji, index) => (
          <button
            key={emoji}
            data-roving-item
            aria-label={`${index + 1}번 아이템`}
            className="hover:bg-neutral-100 focus:ring-primary-500 flex h-12 items-center justify-center rounded-lg text-xl transition-colors focus:ring-2 focus:outline-none"
          >
            {emoji}
          </button>
        ))}
      </div>
      <p className="text-caption-2 text-ink-tertiary select-none">
        아이템을 클릭한 뒤 방향키로 이동해 보세요. ←/→는 한 칸씩, ↑/↓는 4칸(한 열)씩 점프하고, 세로 이동은 같은 열 안에서 순환해요.
      </p>
    </div>
  );
};

export default GridRovingFocusDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const GRID_ROVING_FOCUS_DEMO_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function FruitGrid() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    colSkipCount: 4, // 그리드 열 수 — ↑/↓가 4칸씩 점프해요
    loop: true, // 세로 이동은 같은 열 안에서 순환해요
  });

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="grid" className="grid grid-cols-4">
      {ITEMS.map((item) => (
        <button key={item.id} data-roving-item>
          {item.emoji}
        </button>
      ))}
    </div>
  );
}`;
