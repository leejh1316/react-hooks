import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝", "🍍", "🥭", "🍈", "🍌"];
const COLS = 4;
const DISABLED_INDICES = new Set([2, 7]);

export function GridDemo() {
  const [picked, setPicked] = useState<number | null>(null);

  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "both",
    loop: true,
    colSkipCount: COLS,
    clickOnNavigate: false,
    onNavigate: ({ activeIndex }) => setPicked(activeIndex),
  });

  return (
    <section className="demo-section">
      <h2>Grid — Both Axes</h2>
      <p className="description">
        All four arrow keys · <kbd className="kbd">Home</kbd> / <kbd className="kbd">End</kbd> · loops · grayed items are skipped ·{" "}
        {picked !== null ? `picked: ${EMOJIS[picked]}` : "navigate to pick"}
      </p>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="roving-grid"
        role="grid"
        aria-label="Fruit picker"
        onKeyDown={handleKeyDown}
      >
        {EMOJIS.map((emoji, i) => (
          <button
            key={emoji}
            data-roving-item
            title={`Fruit ${i + 1}`}
            disabled={DISABLED_INDICES.has(i)}
            className={picked === i ? "picked" : ""}
          >
            {emoji}
          </button>
        ))}
      </div>
    </section>
  );
}
