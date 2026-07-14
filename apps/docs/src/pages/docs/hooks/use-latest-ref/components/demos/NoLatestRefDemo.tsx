import { Button } from "@src/components/ui";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useLatestRef 미적용 (비교용)
   마운트 시 한 번 생성된 인터벌이 클로저에 캡처된 초기 count(0)만 계속 읽어요
   ────────────────────────────────────────────── */

const NoLatestRefDemo = () => {
  const [count, setCount] = useState(0);
  const [intervalValue, setIntervalValue] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // 의존성 배열이 비어 있어 인터벌은 마운트 시점의 count(0)를 클로저로 캡처해요.
    const id = setInterval(() => {
      setIntervalValue(count);
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

      <p className="text-body-3 text-ink-tertiary">count를 아무리 올려도 1초마다 실행되는 인터벌은 마운트 시점의 0만 읽어요.</p>

      <div className="flex gap-2">
        <Button onClick={() => setCount((prev) => prev + 1)}>count +1</Button>
        <Button variant="secondary" onClick={() => setCount(0)}>
          count 초기화
        </Button>
      </div>
    </div>
  );
};

export default NoLatestRefDemo;
