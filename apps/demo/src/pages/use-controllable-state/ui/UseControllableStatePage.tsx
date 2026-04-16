import { useState } from "react";
import { useControllableState } from "@leejaehyeok/use-controllable-state";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

// 비제어 모드 - defaultValue만 사용
function UncontrolledDemo() {
  const [log, setLog] = useState<string[]>([]);

  const [count, setCount] = useControllableState<number>({
    defaultValue: 0,
    onChange: (v) => {
      setLog((prev) => [`onChange(${v})`, ...prev.slice(0, 9)]);
    },
  });

  return (
    <DemoSection
      title="비제어 모드 (Uncontrolled)"
      description="value prop 없이 defaultValue만 전달합니다. 내부 상태로 동작하며, 변경 시 onChange가 호출됩니다."
    >
      <div className="flex items-center gap-4 mb-5">
        <Button variant="cancel" onClick={() => setCount((prev) => prev - 1)}>
          −
        </Button>
        <span className="text-2xl font-bold font-mono w-12 text-center">{count}</span>
        <Button onClick={() => setCount((prev) => prev + 1)}>+</Button>
        <Button variant="danger" size="sm" onClick={() => setCount(0)}>
          초기화
        </Button>
      </div>
      <ul className="min-h-16 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && <li className="text-gray-400">버튼을 클릭하면 onChange 로그가 나타납니다.</li>}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 제어 모드 - value를 외부에서 주입
function ControlledDemo() {
  const [externalValue, setExternalValue] = useState(50);

  const [value, setValue] = useControllableState<number>({
    value: externalValue,
    onChange: setExternalValue,
  });

  return (
    <DemoSection
      title="제어 모드 (Controlled)"
      description="value prop을 직접 전달합니다. 상태는 외부에서 관리되며, setValue를 호출하면 onChange가 실행됩니다."
    >
      <div className="flex items-center gap-4 mb-5">
        <Button variant="cancel" onClick={() => setValue((prev) => Math.max(0, prev - 10))}>
          −10
        </Button>
        <span className="text-2xl font-bold font-mono w-16 text-center">{value}</span>
        <Button onClick={() => setValue((prev) => Math.min(100, prev + 10))}>+10</Button>
      </div>
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={100}
          value={externalValue}
          onChange={(e) => setExternalValue(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        외부 상태:{" "}
        <strong className="text-indigo-500 font-mono">{externalValue}</strong>
        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
        훅 반환값:{" "}
        <strong className="text-gray-800 dark:text-gray-100 font-mono">{value}</strong>
      </p>
    </DemoSection>
  );
}

// 컴포넌트 라이브러리 패턴 - 제어/비제어 모두 지원하는 Toggle 컴포넌트
interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: React.ReactNode;
}

function Toggle({ pressed, defaultPressed = false, onPressedChange, children }: ToggleProps) {
  const [isPressed, setIsPressed] = useControllableState<boolean>({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={() => setIsPressed((prev) => !prev)}
      className={[
        "px-4 py-2 text-sm font-medium border rounded-md transition-colors duration-100 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2",
        isPressed
          ? "bg-indigo-500 border-indigo-500 text-white"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ComponentPatternDemo() {
  const [controlledPressed, setControlledPressed] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${msg}`, ...prev.slice(0, 9)]);
  };

  return (
    <DemoSection
      title="컴포넌트 패턴 (Toggle)"
      description="useControllableState를 사용하면 컴포넌트가 제어/비제어 두 모드를 모두 지원할 수 있습니다. 아래 Toggle은 동일한 컴포넌트지만 각각 다르게 동작합니다."
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-semibold">비제어 (defaultPressed)</p>
          <div className="flex gap-2 flex-wrap">
            <Toggle defaultPressed={false} onPressedChange={(v) => addLog(`비제어 Toggle A → ${v}`)}>
              Bold
            </Toggle>
            <Toggle defaultPressed={true} onPressedChange={(v) => addLog(`비제어 Toggle B → ${v}`)}>
              Italic
            </Toggle>
            <Toggle defaultPressed={false} onPressedChange={(v) => addLog(`비제어 Toggle C → ${v}`)}>
              Underline
            </Toggle>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-semibold">
            제어 (pressed = {String(controlledPressed)})
          </p>
          <div className="flex items-center gap-3">
            <Toggle pressed={controlledPressed} onPressedChange={(v) => { setControlledPressed(v); addLog(`제어 Toggle → ${v}`); }}>
              Bold
            </Toggle>
            <Button
              variant="cancel"
              size="sm"
              onClick={() => { setControlledPressed((prev) => !prev); addLog(`외부에서 직접 토글 → ${!controlledPressed}`); }}
            >
              외부에서 토글
            </Button>
          </div>
        </div>
      </div>

      <ul className="mt-5 min-h-16 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && <li className="text-gray-400">Toggle을 클릭하면 로그가 나타납니다.</li>}
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

// 동일 값 업데이트 시 onChange 호출 방지 확인
function SameValueDemo() {
  const [onChangeCount, setOnChangeCount] = useState(0);
  const [setValueCount, setSetValueCount] = useState(0);

  const [value, setValue] = useControllableState<string>({
    defaultValue: "hello",
    onChange: () => setOnChangeCount((c) => c + 1),
  });

  const handleSameValue = () => {
    setSetValueCount((c) => c + 1);
    setValue("hello"); // 동일한 값
  };

  const handleDiffValue = () => {
    setSetValueCount((c) => c + 1);
    setValue(value === "hello" ? "world" : "hello");
  };

  return (
    <DemoSection
      title="동일 값 업데이트 최적화"
      description="이전 값과 동일한 값으로 업데이트할 때는 onChange를 호출하지 않습니다. Object.is 비교를 사용합니다."
    >
      <div className="flex flex-wrap gap-2 mb-5">
        <Button variant="cancel" onClick={handleSameValue}>
          같은 값으로 setValue (&quot;hello&quot;)
        </Button>
        <Button onClick={handleDiffValue}>
          다른 값으로 setValue
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">현재 값</div>
          <div className="font-mono font-bold text-indigo-500">&quot;{value}&quot;</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">setValue 호출 수</div>
          <div className="font-bold text-gray-800 dark:text-gray-100">{setValueCount}</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">onChange 호출 수</div>
          <div className="font-bold text-green-500">{onChangeCount}</div>
        </div>
      </div>
    </DemoSection>
  );
}

export function UseControllableStatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-controllable-state"
        description="제어/비제어 컴포넌트 패턴을 단일 훅으로 구현합니다. value prop 유무에 따라 자동으로 모드를 전환합니다."
      />
      <UncontrolledDemo />
      <ControlledDemo />
      <ComponentPatternDemo />
      <SameValueDemo />
    </div>
  );
}
