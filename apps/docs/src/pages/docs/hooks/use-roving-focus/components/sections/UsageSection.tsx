import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import BasicRovingFocusDemo, { BASIC_ROVING_FOCUS_DEMO_CODE } from "../demos/BasicRovingFocusDemo";
import NoRovingFocusDemo from "../demos/NoRovingFocusDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        roving tabindex 적용 전후의 차이를 직접 비교해 보세요. 미적용 목록은 모든 항목이 Tab 스톱이라 목록을 통과하려면 항목 수만큼 Tab을
        눌러야 하지만, 적용 목록은 Tab 한 번으로 통과하고 내부 이동은 방향키로 해요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>Roving focus 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        useRovingFocus를 적용하지 않았을 때의 동작을 보여주는 예시예요. 메뉴 첫 항목을 클릭한 뒤 <InlineCode>Tab</InlineCode>을 계속
        눌러보세요. 모든 항목이 Tab 스톱이라 아래 액션 버튼까지 가려면 항목 수만큼 Tab을 눌러야 하고, 방향키는 동작하지 않아요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoRovingFocusDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>Roving focus 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 메뉴에 useRovingFocus를 적용한 예시예요. 항목을 클릭한 뒤 <InlineCode>↑</InlineCode> / <InlineCode>↓</InlineCode>로 이동해
        보세요. disabled 항목은 자동으로 건너뛰고, <InlineCode>loop</InlineCode>가 켜져 있어 끝에서 반대쪽으로 순환하며,{" "}
        <InlineCode>Home</InlineCode> / <InlineCode>End</InlineCode>로 양 끝 항목에 즉시 이동할 수 있어요. <InlineCode>Tab</InlineCode>을
        누르면 목록 전체를 한 번에 빠져나가 아래 액션 버튼으로 이동해요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <BasicRovingFocusDemo />
      </PreviewContainer>
      <CodeBlock code={BASIC_ROVING_FOCUS_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>컨테이너와 아이템 연결하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 훅이 반환하는 <InlineCode>containerRef</InlineCode>와 <InlineCode>handleKeyDown</InlineCode>을 컨테이너
        요소에 연결하고, 내비게이션 대상이 될 각 아이템에 <InlineCode>data-roving-item</InlineCode> 속성을 추가하면 돼요. 다른 속성을
        사용하고 싶다면 <InlineCode>itemSelector</InlineCode> 옵션으로 CSS 선택자를 바꿀 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function Toolbar() {
  // 옵션 없이 호출하면 ←/→/↑/↓ 모두 사용하는 1차원 이동으로 동작해요.
  const { containerRef, handleKeyDown } = useRovingFocus();

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="toolbar">
      <button data-roving-item>굵게</button>
      <button data-roving-item>기울임</button>
      <button data-roving-item>밑줄</button>
    </div>
  );
}

// 커스텀 선택자를 사용하는 경우
const { containerRef, handleKeyDown } = useRovingFocus({
  itemSelector: "[role='menuitem']",
});`;

export default UsageSection;
