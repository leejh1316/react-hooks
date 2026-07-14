import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import ScrollRevealDemo, { SCROLL_REVEAL_DEMO_CODE } from "../demos/ScrollRevealDemo";
import VisibilityTrackerDemo, { VISIBILITY_TRACKER_DEMO_CODE } from "../demos/VisibilityTrackerDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        훅이 반환하는 <InlineCode>setContainerRef</InlineCode>를 컨테이너 요소의 <InlineCode>ref</InlineCode>에 연결하면 관찰이 시작돼요.
        관찰 대상은 컨테이너 자체가 아니라 컨테이너 <strong>내부</strong>의 타깃 요소예요. 기본적으로{" "}
        <InlineCode>data-intersection-target</InlineCode> 속성이 있는 요소를 관찰하고, 없으면 첫 번째 자식 요소를 관찰해요.
      </Document.Paragraph>

      {/* 데모 1: 가시성 실시간 추적 */}
      <Document.Heading2>가시성 실시간 추적하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        스크롤 컨테이너를 루트(<InlineCode>root: "container"</InlineCode>)로 사용해 타깃의 진입/이탈을 감지하는 예시예요. 컨테이너를
        스크롤해 보세요. 타깃이 50% 이상 보이면 <InlineCode>isVisible</InlineCode>이 true가 되고, 한 번이라도 진입한 뒤에는{" "}
        <InlineCode>hasEntered</InlineCode>가 계속 true로 유지돼요. 진입/이탈이 일어날 때마다 <InlineCode>onChange</InlineCode> 콜백이
        호출되어 아래 로그에 기록돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <VisibilityTrackerDemo />
      </PreviewContainer>
      <CodeBlock code={VISIBILITY_TRACKER_DEMO_CODE} className="mb-8" />

      {/* 데모 2: once + reset */}
      <Document.Heading2>once로 한 번만 실행하고 reset으로 재시작하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        스크롤 진입 애니메이션처럼 <strong>최초 한 번만</strong> 반응해야 하는 UI에는 <InlineCode>once: true</InlineCode>를 사용해요.
        컨테이너를 스크롤해 카드가 나타난 뒤 다시 위로 스크롤해도 카드가 사라지지 않아요. <InlineCode>reset()</InlineCode>을 호출하면
        상태가 초기화되고 관찰이 처음부터 다시 시작되므로, "다시 재생" 버튼을 누른 뒤 스크롤하면 애니메이션을 다시 볼 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ScrollRevealDemo />
      </PreviewContainer>
      <CodeBlock code={SCROLL_REVEAL_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>기본 사용법 — 첫 번째 자식 자동 관찰</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 옵션 없이 호출하면 브라우저 뷰포트를 루트로 사용하고, <InlineCode>targetSelector</InlineCode>에 매칭되는
        요소가 없으므로 컨테이너의 <InlineCode>firstElementChild</InlineCode>를 자동으로 관찰해요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* targetSelector */}
      <Document.Heading2>targetSelector로 관찰 대상 지정하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        컨테이너 내부의 특정 요소만 관찰하고 싶다면 <InlineCode>targetSelector</InlineCode> 옵션에 CSS 선택자를 전달하면 돼요. 매칭되는
        요소가 여러 개라면 첫 번째 요소만 관찰하고 개발 환경에서 경고가 출력돼요.
      </Document.Paragraph>
      <CodeBlock code={TARGET_SELECTOR_CODE} className="mb-8" />

      {/* 콜백 */}
      <Document.Heading2>콜백으로 사이드 이펙트 처리하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        노출 추적 이벤트 전송처럼 상태 대신 사이드 이펙트가 필요할 때는 <InlineCode>onEntered</InlineCode> /{" "}
        <InlineCode>onExited</InlineCode> / <InlineCode>onChange</InlineCode> 콜백을 사용해요. 콜백은 내부에서 최신 값을 ref로 참조하므로,
        렌더링마다 새 함수를 전달해도 옵저버가 다시 만들어지지 않아요.
      </Document.Paragraph>
      <CodeBlock code={CALLBACK_CODE} className="mb-8" />

      {/* enable */}
      <Document.Heading2>enable로 관찰 일시 중지하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        조건에 따라 감지를 켜고 꺼야 한다면 <InlineCode>enable</InlineCode> 옵션을 사용해요. <InlineCode>false</InlineCode>인 동안에는 교차
        이벤트가 발생해도 콜백 호출과 상태 갱신을 모두 건너뛰어요.
      </Document.Paragraph>
      <CodeBlock code={ENABLE_CODE} className="mb-8" />

      {/* 무한 스크롤 */}
      <Document.Heading2>무한 스크롤 구현하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        리스트 하단에 센티널(sentinel) 요소를 두고 <InlineCode>onEntered</InlineCode>에서 다음 페이지를 로드하면 무한 스크롤을 구현할 수
        있어요. <InlineCode>rootMargin</InlineCode>으로 루트 경계를 확장하면 바닥에 닿기 전에 미리 로드할 수 있어요.{" "}
        <InlineCode>root: "container"</InlineCode>를 사용할 때는 컨테이너에 <InlineCode>overflow: auto</InlineCode> 또는{" "}
        <InlineCode>overflow: scroll</InlineCode>이 설정되어 있어야 해요.
      </Document.Paragraph>
      <CodeBlock code={INFINITE_SCROLL_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";

function FadeInSection() {
  const { setContainerRef, isVisible } = useIntersectionObserver();

  // targetSelector에 매칭되는 요소가 없으므로 firstElementChild(<p>)를 자동으로 관찰해요.
  return (
    <div ref={setContainerRef}>
      <p style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s" }}>뷰포트에 진입하면 나타나요.</p>
    </div>
  );
}`;

const TARGET_SELECTOR_CODE = `const { setContainerRef, isVisible } = useIntersectionObserver({
  targetSelector: ".observe-target",
  threshold: 0.5,
});

<div ref={setContainerRef}>
  <header>헤더 (관찰하지 않아요)</header>
  <main className="observe-target">{isVisible ? "보임" : "안 보임"}</main>
</div>;`;

const CALLBACK_CODE = `const { setContainerRef } = useIntersectionObserver({
  onEntered: (entry) => {
    analytics.track("section_visible", { id: entry.target.id });
  },
  onExited: () => {
    console.log("섹션이 화면에서 사라졌어요.");
  },
  onChange: (type, entry) => {
    // 진입("enter") / 이탈("exit") 모두에서 호출돼요.
    console.log(type, entry.intersectionRatio);
  },
});

<section ref={setContainerRef} id="promo-banner">
  ...
</section>;`;

const ENABLE_CODE = `function TrackedBanner({ consented }: { consented: boolean }) {
  // consented가 false인 동안에는 콜백 호출과 상태 갱신을 모두 건너뛰어요.
  // 내부에서 최신 값을 ref로 참조하므로 옵저버를 다시 만들지 않고도 토글할 수 있어요.
  const { setContainerRef, isVisible } = useIntersectionObserver({ enable: consented });

  return (
    <div ref={setContainerRef}>
      <div data-intersection-target>{isVisible ? "노출 추적 중" : "배너"}</div>
    </div>
  );
}`;

const INFINITE_SCROLL_CODE = `function InfiniteList({ items, loadMore }: { items: Item[]; loadMore: () => void }) {
  const { setContainerRef } = useIntersectionObserver({
    root: "container", // 스크롤 컨테이너 자신을 루트로 사용해요
    targetSelector: "[data-sentinel]",
    rootMargin: "0px 0px 200px 0px", // 바닥에 닿기 200px 전에 미리 로드해요
    onEntered: () => loadMore(),
  });

  return (
    <div ref={setContainerRef} style={{ height: 400, overflowY: "auto" }}>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      {/* 리스트 하단의 센티널 요소 — 보이면 다음 페이지를 로드해요 */}
      <div data-sentinel />
    </div>
  );
}`;

export default UsageSection;
