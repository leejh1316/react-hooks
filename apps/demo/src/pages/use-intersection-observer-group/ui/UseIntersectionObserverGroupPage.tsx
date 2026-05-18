import { useState, useCallback, useRef, useEffect } from "react";
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

const GNB_SECTIONS = [
  { id: "gnb-intro", label: "소개", color: "indigo", bg: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", chip: "bg-indigo-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300" },
  { id: "gnb-features", label: "기능", color: "violet", bg: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300", chip: "bg-violet-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-300" },
  { id: "gnb-usage", label: "사용법", color: "blue", bg: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", chip: "bg-blue-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300" },
  { id: "gnb-examples", label: "예시", color: "emerald", bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", chip: "bg-emerald-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-300" },
  { id: "gnb-summary", label: "요약", color: "orange", bg: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300", chip: "bg-orange-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-300" },
  { id: "gnb-tips", label: "팁", color: "rose", bg: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300", chip: "bg-rose-500 text-white", chipInactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-300" },
];

function GnbNavigationDemo() {
  const [useEnableControl, setUseEnableControl] = useState(true);
  const [activeId, setActiveId] = useState(GNB_SECTIONS[0].id);
  const [enabled, setEnabled] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const chipListRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const { setContainerRef } = useIntersectionObserverGroup({
    root: "container",
    enable: enabled,
    threshold: 0.5,
    onEntered: (key) => {
      setActiveId(key);
    },
  });

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      setContainerRef(node);
      scrollContainerRef.current = node;
    },
    [setContainerRef],
  );

  useEffect(() => {
    const chip = chipRefs.current[activeId];
    if (chip && chipListRef.current) {
      chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  // useEnableControl 모드 변경 시 상태 초기화
  useEffect(() => {
    setActiveId(GNB_SECTIONS[0].id);
    setEnabled(true);
    setIsScrolling(false);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [useEnableControl]);

  const handleChipClick = (id: string) => {
    if (activeId === id) return;

    const target = scrollContainerRef.current?.querySelector(`[data-intersection-key="${id}"]`);

    if (useEnableControl) {
      setEnabled(false);
      setIsScrolling(true);
      setActiveId(id);
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => {
        setEnabled(true);
        setIsScrolling(false);
      }, 700);
    } else {
      // enable 제어 없음 — 스크롤 중 중간 섹션이 감지되어 GNB가 흔들림
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const activeSection = GNB_SECTIONS.find((s) => s.id === activeId);

  return (
    <DemoSection
      title="GNB 네비게이션 (enable 제어)"
      description={
        <>
          칩을 클릭하면 해당 섹션으로 스크롤됩니다.{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">enable 제어 없음</code> 모드에서는
          스크롤 도중 중간 섹션이 감지되어 GNB 칩이 흔들립니다.{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">enable 제어 있음</code> 모드에서는 클릭
          시 감지를 일시 중단해 목적지 칩만 활성화됩니다.
        </>
      }
    >
      {/* Mode Toggle */}
      <div className="mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg flex gap-1">
        <button
          onClick={() => setUseEnableControl(false)}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            !useEnableControl
              ? "bg-red-500 text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          enable 제어 없음 (문제)
        </button>
        <button
          onClick={() => setUseEnableControl(true)}
          className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            useEnableControl
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          enable 제어 있음 (해결)
        </button>
      </div>

      {/* Problem/Solution callout */}
      {!useEnableControl ? (
        <div className="mb-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          멀리 있는 칩을 클릭해 보세요. 스크롤 도중 중간 섹션들이 순차 감지되어 GNB 칩이 흔들립니다.
        </div>
      ) : (
        <div className="mb-3 px-3 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300">
          칩을 클릭하면 감지가 일시 중단되어 목적지 칩만 즉시 활성화됩니다. 스크롤 완료 후 자연 스크롤 감지가 재개됩니다.
        </div>
      )}

      {/* Chip GNB */}
      <div className="mb-2 relative">
        <div
          ref={chipListRef}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {GNB_SECTIONS.map((section) => (
            <button
              key={section.id}
              ref={(el) => {
                chipRefs.current[section.id] = el;
              }}
              onClick={() => handleChipClick(section.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeId === section.id ? section.chip : section.chipInactive
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-linear-to-l from-white dark:from-gray-950 to-transparent pointer-events-none" />
      </div>

      {/* Scroll Container */}
      <div
        ref={setRef}
        className="h-72 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto scroll-smooth"
      >
        {GNB_SECTIONS.map((section) => (
          <div
            key={section.id}
            data-intersection-key={section.id}
            className={`h-52 mx-3 my-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${
              activeId === section.id ? `${section.bg} text-white shadow-lg` : section.light
            }`}
          >
            <span className="text-2xl font-bold">{section.label}</span>
            <span className="text-sm opacity-75 font-mono">{section.id}</span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {useEnableControl && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isScrolling
                ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isScrolling ? "bg-amber-400" : "bg-green-500"}`} />
            {isScrolling ? "스크롤 중 — 감지 일시 중단" : "감지 활성"}
          </span>
        )}
        {!useEnableControl && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            항상 감지 중 (문제 발생 가능)
          </span>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          활성 섹션: <span className="font-medium text-gray-800 dark:text-gray-200">{activeSection?.label}</span>
        </span>
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
      <GnbNavigationDemo />
    </div>
  );
}
