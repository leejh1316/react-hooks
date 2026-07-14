import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";
import { Button } from "@src/components/ui";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useDeferredLoading 적용
   빠른 응답에서는 스피너가 아예 표시되지 않고,
   느린 응답에서는 최소 표시 시간이 보장돼요
   ────────────────────────────────────────────── */

const DeferredLoadingDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const requestCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDeferredLoading = useDeferredLoading(isLoading, { delay: 300, minDisplayDuration: 500 });

  const fetchData = (duration: number) => {
    clearTimeout(timerRef.current!);
    requestCount.current += 1;
    const currentRequest = requestCount.current;
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setResult(`${currentRequest}번째 요청 · ${duration}ms 만에 응답 완료`);
    }, duration);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button variant="secondary" disabled={isLoading} onClick={() => fetchData(80)}>
          빠른 요청 (80ms)
        </Button>
        <Button disabled={isLoading} onClick={() => fetchData(1200)}>
          느린 요청 (1200ms)
        </Button>
      </div>

      <div className="border-line-regular flex h-14 w-full max-w-sm items-center justify-center rounded-lg border">
        {isDeferredLoading ? (
          <span className="text-body-3 text-ink-tertiary flex items-center gap-2">
            <span className="border-primary-500 size-4 animate-spin rounded-full border-2 border-t-transparent" />
            로딩 중...
          </span>
        ) : result ? (
          <span className="text-body-3 text-ink-primary">{result}</span>
        ) : (
          <span className="text-body-3 text-ink-tertiary">버튼을 눌러 요청을 시작해 보세요</span>
        )}
      </div>
    </div>
  );
};

export default DeferredLoadingDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const DEFERRED_LOADING_DEMO_CODE = `import { useRef, useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

function DeferredLoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 로딩이 300ms 이상 지속될 때만 true가 되고, 한 번 true가 되면 500ms 이상 유지돼요.
  const isDeferredLoading = useDeferredLoading(isLoading, { delay: 300, minDisplayDuration: 500 });

  const fetchData = (duration: number) => {
    clearTimeout(timerRef.current!);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setResult(\`\${duration}ms 만에 응답 완료\`);
    }, duration);
  };

  return (
    <>
      <button disabled={isLoading} onClick={() => fetchData(80)}>빠른 요청 (80ms)</button>
      <button disabled={isLoading} onClick={() => fetchData(1200)}>느린 요청 (1200ms)</button>

      {/* isLoading 대신 isDeferredLoading으로 스피너를 제어해요 */}
      {isDeferredLoading ? <p>로딩 중...</p> : <p>{result}</p>}
    </>
  );
}`;
