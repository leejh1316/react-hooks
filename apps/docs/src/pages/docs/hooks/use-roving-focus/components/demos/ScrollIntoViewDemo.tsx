import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

/* ──────────────────────────────────────────────
   Demo: scrollIntoView 스크롤 목록
   화면 밖 항목으로 이동하면 자동으로
   스크롤되어 항목이 보이는 위치로 따라와요
   ────────────────────────────────────────────── */

const ITEMS = Array.from({ length: 20 }, (_, index) => `아이템 ${index + 1}`);

const ScrollIntoViewDemo = () => {
  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical",
    scrollIntoView: { block: "nearest" },
  });

  return (
    <div className="flex w-full max-w-xs flex-col items-stretch gap-4">
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        role="listbox"
        aria-label="스크롤 목록"
        className="border-line-regular flex max-h-52 flex-col gap-1 overflow-y-auto rounded-xl border p-2"
      >
        {ITEMS.map((item) => (
          <button
            key={item}
            data-roving-item
            role="option"
            aria-selected={false}
            className="text-body-3 text-ink-secondary hover:bg-neutral-100 focus:ring-primary-500 shrink-0 rounded-lg px-3 py-2 text-left transition-colors focus:ring-2 focus:outline-none"
          >
            {item}
          </button>
        ))}
      </div>
      <p className="text-caption-2 text-ink-tertiary select-none">
        항목을 클릭한 뒤 ↓를 계속 누르거나 End를 눌러보세요. 화면 밖 항목으로 이동해도 스크롤이 자동으로 따라와요.
      </p>
    </div>
  );
};

export default ScrollIntoViewDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SCROLL_INTO_VIEW_DEMO_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function ScrollableList() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical",
    // true를 넘기면 { block: "nearest" }로 동작하고,
    // ScrollIntoViewOptions 객체를 넘기면 그대로 사용해요.
    scrollIntoView: { block: "nearest" },
  });

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="listbox" className="max-h-52 overflow-y-auto">
      {ITEMS.map((item) => (
        <button key={item.id} data-roving-item role="option">
          {item.label}
        </button>
      ))}
    </div>
  );
}`;
