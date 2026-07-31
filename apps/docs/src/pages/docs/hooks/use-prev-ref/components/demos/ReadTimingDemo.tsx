import { usePrevRef } from "@leejaehyeok/use-prev-ref";
import { Button } from "@src/components/ui";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 읽는 시점에 따른 차이
   렌더링 중에 읽은 값과 이벤트 핸들러에서 읽은 값을
   나란히 비교해요
   ────────────────────────────────────────────── */

type LogEntry = {
  id: number;
  current: number;
  prev: number;
};

const ValueCard = ({ label, caption, value, tone }: { label: string; caption: string; value: number; tone: "primary" | "danger" }) => (
  <div className="border-line-regular flex flex-col items-center gap-1 rounded-xl border p-4">
    <span className="text-caption-2 text-ink-tertiary select-none text-center font-semibold">{label}</span>
    <span className={`text-title-3 font-semibold ${tone === "danger" ? "text-rose-600" : "text-ink-primary"}`}>{value}</span>
    <span className="text-caption-2 text-ink-tertiary select-none text-center">{caption}</span>
  </div>
);

const ReadTimingDemo = () => {
  const [count, setCount] = useState(0);
  const prevCountRef = usePrevRef(count);

  const logIdRef = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const increase = () => {
    // 클릭 시점(커밋 이후)에 읽으면 정확히 1단계 이전 값이에요.
    setLogs((prev) => [{ id: (logIdRef.current += 1), current: count, prev: prevCountRef.current }, ...prev].slice(0, 3));
    setCount((prev) => prev + 1);
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <ValueCard label="현재 값" caption="count" value={count} tone="primary" />
        {/* ❌ 렌더링 중 읽기 — 2단계 이전 값이 보여요 */}
        <ValueCard label="❌ 렌더링 중 읽기" caption="JSX의 prevCountRef.current" value={prevCountRef.current} tone="danger" />
      </div>

      <Button onClick={increase}>+1 증가하면서 이벤트 핸들러에서 읽기</Button>

      <ul className="text-caption-1 font-code flex h-16 flex-col gap-1 overflow-hidden">
        {logs.length === 0 && <li className="text-ink-tertiary">버튼을 두 번 이상 눌러 보세요.</li>}
        {logs.map((log, index) => (
          <li key={log.id} className={index === 0 ? "text-emerald-600" : "text-ink-tertiary"}>
            {index === 0 ? "✅ " : ""}클릭 시점 — current: {log.current}, prevCountRef.current: {log.prev}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadTimingDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const READ_TIMING_DEMO_CODE = `import { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = usePrevRef(count);

  const increase = () => {
    // ✅ 이벤트 핸들러(커밋 이후) — 정확히 1단계 이전 값이에요.
    console.log("current:", count, "prev:", prevCountRef.current);
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <p>현재 값: {count}</p>

      {/* ❌ 렌더링 중 읽기 — 2단계 이전 값이 표시돼요. */}
      <p>이전 값: {prevCountRef.current}</p>

      <button onClick={increase}>+1</button>
    </>
  );
}`;
