import { useEffect, useRef, useState } from "react";

type DeferredLoadingOptions = {
  delay?: number;
  minDisplayDuration?: number;
};
export function useDeferredLoading(isLoading: boolean, options?: DeferredLoadingOptions) {
  const { delay = 100, minDisplayDuration = 300 } = options || {};
  const [isDeferredLoading, setIsDeferredLoading] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const minDurationTimer = useRef<ReturnType<typeof setTimeout>>(null);
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
      return;
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
