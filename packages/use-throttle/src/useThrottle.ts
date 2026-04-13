import { useCallback, useEffect, useRef } from "react";

type ThrottleOptions = {
  leading?: boolean; // 첫 호출 즉시 실행 여부 (기본값: true)
  trailing?: boolean; // 마지막 호출을 제한 시간 후에 실행할지 여부 (기본값: true)
};
const useThrottle = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  { leading = true, trailing = true }: ThrottleOptions = {},
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(func);
  const lastArgs = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = func;
  }, [func]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    lastArgs.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const throttle = useCallback(
    (...args: Parameters<T>) => {
      // 호출된 마지막 인자를 저장
      lastArgs.current = args;

      if (timer.current) return;

      if (leading) {
        callbackRef.current(...args); // 첫 호출 실행
        lastArgs.current = null; // 호출했기에 소모된 인자 초기화
      }

      // 타이머 재귀 설정
      const loop = () => {
        // setTimeout으로 인해 loop가 호출될때 마지막 인자가 남아있다면 trailing 옵션에 따라 실행
        if (trailing && lastArgs.current) {
          callbackRef.current(...lastArgs.current);
          lastArgs.current = null;

          // 다음 throttle 을 위해 타이머 재설정
          timer.current = setTimeout(loop, wait);
        } else {
          timer.current = null;
        }
      };

      // 최초 타이머 설정
      timer.current = setTimeout(loop, wait);
    },
    [wait, trailing, leading],
  );

  const flush = useCallback(() => {
    if (timer.current && lastArgs.current) {
      callbackRef.current(...lastArgs.current);
      cancel();
    }
  }, [cancel]);

  return { throttle, cancel, flush } as const;
};

export { useThrottle };
