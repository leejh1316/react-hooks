import { useComposedRefs } from "@leejaehyeok/use-compose-ref";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";
import { Button } from "@src/components/ui";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 동적 리스트 + once + reset
   내장 MutationObserver 덕분에 나중에 추가된 카드도
   자동으로 관찰되고, 제거된 카드는 states에서 삭제돼요.

   once: true인 옵저버는 각 카드가 최초 진입 후 이탈하는
   시점에 관찰이 중단되어 isVisible이 더 이상 갱신되지 않아요.
   그래서 카드 리빌은 once 옵저버가, states 패널의 실시간
   가시성 표시는 once 없는 라이브 옵저버가 따로 담당하고,
   useComposedRefs로 두 ref를 한 컨테이너에 연결해요
   ────────────────────────────────────────────── */

/** states[key] 상태를 도트 색으로 표현하는 배지 */
const StateChip = ({ stateKey, isVisible, hasEntered }: { stateKey: string; isVisible: boolean; hasEntered: boolean }) => (
  <span className="text-caption-1 font-code border-line-regular text-ink-secondary inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1">
    <span
      className={`size-1.5 shrink-0 rounded-full transition-colors ${
        isVisible ? "bg-emerald-500" : hasEntered ? "bg-amber-400" : "bg-gray-300"
      }`}
    />
    {stateKey}
  </span>
);

const LEGEND = [
  { color: "bg-emerald-500", label: "isVisible" },
  { color: "bg-amber-400", label: "hasEntered (지금은 안 보임)" },
  { color: "bg-gray-300", label: "미진입" },
];

const DynamicListDemo = () => {
  const idRef = useRef(3);
  const [items, setItems] = useState([1, 2, 3]);

  // 리빌 옵저버 — once: true라서 각 카드는 최초 진입 이후 관찰이 중단돼요.
  const {
    setContainerRef: setRevealRef,
    states: revealStates,
    reset: resetReveal,
  } = useIntersectionObserverGroup({
    root: "container",
    once: true,
    threshold: 0.3,
  });

  // 라이브 옵저버 — once 없이 계속 관찰하며 states 패널의 실시간 가시성을 담당해요.
  const {
    setContainerRef: setLiveRef,
    states: liveStates,
    reset: resetLive,
  } = useIntersectionObserverGroup({
    root: "container",
    threshold: 0.3,
  });

  const setContainerRef = useComposedRefs(setRevealRef, setLiveRef);

  const reset = (key?: string) => {
    resetReveal(key);
    resetLive(key);
  };

  return (
    <div className="w-full max-w-md">
      {/* 컨트롤 */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setItems((prev) => [...prev, (idRef.current += 1)])}>
            카드 추가
          </Button>
          <Button variant="secondary" onClick={() => setItems((prev) => prev.slice(0, -1))}>
            마지막 제거
          </Button>
        </div>
        <Button variant="secondary" onClick={() => reset()}>
          전체 리셋
        </Button>
      </div>

      {/* 스크롤 컨테이너 — 추가된 카드는 MutationObserver가 자동으로 관찰을 시작해요 */}
      <div ref={setContainerRef} className="border-line-regular h-56 overflow-y-auto rounded-xl border bg-gray-50 p-3">
        {items.map((id) => {
          const key = `card-${id}`;
          const hasEntered = revealStates[key]?.hasEntered ?? false;
          return (
            // 진입 애니메이션은 카드 전체에 적용돼요. opacity/transform은 레이아웃 크기를
            // 바꾸지 않으므로 숨겨진 상태에서도 교차 판정은 그대로 동작해요.
            <div
              key={key}
              data-intersection-key={key}
              className={`border-line-regular mb-3 flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition-all duration-500 last:mb-0 ${
                hasEntered ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
              }`}
            >
              <span className="text-body-3 text-ink-primary font-semibold">✨ 카드 {id}</span>
              <button
                type="button"
                onClick={() => reset(key)}
                className="text-caption-1 text-ink-tertiary rounded-md px-2 py-1 transition-colors hover:bg-gray-100"
                title="이 카드만 다시 관찰해요"
              >
                ↺ 리셋
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-caption-1 text-ink-tertiary flex h-full items-center justify-center">카드를 추가해 보세요.</div>
        )}
      </div>

      {/* states 요약 — 라이브 옵저버 기준이라 스크롤할 때마다 실시간으로 갱신되고,
          제거된 카드의 키는 자동으로 사라져요 */}
      <div className="border-line-regular mt-3 rounded-xl border bg-gray-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-caption-1 text-ink-secondary font-semibold">states</span>
          <div className="flex items-center gap-2.5">
            {LEGEND.map(({ color, label }) => (
              <span key={label} className="text-caption-2 text-ink-tertiary inline-flex items-center gap-1">
                <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(liveStates).map(([key, state]) => (
            <StateChip key={key} stateKey={key} isVisible={state.isVisible} hasEntered={state.hasEntered} />
          ))}
          {Object.keys(liveStates).length === 0 && <span className="text-caption-1 text-ink-tertiary">아직 관찰된 키가 없어요.</span>}
        </div>
      </div>
    </div>
  );
};

export default DynamicListDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const DYNAMIC_LIST_DEMO_CODE = `import { useState } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

function DynamicList() {
  const [items, setItems] = useState([1, 2, 3]);

  // 리빌 옵저버 — once: true라서 각 카드는 최초 진입 후 이탈하는 시점에 관찰이 중단되고,
  // 이후에는 isVisible이 갱신되지 않아요. reset으로만 다시 시작할 수 있어요.
  const {
    setContainerRef: setRevealRef,
    states: revealStates,
    reset: resetReveal,
  } = useIntersectionObserverGroup({ root: "container", once: true, threshold: 0.3 });

  // 라이브 옵저버 — once 없이 계속 관찰해서 실시간 가시성 표시를 담당해요.
  const {
    setContainerRef: setLiveRef,
    states: liveStates,
    reset: resetLive,
  } = useIntersectionObserverGroup({ root: "container", threshold: 0.3 });

  // 두 옵저버의 ref를 하나의 컨테이너에 함께 연결해요.
  const setContainerRef = useComposedRefs(setRevealRef, setLiveRef);

  const reset = (key?: string) => {
    resetReveal(key);
    resetLive(key);
  };

  return (
    <div>
      {/* 내장 MutationObserver가 추가/제거된 카드를 자동으로 감지해요 */}
      <button onClick={() => setItems((prev) => [...prev, prev.length + 1])}>카드 추가</button>
      <button onClick={() => setItems((prev) => prev.slice(0, -1))}>마지막 제거</button>
      <button onClick={() => reset()}>전체 리셋</button>

      <div ref={setContainerRef} style={{ height: 220, overflowY: "auto" }}>
        {items.map((id) => {
          const key = \`card-\${id}\`;
          const hasEntered = revealStates[key]?.hasEntered ?? false;
          return (
            <div
              key={key}
              data-intersection-key={key}
              style={{
                opacity: hasEntered ? 1 : 0,
                transform: hasEntered ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
                transition: "all 0.5s",
              }}
            >
              <span>✨ 카드 {id}</span>
              {/* reset(key)는 해당 키만 초기화하고 다시 관찰해요 */}
              <button onClick={() => reset(key)}>↺ 리셋</button>
            </div>
          );
        })}
      </div>

      {/* 라이브 옵저버의 states라서 스크롤할 때마다 실시간으로 갱신돼요 */}
      <div>
        {Object.entries(liveStates).map(([key, state]) => (
          <span key={key}>
            {key}: {state.isVisible ? "🟢 보임" : state.hasEntered ? "🟡 진입한 적 있음" : "⚪ 미진입"}
          </span>
        ))}
      </div>
    </div>
  );
}`;
