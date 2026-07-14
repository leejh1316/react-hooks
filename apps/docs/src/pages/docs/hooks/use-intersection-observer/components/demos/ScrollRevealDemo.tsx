import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: once + reset 스크롤 리빌 애니메이션
   최초 진입 시 한 번만 카드가 나타나고(once: true),
   이후 스크롤을 벗어나도 상태가 유지돼요.
   reset 버튼으로 관찰을 처음부터 다시 시작할 수 있어요
   ────────────────────────────────────────────── */

const ScrollRevealDemo = () => {
  const { setContainerRef, hasEntered, reset } = useIntersectionObserver({
    root: "container",
    once: true,
    threshold: 0.4,
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`text-caption-1 rounded-full px-3 py-1 font-semibold transition-colors ${
            hasEntered ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
          }`}
        >
          hasEntered: {String(hasEntered)}
        </span>
        <Button variant="secondary" onClick={reset}>
          다시 재생
        </Button>
      </div>

      <div ref={setContainerRef} className="border-line-regular h-52 overflow-y-auto rounded-xl border bg-gray-50 p-4">
        <div className="text-caption-1 text-ink-tertiary flex h-44 items-center justify-center">아래로 스크롤해 보세요 ↓</div>
        <div
          data-intersection-target
          className={`border-line-regular rounded-xl border bg-white p-5 shadow-sm transition-all duration-700 ${
            hasEntered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h5 className="text-body-3 text-ink-primary mb-1 font-semibold">✨ 한 번만 나타나는 카드</h5>
          <p className="text-caption-1 text-ink-tertiary">
            once: true라서 최초 진입 이후에는 스크롤을 벗어나도 관찰이 중단되고 상태가 유지돼요.
          </p>
        </div>
        <div className="h-44" />
      </div>
    </div>
  );
};

export default ScrollRevealDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SCROLL_REVEAL_DEMO_CODE = `import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";

function ScrollReveal() {
  const { setContainerRef, hasEntered, reset } = useIntersectionObserver({
    root: "container",
    once: true, // 최초 진입 이후 관찰을 중단해요
    threshold: 0.4,
  });

  return (
    <div>
      {/* reset을 호출하면 상태가 초기화되고 관찰이 처음부터 다시 시작돼요 */}
      <button onClick={reset}>다시 재생</button>

      <div ref={setContainerRef} style={{ height: 200, overflowY: "auto" }}>
        <div style={{ height: 300 }}>아래로 스크롤해 보세요 ↓</div>
        <div
          data-intersection-target
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s",
          }}
        >
          ✨ 한 번만 나타나는 카드
        </div>
        <div style={{ height: 300 }} />
      </div>
    </div>
  );
}`;
