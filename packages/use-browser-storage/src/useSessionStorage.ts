import { BrowserStorageOptions } from "./types";
import { useBrowserStorage, useBrowserStorageWithTTL } from "./useBrowserStorage";

function useSessionStorage<T>(options: Omit<BrowserStorageOptions<T>, "storageType" | "getter" | "setter">) {
  return useBrowserStorage({ ...options, storageType: "session" });
}

function useSessionStorageWithTTL<T>(options: Omit<BrowserStorageOptions<T>, "storageType" | "getter" | "setter"> & { ttl?: number }) {
  return useBrowserStorageWithTTL({ ...options, storageType: "session" });
}

export { useSessionStorage, useSessionStorageWithTTL };
