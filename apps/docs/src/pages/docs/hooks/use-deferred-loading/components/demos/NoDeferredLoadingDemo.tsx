import { Button } from "@src/components/ui";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useDeferredLoading 미적용 (비교용)
   isLoading을 그대로 스피너에 연결해 빠른 응답에서 깜빡임이 발생해요
   ────────────────────────────────────────────── */

const NoDeferredLoadingDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const requestCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        {isLoading ? (
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

export default NoDeferredLoadingDemo;
