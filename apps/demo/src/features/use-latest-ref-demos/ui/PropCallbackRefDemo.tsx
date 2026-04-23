import { useState, useCallback, useRef } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { DemoSection, Button } from "@/shared/ui";
import { CallbackRefChild } from "../components/CallbackRefChild";

export function PropCallbackRefDemo() {
  const [parentCount, setParentCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  // 부모의 상태가 변할 때마다 새로운 콜백이 생성됩니다
  const handleParentAction = () => {
    const newLog = `[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] 실행 값: parentCount=${parentCount}`;
    setLog((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  const latestHandleRef = useLatestRef(handleParentAction);
  const wrappedCallbackCreationCount = useRef(0);

  // useCallback에서 ref는 의존성으로 불필요
  // handleParentAction이 바뀌어도 wrappedCallback은 재생성되지 않음
  const wrappedCallback = useCallback(() => {
    latestHandleRef.current();
  }, []);

  // 이전 callback이 변경되었는지 추적
  const prevCallbackRef = useRef(wrappedCallback);
  if (prevCallbackRef.current !== wrappedCallback) {
    wrappedCallbackCreationCount.current += 1;
    prevCallbackRef.current = wrappedCallback;
  }


  return (
    <DemoSection
      title="Props Callback을 Ref로 저장"
      description="부모에서 콜백이 자주 바뀔 때, useLatestRef에 저장하고 useCallback의 의존성 배열에 ref를 넣으면 useCallback이 재생성되지 않습니다. 자식 컴포넌트(memo)에 전달되는 콜백 참조가 같으므로 재렌더링되지 않습니다."
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <div className="text-xs text-gray-500 font-semibold">부모 컴포넌트</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm">
              parentCount: <strong className="text-indigo-500 font-mono text-base">{parentCount}</strong>
            </span>
            <Button size="sm" onClick={() => setParentCount((p) => p + 1)}>
              +1 (콜백 변경)
            </Button>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded text-xs">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              useCallback 재생성 횟수: {wrappedCallbackCreationCount.current}
            </span>
          </div>
        </div>

        <CallbackRefChild onClick={wrappedCallback} />

        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">
            💡 주목
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            parentCount가 계속 증가해도 useCallback은 한 번도 재생성되지 않습니다.
            <br />
            자식 컴포넌트도 memo이므로 재렌더링되지 않습니다.
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {log.length === 0 && (
          <li className="text-xs text-gray-400">자식의 버튼을 클릭하면 콜백이 실행됩니다.</li>
        )}
        {log.map((entry, i) => (
          <li key={i} className="text-xs text-gray-600 dark:text-gray-300 font-mono">
            {entry}
          </li>
        ))}
      </ul>
    </DemoSection>
  );
}
