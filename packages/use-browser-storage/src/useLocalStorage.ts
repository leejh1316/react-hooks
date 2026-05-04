import { useEffect } from "react";
import { BrowserStorageOptions, Serializer, StorageEventExpanded } from "./types";
import { useBrowserStorage, useBrowserStorageWithTTL } from "./useBrowserStorage";
import { browserStorage } from "./utils";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

function useLocalStorageSubscribe<T>(
  storage: ReturnType<typeof useBrowserStorage<T>>,
  options: { subscribe?: boolean; key: string; defaultValue: T; deserialize?: Serializer<T>["deserialize"] },
) {
  const { subscribe, defaultValue, key, deserialize } = options;
  const { dispatch } = storage;
  const deserializeRef = useLatestRef(deserialize);

  useEffect(() => {
    if (!subscribe) return;
    const handleStorageChange = (event: StorageEventExpanded<T>) => {
      if (!event.success) return;
      dispatch(event.newParsedValue ?? defaultValue);
    };
    return browserStorage.subscribe(key, handleStorageChange, deserializeRef.current);
  }, [subscribe, key]);

  return storage;
}
function useLocalStorage<T>(options: Omit<BrowserStorageOptions<T>, "storageType" | "getter" | "setter">) {
  const storage = useBrowserStorage({ ...options, storageType: "local" });
  return useLocalStorageSubscribe(storage, options);
}

function useLocalStorageWithTTL<T>(options: Omit<BrowserStorageOptions<T>, "storageType" | "getter" | "setter"> & { ttl?: number }) {
  const storage = useBrowserStorageWithTTL({ ...options, storageType: "local" });
  return useLocalStorageSubscribe(storage, options);
}

export { useLocalStorage, useLocalStorageWithTTL };
