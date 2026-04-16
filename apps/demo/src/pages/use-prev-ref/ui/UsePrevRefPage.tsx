import { useState, useEffect } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

// 1. 기본 사용법
function BasicDemo() {
  const [count, setCount] = useState(0);
  const prevCountRef = usePrevRef(count);
  const [log, setLog] = useState<string[]>([]);

  const handleCheck = () => {
    setLog((prev) => [
      `[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] current=${count}, prev=${prevCountRef.current}`,
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <DemoSection
      title="기본 사용법"
      description="usePrevRef는 ref를 반환합니다. 이전 값은 이벤트 핸들러나 사이드 이펙트에서 .current로 접근할 때 정확하게 동작합니다."
    >
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <Button variant="cancel" onClick={() => setCount((c) => c - 1)}>
          −
        </Button>
        <span className="text-2xl font-bold font-mono w-12 text-center">{count}</span>
        <Button onClick={() => setCount((c) => c + 1)}>+</Button>
        <Button variant="danger" size="sm" onClick={() => setCount(0)}>
          초기화
        </Button>
      </div>
      <Button size="sm" variant="cancel" onClick={handleCheck}>
        prevCountRef.current 확인
      </Button>
      <ul className="mt-4 min-h-[4rem] text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 이전 값 로그가 나타납니다.</li>
        )}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 2. 값 변화 감지
function ChangeDetectionDemo() {
  const [text, setText] = useState("");
  const prevTextRef = usePrevRef(text);
  const [log, setLog] = useState<string[]>([]);

  const handleApply = () => {
    const prev = prevTextRef.current;
    const current = text;
    if (prev === current) {
      setLog((l) => [`값 변화 없음: "${current}"`, ...l.slice(0, 9)]);
    } else {
      setLog((l) => [`"${prev}" → "${current}"`, ...l.slice(0, 9)]);
    }
  };

  return (
    <DemoSection
      title="값 변화 감지"
      description="이전 값과 현재 값을 비교하여 변화 여부를 감지합니다. useEffect 내부에서도 동일하게 활용할 수 있습니다."
    >
      <div className="flex gap-2 mb-5 flex-wrap">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트를 입력하세요"
          className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
        />
        <Button size="sm" onClick={handleApply}>
          변화 확인
        </Button>
      </div>
      <ul className="min-h-[4rem] text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">텍스트 입력 후 "변화 확인"을 클릭하세요.</li>
        )}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 3. 방향 감지 (슬라이더)
function DirectionDemo() {
  const [value, setValue] = useState(50);
  const prevValueRef = usePrevRef(value);
  const [direction, setDirection] = useState<"up" | "down" | "same" | null>(null);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev === value) return;
    setDirection(value > prev ? "up" : "down");
    setChangeCount((c) => c + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const directionLabel = {
    up: "▲ 증가",
    down: "▼ 감소",
    same: "→ 동일",
    null: "—",
  }[direction ?? "null"];

  const directionColor = {
    up: "text-green-500",
    down: "text-red-500",
    same: "text-gray-400",
    null: "text-gray-400",
  }[direction ?? "null"];

  return (
    <DemoSection
      title="방향 감지"
      description="useEffect 내부에서 prevRef.current와 현재 값을 비교하면 값의 증감 방향을 감지할 수 있습니다."
    >
      <div className="mb-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            값: <strong className="text-indigo-500">{value}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">이전 값 (ref)</div>
          <div className="font-mono font-bold text-gray-600 dark:text-gray-300">
            {prevValueRef.current}
          </div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">현재 값</div>
          <div className="font-mono font-bold text-indigo-500">{value}</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">방향</div>
          <div className={`font-bold ${directionColor}`}>{directionLabel}</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        변화 횟수: <strong className="text-indigo-500">{changeCount}</strong>
      </p>
    </DemoSection>
  );
}

// 4. JSX 직접 렌더링 주의사항
function CaveatDemo() {
  const [count, setCount] = useState(0);
  const prevCountRef = usePrevRef(count);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const handleClick = () => {
    setEventLog((prev) => [
      `클릭 시점: current=${count}, prevRef.current=${prevCountRef.current}`,
      ...prev.slice(0, 7),
    ]);
    setCount((c) => c + 1);
  };

  return (
    <DemoSection
      title="JSX 직접 렌더링 주의사항"
      description="JSX에서 prevRef.current를 직접 렌더링하면 2단계 이전 값이 표시됩니다. useEffect cleanup 타이밍 때문입니다. 이벤트 핸들러에서 접근하는 것을 권장합니다."
    >
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-center">
          <div className="text-xs text-red-400 font-semibold mb-1">❌ JSX 직접 렌더링</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
            prevCountRef.current
          </div>
          <div className="font-mono font-bold text-red-500 text-lg">{prevCountRef.current}</div>
          <div className="text-xs text-red-400 mt-1">2단계 이전 값</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div className="text-xs text-gray-400 font-semibold mb-1">현재 값</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">count</div>
          <div className="font-mono font-bold text-indigo-500 text-lg">{count}</div>
        </div>
      </div>

      <Button onClick={handleClick}>
        +1 증가 &amp; 이벤트 핸들러에서 확인
      </Button>

      <ul className="mt-4 min-h-[4rem] text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {eventLog.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 이벤트 핸들러 기준 로그가 나타납니다.</li>
        )}
        {eventLog.map((entry, i) => (
          <li
            key={i}
            className={i === 0 ? "text-green-600 dark:text-green-400" : ""}
          >
            {i === 0 ? "✅ " : ""}{entry}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        이벤트 핸들러에서는{" "}
        <span className="font-mono text-indigo-500">prevRef.current</span>가 정확히 1단계 이전 값을 반환합니다.
      </p>
    </DemoSection>
  );
}

export function UsePrevRefPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-prev-ref"
        description="이전 렌더링 사이클의 값을 ref로 저장합니다. 이벤트 핸들러나 사이드 이펙트에서 .current로 접근하면 항상 정확한 이전 값을 얻을 수 있습니다."
      />
      <BasicDemo />
      <ChangeDetectionDemo />
      <DirectionDemo />
      <CaveatDemo />
    </div>
  );
}
