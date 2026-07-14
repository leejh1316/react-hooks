import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 스로틀 미적용 (비교용)
   마우스를 움직일 때마다 핸들러가 매번 실행돼요
   ────────────────────────────────────────────── */

const NoThrottleDemo = () => {
  const [eventCount, setEventCount] = useState(0);
  const [handlerCount, setHandlerCount] = useState(0);

  const handleMouseMove = () => {
    setEventCount((prev) => prev + 1);
    // 스로틀이 없으므로 이벤트가 발생할 때마다 핸들러가 그대로 실행돼요.
    setHandlerCount((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        onMouseMove={handleMouseMove}
        className="border-line-regular text-body-3 text-ink-tertiary flex h-32 w-full max-w-md cursor-crosshair items-center justify-center rounded-xl border border-dashed select-none"
      >
        이 영역에서 마우스를 움직여 보세요
      </div>

      <div className="flex gap-6">
        <p className="text-body-3 text-ink-secondary">
          이벤트 발생 <span className="text-ink-primary font-semibold tabular-nums">{eventCount}</span>회
        </p>
        <p className="text-body-3 text-ink-secondary">
          핸들러 실행 <span className="text-ink-primary font-semibold tabular-nums">{handlerCount}</span>회
        </p>
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          setEventCount(0);
          setHandlerCount(0);
        }}
      >
        초기화
      </Button>
    </div>
  );
};

export default NoThrottleDemo;
