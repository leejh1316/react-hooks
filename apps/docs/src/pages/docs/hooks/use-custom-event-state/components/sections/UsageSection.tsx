import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import NoSyncDemo from "../demos/NoSyncDemo";
import SyncDemo, { SYNC_DEMO_CODE } from "../demos/SyncDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        훅 적용 전후의 차이를 직접 비교해 보세요. 미적용 카운터는 각 컴포넌트가 독립적인 상태를 가지지만, 적용 카운터는 같은 key를 사용하는
        두 컴포넌트가 Provider 없이 자동으로 동기화돼요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>useState만 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>useState</InlineCode>만 사용했을 때의 동작을 보여주는 예시예요. 컴포넌트 A에서 카운트를 올려도 컴포넌트 B는 변하지
        않아요. 두 컴포넌트가 상태를 공유하려면 공통 부모로 상태를 끌어올리거나 Context를 도입해야 해요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoSyncDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>useCustomEventState로 동기화하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 카운터에 useCustomEventState를 적용한 예시예요. 두 컴포넌트가 같은 key(<InlineCode>"counter"</InlineCode>)를 사용하므로,
        컴포넌트 A에서 <InlineCode>+1 증가</InlineCode>를 누르면 컴포넌트 B의 카운트도 함께 올라가고, 컴포넌트 B에서{" "}
        <InlineCode>초기화</InlineCode>를 누르면 양쪽 모두 0으로 돌아가요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <SyncDemo />
      </PreviewContainer>
      <CodeBlock code={SYNC_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>기본 사용법</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>useState</InlineCode>와 동일한 형태로 사용하면 돼요. 첫 번째 인자로 상태를 식별하는 <InlineCode>key</InlineCode>를,
        두 번째 인자로 초기값을 전달해요. 상태를 공유할 컴포넌트들이 같은 key를 사용하기만 하면 별도의 설정 없이 동기화돼요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 함수형 업데이트 */}
      <Document.Heading2>함수형 업데이트 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>dispatch</InlineCode>에 값 대신 업데이트 함수를 전달할 수 있어요. 이벤트를 수신한 각 훅 인스턴스가 자신의 이전 상태에
        함수를 적용하므로, 이전 값 기반의 업데이트도 안전하게 처리돼요.
      </Document.Paragraph>
      <CodeBlock code={FUNCTIONAL_UPDATE_CODE} className="mb-8" />

      {/* 지연 초기화 */}
      <Document.Heading2>지연 초기화 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        초기값 계산 비용이 클 때는 <InlineCode>initialState</InlineCode>에 함수를 전달하세요. <InlineCode>useState</InlineCode>의 lazy
        initializer와 동일하게 첫 렌더링에서 한 번만 실행돼요.
      </Document.Paragraph>
      <CodeBlock code={LAZY_INIT_CODE} className="mb-8" />

      {/* 주의사항 */}
      <Document.Heading2>주의: 늦게 마운트된 컴포넌트의 초기값</Document.Heading2>
      <Document.Paragraph mb={6}>
        이 훅은 상태를 별도 저장소에 보관하지 않고 이벤트로만 전파해요. 따라서 <InlineCode>dispatch</InlineCode> 이후에 마운트된
        컴포넌트는 이전에 발행된 값을 알 수 없어 자신의 <InlineCode>initialState</InlineCode>로 시작하고, 다음 dispatch부터 동기화돼요.
        마운트 시점과 무관하게 항상 같은 값을 보여줘야 한다면 모든 컴포넌트가 같은 초기값을 사용하도록 상수로 관리하거나, 값 유지가 필요한
        경우 <InlineCode>useBrowserStorage</InlineCode> 같은 저장소 기반 훅을 사용하세요.
      </Document.Paragraph>
      <CodeBlock code={LATE_MOUNT_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

function ThemeToggle() {
  // useState와 동일한 [state, dispatch] 튜플을 반환해요.
  const [theme, setTheme] = useCustomEventState<"light" | "dark">("app-theme", "light");

  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>현재 테마: {theme}</button>;
}

function Header() {
  // 트리상 멀리 떨어진 컴포넌트도 같은 key만 사용하면 동기화돼요.
  const [theme] = useCustomEventState<"light" | "dark">("app-theme", "light");

  return <header data-theme={theme}>...</header>;
}`;

const FUNCTIONAL_UPDATE_CODE = `const [count, setCount] = useCustomEventState("counter", 0);

// 값 전달
setCount(10);

// 함수형 업데이트 — 각 인스턴스가 자신의 이전 상태에 함수를 적용해요.
setCount((prev) => prev + 1);`;

const LAZY_INIT_CODE = `// 함수를 전달하면 첫 렌더링에서 한 번만 실행돼요.
const [filters, setFilters] = useCustomEventState("search-filters", () => buildDefaultFilters());`;

const LATE_MOUNT_CODE = `function ComponentA() {
  const [count, setCount] = useCustomEventState("counter", 0);
  // setCount(5) 호출 후...
}

function LateMounted() {
  // dispatch 이후에 마운트되면 이전에 발행된 5가 아닌 초기값 0으로 시작해요.
  // 다음 dispatch가 발생하면 그때부터 동기화돼요.
  const [count] = useCustomEventState("counter", 0);
}`;

export default UsageSection;
