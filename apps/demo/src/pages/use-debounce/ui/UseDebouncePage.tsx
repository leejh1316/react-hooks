import { useState, useCallback } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function SearchInputDemo() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [callCount, setCallCount] = useState(0);

  const { debounce } = useDebounce(
    useCallback((value: string) => {
      setSearchQuery(value);
      setCallCount((c) => c + 1);
    }, []),
    500,
    { leading: false, trailing: true },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debounce(value);
  };

  return (
    <DemoSection
      title="검색 입력 (trailing only)"
      description="입력을 멈춘 후 500ms 뒤에 검색어가 반영됩니다. 불필요한 API 호출을 줄이는 전형적인 패턴입니다."
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="검색어를 입력하세요..."
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
      />
      <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
        <span>
          입력값: <strong className="text-gray-800 dark:text-gray-100">{inputValue || "—"}</strong>
        </span>
        <span>
          검색어:{" "}
          <strong className="text-indigo-500">{searchQuery || "—"}</strong>
        </span>
        <span>
          실행 횟수: <strong className="text-gray-800 dark:text-gray-100">{callCount}</strong>
        </span>
      </div>
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

  const { debounce } = useDebounce(addLog("실행"), wait, { leading, trailing });

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
        <Button onClick={() => debounce()}>debounce 호출</Button>
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

  const { debounce, flush, cancel } = useDebounce(
    useCallback(() => addLog("실행됨"), [addLog]),
    2000,
    { leading: false, trailing: true },
  );

  return (
    <DemoSection
      title="flush / cancel"
      description="trailing 전용 (leading: false, trailing: true, wait: 2000ms). debounce를 호출하고 flush로 즉시 실행하거나 cancel로 취소해보세요."
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => { debounce(); addLog("debounce 호출"); }}>
          debounce 호출
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

export function UseDebouncePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-debounce"
        description="마지막 호출로부터 일정 시간이 지난 후 함수를 실행합니다. 검색 입력이나 API 호출 최적화에 유용합니다."
      />
      <SearchInputDemo />
      <OptionsPlaygroundDemo />
      <FlushCancelDemo />
    </div>
  );
}
