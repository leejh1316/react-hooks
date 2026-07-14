import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import DynamicListDemo, { DYNAMIC_LIST_DEMO_CODE } from "../demos/DynamicListDemo";
import ScrollSpyDemo, { SCROLL_SPY_DEMO_CODE } from "../demos/ScrollSpyDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        관찰할 자식 요소마다 <InlineCode>data-intersection-key</InlineCode> 속성으로 키를 지정하고, 훅이 반환하는{" "}
        <InlineCode>setContainerRef</InlineCode>를 컨테이너 요소의 <InlineCode>ref</InlineCode>에 연결하면 돼요. 각 요소의 가시성은{" "}
        <InlineCode>states[key]</InlineCode>로 읽을 수 있어요. 아직 교차 이벤트가 발생하지 않은 키는 <InlineCode>undefined</InlineCode>
        이므로 항상 옵셔널 체이닝(<InlineCode>states[key]?.isVisible</InlineCode>)으로 접근하세요.
      </Document.Paragraph>

      {/* 데모 1: 스크롤 스파이 */}
      <Document.Heading2>스크롤 스파이 만들기</Document.Heading2>
      <Document.Paragraph mb={6}>
        스크롤 컨테이너를 루트(<InlineCode>root: "container"</InlineCode>)로 사용해 섹션 4개를 한꺼번에 관찰하는 예시예요. 컨테이너를
        스크롤하면 50% 이상 보이는 섹션이 목차에 하이라이트돼요. 목차 버튼을 누르면 <InlineCode>states[key].target</InlineCode>으로 관찰
        중인 DOM 요소에 직접 접근해 해당 섹션까지 부드럽게 스크롤해요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ScrollSpyDemo />
      </PreviewContainer>
      <CodeBlock code={SCROLL_SPY_DEMO_CODE} className="mb-8" />

      {/* 데모 2: 동적 리스트 + once + reset */}
      <Document.Heading2>동적 리스트에서 once와 reset 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        내장 <InlineCode>MutationObserver</InlineCode> 덕분에 "카드 추가"로 나중에 추가된 카드도 별도 처리 없이 자동으로 관찰되고, "마지막
        제거"로 제거된 카드는 <InlineCode>states</InlineCode>에서 키가 삭제돼요. <InlineCode>once: true</InlineCode>라서 각 카드는 최초
        진입 시 한 번만 나타나고, 카드별 "↺ 리셋" 버튼(<InlineCode>reset(key)</InlineCode>)으로 해당 카드만, "전체 리셋"(
        <InlineCode>reset()</InlineCode>)으로 모든 카드를 처음부터 다시 관찰할 수 있어요. 하단 <InlineCode>states</InlineCode> 패널에서 각
        키의 상태를 색상 도트(보임 / 진입한 적 있음 / 미진입)로 한눈에 확인할 수 있어요. 한 가지 주의할 점은,{" "}
        <InlineCode>once: true</InlineCode>인 옵저버는 최초 진입 후 이탈하는 시점에 관찰이 중단되어 <InlineCode>isVisible</InlineCode>이 더
        이상 갱신되지 않는다는 거예요. 그래서 이 데모는 카드 리빌용 once 옵저버와 실시간 가시성 표시용 라이브 옵저버를 따로 두고,{" "}
        <InlineCode>useComposedRefs</InlineCode>로 두 ref를 하나의 컨테이너에 연결했어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <DynamicListDemo />
      </PreviewContainer>
      <CodeBlock code={DYNAMIC_LIST_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>기본 사용법 — 리스트 진입 애니메이션</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 브라우저 뷰포트를 루트로 사용하고, 각 아이템의 <InlineCode>data-intersection-key</InlineCode> 값으로{" "}
        <InlineCode>states</InlineCode>에서 상태를 조회해요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 콜백 */}
      <Document.Heading2>콜백으로 요소별 노출 트래킹하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        모든 콜백은 첫 번째 인자로 <InlineCode>key</InlineCode>를 전달하므로 어떤 요소에서 이벤트가 발생했는지 구분할 수 있어요. 콜백은
        내부에서 최신 값을 ref로 참조하므로, 렌더링마다 새 함수를 전달해도 옵저버가 다시 만들어지지 않아요.
      </Document.Paragraph>
      <CodeBlock code={CALLBACK_CODE} className="mb-8" />

      {/* keyAttribute */}
      <Document.Heading2>keyAttribute로 키 속성명 바꾸기</Document.Heading2>
      <Document.Paragraph mb={6}>
        기본 속성명 <InlineCode>data-intersection-key</InlineCode> 대신 다른 속성명을 사용하고 싶다면 <InlineCode>keyAttribute</InlineCode>{" "}
        옵션을 지정하면 돼요.
      </Document.Paragraph>
      <CodeBlock code={KEY_ATTRIBUTE_CODE} className="mb-8" />

      {/* once + reset */}
      <Document.Heading2>once와 reset 조합하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>once: true</InlineCode>는 키별로 독립적으로 적용되므로, <InlineCode>reset(key)</InlineCode>를 호출하면 해당 키의 once
        플래그와 상태가 초기화되어 그 요소만 다시 관찰할 수 있어요. <InlineCode>reset</InlineCode>은 컨테이너가 마운트된 이후에 호출해야
        해요(없으면 경고 출력 후 무시).
      </Document.Paragraph>
      <CodeBlock code={ONCE_RESET_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useIntersectionObserverGroup } from "@leejaehyeok/use-intersection-observer";

function AnimatedList() {
  const { setContainerRef, states } = useIntersectionObserverGroup({
    threshold: 0.2,
    once: true, // 각 아이템은 한 번 진입한 뒤 관찰이 중단돼요
  });

  const items = ["apple", "banana", "cherry"];

  return (
    <ul ref={setContainerRef}>
      {items.map((item) => (
        <li
          key={item}
          data-intersection-key={item}
          style={{
            opacity: states[item]?.hasEntered ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}`;

const CALLBACK_CODE = `const { setContainerRef } = useIntersectionObserverGroup({
  threshold: 0.5,
  onEntered: (key, entry) => {
    analytics.track("impression", { section: key });
  },
  onExited: (key) => {
    analytics.track("exit", { section: key });
  },
  onChange: (key, type, entry) => {
    // 진입("enter") / 이탈("exit") 모두에서 호출돼요.
    console.log(key, type, entry.intersectionRatio);
  },
});

<div ref={setContainerRef}>
  <section data-intersection-key="hero">...</section>
  <section data-intersection-key="pricing">...</section>
</div>;`;

const KEY_ATTRIBUTE_CODE = `const { setContainerRef, states } = useIntersectionObserverGroup({
  keyAttribute: "data-section-id", // 기본값 "data-intersection-key" 대신 사용해요
});

<div ref={setContainerRef}>
  <section data-section-id="intro">{String(states["intro"]?.isVisible)}</section>
  <section data-section-id="features">{String(states["features"]?.isVisible)}</section>
</div>;`;

const ONCE_RESET_CODE = `const { setContainerRef, states, reset } = useIntersectionObserverGroup({ once: true });

// 특정 키만 초기화하고 다시 관찰해요 — 해당 키의 once 플래그도 함께 초기화돼요.
reset("hero-section");

// 전체 상태를 비우고 모든 타깃을 처음부터 다시 관찰해요.
reset();`;

export default UsageSection;
