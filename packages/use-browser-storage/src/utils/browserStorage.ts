import { Serializer, StorageEventExpanded, StorageResult, StorageType } from "../types";

const defaultSerializer: Serializer<unknown> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

function getStorage(type: StorageType): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    if (type === "local") return window.localStorage;
    if (type === "session") return window.sessionStorage;
    return null;
  } catch {
    return null;
  }
}

function get<T>(
  storageType: StorageType,
  key: string,
  deserialize: Serializer<T>["deserialize"] = defaultSerializer.deserialize as Serializer<T>["deserialize"],
): StorageResult<T> {
  const storage = getStorage(storageType);
  if (!storage) {
    return { success: false, error: "UNAVAILABLE" };
  }
  try {
    const raw = storage.getItem(key);
    if (raw === null) {
      return { success: false, error: "NOT_FOUND" };
    }
    const value = deserialize(raw);
    return { success: true, value };
  } catch (e) {
    if (e instanceof SyntaxError) {
      return { success: false, error: "PARSE_ERROR" };
    }
    return { success: false, error: "UNKNOWN" };
  }
}

function set<T>(
  storageType: StorageType,
  key: string,
  value: T,
  serialize: Serializer<T>["serialize"] = defaultSerializer.serialize as Serializer<T>["serialize"],
): StorageResult<string> {
  const storage = getStorage(storageType);
  if (!storage) {
    return { success: false, error: "UNAVAILABLE" };
  }

  let raw: string;
  try {
    raw = serialize(value);
  } catch (e) {
    return { success: false, error: "SERIALIZE_ERROR" };
  }

  try {
    storage.setItem(key, raw);
    return { success: true, value: raw };
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
      return { success: false, error: "QUOTA_EXCEEDED" };
    }
    return { success: false, error: "UNKNOWN" };
  }
}

function remove(storageType: StorageType, key: string): StorageResult<void> {
  const storage = getStorage(storageType);
  if (!storage) {
    return { success: false, error: "UNAVAILABLE" };
  }
  try {
    storage.removeItem(key);
    return { success: true, value: undefined };
  } catch (e) {
    return { success: false, error: "UNKNOWN" };
  }
}

function clear(storageType: StorageType): StorageResult<void> {
  const storage = getStorage(storageType);
  if (!storage) {
    return { success: false, error: "UNAVAILABLE" };
  }
  try {
    storage.clear();
    return { success: true, value: undefined };
  } catch (e) {
    return { success: false, error: "UNKNOWN" };
  }
}

function has(storageType: StorageType, key: string): boolean {
  const storage = getStorage(storageType);
  if (!storage) return false;
  try {
    return storage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function length(storageType: StorageType): number {
  const storage = getStorage(storageType);
  if (!storage) return 0;
  try {
    return storage.length;
  } catch {
    return 0;
  }
}

function key(storageType: StorageType, index: number): string | null {
  const storage = getStorage(storageType);
  if (!storage) return null;
  try {
    return storage.key(index);
  } catch {
    return null;
  }
}

function keys(storageType: StorageType): StorageResult<string[]> {
  const storage = getStorage(storageType);
  if (!storage) return { success: false, error: "UNAVAILABLE" };
  try {
    const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)!);
    return { success: true, value: keys };
  } catch {
    return { success: false, error: "UNKNOWN" };
  }
}

function subscribe<T>(
  key: string,
  callback: (event: StorageEventExpanded<T>) => void,
  deserialize: Serializer<T>["deserialize"] = defaultSerializer.deserialize as Serializer<T>["deserialize"],
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: StorageEvent) => {
    if (event.key !== key) return;
    try {
      const newParsedValue = event.newValue !== null ? deserialize(event.newValue) : null;
      const oldParsedValue = event.oldValue !== null ? deserialize(event.oldValue) : null;
      callback({
        ...event,
        success: true,
        newParsedValue,
        oldParsedValue,
      });
    } catch (e) {
      callback({
        ...event,
        success: false,
        error: e instanceof SyntaxError ? "PARSE_ERROR" : "UNKNOWN",
      } as StorageEventExpanded<T>);
    }
  };
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("storage", handler);
  };
}

export { getStorage };
export const browserStorage = {
  get,
  set,
  remove,
  clear,
  has,
  length,
  key,
  keys,
  subscribe,
};
