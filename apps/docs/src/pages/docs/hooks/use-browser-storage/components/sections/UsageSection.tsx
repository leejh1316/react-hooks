import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import LocalStorageDemo, { LOCAL_STORAGE_DEMO_CODE } from "../demos/LocalStorageDemo";
import NoSerializerDemo, { NO_SERIALIZER_DEMO_CODE } from "../demos/NoSerializerDemo";
import SerializerDemo, { SERIALIZER_DEMO_CODE } from "../demos/SerializerDemo";
import SessionStorageDemo, { SESSION_STORAGE_DEMO_CODE } from "../demos/SessionStorageDemo";
import TTLDemo, { TTL_DEMO_CODE } from "../demos/TTLDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        탭을 닫아도 값을 유지하려면 <InlineCode>useLocalStorage</InlineCode>, 탭을 닫으면 사라져야 하면{" "}
        <InlineCode>useSessionStorage</InlineCode>를 사용하세요. 만료 시간이 필요하면 각각의 <InlineCode>WithTTL</InlineCode> 훅을
        사용해요. 네 훅 모두 옵션과 반환값 구조가 동일해요.
      </Document.Paragraph>

      {/* localStorage 데모 */}
      <Document.Heading2>localStorage에 상태 저장하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        입력한 값을 localStorage에 저장해 새로고침해도 유지되는 예시예요. 같은 <InlineCode>key</InlineCode>를 사용하는 두 컴포넌트는 별도 설정
        없이 자동으로 동기화되며, <InlineCode>subscribe: true</InlineCode>를 지정했으므로 이 페이지를 새 탭에서 하나 더 열어 값을 바꿔도
        서로 반영돼요. <InlineCode>removeValue</InlineCode>를 호출하면 키가 삭제되고 <InlineCode>defaultValue</InlineCode>로 되돌아가요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <LocalStorageDemo />
      </PreviewContainer>
      <CodeBlock code={LOCAL_STORAGE_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>값 저장하고 복원하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. <InlineCode>key</InlineCode>와 <InlineCode>defaultValue</InlineCode>만 지정하면 돼요. 객체·배열 등 JSON으로 직렬화 가능한 값은
        그대로 저장할 수 있으며, <InlineCode>setValue</InlineCode>는 함수형 업데이트를 지원해요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* TTL 데모 */}
      <Document.Heading2>TTL로 값 자동 만료시키기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>WithTTL</InlineCode> 훅의 <InlineCode>ttl</InlineCode> 옵션(ms)을 사용해서 값의 유효 시간을 지정할 수 있어요. 만료 검사는 스토리지를
        읽는 시점(마운트)에 일어나며, 만료된 값은 스토리지에서 삭제되고 <InlineCode>defaultValue</InlineCode>로 초기화돼요. 값을 저장하고
        5초가 지난 뒤 "다시 읽기"를 눌러 보세요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <TTLDemo />
      </PreviewContainer>
      <CodeBlock code={TTL_DEMO_CODE} className="mb-8" />

      {/* sessionStorage 데모 */}
      <Document.Heading2>sessionStorage에 임시 상태 저장하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        탭(세션)이 유지되는 동안만 값이 필요할 때 사용하는 예시예요. 안내 모달 노출 여부, 임시 폼 상태 등에 적합해요. 브라우저 스펙상
        sessionStorage는 탭 간에 공유되지 않으므로 <InlineCode>subscribe</InlineCode> 옵션은 효과가 없어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <SessionStorageDemo />
      </PreviewContainer>
      <CodeBlock code={SESSION_STORAGE_DEMO_CODE} className="mb-8" />

      {/* 크로스탭 동기화 */}
      <Document.Heading2>탭 간 상태 동기화하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>subscribe</InlineCode> 옵션을 사용해서 탭 간 상태를 동기화할 수 있어요. <InlineCode>subscribe: true</InlineCode>를
        지정하면 다른 탭에서 같은 키의 값이 변경될 때 현재 탭의 상태도 자동으로 갱신돼요. 테마,
        로그인 상태처럼 모든 탭이 같은 값을 봐야 하는 상태에 유용해요. 위의 localStorage 데모가 이 옵션을 사용하고 있으니, 이 페이지를 두
        탭에서 열어 직접 확인해 보세요.
      </Document.Paragraph>
      <CodeBlock code={SUBSCRIBE_USAGE_CODE} className="mb-8" />

      {/* 커스텀 직렬화 */}
      <Document.Heading2>커스텀 직렬화 사용하기</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>serializer</InlineCode> 헬퍼를 사용해서 직렬화 방식을 바꿀 수 있어요. 기본 직렬화는{" "}
        <InlineCode>JSON.stringify</InlineCode> / <InlineCode>JSON.parse</InlineCode>예요. Map, Set, Date처럼 JSON으로
        표현할 수 없는 타입을 그대로 저장하면 데이터가 유실되므로, <InlineCode>serializer</InlineCode> 헬퍼를 옵션에 스프레드해 사용하세요.
      </Document.Paragraph>

      <Document.Heading3>
        <InlineCode>serializer</InlineCode> 없이 Set 저장하기 — 데이터 유실
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        <InlineCode>JSON.stringify</InlineCode>는 Set을 빈 객체 문자열로 직렬화하므로, 어떤 도시를 즐겨찾기해도 스토리지에는 항상 빈 객체만
        저장돼요. 화면은 메모리의 Set으로 동작하는 것처럼 보이지만, 도시를 즐겨찾기하고 새로고침하면 즐겨찾기가 사라지고{" "}
        <InlineCode>value</InlineCode>는 Set이 아닌 일반 객체가 돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <NoSerializerDemo />
      </PreviewContainer>
      <CodeBlock code={NO_SERIALIZER_DEMO_CODE} className="mb-8" />

      <Document.Heading3>
        <InlineCode>serializer</InlineCode>로 Set 저장하기
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        같은 동작에 <InlineCode>serializer.set&lt;string&gt;()</InlineCode>을 스프레드한 예시예요. Set이 배열 형태의 JSON 문자열로 저장되고
        읽을 때 다시 Set으로 복원되므로, 새로고침해도 즐겨찾기 상태가 유지돼요. <InlineCode>serialize</InlineCode> /{" "}
        <InlineCode>deserialize</InlineCode> 옵션에 직접 만든 함수를 전달할 수도 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <SerializerDemo />
      </PreviewContainer>
      <CodeBlock code={SERIALIZER_DEMO_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

function Counter() {
  const { value, setValue, removeValue } = useLocalStorage<{ count: number }>({
    key: "my-counter",
    defaultValue: { count: 0 },
  });

  return (
    <>
      <p>카운트: {value.count}</p>
      {/* 함수형 업데이트를 지원해요. */}
      <button onClick={() => setValue((prev) => ({ count: prev.count + 1 }))}>+1</button>
      {/* 키를 삭제하고 defaultValue로 되돌려요. */}
      <button onClick={removeValue}>초기화</button>
    </>
  );
}`;

const SUBSCRIBE_USAGE_CODE = `// 탭 A, 탭 B 모두 subscribe: true로 설정해요.
const { value, setValue } = useLocalStorage({
  key: "theme",
  defaultValue: "light",
  subscribe: true,
});

// 탭 A에서 setValue("dark") → 탭 B의 value도 "dark"로 자동 갱신돼요.`;

export default UsageSection;
