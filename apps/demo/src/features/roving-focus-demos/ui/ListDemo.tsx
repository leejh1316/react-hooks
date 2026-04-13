import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { DemoSection, Kbd } from "@/shared/ui";

const MAIL_FOLDERS = ["Inbox", "Drafts", "Sent", "Spam", "Trash"];

export function ListDemo() {
  const [selected, setSelected] = useState(0);
  const [log, setLog] = useState<string>("");

  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "vertical",
    loop: false,
    onNavigate: ({ activeIndex }) => setSelected(activeIndex),
    onUnderflow: () => setLog("↑ 첫 번째 항목입니다"),
    onOverflow: () => setLog("↓ 마지막 항목입니다"),
  });

  return (
    <DemoSection
      title="List — Vertical"
      description={
        <>
          <Kbd>↑</Kbd> / <Kbd>↓</Kbd> to navigate · stops at edges{" "}
          {log && <span className="text-indigo-500 italic">({log})</span>}
        </>
      }
    >
      <ul
        ref={containerRef as React.RefObject<HTMLUListElement>}
        role="listbox"
        aria-label="Mailbox folders"
        onKeyDown={handleKeyDown}
        className="list-none p-0 m-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-70"
      >
        {MAIL_FOLDERS.map((name, i) => (
          <li
            key={name}
            data-roving-item
            role="option"
            aria-selected={selected === i}
            onClick={() => setSelected(i)}
            className={[
              "px-4 py-2.5 text-[0.9rem] cursor-default border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors duration-100",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:-outline-offset-2",
              selected === i
                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {name}
          </li>
        ))}
      </ul>
    </DemoSection>
  );
}
