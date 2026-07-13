import { useDebounce } from "@leejaehyeok/use-debounce";
import { Button } from "@src/components/ui";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useDebounce 적용
   이벤트는 매번 발생하지만 핸들러는 입력이 500ms 동안 멈춘 뒤 한 번만 실행됩니다
   ────────────────────────────────────────────── */

const WAIT = 500;

const DebounceDemo = () => {
  const [value, setValue] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [handlerCount, setHandlerCount] = useState(0);
  const [debouncedValue, setDebouncedValue] = useState("");

  const { debounce, cancel, flush } = useDebounce(
    (val: string) => {
      setDebouncedValue(val);
      setHandlerCount((prev) => prev + 1);
    },
    WAIT,
    { leading: false },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setEventCount((prev) => prev + 1);
    debounce(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={`여기에 입력해 보세요 (${WAIT}ms 디바운스)`}
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

      <p className="text-body-3 text-ink-secondary">
        디바운스된 값: <span className="text-ink-primary font-semibold">{debouncedValue || "(없음)"}</span>
      </p>

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
            setValue("");
            setEventCount(0);
            setHandlerCount(0);
            setDebouncedValue("");
          }}
        >
          초기화
        </Button>
      </div>
    </div>
  );
};

export default DebounceDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const DEBOUNCE_DEMO_CODE = `import { useState } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";

function DebounceDemo() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // 입력이 500ms 동안 멈춘 뒤에만 핸들러가 실행됩니다.
  const { debounce, cancel, flush } = useDebounce((val: string) => setDebouncedValue(val), 500, { leading: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // 입력 값은 매번 반영
    debounce(e.target.value); // 핸들러 실행은 디바운싱
  };

  return (
    <>
      <input type="text" value={value} onChange={handleChange} placeholder="여기에 입력해 보세요" />
      <p>현재 값: {value}</p>
      <p>디바운스된 값: {debouncedValue}</p>

      <button onClick={cancel}>대기 중인 호출 취소</button>
      <button onClick={flush}>즉시 실행</button>
    </>
  );
}`;
