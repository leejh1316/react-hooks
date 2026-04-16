import { useEffect, useRef } from "react";

export function usePrev<T>(value: T) {
  const prevValue = useRef<T>(value);

  useEffect(() => {
    return () => {
      prevValue.current = value;
    };
  }, [value]);

  return prevValue;
}
