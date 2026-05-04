import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { useCallback } from "react";
import type { BrowserStorageOptions } from "./types";
import { browserStorage } from "./utils";

const EVENT_KEY_PREFIX = "/use-browser-storage";

function useStorageState<T>(options: BrowserStorageOptions<T>) {
  const { storageType, key, defaultValue, getter, setter } = options;

  const getterRef = useLatestRef(getter);
  const setterRef = useLatestRef(setter);

  const [value, dispatch] = useCustomEventState(`${EVENT_KEY_PREFIX}/${key}`, () => {
    const result = getterRef.current();
    return result.success ? result.value : defaultValue;
  });

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (next) => {
      if (typeof next === "function") {
        dispatch((prev) => {
          const computedNext = (next as (prevState: T) => T)(prev);
          const result = setterRef.current(computedNext);
          if (!result.success) {
            console.error(`[BrowserStorage] Failed to set item in ${storageType}Storage:`, result.error);
          }
          return computedNext;
        });
      } else {
        const result = setterRef.current(next);
        if (!result.success) {
          console.error(`[BrowserStorage] Failed to set item in ${storageType}Storage:`, result.error);
        }
        dispatch(next);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    browserStorage.remove(storageType, key);
    dispatch(defaultValue);
  }, [key]);

  return { value, setValue, removeValue, dispatch } as const;
}

export { useStorageState };
