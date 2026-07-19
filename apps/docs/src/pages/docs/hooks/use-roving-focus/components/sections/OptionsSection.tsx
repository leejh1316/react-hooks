import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import BoundaryCallbackDemo, { BOUNDARY_CALLBACK_DEMO_CODE } from "../demos/BoundaryCallbackDemo";
import GridRovingFocusDemo, { GRID_ROVING_FOCUS_DEMO_CODE } from "../demos/GridRovingFocusDemo";
import OptionsPlaygroundDemo, { OPTIONS_PLAYGROUND_DEMO_CODE } from "../demos/OptionsPlaygroundDemo";
import ScrollIntoViewDemo, { SCROLL_INTO_VIEW_DEMO_CODE } from "../demos/ScrollIntoViewDemo";
import TabsClickOnNavigateDemo, { TABS_CLICK_ON_NAVIGATE_DEMO_CODE } from "../demos/TabsClickOnNavigateDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const OptionsSection = () => {
  return (
    <section>
      <Document.Heading1>옵션 활용</Document.Heading1>
      <Document.Paragraph mb={8}>
        옵션 조합에 따라 메뉴·탭·그리드·리스트박스 등 다양한 위젯 패턴을 만들 수 있어요. 대표적인 조합을 데모와 함께 살펴보고, 마지막
        플레이그라운드에서 모든 옵션을 직접 바꿔가며 확인해 보세요.
      </Document.Paragraph>

      {/* colSkipCount — 그리드 내비게이션 */}
      <Document.Heading2>
        <InlineCode>colSkipCount</InlineCode> — 2차원 그리드 이동
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>colSkipCount</InlineCode>에 그리드의 열 수를 지정하면 <InlineCode>↑</InlineCode> / <InlineCode>↓</InlineCode>가 열
        수만큼 점프해 2차원 이동처럼 동작해요. <InlineCode>loop</InlineCode>가 켜져 있으면 세로 이동은 같은 열 안에서 순환하고, 가로 이동은
        전체 아이템을 한 줄로 이어서 순환해요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <GridRovingFocusDemo />
      </PreviewContainer>
      <CodeBlock code={GRID_ROVING_FOCUS_DEMO_CODE} className="mb-8" />

      {/* clickOnNavigate — 탭 자동 선택 */}
      <Document.Heading2>
        <InlineCode>clickOnNavigate</InlineCode> — 이동 즉시 선택
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>clickOnNavigate</InlineCode>를 켜면 방향키로 포커스가 이동하는 즉시 해당 아이템의 <InlineCode>click()</InlineCode>이
        호출돼요. 아이템의 <InlineCode>onClick</InlineCode>에 선택 로직을 연결해 두면, 방향키 이동만으로 탭이 전환되는 WAI-ARIA의 자동
        활성화(automatic activation) 탭 패턴을 구현할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <TabsClickOnNavigateDemo />
      </PreviewContainer>
      <CodeBlock code={TABS_CLICK_ON_NAVIGATE_DEMO_CODE} className="mb-8" />

      {/* scrollIntoView — 자동 스크롤 */}
      <Document.Heading2>
        <InlineCode>scrollIntoView</InlineCode> — 자동 스크롤
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        스크롤되는 컨테이너에서 <InlineCode>scrollIntoView</InlineCode>를 켜면 이동한 아이템이 보이도록 자동으로 스크롤돼요.{" "}
        <InlineCode>true</InlineCode>를 넘기면 <InlineCode>{`{ block: "nearest" }`}</InlineCode>로 동작하고,{" "}
        <InlineCode>ScrollIntoViewOptions</InlineCode> 객체를 넘기면 <InlineCode>behavior</InlineCode>, <InlineCode>block</InlineCode> 등을
        직접 제어할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ScrollIntoViewDemo />
      </PreviewContainer>
      <CodeBlock code={SCROLL_INTO_VIEW_DEMO_CODE} className="mb-8" />

      {/* onUnderflow / onOverflow — 경계 콜백 */}
      <Document.Heading2>
        <InlineCode>onUnderflow</InlineCode> / <InlineCode>onOverflow</InlineCode> — 경계 감지
      </Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>loop</InlineCode>가 꺼져 있을 때 첫 아이템에서 이전 방향으로 이동을 시도하면 <InlineCode>onUnderflow</InlineCode>,
        마지막 아이템에서 다음 방향으로 이동을 시도하면 <InlineCode>onOverflow</InlineCode>가 호출돼요. 이전/다음 페이지로 넘어가거나 다른
        그룹으로 포커스를 옮기는 등의 연계 동작을 구현할 때 사용할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <BoundaryCallbackDemo />
      </PreviewContainer>
      <CodeBlock code={BOUNDARY_CALLBACK_DEMO_CODE} className="mb-8" />

      {/* 플레이그라운드 */}
      <Document.Heading2>플레이그라운드</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>orientation</InlineCode>, <InlineCode>loop</InlineCode>, <InlineCode>colSkipCount</InlineCode>,{" "}
        <InlineCode>clickOnNavigate</InlineCode>, <InlineCode>scrollIntoView</InlineCode>, <InlineCode>enableHome</InlineCode>,{" "}
        <InlineCode>enableEnd</InlineCode>를 실시간으로 바꿔가며 키보드 내비게이션 동작을 확인해 보세요. 아이템 수를 조절하면
        MutationObserver가 아이템 추가/제거를 감지하는 동작도, 이벤트 로그에서는 <InlineCode>onNavigate</InlineCode> /{" "}
        <InlineCode>onUnderflow</InlineCode> / <InlineCode>onOverflow</InlineCode> 콜백이 호출되는 시점도 확인할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <OptionsPlaygroundDemo />
      </PreviewContainer>
      <CodeBlock code={OPTIONS_PLAYGROUND_DEMO_CODE} />
    </section>
  );
};

export default OptionsSection;
