import { useComposedState } from "@leejaehyeok/use-compose-state";
import { Button } from "@src/components/ui";
import { useState } from "react";
import StateBoard from "./StateBoard";

/* ──────────────────────────────────────────────
   Demo: 직접 값 vs 함수형 업데이트
   두 상태의 값을 일부러 어긋뜨린 뒤 두 방식의
   결과가 어떻게 달라지는지 비교해 볼 수 있어요
   ────────────────────────────────────────────── */

const FunctionalUpdateDemo = () => {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const setCount = useComposedState(setCountA, setCountB);

  return (
    <StateBoard
      title="useComposedState로 합성한 상태 2개"
      items={[
        { label: "setCountA", caption: "상태 A", value: countA },
        { label: "setCountB", caption: "상태 B", value: countB },
      ]}
    >
      {/* 합성하지 않은 setter를 직접 호출해 두 상태의 값을 어긋뜨려요 */}
      <Button variant="secondary" onClick={() => setCountA((prev) => prev + 3)}>
        A만 +3 (값 어긋뜨리기)
      </Button>
      {/* 함수형 업데이트 — 각 상태가 자신의 이전 값에 함수를 적용해요 */}
      <Button onClick={() => setCount((prev) => prev + 1)}>{"setCount((prev) => prev + 1)"}</Button>
      {/* 직접 값 — 모든 상태가 같은 값이 돼요 */}
      <Button onClick={() => setCount(0)}>setCount(0)</Button>
    </StateBoard>
  );
};

export default FunctionalUpdateDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const FUNCTIONAL_UPDATE_DEMO_CODE = `import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

function CountPanel() {
  const [countA, setCountA] = useState(0); // 예: 3
  const [countB, setCountB] = useState(0); // 예: 0

  const setCount = useComposedState(setCountA, setCountB);

  return (
    <>
      {/* 함수형 업데이트: 각 상태가 자신의 이전 값에 함수를 적용해요 → 4, 1 */}
      <button onClick={() => setCount((prev) => prev + 1)}>모두 +1</button>

      {/* 직접 값: 모든 상태가 같은 값이 돼요 → 0, 0 */}
      <button onClick={() => setCount(0)}>모두 초기화</button>
    </>
  );
}`;
