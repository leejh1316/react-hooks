import { useCallback } from "react";
import { BrowserStorageOptions } from "./types";
import { useStorageState } from "./useStorageState";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { browserStorage, withTTL } from "./utils";

function useBrowserStorage<T>(options: Omit<BrowserStorageOptions<T>, "getter" | "setter">) {
  const { serialize, deserialize, storageType, key } = options;

  const serializeRef = useLatestRef(serialize);
  const deserializeRef = useLatestRef(deserialize);

  const getter = useCallback<BrowserStorageOptions<T>["getter"]>(() => {
    return browserStorage.get(storageType, key, deserializeRef.current);
  }, [key]);
  const setter = useCallback<BrowserStorageOptions<T>["setter"]>(
    (value) => {
      return browserStorage.set(storageType, key, value, serializeRef.current);
    },
    [key, storageType],
  );

  return useStorageState({ ...options, getter, setter });
}

const browserStorageWithTTL = withTTL(browserStorage);
function useBrowserStorageWithTTL<T>(options: Omit<BrowserStorageOptions<T>, "getter" | "setter"> & { ttl?: number }) {
  const { serialize, deserialize, storageType, key, ttl } = options;

  const serializeRef = useLatestRef(serialize);
  const deserializeRef = useLatestRef(deserialize);

  const getter = useCallback<BrowserStorageOptions<T>["getter"]>(() => {
    return browserStorageWithTTL.get(storageType, key, deserializeRef.current);
  }, [key, storageType]);

  const setter = useCallback<BrowserStorageOptions<T>["setter"]>(
    (value) => {
      return browserStorageWithTTL.set(storageType, key, value, ttl, serializeRef.current);
    },
    [key, storageType, ttl],
  );

  return useStorageState({ ...options, getter, setter });
}

export { useBrowserStorage, useBrowserStorageWithTTL };
