import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: useCustomEventState 적용
   같은 key를 사용하는 두 컴포넌트가 Provider나
   prop drilling 없이 자동으로 동기화돼요
   ────────────────────────────────────────────── */

const EVENT_KEY = "docs/use-custom-event-state/counter";

const CounterPanelA = () => {
  const [count, setCount] = useCustomEventState(EVENT_KEY, 0);

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 A — key: "counter"</p>
      <p className="text-body-3 text-ink-secondary">
        카운트: <span className="text-ink-primary font-semibold">{count}</span>
      </p>
      {/* 함수형 업데이트도 useState와 동일하게 사용할 수 있어요 */}
      <Button onClick={() => setCount((prev) => prev + 1)}>+1 증가</Button>
    </div>
  );
};

const CounterPanelB = () => {
  // 같은 key를 사용하므로 Provider 없이 컴포넌트 A와 자동으로 동기화돼요.
  const [count, setCount] = useCustomEventState(EVENT_KEY, 0);

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 B — key: "counter"</p>
      <p className="text-body-3 text-ink-secondary">
        카운트: <span className="text-ink-primary font-semibold">{count}</span>
      </p>
      <Button variant="secondary" onClick={() => setCount(0)}>
        초기화
      </Button>
    </div>
  );
};

const SyncDemo = () => (
  <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
    <CounterPanelA />
    <CounterPanelB />
  </div>
);

export default SyncDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SYNC_DEMO_CODE = `import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

const EVENT_KEY = "counter";

function CounterA() {
  const [count, setCount] = useCustomEventState(EVENT_KEY, 0);

  return (
    <>
      <p>카운트: {count}</p>
      {/* 함수형 업데이트도 useState와 동일하게 사용할 수 있어요 */}
      <button onClick={() => setCount((prev) => prev + 1)}>+1 증가</button>
    </>
  );
}

function CounterB() {
  // 같은 key를 사용하므로 Provider 없이 CounterA와 자동으로 동기화돼요.
  const [count, setCount] = useCustomEventState(EVENT_KEY, 0);

  return (
    <>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(0)}>초기화</button>
    </>
  );
}`;
