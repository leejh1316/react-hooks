import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { DemoSection, Kbd } from "@/shared/ui";

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
    <DemoSection
      title="Grid — Both Axes"
      description={
        <>
          All four arrow keys · <Kbd>Home</Kbd> / <Kbd>End</Kbd> · loops · grayed items are
          skipped ·{" "}
          {picked !== null ? `picked: ${EMOJIS[picked]}` : "navigate to pick"}
        </>
      }
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        role="grid"
        aria-label="Fruit picker"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-4 gap-2 w-fit"
      >
        {EMOJIS.map((emoji, i) => (
          <button
            key={emoji}
            data-roving-item
            title={`Fruit ${i + 1}`}
            disabled={DISABLED_INDICES.has(i)}
            className={[
              "w-12 h-12 text-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-colors duration-100",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-1",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "[[tabindex='0']]:bg-indigo-100 dark:[[tabindex='0']]:bg-indigo-950 [[tabindex='0']]:border-indigo-300 dark:[[tabindex='0']]:border-indigo-700",
              picked === i ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {emoji}
          </button>
        ))}
      </div>
    </DemoSection>
  );
}
