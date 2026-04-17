import { useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// 1. 기본 동작 비교
function BasicDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const isDeferredLoading = useDeferredLoading(isLoading, 300);

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
          delay=300ms 기준으로, 로딩 시간이 짧으면 스피너가 나타나지 않습니다.{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">isLoading</code>은 즉시 반영되고,{" "}
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">isDeferredLoading</code>은 300ms 후에만 true가 됩니다.
        </>
      }
    >
      <div className="flex gap-2 flex-wrap mb-6">
        <Button onClick={() => handleFetch(100)} disabled={isLoading} size="sm">
          100ms 로딩 (스피너 없음)
        </Button>
        <Button onClick={() => handleFetch(600)} disabled={isLoading} size="sm" variant="cancel">
          600ms 로딩 (스피너 표시)
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
            isLoading (원본)
          </p>
          <div className="flex items-center gap-2">
            <span
              className={[
                "w-2.5 h-2.5 rounded-full transition-colors duration-100",
                isLoading ? "bg-orange-400" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-200">
              {String(isLoading)}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400">즉시 변경됨</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
            isDeferredLoading (지연)
          </p>
          <div className="flex items-center gap-2">
            <span
              className={[
                "w-2.5 h-2.5 rounded-full transition-colors duration-100",
                isDeferredLoading ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-200">
              {String(isDeferredLoading)}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400">300ms 이상 지속될 때만 true</p>
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

  const isDeferredLoading = useDeferredLoading(isLoading, delay);

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
    <DemoSection
      title="delay 조정"
      description="delay 값과 실제 로딩 시간을 각각 조절해서 스피너가 언제 나타나는지 확인하세요."
    >
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
            <span
              className={[
                "w-2 h-2 rounded-full",
                isLoading ? "bg-orange-400" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
            <span className="text-gray-500 dark:text-gray-400">isLoading</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={[
                "w-2 h-2 rounded-full",
                isDeferredLoading ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600",
              ].join(" ")}
            />
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
  const isDeferredLoading = useDeferredLoading(isLoading, 300);
  const [resultA, setResultA] = useState<string | null>(null);
  const [resultB, setResultB] = useState<string | null>(null);

  const handleFetch = async () => {
    setResultA(null);
    setResultB(null);
    setIsLoading(true);
    await sleep(150);
    setIsLoading(false);
    setResultA("데이터 로드 완료 ✓");
    setResultB("데이터 로드 완료 ✓");
  };

  return (
    <DemoSection
      title="깜빡임 방지 효과 비교"
      description="150ms 짧은 로딩 시뮬레이션입니다. isLoading은 스피너가 순간 깜빡이고, isDeferredLoading(delay=300ms)은 스피너 없이 부드럽게 전환됩니다."
    >
      <Button onClick={handleFetch} disabled={isLoading} size="sm" className="mb-5">
        짧은 요청 실행 (150ms)
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-xs font-semibold text-orange-500 mb-3 uppercase tracking-wide">
            isLoading 사용 (깜빡임 발생)
          </p>
          <div className="min-h-[3rem] flex items-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-orange-400">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                로딩 중...
              </div>
            ) : resultA ? (
              <p className="text-sm text-gray-700 dark:text-gray-200">{resultA}</p>
            ) : (
              <p className="text-sm text-gray-400">버튼을 눌러보세요</p>
            )}
          </div>
        </div>

        <div className="p-4 border border-indigo-200 dark:border-indigo-900 rounded-lg">
          <p className="text-xs font-semibold text-indigo-500 mb-3 uppercase tracking-wide">
            isDeferredLoading 사용 (부드러운 전환)
          </p>
          <div className="min-h-[3rem] flex items-center">
            {isDeferredLoading ? (
              <div className="flex items-center gap-2 text-sm text-indigo-400">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                로딩 중...
              </div>
            ) : resultB ? (
              <p className="text-sm text-gray-700 dark:text-gray-200">{resultB}</p>
            ) : (
              <p className="text-sm text-gray-400">버튼을 눌러보세요</p>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
}
