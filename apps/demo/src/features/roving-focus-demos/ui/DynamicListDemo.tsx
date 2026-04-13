import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { DemoSection, Button } from "@/shared/ui";

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
    <DemoSection
      title="Dynamic List — MutationObserver sync"
      description="Items added/removed are automatically detected via MutationObserver"
    >
      <div className="mb-3">
        <Button onClick={addItem}>+ Add item</Button>
      </div>
      <ul
        ref={containerRef as React.RefObject<HTMLUListElement>}
        role="listbox"
        aria-label="Dynamic list"
        onKeyDown={handleKeyDown}
        className="list-none p-0 m-0 max-h-55 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      >
        {items.map((item) => (
          <li
            key={item.id}
            data-roving-item
            role="option"
            className="flex items-center justify-between px-4 py-2.5 text-[0.9rem] cursor-default border-b border-gray-100 dark:border-gray-800 last:border-b-0
              hover:bg-gray-50 dark:hover:bg-gray-800
              focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:-outline-offset-2
              [[tabindex='0']]:bg-indigo-50 dark:[[tabindex='0']]:bg-indigo-950
              [[tabindex='0']]:text-indigo-700 dark:[[tabindex='0']]:text-indigo-300"
          >
            <span>{item.label}</span>
            <button
              aria-label={`Remove ${item.label}`}
              onClick={() => removeItem(item.id)}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-xs bg-transparent border border-transparent rounded text-gray-400 cursor-pointer transition-colors duration-100
                hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </DemoSection>
  );
}
