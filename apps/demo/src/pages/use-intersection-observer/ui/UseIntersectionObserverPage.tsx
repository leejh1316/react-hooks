import { useState, useCallback, useRef } from "react";
import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicDetectionDemo() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({ root: "container" });

  return (
    <DemoSection
      title="기본 교차점 감지"
      description={
        <>
          컨테이너를 스크롤하면 대상 요소의 가시성 상태가 실시간으로 변합니다. isVisible은 요소가 현재 보이는지 여부, hasEntered는 요소가 한
          번이라도 보인 적이 있는지를 나타냅니다. 원하는 감시 대상에
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs"> data-intersection-target </code>속성을
          추가하세요. 추가하지 않으면 기본적으로 container의 첫번째 요소가 감시 대상으로 지정됩니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
      >
        <div className="flex items-center justify-center h-90 text-sm text-gray-400">스크롤하세요 ↓</div>
        <div
          data-intersection-target
          className="mx-4 h-28 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg"
        >
          대상 요소
        </div>
        <div className="flex items-center justify-center h-90 text-sm text-gray-400">↓ 계속 스크롤</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-lg text-center text-sm font-medium transition-all duration-200 ${
            isVisible
              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-1 ring-green-400 dark:ring-green-600"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          <div className="font-mono text-xs mb-1">isVisible</div>
          <div className="font-semibold">{String(isVisible)}</div>
        </div>
        <div
          className={`p-3 rounded-lg text-center text-sm font-medium transition-all duration-200 ${
            hasEntered
              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400 dark:ring-blue-600"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          <div className="font-mono text-xs mb-1">hasEntered</div>
          <div className="font-semibold">{String(hasEntered)}</div>
        </div>
      </div>
    </DemoSection>
  );
}

function TargetSelectorDemo() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({
    root: "container",
    targetSelector: "[data-highlight-target]",
  });

  return (
    <DemoSection
      title="targetSelector 옵션"
      description={
        <>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">targetSelector</code> 로 컨테이너 내 특정
          요소를 지정해 감지합니다. 기본값은{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">[data-intersection-target]</code>입니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
      >
        <div className="mx-4 mt-4 space-y-3">
          {["일반 요소 — 감지 대상 아님", "일반 요소 — 감지 대상 아님"].map((label, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-400 dark:text-gray-500"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center h-60 text-sm text-gray-400">↓ 스크롤</div>
        <div className="mx-4">
          <div
            data-highlight-target
            className={`p-4 rounded-xl font-medium text-center transition-all duration-300 ${
              isVisible
                ? "bg-violet-500 text-white shadow-lg"
                : "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700"
            }`}
          >
            <div className="text-xs font-mono mb-1 opacity-70">data-highlight-target</div>
            감지 대상 요소
          </div>
        </div>
        <div className="mx-4 mt-3 space-y-3">
          <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-400 dark:text-gray-500">
            일반 요소 — 감지 대상 아님
          </div>
        </div>
        <div className="flex items-center justify-center h-60 text-sm text-gray-400">↓ 계속</div>
      </div>
      <div className="mt-4 flex gap-3">
        <span
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            isVisible
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          {isVisible ? "✓ 보임" : "○ 안 보임"}
        </span>
        <span
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            hasEntered
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          {hasEntered ? "✓ 진입함" : "○ 아직"}
        </span>
      </div>
    </DemoSection>
  );
}

function OnceResetDemo() {
  const { setContainerRef, hasEntered, reset } = useIntersectionObserver({
    root: "container",
    once: true,
  });

  return (
    <DemoSection
      title="once 옵션 & reset"
      description={
        <>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">once: true</code> 로 설정하면 처음 교차 시
          한 번만 감지하고 관찰을 중단합니다.{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">reset()</code> 으로 재활성화할 수 있습니다.
        </>
      }
    >
      <div
        ref={setContainerRef}
        className="h-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
      >
        <div className="flex items-center justify-center h-90 text-sm text-gray-400">스크롤하세요 ↓</div>
        <div
          data-intersection-target
          className={`mx-4 h-28 rounded-xl flex flex-col items-center justify-center font-semibold transition-all duration-500 ${
            hasEntered
              ? "bg-emerald-500 text-white shadow-lg"
              : "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-dashed border-orange-300 dark:border-orange-600"
          }`}
        >
          <div className="text-2xl mb-1">{hasEntered ? "✓" : "?"}</div>
          <div>{hasEntered ? "감지 완료!" : "아직 감지 안 됨"}</div>
          {hasEntered && <div className="text-xs mt-1 opacity-75">다시 스크롤해도 변하지 않아요</div>}
        </div>
        <div className="flex items-center justify-center h-90 text-sm text-gray-400">↓ 계속 스크롤</div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={reset} size="sm" variant="cancel">
          reset()
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {hasEntered ? "reset 후 다시 스크롤해 보세요" : "스크롤해서 진입해 보세요"}
        </span>
      </div>
    </DemoSection>
  );
}

function CallbackEventDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);

  const addLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString("ko-KR", { hour12: false });
    logsRef.current = [`[${time}] ${message}`, ...logsRef.current].slice(0, 12);
    setLogs([...logsRef.current]);
  }, []);

  const { setContainerRef } = useIntersectionObserver({
    root: "container",
    onEntered: () => addLog("onEntered — 요소가 뷰포트에 들어왔습니다"),
    onExited: () => addLog("onExited — 요소가 뷰포트에서 나갔습니다"),
    onChange: (type) => addLog(`onChange("${type}")`),
  });

  return (
    <DemoSection title="이벤트 콜백" description="onEntered, onExited, onChange 콜백으로 교차 이벤트를 구독합니다.">
      <div
        ref={setContainerRef}
        className="h-56 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
      >
        <div className="flex items-center justify-center h-60 text-sm text-gray-400">스크롤하세요 ↓</div>
        <div
          data-intersection-target
          className="mx-4 h-24 rounded-xl bg-purple-500 flex items-center justify-center text-white font-semibold shadow-lg"
        >
          대상 요소
        </div>
        <div className="flex items-center justify-center h-60 text-sm text-gray-400">↓ 계속</div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">이벤트 로그</span>
          <button
            onClick={() => {
              logsRef.current = [];
              setLogs([]);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            지우기
          </button>
        </div>
        <div className="h-36 bg-gray-950 rounded-lg p-3 overflow-y-auto font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-600">이벤트를 기다리는 중...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={i === 0 ? "text-green-400" : "text-gray-500"}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </DemoSection>
  );
}

export function UseIntersectionObserverPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-intersection-observer"
        description="IntersectionObserver API를 래핑한 훅으로, 요소가 뷰포트와 교차하는 시점을 감지합니다. 단일 대상만 감지합니다."
      />
      <BasicDetectionDemo />
      <TargetSelectorDemo />
      <OnceResetDemo />
      <CallbackEventDemo />
    </div>
  );
}
