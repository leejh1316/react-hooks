import { useState } from "react";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicGroupDetectionDemo() {
  const items = Array.from({ length: 6 }, (_, i) => ({ id: `item-${i + 1}`, label: `항목 ${i + 1}` }));
  const { setContainerRef, states } = useIntersectionObserverGroup({ root: "container" });
  const visibleCount = Object.values(states).filter((s) => s.isVisible).length;
  const enteredCount = Object.values(states).filter((s) => s.hasEntered).length;

  return (
    <DemoSection
      title="다중 요소 동시 감지"
      description={
        <>
          각 요소에 <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">data-intersection-key</code> 를
          부여하면 그룹으로 관찰합니다. 스크롤하면 개별 상태가 실시간으로 업데이트됩니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto px-4 py-3 space-y-3"
      >
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">스크롤하세요 ↓</div>
        {items.map((item) => {
          const state = states[item.id];
          const isVisible = state?.isVisible ?? false;
          const hasEntered = state?.hasEntered ?? false;

          return (
            <div
              key={item.id}
              data-intersection-key={item.id}
              className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
                isVisible
                  ? "bg-indigo-500 text-white shadow-md"
                  : hasEntered
                    ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <div className="flex gap-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded ${isVisible ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                  {isVisible ? "보임" : "안 보임"}
                </span>
                {hasEntered && (
                  <span
                    className={`px-2 py-0.5 rounded ${isVisible ? "bg-white/20" : "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300"}`}
                  >
                    진입함
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">↓ 계속 스크롤</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{visibleCount}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">현재 보임</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{enteredCount}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">진입한 적 있음</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{items.length}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">전체 개수</div>
        </div>
      </div>
    </DemoSection>
  );
}

function ScrollAnimationDemo() {
  const cards = Array.from({ length: 8 }, (_, i) => ({
    id: `card-${i}`,
    title: `카드 ${i + 1}`,
    description: "스크롤하면 애니메이션과 함께 등장합니다.",
  }));

  const { setContainerRef, states } = useIntersectionObserverGroup({
    root: "container",
    once: true,
  });

  return (
    <DemoSection
      title="스크롤 진입 애니메이션"
      description={
        <>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">once: true</code> 를 활용한 스크롤 트리거
          애니메이션 패턴입니다. 각 항목은 처음 진입할 때 한 번만 애니메이션됩니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-72 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto px-4 py-3 space-y-3"
      >
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">스크롤하세요 ↓</div>
        {cards.map((card) => {
          const hasEntered = states[card.id]?.hasEntered ?? false;

          return (
            <div
              key={card.id}
              data-intersection-key={card.id}
              className={`p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-500 ${
                hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{card.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
            </div>
          );
        })}
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">끝</div>
      </div>
    </DemoSection>
  );
}

function IndividualResetDemo() {
  const items = Array.from({ length: 5 }, (_, i) => ({ id: `reset-item-${i + 1}`, label: `항목 ${i + 1}` }));
  const { setContainerRef, states, reset } = useIntersectionObserverGroup({
    root: "container",
    once: true,
  });
  const [lastReset, setLastReset] = useState<string | null>(null);

  const handleReset = (key?: string) => {
    reset(key);
    setLastReset(key ?? "all");
    setTimeout(() => setLastReset(null), 800);
  };

  return (
    <DemoSection
      title="개별 / 전체 reset"
      description={
        <>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">reset(key)</code> 로 특정 항목만,{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">reset()</code> 로 전체 상태를 초기화합니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto px-4 py-3 space-y-3"
      >
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">스크롤하세요 ↓</div>
        {items.map((item) => {
          const hasEntered = states[item.id]?.hasEntered ?? false;
          const isResetting = lastReset === item.id || lastReset === "all";

          return (
            <div
              key={item.id}
              data-intersection-key={item.id}
              className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
                isResetting
                  ? "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
                  : hasEntered
                    ? "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              <div>
                <span className="font-medium">{item.label}</span>
                {hasEntered && !isResetting && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">✓ 감지됨</span>}
                {isResetting && <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">초기화됨</span>}
              </div>
              {hasEntered && (
                <button
                  onClick={() => handleReset(item.id)}
                  className="px-2 py-1 text-xs font-medium rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  reset
                </button>
              )}
            </div>
          );
        })}
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">↓ 계속</div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={() => handleReset()} variant="primary" size="sm">
          전체 reset()
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          감지됨: {Object.values(states).filter((s) => s.hasEntered).length} / {items.length}
        </span>
      </div>
    </DemoSection>
  );
}

let nextItemId = 1;

function DynamicListDemo() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({ id: `dynamic-${nextItemId++}`, label: `항목 ${i + 1}` })),
  );

  const { setContainerRef, states } = useIntersectionObserverGroup({ root: "container" });

  const addItem = () => {
    const id = `dynamic-${nextItemId++}`;
    setItems((prev) => [...prev, { id, label: `항목 ${prev.length + 1}` }]);
  };

  const addItemAtTop = () => {
    const id = `dynamic-${nextItemId++}`;
    setItems((prev) => [{ id, label: `항목 (상단 추가)` }, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const visibleCount = Object.values(states).filter((s) => s.isVisible).length;

  return (
    <DemoSection
      title="동적 리스트 — MutationObserver 연동"
      description={
        <>
          항목을 추가·제거해도 <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">MutationObserver</code>
          가 DOM 변경을 감지해 자동으로 관찰 대상에 등록·해제합니다.
        </>
      }
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <Button onClick={addItemAtTop} size="sm">
          상단에 추가
        </Button>
        <Button onClick={addItem} size="sm">
          하단에 추가
        </Button>
      </div>
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto px-4 py-3 space-y-2"
      >
        {items.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">항목이 없습니다</div>
        )}
        {items.map((item) => {
          const state = states[item.id];
          const isVisible = state?.isVisible ?? false;

          return (
            <div
              key={item.id}
              data-intersection-key={item.id}
              className={`p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${
                isVisible
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{item.label}</span>
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isVisible ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                  {isVisible ? "보임" : "안 보임"}
                </span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className={`w-6 h-6 flex items-center justify-center text-xs rounded transition-colors ${
                  isVisible
                    ? "hover:bg-white/20 text-white/70 hover:text-white"
                    : "text-gray-400 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-500"
                }`}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{visibleCount}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">현재 보임</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{items.length}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">전체 개수</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Object.keys(states).length}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">관찰 중</div>
        </div>
      </div>
    </DemoSection>
  );
}

export function UseIntersectionObserverGroupPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-intersection-observer-group"
        description="여러 요소의 교차점을 그룹으로 감지하고 각 요소의 상태를 독립적으로 관리하는 훅입니다."
      />
      <BasicGroupDetectionDemo />
      <ScrollAnimationDemo />
      <IndividualResetDemo />
      <DynamicListDemo />
    </div>
  );
}
