import { useState, useCallback, useRef } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { DemoSection, Button } from "@/shared/ui";
import { PropsCallbackChild } from "../components/PropsCallbackChild";

export function PropsCallbackDemo() {
  const [parentValue, setParentValue] = useState("initial");
  const [log, setLog] = useState<string[]>([]);
  const childCallbackCreationCount = useRef(0);
  const prevChildCallback = useRef<(() => void) | null>(null);

  // 외부에서 받은 콜백 (props로 받는 상황 시뮬레이션)
  const onValueChange = (val: string) => {
    return `콜백 실행 - 전달받은 값: ${val}`;
  };

  // useLatestRef 사용
  const latestOnValueChangeRef = useLatestRef(onValueChange);
  const latestParentValueRef = useLatestRef(parentValue);
  const childCallback = useCallback(() => {
    return latestOnValueChangeRef.current(latestParentValueRef.current);
  }, []);

  if (prevChildCallback.current !== childCallback) {
    childCallbackCreationCount.current += 1;
    prevChildCallback.current = childCallback;
  }

  return (
    <DemoSection
      title="실제 사용 케이스: Props 콜백"
      description="부모에서 받은 콜백을 useLatestRef에 저장하면, parentValue가 변해도 자식에 전달되는 childCallback 함수 참조가 유지되므로 자식 컴포넌트(memo)가 재렌더링되지 않습니다."
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <div className="text-xs text-gray-500 font-semibold">부모 컴포넌트</div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">
              parentValue
            </label>
            <input
              type="text"
              value={parentValue}
              onChange={(e) => setParentValue(e.target.value)}
              placeholder="값을 입력하세요"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <PropsCallbackChild
          onClick={() => {
            const result = childCallback();
            setLog((prev) => [result, ...prev.slice(0, 4)]);
          }}
          creationCount={childCallbackCreationCount.current}
        />

        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">
            💡 주목
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            input을 입력해서 parentValue를 변경해도 자식의 useCallback은 재생성되지 않습니다.
            <br />
            하지만 콜백을 실행하면 항상 최신 parentValue를 사용합니다.
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {log.length === 0 && (
          <li className="text-xs text-gray-400">자식의 버튼을 클릭하세요</li>
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
