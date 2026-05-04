type StorageType = "local" | "session";

type Serializer<T> = {
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
};

type StorageResult<T> = { success: true; value: T } | { success: false; error: StorageError };

type StorageError =
  | "NOT_FOUND" // 키가 존재하지 않음
  | "PARSE_ERROR" // 역직렬화 실패
  | "SERIALIZE_ERROR" // 직렬화 실패
  | "QUOTA_EXCEEDED" // 용량 초과
  | "UNAVAILABLE" // Storage 자체 접근 불가 (SSR, Private 모드)
  | "UNKNOWN"; // 그 외

type StorageEventExpanded<T> =
  | (StorageEvent & {
      success: true;
      newParsedValue: T | null;
      oldParsedValue: T | null;
    })
  | ({
      success: false;
      error: Extract<StorageError, "PARSE_ERROR" | "UNKNOWN">;
    } & StorageEvent);

type BrowserStorageOptions<T> = {
  storageType: StorageType;
  defaultValue: T;
  key: string;
  subscribe?: boolean;
  serialize?: Serializer<T>["serialize"];
  deserialize?: Serializer<T>["deserialize"];
  getter: () => StorageResult<T>;
  setter: (value: T) => StorageResult<string>;
};

export type { StorageType, Serializer, StorageResult, StorageError, StorageEventExpanded, BrowserStorageOptions };
