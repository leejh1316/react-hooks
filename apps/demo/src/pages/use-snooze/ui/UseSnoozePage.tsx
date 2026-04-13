import { useState } from "react";
import { useSnooze } from "@leejaehyeok/use-snooze";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicSnoozeDemo() {
  const [isActive, snooze] = useSnooze({
    key: "demo-basic-snooze",
    duration: 5000,
    storageType: "session",
  });

  return (
    <DemoSection
      title="기본 동작"
      description="'다시 보지 않기' 버튼을 클릭하면 5초 동안 배너가 숨겨집니다. (storageType: session, duration: 5000ms)"
    >
      {isActive ? (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg">
          <p className="m-0 text-sm text-indigo-700 dark:text-indigo-300">
            새로운 업데이트가 있습니다! 지금 확인해보세요.
          </p>
          <Button size="sm" variant="cancel" onClick={snooze}>
            5초 후 다시보기
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          배너가 숨겨졌습니다. 5초 후 다시 표시됩니다.
        </p>
      )}
    </DemoSection>
  );
}

function AutoReactivateDemo() {
  const [isActive, snooze] = useSnooze({
    key: "demo-auto-reactivate-snooze",
    duration: 5000,
    storageType: "session",
    autoReactivate: true,
  });

  return (
    <DemoSection
      title="autoReactivate"
      description="스누즈 후 duration이 지나면 자동으로 다시 활성화됩니다. (autoReactivate: true, duration: 5000ms)"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={[
            "px-3 py-1.5 rounded-full text-xs font-semibold",
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
          ].join(" ")}
        >
          {isActive ? "활성화" : "스누즈 중"}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          isActive: <strong className="font-mono text-indigo-500">{String(isActive)}</strong>
        </span>
      </div>
      {isActive ? (
        <Button onClick={snooze}>스누즈 (5초)</Button>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          5초 후 자동으로 다시 활성화됩니다…
        </p>
      )}
    </DemoSection>
  );
}

function StorageTypeDemo() {
  const [localActive, localSnooze] = useSnooze({
    key: "demo-local-snooze",
    duration: 1000 * 60 * 60 * 24,
    storageType: "local",
  });

  const [sessionActive, sessionSnooze] = useSnooze({
    key: "demo-session-snooze",
    duration: 1000 * 60 * 60 * 24,
    storageType: "session",
  });

  const [resetCount, setResetCount] = useState(0);

  const handleReset = () => {
    localStorage.removeItem("demo-local-snooze");
    sessionStorage.removeItem("demo-session-snooze");
    setResetCount((c) => c + 1);
    window.location.reload();
  };

  return (
    <DemoSection
      title="storageType 비교"
      description="localStorage는 탭을 닫아도 유지되고, sessionStorage는 탭을 닫으면 초기화됩니다. (duration: 1일)"
    >
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <p className="m-0 text-sm font-medium text-gray-700 dark:text-gray-300">localStorage 배너</p>
            <p className="m-0 text-xs text-gray-400 dark:text-gray-500">탭을 닫아도 스누즈 유지</p>
          </div>
          {localActive ? (
            <Button size="sm" onClick={localSnooze}>스누즈</Button>
          ) : (
            <span className="text-xs text-gray-400 italic">스누즈 중</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <p className="m-0 text-sm font-medium text-gray-700 dark:text-gray-300">sessionStorage 배너</p>
            <p className="m-0 text-xs text-gray-400 dark:text-gray-500">탭을 닫으면 스누즈 초기화</p>
          </div>
          {sessionActive ? (
            <Button size="sm" onClick={sessionSnooze}>스누즈</Button>
          ) : (
            <span className="text-xs text-gray-400 italic">스누즈 중</span>
          )}
        </div>
      </div>
      <Button variant="cancel" size="sm" onClick={handleReset} key={resetCount}>
        스누즈 초기화 (새로고침)
      </Button>
    </DemoSection>
  );
}

export function UseSnoozePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-snooze"
        description="배너·알림·팝업을 일정 시간 동안 숨기는 스누즈 기능을 제공합니다. localStorage 또는 sessionStorage로 상태를 유지합니다."
      />
      <BasicSnoozeDemo />
      <AutoReactivateDemo />
      <StorageTypeDemo />
    </div>
  );
}
