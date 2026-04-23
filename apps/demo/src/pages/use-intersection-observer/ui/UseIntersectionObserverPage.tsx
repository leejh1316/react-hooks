import { useState, useCallback, useRef } from "react";
import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicDetectionDemo() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver();
  const description = "컨테이너 내의 요소가 뷰포트와 교차하는 시점을 감지합니다.";

  return (
    <DemoSection title="기본 교차점 감지" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto flex flex-col justify-between"
        >
          <div className="text-sm text-gray-400 py-16 text-center">스크롤을 내려보세요 ↓</div>
          <div className="flex items-center justify-center w-full h-24 bg-indigo-500 text-white font-medium rounded-lg transition-all duration-300">
            대상 요소
          </div>
          <div className="text-sm text-gray-400 py-16 text-center">↓ 계속 스크롤 ↓</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <span
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            isVisible
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isVisible ? "✓ 보임" : "○ 안 보임"}
        </span>
        <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          {hasEntered ? "✓ 들어옴" : "○ 아직"}
        </span>
      </div>
    </DemoSection>
  );
}

function OnceOptionDemo() {
  const { setContainerRef, isVisible, hasEntered, reset } = useIntersectionObserver({ once: true });
  const description = "한 번 교차하면 다시 감지하지 않습니다. reset()을 호출하면 감지를 재활성화할 수 있습니다.";

  return (
    <DemoSection title="once 옵션" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto flex flex-col justify-between"
        >
          <div className="text-sm text-gray-400 py-16 text-center">스크롤을 내려보세요 ↓</div>
          <div
            className={`flex items-center justify-center w-full h-24 rounded-lg font-medium transition-all duration-300 ${
              hasEntered
                ? "bg-emerald-500 text-white"
                : "bg-orange-300 dark:bg-orange-700 text-orange-900 dark:text-orange-100"
            }`}
          >
            {hasEntered ? "✓ 감지됨!" : "아직 감지 안 됨"}
          </div>
          <div className="text-sm text-gray-400 py-16 text-center">↓ 계속 스크롤 ↓</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <span
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            isVisible
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isVisible ? "✓ 보임" : "○ 안 보임"}
        </span>
        <Button onClick={reset} size="sm" variant="cancel">
          Reset
        </Button>
      </div>
    </DemoSection>
  );
}

function CallbackEventsDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    logsRef.current = [`[${timestamp}] ${message}`, ...logsRef.current].slice(0, 10);
    setLogs([...logsRef.current]);
  }, []);

  const { setContainerRef, reset } = useIntersectionObserver({
    onEntered: () => addLog("📍 요소가 보이기 시작했습니다"),
    onExited: () => addLog("👋 요소가 사라졌습니다"),
  });

  const description = "onEntered와 onExited 콜백을 통해 교차 이벤트를 감지합니다. (최근 10개 로그 표시)";

  return (
    <DemoSection title="이벤트 콜백 로그" description={description}>
      <div className="mb-4">
        <div
          ref={setContainerRef}
          className="h-96 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto flex flex-col justify-between"
        >
          <div className="text-sm text-gray-400 py-16 text-center">스크롤을 내려보세요 ↓</div>
          <div className="flex items-center justify-center w-full h-24 bg-purple-500 text-white font-medium rounded-lg">
            대상 요소
          </div>
          <div className="text-sm text-gray-400 py-16 text-center">↓ 계속 스크롤 ↓</div>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">이벤트 로그</h4>
          <Button onClick={reset} size="sm" variant="cancel">
            로그 초기화
          </Button>
        </div>
        <div className="h-48 bg-gray-900 rounded-lg p-3 overflow-y-auto font-mono text-xs text-gray-300 dark:text-gray-200">
          {logs.length === 0 ? (
            <div className="text-gray-500">이벤트를 기다리는 중...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-green-400">
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
  const headerDescription =
    "IntersectionObserver API를 래핑한 훅으로, 요소가 뷰포트와 교차하는 시점을 감지합니다.";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader title="use-intersection-observer" description={headerDescription} />
      <BasicDetectionDemo />
      <OnceOptionDemo />
      <CallbackEventsDemo />
    </div>
  );
}
