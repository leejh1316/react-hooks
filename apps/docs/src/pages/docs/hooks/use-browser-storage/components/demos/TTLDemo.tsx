import { ttl, useLocalStorageWithTTL } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useLocalStorageWithTTL
   저장 후 5초가 지나면 만료돼요. TTL 검사는 스토리지를
   읽는 시점(마운트)에 일어나므로, "다시 읽기"로 재마운트해
   만료 여부를 확인해요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/ttl-demo";
const TTL_SECONDS = 5;

const TTLDemoInner = ({ onReread }: { onReread: () => void }) => {
  const { value, setValue } = useLocalStorageWithTTL<string | null>({
    key: STORAGE_KEY,
    defaultValue: null,
    ttl: ttl.seconds(TTL_SECONDS),
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-body-3 text-ink-secondary">
        저장된 값: <span className="text-ink-primary font-semibold tabular-nums">{value ?? "(없음 — defaultValue)"}</span>
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => setValue(new Date().toLocaleTimeString())}>
          지금 시각 저장 ({TTL_SECONDS}초 TTL)
        </Button>
        <Button variant="secondary" onClick={onReread}>
          스토리지에서 다시 읽기
        </Button>
      </div>

      <p className="text-caption-1 text-ink-tertiary select-none">
        저장하고 {TTL_SECONDS}초가 지난 뒤 "다시 읽기"를 누르면 만료되어 값이 사라져요.
      </p>
    </div>
  );
};

const TTLDemo = () => {
  // key를 바꿔 재마운트하면 훅이 스토리지를 다시 읽어 만료 여부를 검사해요.
  const [readKey, setReadKey] = useState(0);
  return <TTLDemoInner key={readKey} onReread={() => setReadKey((prev) => prev + 1)} />;
};

export default TTLDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const TTL_DEMO_CODE = `import { ttl, useLocalStorageWithTTL } from "@leejaehyeok/use-browser-storage";

function TTLDemo() {
  const { value, setValue } = useLocalStorageWithTTL<string | null>({
    key: "ttl-demo",
    defaultValue: null,
    ttl: ttl.seconds(5), // 저장 후 5초가 지나면 만료
  });

  // 만료된 값은 스토리지를 읽는 시점(마운트)에 삭제되고 defaultValue로 초기화돼요.
  return (
    <>
      <p>저장된 값: {value ?? "(없음)"}</p>
      <button onClick={() => setValue(new Date().toLocaleTimeString())}>지금 시각 저장</button>
    </>
  );
}`;
