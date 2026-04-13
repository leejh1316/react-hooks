import { useState, useCallback } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function ClickCounterDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  const { throttle } = useThrottle(
    useCallback(() => setThrottledCount((c) => c + 1), []),
    1000,
  );

  const handleClick = () => {
    setClickCount((c) => c + 1);
    throttle();
  };

  return (
    <DemoSection
      title="기본 동작 (leading + trailing)"
      description="버튼을 빠르게 클릭해보세요. 실제 클릭 횟수와 실행 횟수를 비교할 수 있습니다. wait: 1000ms"
    >
      <div className="flex items-center gap-6 mb-4">
        <Button onClick={handleClick}>클릭</Button>
        <div className="flex gap-8 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            클릭 횟수: <strong className="text-gray-800 dark:text-gray-100">{clickCount}</strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            실행 횟수:{" "}
            <strong className="text-indigo-500">{throttledCount}</strong>
          </span>
        </div>
      </div>
      <Button variant="cancel" size="sm" onClick={() => { setClickCount(0); setThrottledCount(0); }}>
        초기화
      </Button>
    </DemoSection>
  );
}

function OptionsPlaygroundDemo() {
  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [wait, setWait] = useState(1000);
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback(
    (prefix: string) => () => {
      setLog((prev) => [
        `${prefix} ${new Date().toLocaleTimeString("ko-KR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}.${String(new Date().getMilliseconds()).padStart(3, "0")}`,
        ...prev.slice(0, 9),
      ]);
    },
    [],
  );

  const { throttle } = useThrottle(addLog("실행"), wait, { leading, trailing });

  return (
    <DemoSection
      title="옵션 플레이그라운드"
      description="leading / trailing 옵션과 wait 값을 조정하며 동작 차이를 확인하세요."
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={leading}
            onChange={(e) => setLeading(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          leading
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={trailing}
            onChange={(e) => setTrailing(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          trailing
        </label>
        <label className="flex items-center gap-2 text-sm">
          wait:
          <select
            value={wait}
            onChange={(e) => setWait(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            {[500, 1000, 2000].map((v) => (
              <option key={v} value={v}>
                {v}ms
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => throttle()}>throttle 호출</Button>
        <Button variant="cancel" onClick={() => setLog([])}>
          로그 초기화
        </Button>
      </div>
      <ul className="min-h-24 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 실행 로그가 나타납니다.</li>
        )}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

function FlushCancelDemo() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback(
    (msg: string) =>
      setLog((prev) => [`[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${msg}`, ...prev.slice(0, 9)]),
    [],
  );

  const { throttle, flush, cancel } = useThrottle(
    useCallback(() => addLog("실행됨"), [addLog]),
    2000,
    { leading: false, trailing: true },
  );

  return (
    <DemoSection
      title="flush / cancel"
      description="trailing 전용 (leading: false, trailing: true, wait: 2000ms). throttle을 호출하고 flush로 즉시 실행하거나 cancel로 취소해보세요."
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => { throttle(); addLog("throttle 호출"); }}>
          throttle 호출
        </Button>
        <Button
          variant="cancel"
          onClick={() => { flush(); addLog("flush 호출"); }}
        >
          flush
        </Button>
        <Button
          variant="danger"
          onClick={() => { cancel(); addLog("cancel 호출"); }}
        >
          cancel
        </Button>
      </div>
      <ul className="min-h-24 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 실행 로그가 나타납니다.</li>
        )}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

export function UseThrottlePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-throttle"
        description="일정 시간 동안 함수 호출 횟수를 제한합니다. 스크롤·리사이즈 이벤트 최적화에 유용합니다."
      />
      <ClickCounterDemo />
      <OptionsPlaygroundDemo />
      <FlushCancelDemo />
    </div>
  );
}
