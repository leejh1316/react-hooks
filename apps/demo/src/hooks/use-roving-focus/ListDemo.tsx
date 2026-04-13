import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

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
    <section className="demo-section">
      <h2>List — Vertical</h2>
      <p className="description">
        <kbd className="kbd">↑</kbd> / <kbd className="kbd">↓</kbd> to navigate · stops at edges{" "}
        {log && <span className="log-msg">({log})</span>}
      </p>
      <ul
        ref={containerRef as React.RefObject<HTMLUListElement>}
        className="roving-list"
        role="listbox"
        aria-label="Mailbox folders"
        onKeyDown={handleKeyDown}
      >
        {MAIL_FOLDERS.map((name, i) => (
          <li
            key={name}
            data-roving-item
            role="option"
            aria-selected={selected === i}
            className={selected === i ? "selected" : ""}
            onClick={() => setSelected(i)}
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
