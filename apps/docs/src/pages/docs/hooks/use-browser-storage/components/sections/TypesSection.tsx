import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const TypesSection = () => {
  return (
    <section>
      <Document.Heading1>API — 타입</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지가 export 하는 타입입니다. <InlineCode>StorageResult</InlineCode>는 <InlineCode>success</InlineCode> 필드로 구분되는
        discriminated union이므로, 실패 케이스를 타입 안전하게 분기할 수 있습니다.
      </Document.Paragraph>
      <CodeBlock code={TYPES_CODE} language="ts" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const TYPES_CODE = `type StorageType = "local" | "session";

type Serializer<T> = {
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
};

// 모든 스토리지 연산의 결과 — 예외를 던지는 대신 성공 / 실패를 값으로 표현합니다.
type StorageResult<T> = { success: true; value: T } | { success: false; error: StorageError };

type StorageError =
  | "NOT_FOUND" // 키가 존재하지 않음 (TTL 만료 포함)
  | "PARSE_ERROR" // 역직렬화 실패
  | "SERIALIZE_ERROR" // 직렬화 실패
  | "QUOTA_EXCEEDED" // 스토리지 용량 초과
  | "UNAVAILABLE" // 스토리지 접근 불가 (SSR, Private 모드 등)
  | "UNKNOWN"; // 그 외

// browserStorage.subscribe 콜백에 전달되는 확장 StorageEvent
type StorageEventExpanded<T> =
  | (StorageEvent & { success: true; newParsedValue: T | null; oldParsedValue: T | null })
  | (StorageEvent & { success: false; error: "PARSE_ERROR" | "UNKNOWN" });

// 훅 옵션의 원형 타입 — getter / setter를 제외한 필드가 훅 옵션으로 사용됩니다.
type BrowserStorageOptions<T> = {
  storageType: StorageType;
  key: string;
  defaultValue: T;
  subscribe?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
  getter: () => StorageResult<T>;
  setter: (value: T) => StorageResult<string>;
};`;

export default TypesSection;
