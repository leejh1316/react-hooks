import { useSnooze } from "@leejaehyeok/use-snooze";
import { Button } from "@src/components/ui";
import clsx from "clsx";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 옵션 조정 플레이그라운드
   duration / storageType / autoReactivate를 실시간으로
   바꿔가며 스누즈 동작을 확인해요. 초기 상태는 마운트 시점에
   스토리지를 읽어 결정되므로, 옵션이 바뀌면 데모를
   재마운트해 다시 읽어요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-snooze/playground";

type StorageType = "local" | "session";
type DurationPreset = { label: string; value: "day" | number };

const DURATION_PRESETS: DurationPreset[] = [
  { label: "3초", value: 3_000 },
  { label: "10초", value: 10_000 },
  { label: "30초", value: 30_000 },
  { label: '"day"', value: "day" },
];

const STORAGE_TYPES: StorageType[] = ["local", "session"];

const getStorage = (storageType: StorageType) => (storageType === "local" ? window.localStorage : window.sessionStorage);

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const OptionButton = ({ label, selected, onClick }: OptionButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "text-caption-1 font-code cursor-pointer rounded-lg border px-2 py-1 transition-colors",
      selected ? "border-ink-primary bg-ink-primary text-ink-white font-semibold" : "border-line-regular text-ink-secondary hover:bg-neutral-100",
    )}
  >
    {label}
  </button>
);

interface PlaygroundInnerProps {
  duration: "day" | number;
  storageType: StorageType;
  autoReactivate: boolean;
  onReread: () => void;
}

const PlaygroundInner = ({ duration, storageType, autoReactivate, onReread }: PlaygroundInnerProps) => {
  const [isActive, snooze] = useSnooze({ key: STORAGE_KEY, duration, storageType, autoReactivate });

  // 스토리지에 저장된 만료 시각을 읽어 남은 시간을 표시해요.
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      setRemainingMs(null);
      return;
    }
    const timer = setInterval(() => {
      const stored = getStorage(storageType).getItem(STORAGE_KEY);
      if (!stored) return;
      setRemainingMs(Math.max(0, parseInt(stored) - Date.now()));
    }, 100);
    return () => clearInterval(timer);
  }, [isActive, storageType]);

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    onReread();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {isActive ? (
        <div className="border-line-regular w-full rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-body-3 text-ink-primary mb-1 font-semibold">🧪 플레이그라운드 배너</p>
          <p className="text-caption-1 text-ink-tertiary mb-3">위 옵션 조합대로 스누즈해 보세요.</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={snooze}>
              스누즈
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-line-regular text-caption-1 text-ink-tertiary w-full rounded-xl border border-dashed p-6 text-center">
          스누즈됨 — 만료까지{" "}
          <span className="text-ink-primary font-code font-semibold tabular-nums">{((remainingMs ?? 0) / 1000).toFixed(1)}초</span>
          {autoReactivate ? " (만료되면 자동으로 다시 나타나요)" : " (만료 후 \"다시 읽기\"를 누르면 나타나요)"}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onReread}>
          스토리지에서 다시 읽기
        </Button>
        <Button variant="secondary" onClick={reset}>
          초기화
        </Button>
      </div>
    </div>
  );
};

const OptionsPlaygroundDemo = () => {
  const [duration, setDuration] = useState<"day" | number>(3_000);
  const [storageType, setStorageType] = useState<StorageType>("local");
  const [autoReactivate, setAutoReactivate] = useState(true);
  const [readKey, setReadKey] = useState(0);

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {/* 옵션 컨트롤 */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
            duration: <span className="text-ink-primary font-code">{typeof duration === "number" ? `${duration}ms` : '"day"'}</span>
          </span>
          <div className="flex gap-1">
            {DURATION_PRESETS.map(({ label, value }) => (
              <OptionButton key={label} label={label} selected={value === duration} onClick={() => setDuration(value)} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
            storageType: <span className="text-ink-primary font-code">{storageType}</span>
          </span>
          <div className="flex gap-1">
            {STORAGE_TYPES.map((value) => (
              <OptionButton key={value} label={value} selected={value === storageType} onClick={() => setStorageType(value)} />
            ))}
          </div>
        </div>
        <label className="text-caption-1 text-ink-secondary flex cursor-pointer items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={autoReactivate}
            onChange={(e) => setAutoReactivate(e.target.checked)}
            className="accent-ink-primary h-4 w-4 cursor-pointer"
          />
          <span className="font-code">autoReactivate</span>
        </label>
      </div>

      {/* 옵션이 바뀌면 재마운트해 스토리지를 다시 읽어요 */}
      <PlaygroundInner
        key={`${duration}-${storageType}-${autoReactivate}-${readKey}`}
        duration={duration}
        storageType={storageType}
        autoReactivate={autoReactivate}
        onReread={() => setReadKey((prev) => prev + 1)}
      />

      <p className="text-caption-2 text-ink-tertiary select-none">
        key는 "{STORAGE_KEY}"로 고정되어 있어요. 초기 상태는 마운트 시점에 스토리지를 읽어 결정되므로, 옵션을 바꾸면 데모가 재마운트되어
        스토리지를 다시 읽어요. "day"를 선택하고 스누즈하면 24시간 동안 유지되니 "초기화"로 되돌리세요.
      </p>
    </div>
  );
};

export default OptionsPlaygroundDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const OPTIONS_PLAYGROUND_DEMO_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";

const [isActive, snooze] = useSnooze({
  key: "playground-banner", // 만료 시각을 저장할 스토리지 key
  duration: 3_000, // "day"(24시간) 또는 ms 단위 숫자
  storageType: "local", // "local"(기본값) | "session"
  autoReactivate: true, // 만료 시 재마운트 없이 자동 재활성화
});

// 초기 상태는 마운트 시점에 스토리지를 읽어 결정돼요.
// key / storageType을 바꿀 때는 컴포넌트를 재마운트해야
// 새 위치의 스토리지를 다시 읽어요.`;
