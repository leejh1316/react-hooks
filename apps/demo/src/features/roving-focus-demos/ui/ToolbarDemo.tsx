import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { DemoSection, Kbd } from "@/shared/ui";

const TOOLS = [
  { label: "Bold", icon: "B" },
  { label: "Italic", icon: "I" },
  { label: "Underline", icon: "U" },
  { label: "Strike", icon: "S" },
  { label: "Link", icon: "🔗" },
  { label: "Image", icon: "🖼" },
];

export function ToolbarDemo() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    itemSelector: "[data-roving-item]",
    orientation: "horizontal",
    loop: true,
  });

  return (
    <DemoSection
      title="Toolbar — Horizontal"
      description={
        <>
          <Kbd>←</Kbd> / <Kbd>→</Kbd> to navigate · <Kbd>Home</Kbd> / <Kbd>End</Kbd> to jump ·
          loops around
        </>
      }
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        role="toolbar"
        aria-label="Text formatting"
        onKeyDown={handleKeyDown}
        className="flex gap-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-fit"
      >
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            data-roving-item
            aria-label={tool.label}
            title={tool.label}
            className="px-3.5 py-1.5 text-sm font-medium bg-transparent border border-transparent rounded-md cursor-pointer color-inherit transition-colors duration-100
              hover:bg-gray-200 dark:hover:bg-gray-700
              focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-1
              [[tabindex='0']]:bg-indigo-100 dark:[[tabindex='0']]:bg-indigo-950
              [[tabindex='0']]:border-indigo-200 dark:[[tabindex='0']]:border-indigo-700
              [[tabindex='0']]:text-indigo-700 dark:[[tabindex='0']]:text-indigo-300"
          >
            {tool.icon}
          </button>
        ))}
      </div>
    </DemoSection>
  );
}
