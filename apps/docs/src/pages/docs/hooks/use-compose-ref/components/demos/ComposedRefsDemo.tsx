import { useComposedRefs } from "@leejaehyeok/use-compose-ref";
import { Button } from "@src/components/ui";
import { useCallback, useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 여러 ref 병합
   객체형 ref와 함수형 ref를 하나의 callback ref로 병합해 같은 엘리먼트에 연결해요
   ────────────────────────────────────────────── */

const ComposedRefsDemo = () => {
  const [mounted, setMounted] = useState(true);
  const [width, setWidth] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // 객체형 ref — 포커스 이동에 사용해요.
  const objectRef = useRef<HTMLInputElement>(null);

  // 함수형 ref — 연결/해제 시점을 기록하고 너비를 측정해요.
  // useCallback으로 참조를 고정해 병합된 ref가 다시 생성되지 않게 해요.
  const trackRef = useCallback((el: HTMLInputElement | null) => {
    if (el) {
      setWidth(Math.round(el.getBoundingClientRect().width));
      setLogs((prev) => [...prev.slice(-3), "callback ref ← 엘리먼트 연결"]);
    } else {
      setWidth(null);
      setLogs((prev) => [...prev.slice(-3), "callback ref ← null (연결 해제)"]);
    }
  }, []);

  const composedRef = useComposedRefs(objectRef, trackRef);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {mounted ? (
        <input
          ref={composedRef}
          type="text"
          placeholder="두 ref가 함께 연결된 input"
          className="border-line-regular text-body-3 focus:border-primary-500 w-full max-w-sm rounded-lg border px-3 py-2 outline-none"
        />
      ) : (
        <p className="text-body-3 text-ink-tertiary flex h-[38px] items-center">input이 마운트 해제되었어요.</p>
      )}

      <div className="flex gap-6">
        <p className="text-body-3 text-ink-secondary">
          callback ref가 측정한 너비 <span className="text-ink-primary font-semibold tabular-nums">{width !== null ? `${width}px` : "-"}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => objectRef.current?.focus()} disabled={!mounted}>
          objectRef로 포커스
        </Button>
        <Button variant="secondary" onClick={() => setMounted((prev) => !prev)}>
          {mounted ? "마운트 해제" : "다시 마운트"}
        </Button>
      </div>

      <ul className="text-body-3 text-ink-tertiary flex flex-col items-center gap-1">
        {logs.map((log, i) => (
          <li key={i} className="font-code">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComposedRefsDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const COMPOSED_REFS_DEMO_CODE = `import { useCallback, useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

function ComposedRefsDemo() {
  // 객체형 ref — 포커스 이동에 사용해요.
  const objectRef = useRef<HTMLInputElement>(null);

  // 함수형 ref — 연결/해제 시점에 호출돼요.
  const trackRef = useCallback((el: HTMLInputElement | null) => {
    console.log(el ? "엘리먼트 연결" : "연결 해제");
  }, []);

  // 두 ref를 하나의 callback ref로 병합해요.
  const composedRef = useComposedRefs(objectRef, trackRef);

  return (
    <>
      <input ref={composedRef} />
      <button onClick={() => objectRef.current?.focus()}>포커스</button>
    </>
  );
}`;
