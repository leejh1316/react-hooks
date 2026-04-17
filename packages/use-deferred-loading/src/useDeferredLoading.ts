import { useEffect, useRef, useState } from "react";

export function useDeferredLoading(isLoading: boolean, delay: number = 100) {
  const [isDeferredLoading, setIsDeferredLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!isLoading) {
      setIsDeferredLoading(false);
      return;
    }

    timer.current = setTimeout(() => {
      setIsDeferredLoading(true);
    }, delay);

    return () => {
      clearTimeout(timer.current!);
      timer.current = null;
    };
  }, [isLoading, delay]);

  return isDeferredLoading;
}
