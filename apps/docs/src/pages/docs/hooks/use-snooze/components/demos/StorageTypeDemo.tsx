import { useSnooze } from "@leejaehyeok/use-snooze";
import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: storageType — local vs session 비교
   같은 duration으로 스누즈한 뒤 새로고침·새 탭에서
   유지 범위 차이를 확인해요
   ────────────────────────────────────────────── */

const LOCAL_KEY = "docs/use-snooze/storage-local-demo";
const SESSION_KEY = "docs/use-snooze/storage-session-demo";

const StorageTypeDemoInner = ({ onReread }: { onReread: () => void }) => {
  const [isLocalActive, snoozeLocal] = useSnooze({ key: LOCAL_KEY, duration: "day", storageType: "local" });
  const [isSessionActive, snoozeSession] = useSnooze({ key: SESSION_KEY, duration: "day", storageType: "session" });

  const reset = () => {
    window.localStorage.removeItem(LOCAL_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    onReread();
  };

  const cards = [
    { title: "localStorage", caption: "브라우저를 닫았다 열어도 유지돼요", isActive: isLocalActive, snooze: snoozeLocal },
    { title: "sessionStorage", caption: "탭을 닫으면 초기화돼요", isActive: isSessionActive, snooze: snoozeSession },
  ];

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map(({ title, caption, isActive, snooze }) => (
          <div key={title} className="border-line-regular flex flex-col gap-2 rounded-xl border bg-white p-4">
            <p className="font-code text-body-3 text-ink-primary font-semibold">{title}</p>
            <p className="text-caption-1 text-ink-tertiary">{caption}</p>
            <p className="text-caption-1 text-ink-secondary">
              isActive:{" "}
              <span className={isActive ? "font-code font-semibold text-emerald-600" : "font-code font-semibold text-amber-600"}>
                {String(isActive)}
              </span>
            </p>
            <Button variant="secondary" onClick={snooze} disabled={!isActive}>
              하루 동안 보지 않기
            </Button>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={reset}>
        모두 초기화
      </Button>

      <p className="text-caption-1 text-ink-tertiary text-center select-none">
        두 카드를 모두 스누즈한 뒤 페이지를 새로고침해 보세요. 둘 다 숨김이 유지되지만, 새 탭에서 이 페이지를 열면 sessionStorage 쪽만
        다시 나타나요.
      </p>
    </div>
  );
};

const StorageTypeDemo = () => {
  const [readKey, setReadKey] = useState(0);
  return <StorageTypeDemoInner key={readKey} onReread={() => setReadKey((prev) => prev + 1)} />;
};

export default StorageTypeDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const STORAGE_TYPE_DEMO_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";

// localStorage(기본값): 브라우저를 닫았다 열어도 스누즈가 유지돼요.
const [isBannerActive, snoozeBanner] = useSnooze({
  key: "promotion-banner",
  duration: "day",
  storageType: "local",
});

// sessionStorage: 현재 탭에서만 유지되고, 탭을 닫으면 초기화돼요.
const [isTooltipActive, snoozeTooltip] = useSnooze({
  key: "onboarding-tooltip",
  duration: "day",
  storageType: "session",
});`;
