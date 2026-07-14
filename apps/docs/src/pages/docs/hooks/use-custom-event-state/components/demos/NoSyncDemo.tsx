import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useCustomEventState 미적용 (비교용)
   각 컴포넌트가 독립적인 useState를 사용하므로
   버튼을 눌러도 서로의 카운트가 동기화되지 않아요
   ────────────────────────────────────────────── */

const CounterPanelA = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 A — 독립적인 useState</p>
      <p className="text-body-3 text-ink-secondary">
        카운트: <span className="text-ink-primary font-semibold">{count}</span>
      </p>
      <Button onClick={() => setCount(count + 1)}>+1 증가</Button>
    </div>
  );
};

const CounterPanelB = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 B — 독립적인 useState</p>
      <p className="text-body-3 text-ink-secondary">
        카운트: <span className="text-ink-primary font-semibold">{count}</span>
      </p>
      <Button variant="secondary" onClick={() => setCount(0)}>
        초기화
      </Button>
    </div>
  );
};

const NoSyncDemo = () => (
  <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
    <CounterPanelA />
    <CounterPanelB />
  </div>
);

export default NoSyncDemo;
