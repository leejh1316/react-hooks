import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: onUnderflow / onOverflow 경계 콜백
   loop: false일 때 경계를 넘어가려는 시도를
   콜백으로 감지해요
   ────────────────────────────────────────────── */

const ITEMS = ["1", "2", "3", "4", "5"];

const BoundaryCallbackDemo = () => {
  const [message, setMessage] = useState<string | null>(null);

  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "horizontal",
    loop: false, // 순환하지 않아야 경계 콜백이 호출돼요
    onNavigate: () => setMessage(null),
    onUnderflow: () => setMessage("⛔ onUnderflow — 첫 번째 아이템이에요"),
    onOverflow: () => setMessage("⛔ onOverflow — 마지막 아이템이에요"),
  });

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div ref={containerRef} onKeyDown={handleKeyDown} role="toolbar" aria-label="경계 콜백 데모" className="flex gap-1">
        {ITEMS.map((item) => (
          <button
            key={item}
            data-roving-item
            className="text-body-3 text-ink-secondary border-line-regular focus:ring-primary-500 h-10 w-10 rounded-lg border transition-colors hover:bg-neutral-100 focus:ring-2 focus:outline-none"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="font-code text-caption-1 border-line-regular flex min-h-11 w-full items-center justify-center rounded-xl border p-3">
        {message ? (
          <span className="text-ink-primary font-semibold">{message}</span>
        ) : (
          <span className="text-ink-tertiary">양 끝에서 ←/→를 한 번 더 눌러보세요</span>
        )}
      </div>
    </div>
  );
};

export default BoundaryCallbackDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const BOUNDARY_CALLBACK_DEMO_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

const { containerRef, handleKeyDown } = useRovingFocus({
  orientation: "horizontal",
  loop: false, // loop가 true면 순환하므로 경계 콜백이 호출되지 않아요
  onUnderflow: () => {
    // 첫 번째 아이템에서 이전 방향으로 이동 시도
    console.log("첫 번째 아이템이에요");
  },
  onOverflow: () => {
    // 마지막 아이템에서 다음 방향으로 이동 시도
    console.log("마지막 아이템이에요");
  },
});`;
