import { useSnooze } from "@leejaehyeok/use-snooze";
import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useSnooze 대표 데모
   "10초 동안 보지 않기" 배너. 만료 검사는 스토리지를
   읽는 시점(마운트)에 일어나므로, "다시 읽기"로 재마운트해
   만료 여부를 확인해요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-snooze/banner-demo";
const DURATION_MS = 10_000;

const BannerSnoozeDemoInner = ({ onReread }: { onReread: () => void }) => {
  const [isActive, snooze] = useSnooze({ key: STORAGE_KEY, duration: DURATION_MS });

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    onReread();
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {isActive ? (
        <div className="border-line-regular w-full rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-body-3 text-ink-primary mb-1 font-semibold">🎉 신규 기능 출시 안내</p>
          <p className="text-caption-1 text-ink-tertiary mb-3">프로모션 배너처럼 일정 기간 숨겨야 하는 콘텐츠예요.</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={snooze}>
              10초 동안 보지 않기
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-line-regular text-caption-1 text-ink-tertiary w-full rounded-xl border border-dashed p-6 text-center">
          배너가 스누즈되어 숨겨졌어요 (isActive: <span className="font-code">false</span>)
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onReread}>
          스토리지에서 다시 읽기
        </Button>
        <Button variant="secondary" onClick={reset}>
          스누즈 초기화
        </Button>
      </div>

      <p className="text-caption-1 text-ink-tertiary text-center select-none">
        "보지 않기"를 누르면 만료 시각이 localStorage에 저장돼요. 10초가 지난 뒤 "스토리지에서 다시 읽기"를 누르면 배너가 다시 나타나요.
      </p>
    </div>
  );
};

const BannerSnoozeDemo = () => {
  // key를 바꿔 재마운트하면 훅이 스토리지를 다시 읽어 만료 여부를 검사해요.
  const [readKey, setReadKey] = useState(0);
  return <BannerSnoozeDemoInner key={readKey} onReread={() => setReadKey((prev) => prev + 1)} />;
};

export default BannerSnoozeDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const BANNER_SNOOZE_DEMO_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";

function PromotionBanner() {
  const [isActive, snooze] = useSnooze({
    key: "promotion-banner",
    duration: 10_000, // ms 단위 숫자 또는 "day"
  });

  // 스누즈되면 isActive가 false가 되고, 만료 시각이 지나기 전까지
  // 다시 마운트되어도 계속 false로 유지돼요.
  if (!isActive) return null;

  return (
    <div>
      <p>🎉 신규 기능 출시 안내</p>
      <button onClick={snooze}>10초 동안 보지 않기</button>
    </div>
  );
}`;
