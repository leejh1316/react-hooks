import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import "./App.css";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo 1: Toolbar (horizontal, loop)
────────────────────────────────────────────── */
const TOOLS = [
  { label: "Bold", icon: "B" },
  { label: "Italic", icon: "I" },
  { label: "Underline", icon: "U" },
  { label: "Strike", icon: "S" },
  { label: "Link", icon: "🔗" },
  { label: "Image", icon: "🖼" },
];

function ToolbarDemo() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "horizontal",
    loop: true,
  });

  return (
    <section className="demo-section">
      <h2>Toolbar — Horizontal</h2>
      <p className="description">
        <kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd> to navigate · <kbd className="kbd">Home</kbd> /{" "}
        <kbd className="kbd">End</kbd> to jump · loops around
      </p>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="toolbar"
        role="toolbar"
        aria-label="Text formatting"
        onKeyDown={handleKeyDown}
      >
        {TOOLS.map((tool) => (
          <button key={tool.label} data-roving-item aria-label={tool.label} title={tool.label}>
            {tool.icon}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Demo 2: List (vertical, no loop, callbacks)
────────────────────────────────────────────── */
const MAIL_FOLDERS = ["Inbox", "Drafts", "Sent", "Spam", "Trash"];

function ListDemo() {
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

/* ──────────────────────────────────────────────
   Demo 3: Grid (both axes, colSkipCount, disabled)
────────────────────────────────────────────── */
const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝", "🍍", "🥭", "🍈", "🍌"];
const COLS = 4;
const DISABLED_INDICES = new Set([2, 7]);

function GridDemo() {
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

/* ──────────────────────────────────────────────
   Demo 4: Dynamic list (add / remove, MutationObserver)
────────────────────────────────────────────── */
let nextId = 5;

function DynamicListDemo() {
  const [items, setItems] = useState([
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" },
    { id: 3, label: "Item 3" },
    { id: 4, label: "Item 4" },
  ]);

  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "vertical",
    loop: true,
    scrollIntoView: { block: "nearest" },
  });

  const addItem = () => setItems((prev) => [...prev, { id: nextId, label: `Item ${nextId++}` }]);

  const removeItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="demo-section">
      <h2>Dynamic List — MutationObserver sync</h2>
      <p className="description">Items added/removed are automatically detected via MutationObserver</p>
      <div className="dynamic-controls">
        <button className="ctrl-btn" onClick={addItem}>
          + Add item
        </button>
      </div>
      <ul
        ref={containerRef as React.RefObject<HTMLUListElement>}
        className="roving-list dynamic-list"
        role="listbox"
        aria-label="Dynamic list"
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => (
          <li key={item.id} data-roving-item role="option" className="dynamic-item">
            <span>{item.label}</span>
            <button className="remove-btn" aria-label={`Remove ${item.label}`} onClick={() => removeItem(item.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Root
────────────────────────────────────────────── */
import React from "react";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>@leejaehyeok/use-roving-focus</h1>
        <p>Accessible keyboard navigation with roving tabindex</p>
      </header>
      <main>
        <ToolbarDemo />
        <ListDemo />
        <GridDemo />
        <DynamicListDemo />
      </main>
    </div>
  );
}
