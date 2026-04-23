import { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// 1. 기본 동작 비교
function BasicDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, { delay: 500, minDisplayDuration: 1000 });

  const handleFetch = async (duration: number) => {
    setIsLoading(true);
    try {
      await sleep(duration);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DemoSection
      title="기본 동작 비교"
      description={
        <>
          delay=500ms 기준으로, 로딩 시간이 짧으면 스피너가 나타나지 않습니다.{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">isLoading</code>은 즉시 반영되고,{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">isDeferredLoading</code>은 500ms 후에만 true가 됩니다.
          <br />
          minDisplayDuration으로 로딩의 최소 표시 시간을 설정할 수 있습니다. (현재: 1000ms)
        </>
      }
    >
      <div className="flex gap-2 flex-wrap mb-6">
        <Button onClick={() => handleFetch(400)} disabled={isLoading} size="sm">
          400ms 로딩
        </Button>
        <Button onClick={() => handleFetch(500)} disabled={isLoading} size="sm">
          500ms 로딩 (최소 1초 유지)
        </Button>
        <Button onClick={() => handleFetch(1500)} disabled={isLoading} size="sm">
          1.5s 로딩
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">isLoading (원본)</p>
          <div className="flex items-center gap-2">
            <span
              className={[
                "w-2.5 h-2.5 rounded-full transition-colors duration-100",
                isLoading ? "bg-orange-400" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-200">{String(isLoading)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">즉시 변경됨</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">isDeferredLoading (지연)</p>
          <div className="flex items-center gap-2">
            <span
              className={[
                "w-2.5 h-2.5 rounded-full transition-colors duration-100",
                isDeferredLoading ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-200">{String(isDeferredLoading)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">500ms 이상 지속될 때만 true</p>
        </div>
      </div>

      {isDeferredLoading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-indigo-500">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          로딩 중...
        </div>
      )}
    </DemoSection>
  );
}

// 2. delay 직접 설정
function DelayControlDemo() {
  const [delay, setDelay] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [loadDuration, setLoadDuration] = useState(500);
  const [log, setLog] = useState<string[]>([]);

  const isDeferredLoading = useDeferredLoading(isLoading, { delay });

  const handleFetch = async () => {
    setLog([]);
    setIsLoading(true);
    const start = Date.now();
    setLog((prev) => [`[${0}ms] isLoading → true`, ...prev]);

    const checkInterval = setInterval(() => {
      // log는 setState이므로 직접 접근 안 됨 (단순 시각화 목적)
    }, 50);

    try {
      await sleep(loadDuration);
    } finally {
      clearInterval(checkInterval);
      setIsLoading(false);
      const elapsed = Date.now() - start;
      setLog((prev) => [`[${elapsed}ms] isLoading → false`, ...prev]);
    }
  };

  return (
    <DemoSection title="delay 조정" description="delay 값과 실제 로딩 시간을 각각 조절해서 스피너가 언제 나타나는지 확인하세요.">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            delay: <strong className="text-indigo-500">{delay}ms</strong>
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            로딩 시간: <strong className="text-indigo-500">{loadDuration}ms</strong>
          </span>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={loadDuration}
            onChange={(e) => setLoadDuration(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button onClick={handleFetch} disabled={isLoading} size="sm">
          요청 실행
        </Button>
        <div className="flex items-center gap-3 text-sm font-mono">
          <span className="flex items-center gap-1.5">
            <span className={["w-2 h-2 rounded-full", isLoading ? "bg-orange-400" : "bg-gray-300 dark:bg-gray-600"].join(" ")} />
            <span className="text-gray-500 dark:text-gray-400">isLoading</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={["w-2 h-2 rounded-full", isDeferredLoading ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"].join(" ")} />
            <span className="text-gray-500 dark:text-gray-400">isDeferredLoading</span>
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        {loadDuration < delay
          ? `⚡ 로딩(${loadDuration}ms) < delay(${delay}ms) → 스피너가 나타나지 않습니다`
          : `⏳ 로딩(${loadDuration}ms) ≥ delay(${delay}ms) → 스피너가 나타납니다`}
      </p>
    </DemoSection>
  );
}

// 3. 실제 UI 비교 (깜빡임 방지 효과)
function FlickerCompareDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, { delay: 300 });
  const [done, setDone] = useState(false);
  const [flickerCount, setFlickerCount] = useState(0);

  const handleFetch = async () => {
    setDone(false);
    setFlickerCount((c) => c + 1);
    setIsLoading(true);
    await sleep(150);
    setIsLoading(false);
    setDone(true);
  };

  return (
    <DemoSection
      title="깜빡임 방지 효과 비교"
      description="150ms 짧은 로딩입니다. 왼쪽은 isLoading을 그대로 써서 스피너가 순간 깜빡이고, 오른쪽은 isDeferredLoading(delay=300ms)을 써서 스피너 없이 콘텐츠가 부드럽게 페이드인됩니다."
    >
      <div className="flex items-center gap-3 mb-5">
        <Button onClick={handleFetch} disabled={isLoading} size="sm">
          짧은 요청 실행 (150ms)
        </Button>
        {flickerCount > 0 && <span className="text-xs text-gray-400 font-mono">{flickerCount}회 실행됨</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* isLoading — 깜빡임 발생 */}
        <div className="p-4 border border-orange-200 dark:border-orange-900/50 rounded-lg overflow-hidden">
          <p className="text-xs font-semibold text-orange-500 mb-3 uppercase tracking-wide">isLoading (깜빡임)</p>
          <div className="relative min-h-20">
            {/* 스피너 — isLoading일 때 즉시 나타났다 사라짐 */}
            <div
              className={[
                "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-150",
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <svg className="animate-spin w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs text-orange-400">로딩 중...</span>
            </div>

            {/* 콘텐츠 */}
            <div
              className={[
                "absolute inset-0 flex items-center justify-center transition-opacity duration-150",
                !isLoading && done ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <div className="text-center">
                <p className="text-2xl mb-1">✓</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">완료</p>
              </div>
            </div>

            {/* 초기 상태 */}
            <div
              className={[
                "absolute inset-0 flex items-center justify-center transition-opacity duration-150",
                !isLoading && !done ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <p className="text-xs text-gray-400">버튼을 눌러보세요</p>
            </div>
          </div>
        </div>

        {/* isDeferredLoading — 부드러운 전환 */}
        <div className="p-4 border border-indigo-200 dark:border-indigo-900/50 rounded-lg overflow-hidden">
          <p className="text-xs font-semibold text-indigo-500 mb-3 uppercase tracking-wide">isDeferredLoading (부드럽게)</p>
          <div className="relative min-h-20">
            {/* 스피너 — delay 이상일 때만 페이드인 */}
            <div
              className={[
                "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300",
                isDeferredLoading ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <svg className="animate-spin w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs text-indigo-400">로딩 중...</span>
            </div>

            {/* 콘텐츠 — 페이드인 */}
            <div
              className={[
                "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                !isDeferredLoading && done ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <div className="text-center">
                <p className="text-2xl mb-1">✓</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">완료</p>
              </div>
            </div>

            {/* 초기 상태 */}
            <div
              className={[
                "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                !isDeferredLoading && !done ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <p className="text-xs text-gray-400">버튼을 눌러보세요</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        왼쪽은 순간 깜빡이는 스피너가 보이고, 오른쪽은 스피너 없이 완료 화면이 페이드인됩니다.
      </p>
    </DemoSection>
  );
}

// 4. minDisplayDuration 최소 표시 시간 데모
function MinDisplayDurationDemo() {
  const [minDisplayDuration, setMinDisplayDuration] = useState(800);
  const [loadDuration, setLoadDuration] = useState(400);
  const [isLoading, setIsLoading] = useState(false);
  const [log, setLog] = useState<{ time: number; message: string }[]>([]);

  const withMinDuration = useDeferredLoading(isLoading, { delay: 100, minDisplayDuration });
  const withoutMinDuration = useDeferredLoading(isLoading, { delay: 100, minDisplayDuration: 0 });

  const handleFetch = async () => {
    const start = Date.now();
    setLog([]);
    setIsLoading(true);
    setLog([{ time: 0, message: "isLoading → true" }]);

    try {
      await sleep(loadDuration);
    } finally {
      setIsLoading(false);
      setLog((prev) => [...prev, { time: Date.now() - start, message: "isLoading → false" }]);
    }
  };

  return (
    <DemoSection
      title="minDisplayDuration — 최소 표시 시간"
      description={
        <>
          스피너가 나타난 후 너무 빨리 사라지면 오히려 어색합니다.{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">minDisplayDuration</code>을 설정하면 스피너가 최소 해당 시간
          동안 유지됩니다. 오른쪽(minDisplayDuration 없음)과 비교해 보세요.
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            minDisplayDuration: <strong className="text-indigo-500">{minDisplayDuration}ms</strong>
          </span>
          <input
            type="range"
            min={0}
            max={2000}
            step={100}
            value={minDisplayDuration}
            onChange={(e) => setMinDisplayDuration(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            로딩 시간: <strong className="text-indigo-500">{loadDuration}ms</strong>
          </span>
          <input
            type="range"
            min={150}
            max={2000}
            step={50}
            value={loadDuration}
            onChange={(e) => setLoadDuration(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Button onClick={handleFetch} disabled={isLoading} size="sm">
          요청 실행
        </Button>
        {log.length > 0 && (
          <ul className="flex gap-3 text-xs font-mono text-gray-400">
            {log.map((entry, i) => (
              <li key={i}>
                [{entry.time}ms] {entry.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-indigo-200 dark:border-indigo-900/50 rounded-lg">
          <p className="text-xs font-semibold text-indigo-500 mb-1 uppercase tracking-wide">minDisplayDuration 적용</p>
          <p className="text-xs text-gray-400 mb-3">delay=100ms, minDisplayDuration={minDisplayDuration}ms</p>
          <div className="flex items-center gap-2 min-h-8">
            {withMinDuration ? (
              <>
                <svg className="animate-spin w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm text-indigo-400">최소 {minDisplayDuration}ms 유지됩니다</span>
              </>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">대기 중</span>
            )}
          </div>
        </div>

        <div className="p-4 border border-orange-200 dark:border-orange-900/50 rounded-lg">
          <p className="text-xs font-semibold text-orange-500 mb-1 uppercase tracking-wide">minDisplayDuration 없음</p>
          <p className="text-xs text-gray-400 mb-3">delay=100ms, minDisplayDuration=0ms</p>
          <div className="flex items-center gap-2 min-h-8">
            {withoutMinDuration ? (
              <>
                <svg className="animate-spin w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm text-orange-400">로딩 끝나면 바로 사라집니다</span>
              </>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">대기 중</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        {loadDuration >= minDisplayDuration
          ? `로딩(${loadDuration}ms) ≥ minDisplayDuration(${minDisplayDuration}ms) → 차이가 크지 않습니다. 로딩 시간을 minDisplayDuration보다 짧게 줄여보세요.`
          : `로딩(${loadDuration}ms) < minDisplayDuration(${minDisplayDuration}ms) → 왼쪽 스피너가 ${minDisplayDuration - loadDuration}ms 더 유지됩니다.`}
      </p>
    </DemoSection>
  );
}

export function UseDeferredLoadingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-deferred-loading"
        description="지정된 지연 시간 이상 로딩이 지속될 때만 로딩 상태를 노출합니다. 짧은 로딩은 표시하지 않아 불필요한 스피너 깜빡임을 방지합니다."
      />
      <BasicDemo />
      <DelayControlDemo />
      <FlickerCompareDemo />
      <MinDisplayDurationDemo />
    </div>
  );
}
