import { useState } from "react";
import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicGroupDetectionDemo() {
  const { setContainerRef, states } = useIntersectionObserverGroup();
  const cards = Array.from({ length: 8 }, (_, i) => ({ id: `card-${i + 1}`, title: `Card ${i + 1}` }));

  const description = "컨테이너 내 여러 요소의 교차점을 동시에 감지합니다. 각 요소는 data-intersection-key 속성으로 구별됩니다.";

  return (
    <DemoSection title="다중 카드 감지" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto space-y-4 py-4"
        >
          <div className="text-sm text-gray-400 h-20 flex items-center justify-center">스크롤을 내려보세요 ↓</div>
          {cards.map((card) => {
            const state = states[card.id];
            const isVisible = state?.isVisible ?? false;
            const hasEntered = state?.hasEntered ?? false;

            return (
              <div
                key={card.id}
                data-intersection-key={card.id}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  hasEntered
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{card.title}</h4>
                  <div className="flex gap-2">
                    {isVisible && (
                      <span className={`text-sm px-2 py-1 rounded ${hasEntered ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}>
                        {isVisible ? "👁️ 보임" : ""}
                      </span>
                    )}
                  </div>
                </div>
                {hasEntered && <p className="text-sm mt-2 opacity-90">✓ 처음 나타남!</p>}
              </div>
            );
          })}
          <div className="text-sm text-gray-400 h-20 flex items-center justify-center">↓ 계속 스크롤 ↓</div>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">감지된 카드:</span>
        <span className="ml-2">
          {Object.entries(states).filter(([, state]) => state.isVisible).length} / {cards.length}
        </span>
      </div>
    </DemoSection>
  );
}

function OnceWithResetDemo() {
  const { setContainerRef, states, reset } = useIntersectionObserverGroup({ once: true });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const cards = Array.from({ length: 6 }, (_, i) => ({ id: `once-card-${i + 1}`, title: `Item ${i + 1}` }));

  const description = "once: true로 설정하면 한 번만 감지합니다. 각 항목을 개별 reset하거나 전체 reset할 수 있습니다.";

  return (
    <DemoSection title="once 옵션 & 개별 Reset" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto space-y-3 py-4"
        >
          <div className="text-sm text-gray-400 h-16 flex items-center justify-center">스크롤 ↓</div>
          {cards.map((card) => {
            const state = states[card.id];
            const hasEntered = state?.hasEntered ?? false;

            return (
              <div
                key={card.id}
                data-intersection-key={card.id}
                className={`p-4 rounded-lg transition-all duration-300 flex items-center justify-between ${
                  hasEntered
                    ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div>
                  <h4 className="font-medium">{card.title}</h4>
                  {hasEntered && <p className="text-sm opacity-75">✓ 감지됨</p>}
                </div>
                {hasEntered && (
                  <button
                    onClick={() => {
                      reset(card.id);
                      setSelectedKey(card.id);
                      setTimeout(() => setSelectedKey(null), 500);
                    }}
                    className="px-2 py-1 text-xs font-medium bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 rounded transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            );
          })}
          <div className="text-sm text-gray-400 h-16 flex items-center justify-center">↓ 계속 스크롤</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => reset()}
          variant="primary"
          title="모든 항목의 감지 상태를 초기화합니다"
        >
          전체 Reset
        </Button>
        <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
          감지됨: {Object.values(states).filter((s) => s.hasEntered).length} / {cards.length}
        </span>
      </div>
    </DemoSection>
  );
}

function CounterGroupDemo() {
  const { setContainerRef, states } = useIntersectionObserverGroup();
  const items = Array.from({ length: 12 }, (_, i) => ({ id: `counter-${i}`, number: i + 1 }));

  const description = "각 요소의 상태를 실시간으로 추적하고 통계를 표시합니다.";
  const visibleCount = Object.values(states).filter((s) => s.isVisible).length;
  const enteredCount = Object.values(states).filter((s) => s.hasEntered).length;

  return (
    <DemoSection title="상태 통계" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
        >
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="text-sm text-gray-400 h-12 flex items-center justify-center">스크롤 ↓</div>
            {items.map((item) => {
              const state = states[`counter-${item.id}`];
              const isVisible = state?.isVisible ?? false;
              const hasEntered = state?.hasEntered ?? false;

              return (
                <div
                  key={item.id}
                  data-intersection-key={`counter-${item.id}`}
                  className={`p-3 rounded-lg text-center font-bold transition-all duration-300 ${
                    hasEntered
                      ? "bg-indigo-500 text-white scale-105"
                      : isVisible
                        ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {item.number}
                </div>
              );
            })}
            <div className="text-sm text-gray-400 h-12 flex items-center justify-center col-span-3">
              ↓ 계속 스크롤 ↓
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{visibleCount}</div>
          <div className="text-gray-600 dark:text-gray-400">현재 보임</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{enteredCount}</div>
          <div className="text-gray-600 dark:text-gray-400">한 번은 본</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{items.length}</div>
          <div className="text-gray-600 dark:text-gray-400">전체 개수</div>
        </div>
      </div>
    </DemoSection>
  );
}

export function UseIntersectionObserverGroupPage() {
  const headerDescription =
    "여러 요소의 교차점을 그룹으로 감지하고 각 요소의 상태를 독립적으로 관리하는 훅입니다.";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader title="use-intersection-observer-group" description={headerDescription} />
      <BasicGroupDetectionDemo />
      <OnceWithResetDemo />
      <CounterGroupDemo />
    </div>
  );
}
