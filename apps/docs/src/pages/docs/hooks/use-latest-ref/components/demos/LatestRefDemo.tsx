import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { Button } from "@src/components/ui";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useLatestRef 적용
   인터벌은 마운트 시 한 번만 생성되지만 ref.current를 통해 항상 최신 count를 읽습니다
   ────────────────────────────────────────────── */

const LatestRefDemo = () => {
  const [count, setCount] = useState(0);
  const [intervalValue, setIntervalValue] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  const latestCountRef = useLatestRef(count);

  useEffect(() => {
    // 의존성 배열이 비어 있어 인터벌은 한 번만 생성되지만,
    // ref.current를 통해 항상 최신 count를 읽습니다.
    const id = setInterval(() => {
      setIntervalValue(latestCountRef.current);
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex gap-6">
        <p className="text-body-3 text-ink-secondary">
          현재 count <span className="text-ink-primary font-semibold tabular-nums">{count}</span>
        </p>
        <p className="text-body-3 text-ink-secondary">
          인터벌이 읽은 값 <span className="text-ink-primary font-semibold tabular-nums">{intervalValue ?? "-"}</span>
        </p>
        <p className="text-body-3 text-ink-secondary">
          인터벌 실행 <span className="text-ink-primary font-semibold tabular-nums">{tick}</span>회
        </p>
      </div>

      <p className="text-body-3 text-ink-tertiary">인터벌은 다시 생성되지 않지만, 다음 실행부터 항상 최신 count를 읽습니다.</p>

      <div className="flex gap-2">
        <Button onClick={() => setCount((prev) => prev + 1)}>count +1</Button>
        <Button variant="secondary" onClick={() => setCount(0)}>
          count 초기화
        </Button>
      </div>
    </div>
  );
};

export default LatestRefDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const LATEST_REF_DEMO_CODE = `import { useEffect, useState } from "react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

function LatestRefDemo() {
  const [count, setCount] = useState(0);
  const [intervalValue, setIntervalValue] = useState<number | null>(null);

  const latestCountRef = useLatestRef(count);

  useEffect(() => {
    // 인터벌은 마운트 시 한 번만 생성되지만,
    // ref.current를 통해 항상 최신 count를 읽습니다.
    const id = setInterval(() => setIntervalValue(latestCountRef.current), 1000);
    return () => clearInterval(id);
  }, []); // count를 의존성 배열에 넣지 않아도 됩니다.

  return (
    <>
      <p>현재 count: {count}</p>
      <p>인터벌이 읽은 값: {intervalValue}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>count +1</button>
    </>
  );
}`;
