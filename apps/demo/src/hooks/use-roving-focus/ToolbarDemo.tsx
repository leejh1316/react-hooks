import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

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
    <section className="demo-section">
      <h2>Toolbar — Horizontal</h2>
      <p className="description">
        <kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd> to navigate ·{" "}
        <kbd className="kbd">Home</kbd> / <kbd className="kbd">End</kbd> to jump · loops around
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
