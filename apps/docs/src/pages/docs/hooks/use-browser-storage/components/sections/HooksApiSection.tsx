import { CodeBlock, ParameterTable, ReturnTable, type ParameterTableRow, type ReturnTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const HooksApiSection = () => {
  return (
    <section>
      <Document.Heading1>API — 훅</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지는 훅 4종과 유틸리티 3종(<InlineCode>browserStorage</InlineCode>, <InlineCode>ttl</InlineCode>,{" "}
        <InlineCode>serializer</InlineCode>), 그리고 관련 타입을 named export 합니다. 네 훅 모두 동일한 옵션과 반환값 구조를 가지며,
        사용하는 스토리지와 TTL 만료 지원 여부만 다릅니다.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={HOOKS_SIGNATURE_CODE} language="ts" />

      {/* Options */}
      <Document.Heading2>Options</Document.Heading2>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        네 훅 모두 <InlineCode>value</InlineCode>, <InlineCode>setValue</InlineCode>, <InlineCode>removeValue</InlineCode>,{" "}
        <InlineCode>dispatch</InlineCode>를 담은 객체를 반환합니다.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import {
  // 훅
  useLocalStorage,
  useLocalStorageWithTTL,
  useSessionStorage,
  useSessionStorageWithTTL,
  // 유틸리티
  browserStorage,
  ttl,
  serializer,
} from "@leejaehyeok/use-browser-storage";`;

const HOOKS_SIGNATURE_CODE = `// 새로고침 · 탭을 닫아도 유지 (localStorage)
function useLocalStorage<T>(options: Options<T>): StorageState<T>;
function useLocalStorageWithTTL<T>(options: Options<T> & { ttl?: number }): StorageState<T>;

// 탭을 닫으면 삭제 (sessionStorage)
function useSessionStorage<T>(options: Options<T>): StorageState<T>;
function useSessionStorageWithTTL<T>(options: Options<T> & { ttl?: number }): StorageState<T>;

type Options<T> = {
  key: string;
  defaultValue: T;
  subscribe?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
};

type StorageState<T> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  removeValue: () => void;
  dispatch: React.Dispatch<React.SetStateAction<T>>;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** 훅 공통 Options 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "key",
    type: "string",
    description: "스토리지에 저장할 키입니다. 같은 key를 사용하는 컴포넌트끼리는 같은 탭 안에서 자동으로 상태가 동기화됩니다.",
  },
  {
    name: "defaultValue",
    type: "T",
    description: "키가 존재하지 않거나 읽기에 실패했을 때(TTL 만료, 파싱 실패, 스토리지 접근 불가 등) 사용할 기본값입니다.",
  },
  {
    name: "subscribe",
    type: "boolean",
    defaultValue: "false",
    description:
      "true이면 다른 탭에서 변경된 값이 자동 반영됩니다. localStorage 훅 전용이며, 브라우저 스펙상 sessionStorage 훅에서는 효과가 없습니다.",
  },
  {
    name: "serialize",
    type: "(value: T) => string",
    defaultValue: "JSON.stringify",
    description: "저장 시 값을 문자열로 변환하는 함수입니다. Map, Set 등 특수 타입은 serializer 헬퍼를 사용하세요.",
  },
  {
    name: "deserialize",
    type: "(raw: string) => T",
    defaultValue: "JSON.parse",
    description: "읽을 때 문자열을 원래 값으로 되돌리는 함수입니다.",
  },
  {
    name: "ttl",
    type: "number",
    description:
      "값의 유효 시간(ms)입니다. WithTTL 훅 전용이며, 생략하면 만료되지 않습니다. ttl 헬퍼(ttl.hours(1) 등)로 쉽게 계산할 수 있습니다.",
  },
];

/** 훅 공통 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "value",
    type: "T",
    description: "현재 값입니다. 마운트 시 스토리지에서 읽어온 값으로 초기화되며, 이후 setValue로 갱신됩니다.",
  },
  {
    name: "setValue",
    type: "React.Dispatch<React.SetStateAction<T>>",
    description:
      "값을 갱신하고 스토리지에 저장합니다. 함수형 업데이트를 지원합니다. 저장에 실패하면 console.error로 기록되고 UI 상태는 낙관적으로 업데이트됩니다.",
  },
  {
    name: "removeValue",
    type: "() => void",
    description: "스토리지에서 키를 삭제하고 상태를 defaultValue로 되돌립니다.",
  },
  {
    name: "dispatch",
    type: "React.Dispatch<React.SetStateAction<T>>",
    description: "스토리지에 쓰지 않고 컴포넌트 상태만 갱신하는 저수준 함수입니다. 일반적인 상황에서는 setValue를 사용하세요.",
  },
];

export default HooksApiSection;
