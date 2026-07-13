import { useSessionStorage } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: useSessionStorage
   새로고침해도 값이 유지되지만, 탭(세션)을 닫거나
   새 탭에서 열면 defaultValue부터 다시 시작합니다
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/session-count";

const SessionStorageDemo = () => {
  const { value, setValue, removeValue } = useSessionStorage<number>({
    key: STORAGE_KEY,
    defaultValue: 0,
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-body-3 text-ink-secondary">
        카운트: <span className="text-ink-primary font-semibold tabular-nums">{value}</span>
      </p>

      <div className="flex gap-2">
        <Button onClick={() => setValue((prev) => prev + 1)}>+1</Button>
        <Button variant="secondary" onClick={removeValue}>
          초기화 (removeValue)
        </Button>
      </div>

      <p className="text-caption-1 text-ink-tertiary select-none">
        새로고침해도 값이 유지되지만, 이 페이지를 새 탭에서 열면 0부터 시작합니다.
      </p>
    </div>
  );
};

export default SessionStorageDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SESSION_STORAGE_DEMO_CODE = `import { useSessionStorage } from "@leejaehyeok/use-browser-storage";

function SessionCounter() {
  // 탭(세션)이 유지되는 동안만 값이 살아있습니다.
  const { value, setValue, removeValue } = useSessionStorage<number>({
    key: "session-count",
    defaultValue: 0,
  });

  return (
    <>
      <p>카운트: {value}</p>
      <button onClick={() => setValue((prev) => prev + 1)}>+1</button>
      <button onClick={removeValue}>초기화</button>
    </>
  );
}`;
