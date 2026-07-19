import { useSnooze } from "@leejaehyeok/use-snooze";
import { Button } from "@src/components/ui";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: autoReactivate — 만료 시 자동 재활성화
   스누즈하면 5초 뒤 재마운트 없이 배너가 자동으로
   다시 나타나요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-snooze/auto-reactivate-demo";
const DURATION_MS = 5_000;

const AutoReactivateDemo = () => {
  const [isActive, snooze] = useSnooze({
    key: STORAGE_KEY,
    duration: DURATION_MS,
    autoReactivate: true,
  });

  // 스토리지에 저장된 만료 시각을 읽어 남은 시간을 표시해요.
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      setRemainingMs(null);
      return;
    }
    const timer = setInterval(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      setRemainingMs(Math.max(0, parseInt(stored) - Date.now()));
    }, 100);
    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {isActive ? (
        <div className="border-line-regular w-full rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-body-3 text-ink-primary mb-1 font-semibold">⏰ 자동으로 되살아나는 배너</p>
          <p className="text-caption-1 text-ink-tertiary mb-3">autoReactivate가 켜져 있어 만료되면 즉시 다시 나타나요.</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={snooze}>
              5초 동안 보지 않기
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-line-regular text-caption-1 text-ink-tertiary w-full rounded-xl border border-dashed p-6 text-center">
          스누즈됨 — <span className="text-ink-primary font-code font-semibold tabular-nums">{((remainingMs ?? 0) / 1000).toFixed(1)}초</span>{" "}
          뒤 자동으로 다시 나타나요
        </div>
      )}

      <p className="text-caption-1 text-ink-tertiary text-center select-none">
        새로고침이나 재마운트 없이도 만료 시각에 맞춰 걸린 타이머가 isActive를 자동으로 true로 되돌려요.
      </p>
    </div>
  );
};

export default AutoReactivateDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const AUTO_REACTIVATE_DEMO_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";

function AutoReactivateBanner() {
  const [isActive, snooze] = useSnooze({
    key: "auto-reactivate-banner",
    duration: 5_000,
    autoReactivate: true, // 만료 시각에 맞춰 타이머를 걸어 자동으로 다시 활성화
  });

  if (!isActive) return null;

  return (
    <div>
      <p>⏰ 자동으로 되살아나는 배너</p>
      <button onClick={snooze}>5초 동안 보지 않기</button>
    </div>
  );
}`;
