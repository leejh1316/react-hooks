import { Serializer, StorageResult, StorageType } from "../types";
import { browserStorage } from "./browserStorage";

type TTLWrapper = {
  value: string;
  expiresAt: number | null;
};

const ttl = {
  ms: (ms: number) => ms,
  seconds: (s: number) => s * 1000,
  minutes: (m: number) => m * 1000 * 60,
  hours: (h: number) => h * 1000 * 60 * 60,
  days: (d: number) => d * 1000 * 60 * 60 * 24,
  weeks: (w: number) => w * 1000 * 60 * 60 * 24 * 7,
} as const;

function withTTL(storage: typeof browserStorage) {
  return {
    ...storage,
    set: <T>(
      storageType: StorageType,
      key: string,
      value: T,
      ttl?: number,
      serialize: Serializer<T>["serialize"] = JSON.stringify,
    ): StorageResult<string> => {
      try {
        const expiresAt = ttl != null ? Date.now() + ttl : null;
        const valueWithTTL = { value: serialize(value), expiresAt };
        return storage.set(storageType, key, valueWithTTL);
      } catch (e) {
        return { success: false, error: "SERIALIZE_ERROR" };
      }
    },

    get: <T>(storageType: StorageType, key: string, deserialize: Serializer<T>["deserialize"] = JSON.parse): StorageResult<T> => {
      const result = storage.get<TTLWrapper>(storageType, key);
      if (!result.success) return result;
      const { value, expiresAt } = result.value;
      if (expiresAt !== null && Date.now() > expiresAt) {
        storage.remove(storageType, key);
        return { success: false, error: "NOT_FOUND" };
      }
      try {
        return { success: true, value: deserialize(value) };
      } catch (e) {
        return { success: false, error: "PARSE_ERROR" };
      }
    },
  };
}

export { withTTL, ttl };
