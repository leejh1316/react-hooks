import { CodeBlock, ReturnTable, type ReturnTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UtilsApiSection = () => {
  return (
    <section>
      <Document.Heading1>API — 유틸리티</Document.Heading1>

      {/* browserStorage */}
      <Document.Heading2 mt={6}>
        <InlineCode>browserStorage</InlineCode>
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        훅 없이 스토리지를 직접 조작할 때 사용하는 저수준 유틸 객체예요. 모든 메서드는 예외를 던지는 대신{" "}
        <InlineCode>StorageResult</InlineCode>(성공 / 실패 유니온) 또는 안전한 기본값을 반환하므로 try-catch 없이 사용할 수 있어요. SSR
        환경에서는 <InlineCode>UNAVAILABLE</InlineCode> 에러를 반환해요.
      </Document.Paragraph>
      <CodeBlock code={BROWSER_STORAGE_CODE} className="mb-4" language="ts" />
      <ReturnTable rows={BROWSER_STORAGE_ROWS} />

      {/* ttl */}
      <Document.Heading2>
        <InlineCode>ttl</InlineCode>
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        시간 단위를 밀리초로 변환하는 헬퍼예요. <InlineCode>WithTTL</InlineCode> 훅의 <InlineCode>ttl</InlineCode> 옵션 값을 계산할 때
        사용하세요.
      </Document.Paragraph>
      <CodeBlock code={TTL_UTIL_CODE} language="ts" />

      {/* serializer */}
      <Document.Heading2>
        <InlineCode>serializer</InlineCode>
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        JSON으로 직렬화할 수 없는 타입을 위한 <InlineCode>serialize</InlineCode> / <InlineCode>deserialize</InlineCode> 쌍을 반환하는
        헬퍼예요. 훅 옵션에 스프레드해 사용해요.
      </Document.Paragraph>
      <CodeBlock code={SERIALIZER_UTIL_CODE} language="ts" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BROWSER_STORAGE_CODE = `import { browserStorage } from "@leejaehyeok/use-browser-storage";

const result = browserStorage.get<string>("local", "my-key");
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error); // "NOT_FOUND" | "PARSE_ERROR" | ...
}

browserStorage.set("local", "my-key", "hello");
browserStorage.remove("local", "my-key");

// 다른 탭의 변경을 구독해요. 구독 해제 함수를 반환해요.
const unsubscribe = browserStorage.subscribe<string>("my-key", (event) => {
  if (event.success) console.log(event.newParsedValue);
});`;

const TTL_UTIL_CODE = `import { ttl } from "@leejaehyeok/use-browser-storage";

ttl.ms(500); // 500
ttl.seconds(30); // 30,000
ttl.minutes(5); // 300,000
ttl.hours(1); // 3,600,000
ttl.days(7); // 604,800,000
ttl.weeks(2); // 1,209,600,000`;

const SERIALIZER_UTIL_CODE = `import { serializer } from "@leejaehyeok/use-browser-storage";

serializer.map<K, V>(); // Map<K, V>
serializer.set<V>(); // Set<V>
serializer.date(); // Date (ISO 문자열로 저장)
serializer.url(); // URL
serializer.bigint(); // bigint

// serialize / deserialize 쌍을 반환하므로 옵션에 스프레드해 사용해요.
useLocalStorage({
  key: "visited",
  defaultValue: new Set<string>(),
  ...serializer.set<string>(),
});`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** browserStorage 메서드 */
const BROWSER_STORAGE_ROWS: ReturnTableRow[] = [
  {
    name: "get",
    type: "<T>(storageType, key, deserialize?) => StorageResult<T>",
    description: "키의 값을 읽어 역직렬화해 반환해요. 키가 없으면 NOT_FOUND 에러를 반환해요.",
  },
  {
    name: "set",
    type: "<T>(storageType, key, value, serialize?) => StorageResult<string>",
    description: "값을 직렬화해 저장해요. 성공 시 저장된 문자열을 반환해요.",
  },
  {
    name: "remove",
    type: "(storageType, key) => StorageResult<void>",
    description: "키를 삭제해요.",
  },
  {
    name: "clear",
    type: "(storageType) => StorageResult<void>",
    description: "해당 스토리지의 모든 항목을 삭제해요.",
  },
  {
    name: "has",
    type: "(storageType, key) => boolean",
    description: "키의 존재 여부를 반환해요. 접근 불가 시 false를 반환해요.",
  },
  {
    name: "length",
    type: "(storageType) => number",
    description: "저장된 항목 개수를 반환해요. 접근 불가 시 0을 반환해요.",
  },
  {
    name: "key",
    type: "(storageType, index) => string | null",
    description: "인덱스에 해당하는 키를 반환해요.",
  },
  {
    name: "keys",
    type: "(storageType) => StorageResult<string[]>",
    description: "모든 키 목록을 반환해요.",
  },
  {
    name: "subscribe",
    type: "<T>(key, callback, deserialize?) => () => void",
    description:
      "다른 탭에서 해당 키가 변경될 때 콜백을 호출해요. 콜백은 파싱된 값(newParsedValue / oldParsedValue)이 담긴 StorageEventExpanded를 받으며, 반환된 함수로 구독을 해제해요. 값이 변경된 탭 자신에게는 발생하지 않아요.",
  },
];

export default UtilsApiSection;
