import { useThrottle } from "@leejaehyeok/use-throttle";
import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useThrottle 적용
   이벤트는 매번 발생하지만 핸들러는 500ms당 최대 한 번 실행됩니다
   ────────────────────────────────────────────── */

const WAIT = 500;

const ThrottleDemo = () => {
  const [eventCount, setEventCount] = useState(0);
  const [handlerCount, setHandlerCount] = useState(0);

  const { throttle, cancel, flush } = useThrottle(() => setHandlerCount((prev) => prev + 1), WAIT);

  const handleMouseMove = () => {
    setEventCount((prev) => prev + 1);
    throttle();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        onMouseMove={handleMouseMove}
        className="border-line-regular text-body-3 text-ink-tertiary flex h-32 w-full max-w-md cursor-crosshair items-center justify-center rounded-xl border border-dashed select-none"
      >
        이 영역에서 마우스를 움직여 보세요 ({WAIT}ms 스로틀)
      </div>

      <div className="flex gap-6">
        <p className="text-body-3 text-ink-secondary">
          이벤트 발생 <span className="text-ink-primary font-semibold tabular-nums">{eventCount}</span>회
        </p>
        <p className="text-body-3 text-ink-secondary">
          핸들러 실행 <span className="text-ink-primary font-semibold tabular-nums">{handlerCount}</span>회
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={cancel}>
          대기 중인 호출 취소 (cancel)
        </Button>
        <Button variant="secondary" onClick={flush}>
          즉시 실행 (flush)
        </Button>
        <Button
          onClick={() => {
            cancel();
            setEventCount(0);
            setHandlerCount(0);
          }}
        >
          초기화
        </Button>
      </div>
    </div>
  );
};

export default ThrottleDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const THROTTLE_DEMO_CODE = `import { useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

function ThrottleDemo() {
  const [eventCount, setEventCount] = useState(0);
  const [handlerCount, setHandlerCount] = useState(0);

  // 500ms당 최대 한 번만 핸들러가 실행됩니다.
  const { throttle, cancel, flush } = useThrottle(() => setHandlerCount((prev) => prev + 1), 500);

  const handleMouseMove = () => {
    setEventCount((prev) => prev + 1); // 이벤트는 매번 카운트
    throttle(); // 핸들러 실행은 스로틀링
  };

  return (
    <>
      <div onMouseMove={handleMouseMove}>이 영역에서 마우스를 움직여 보세요</div>
      <p>이벤트 발생: {eventCount}회</p>
      <p>핸들러 실행: {handlerCount}회</p>

      <button onClick={cancel}>대기 중인 호출 취소</button>
      <button onClick={flush}>즉시 실행</button>
    </>
  );
}`;
