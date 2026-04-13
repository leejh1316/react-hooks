import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

let nextId = 5;

export function DynamicListDemo() {
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
