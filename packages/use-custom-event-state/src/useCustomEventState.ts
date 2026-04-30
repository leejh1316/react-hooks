import { useCallback, useEffect, useState } from "react";

const EVENT_PREFIX = "@leejaehyeok/use-custom-event-state";

function useCustomEventState<S>(key: string, initialState: S | (() => S)) {
  const [state, setState] = useState<S>(() => (typeof initialState === "function" ? (initialState as () => S)() : initialState));

  useEffect(() => {
    const handler = (event: CustomEvent<React.SetStateAction<S>>) => {
      if (typeof event.detail === "function") {
        setState((prev) => (event.detail as (prevState: S) => S)(prev));
      } else {
        setState(event.detail);
      }
    };
    window.addEventListener(`${EVENT_PREFIX}:${key}`, handler as EventListener);
    return () => {
      window.removeEventListener(`${EVENT_PREFIX}:${key}`, handler as EventListener);
    };
  }, [key]);

  const dispatch = useCallback<React.Dispatch<React.SetStateAction<S>>>(
    (next) => {
      window.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}:${key}`, { detail: next }));
    },
    [key],
  );

  return [state, dispatch] as const;
}

export { useCustomEventState };
