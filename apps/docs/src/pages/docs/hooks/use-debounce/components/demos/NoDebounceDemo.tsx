import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 디바운스 미적용 (비교용)
   입력할 때마다 핸들러가 매번 실행돼요
   ────────────────────────────────────────────── */

const NoDebounceDemo = () => {
  const [value, setValue] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [handlerCount, setHandlerCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setEventCount((prev) => prev + 1);
    // 디바운스가 없으므로 입력할 때마다 핸들러가 그대로 실행돼요.
    setHandlerCount((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="여기에 입력해 보세요"
        className="border-line-regular text-body-3 text-ink-primary placeholder:text-ink-tertiary w-full max-w-md rounded-xl border px-4 py-3 outline-none"
      />

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
          setValue("");
          setEventCount(0);
          setHandlerCount(0);
        }}
      >
        초기화
      </Button>
    </div>
  );
};

export default NoDebounceDemo;
