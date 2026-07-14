import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

/* ──────────────────────────────────────────────
   Demo: 스크롤 스파이
   스크롤 컨테이너(root: "container") 안의 섹션들을
   키 기반으로 관찰해 현재 보이는 섹션을 목차에
   하이라이트하고, 목차 클릭 시 states[key].target으로
   해당 섹션까지 스크롤해요
   ────────────────────────────────────────────── */

const SECTIONS = [
  { key: "intro", label: "소개", color: "bg-sky-100 text-sky-700" },
  { key: "features", label: "기능", color: "bg-emerald-100 text-emerald-700" },
  { key: "usage", label: "사용법", color: "bg-amber-100 text-amber-700" },
  { key: "faq", label: "FAQ", color: "bg-violet-100 text-violet-700" },
];

const ScrollSpyDemo = () => {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    root: "container",
    threshold: 0.5,
  });

  return (
    <div className="flex w-full max-w-md gap-3">
      {/* 목차 — 현재 보이는 섹션이 하이라이트돼요 */}
      <nav className="flex w-24 shrink-0 flex-col gap-1">
        {SECTIONS.map(({ key, label }) => {
          const isVisible = states[key]?.isVisible ?? false;
          return (
            <button
              key={key}
              type="button"
              onClick={() => states[key]?.target?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
              className={`text-caption-1 rounded-lg px-3 py-1.5 text-left font-semibold transition-colors ${
                isVisible ? "bg-emerald-500 text-white" : "text-ink-tertiary hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* 스크롤 컨테이너 — root: "container"의 루트가 돼요 */}
      <div ref={setContainerRef} className="border-line-regular h-64 flex-1 overflow-y-auto rounded-xl border bg-gray-50 p-3">
        {SECTIONS.map(({ key, label, color }) => (
          <section
            key={key}
            data-intersection-key={key}
            className={`mb-3 flex h-40 flex-col items-center justify-center rounded-xl last:mb-0 ${color}`}
          >
            <span className="font-semibold">{label}</span>
            <span className="text-caption-1 font-code mt-1">
              isVisible: {String(states[key]?.isVisible ?? false)}
            </span>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ScrollSpyDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SCROLL_SPY_DEMO_CODE = `import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

const SECTIONS = ["intro", "features", "usage", "faq"];

function ScrollSpy() {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    root: "container", // 스크롤 컨테이너 자신을 교차 판정 루트로 사용해요
    threshold: 0.5,
  });

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <nav>
        {SECTIONS.map((key) => (
          <button
            key={key}
            // states[key].target으로 관찰 중인 DOM 요소에 직접 접근할 수 있어요
            onClick={() => states[key]?.target?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
            className={states[key]?.isVisible ? "active" : ""}
          >
            {key}
          </button>
        ))}
      </nav>

      <div ref={setContainerRef} style={{ height: 260, overflowY: "auto" }}>
        {SECTIONS.map((key) => (
          // keyAttribute(기본값 data-intersection-key)의 값이 states의 키가 돼요
          <section key={key} data-intersection-key={key} style={{ height: 160 }}>
            {key} — isVisible: {String(states[key]?.isVisible ?? false)}
          </section>
        ))}
      </div>
    </div>
  );
}`;
