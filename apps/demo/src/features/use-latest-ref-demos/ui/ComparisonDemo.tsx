import { useState, useCallback, useRef } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { DemoSection } from "@/shared/ui";
import { ComparisonChild1 } from "../components/ComparisonChild1";
import { ComparisonChild2 } from "../components/ComparisonChild2";

export function ComparisonDemo() {
  const [value, setValue] = useState(0);

  const callbackCreationCounts = useRef({ withDependency: 0, withRef: 0 });
  const prevCallbacks = useRef<{ withDependency?: () => void; withRef?: () => void }>({});

  // 의존성 배열에 직접 콜백을 넣은 경우
  const handleWithDependency = useCallback(() => {
    return value;
  }, [value]);

  if (prevCallbacks.current.withDependency !== handleWithDependency) {
    callbackCreationCounts.current.withDependency += 1;
    prevCallbacks.current.withDependency = handleWithDependency;
  }

  // useLatestRef를 사용한 경우
  const latestValueRef = useLatestRef(value);
  const handleWithRef = useCallback(() => {
    return latestValueRef.current;
  }, []);

  if (prevCallbacks.current.withRef !== handleWithRef) {
    callbackCreationCounts.current.withRef += 1;
    prevCallbacks.current.withRef = handleWithRef;
  }

  const [log1, setLog1] = useState<string[]>([]);
  const [log2, setLog2] = useState<string[]>([]);

  return (
    <DemoSection
      title="콜백 의존성 비교"
      description="value가 변할 때, 의존성 배열에 value를 직접 넣으면 useCallback이 매번 재생성되지만, useLatestRef를 사용하면 재생성되지 않으면서도 최신 값을 사용합니다."
    >
      <div className="mb-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 font-semibold">
            value: <strong className="text-indigo-500 font-mono text-base">{value}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={20}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ComparisonChild1
            onClick={() => {
              const result = handleWithDependency();
              setLog1((prev) => [`결과: ${result}`, ...prev.slice(0, 4)]);
            }}
            title="의존성 배열에 value 포함"
            creationCount={callbackCreationCounts.current.withDependency}
          />
          <ul className="mt-2 text-xs space-y-0.5">
            {log1.length === 0 && (
              <li className="text-gray-400">버튼을 클릭하세요</li>
            )}
            {log1.map((entry, i) => (
              <li key={i} className="text-gray-600 dark:text-gray-300 font-mono">
                {entry}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ComparisonChild2
            onClick={() => {
              const result = handleWithRef();
              setLog2((prev) => [`결과: ${result}`, ...prev.slice(0, 4)]);
            }}
            title="useLatestRef 사용"
            creationCount={callbackCreationCounts.current.withRef}
          />
          <ul className="mt-2 text-xs space-y-0.5">
            {log2.length === 0 && (
              <li className="text-gray-400">버튼을 클릭하세요</li>
            )}
            {log2.map((entry, i) => (
              <li key={i} className="text-gray-600 dark:text-gray-300 font-mono">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">
          💡 비교
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">
          value를 변경하면 왼쪽의 useCallback은 매번 재생성되지만,
          <br />
          오른쪽은 재생성되지 않으면서도 최신 값을 반환합니다.
        </div>
      </div>
    </DemoSection>
  );
}
