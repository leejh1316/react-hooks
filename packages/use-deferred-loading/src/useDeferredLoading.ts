import { useEffect, useRef, useState } from "react";

type DeferredLoadingOptions = {
  delay?: number;
  minDisplayDuration?: number;
};
export function useDeferredLoading(isLoading: boolean, options?: DeferredLoadingOptions) {
  const { delay = 100, minDisplayDuration = 300 } = options || {};
  const [isDeferredLoading, setIsDeferredLoading] = useState(false);
  // 타입 인자에 null을 포함해야 current가 쓰기 가능한 ref가 된다.
  // (React 18 타입에서 useRef<T>(null)은 readonly current를 가진 RefObject로 추론된다)
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDurationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTime = useRef<number | null>(null);
  useEffect(() => {
    if (!isLoading) {
      if (showTime.current !== null) {
        const elapsed = Date.now() - showTime.current;
        const remaining = minDisplayDuration - elapsed;

        if (remaining > 0) {
          minDurationTimer.current = setTimeout(() => {
            setIsDeferredLoading(false);
            showTime.current = null;
          }, remaining);
        } else {
          setIsDeferredLoading(false);
          showTime.current = null;
        }
      }
      // 최소 표시 시간 타이머도 정리 대상이다. cleanup을 반환하지 않으면
      // 언마운트 시 타이머가 남고, 다시 로딩이 시작될 때 이 타이머가 뒤늦게 스피너를 숨긴다.
      return () => {
        clearTimeout(minDurationTimer.current!);
        minDurationTimer.current = null;
      };
    }

    delayTimer.current = setTimeout(() => {
      setIsDeferredLoading(true);
      showTime.current = Date.now();
    }, delay);

    return () => {
      clearTimeout(delayTimer.current!);
      clearTimeout(minDurationTimer.current!);
      delayTimer.current = null;
      minDurationTimer.current = null;
    };
  }, [isLoading, delay, minDisplayDuration]);
  return isDeferredLoading;
}
