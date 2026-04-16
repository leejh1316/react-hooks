import { useEffect, useRef } from "react";

export function usePrevRef<T>(value: T) {
  const prevValue = useRef<T>(value);

  useEffect(() => {
    return () => {
      prevValue.current = value;
    };
  }, [value]);

  return prevValue;
}
