import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import FocusTrapDemo, { FOCUS_TRAP_DEMO_CODE } from "../demos/FocusTrapDemo";
import NoFocusTrapDemo from "../demos/NoFocusTrapDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        포커스 트랩 적용 전후의 차이를 직접 비교해 보세요. 미적용 다이얼로그는 Tab 포커스가 다이얼로그 밖으로 벗어나지만, 적용 다이얼로그는
        포커스가 내부에서만 순환하고 닫으면 이전 포커스가 복원돼요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>포커스 트랩 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        포커스 트랩을 적용하지 않았을 때의 동작을 보여주는 예시예요. 다이얼로그를 연 뒤 <InlineCode>Tab</InlineCode>을 계속 눌러보세요.
        포커스가 다이얼로그를 벗어나 페이지의 다른 요소로 이동하고, 다이얼로그를 닫아도 이전 포커스가 복원되지 않아요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoFocusTrapDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>포커스 트랩 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 다이얼로그에 useFocusTrap을 적용한 예시예요. 다이얼로그를 연 뒤 <InlineCode>Tab</InlineCode> /{" "}
        <InlineCode>Shift+Tab</InlineCode>을 눌러보세요. 포커스가 다이얼로그 내부에서만
        순환해요. 이름 입력에 <InlineCode>data-initial-focus</InlineCode>가 지정되어 있어 열리는 즉시 이름 입력으로 포커스가 이동하고,
        다이얼로그를 닫으면 "다이얼로그 열기" 버튼으로 포커스가 복원돼요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <FocusTrapDemo />
      </PreviewContainer>
      <CodeBlock code={FOCUS_TRAP_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>컨테이너에 포커스 가두기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 훅이 반환하는 callback ref를 포커스를 가둘 컨테이너 요소의 <InlineCode>ref</InlineCode>에 연결하면
        돼요. 컨테이너가 마운트되는 순간
        트랩이 활성화되고, 조건부 렌더링 등으로 컨테이너가 DOM에서 제거되면 트랩이 해제되면서 이전 포커스가 복원돼요.{" "}
        <InlineCode>display: none</InlineCode>으로 숨기는 방식은 트랩이 해제되지 않으므로, 반드시 컨테이너 자체를 조건부 렌더링해야 해요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 초기 포커스 지정 */}
      <Document.Heading2>초기 포커스 지정하기</Document.Heading2>
      <Document.Paragraph>
        트랩이 활성화될 때 처음 포커스할 요소를 두 가지 방법으로 지정할 수 있어요. 지정하지 않으면 컨테이너 내 첫 번째 포커스 가능 요소에,
        포커스 가능 요소가 하나도 없으면 컨테이너 자체에 포커스돼요.
      </Document.Paragraph>

      <Document.Heading3>
        <InlineCode>data-initial-focus</InlineCode> 속성 사용하기
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        <InlineCode>data-initial-focus</InlineCode> 속성을 사용해서 초기 포커스 대상을 지정할 수 있어요. 기본 선택자가{" "}
        <InlineCode>[data-initial-focus]</InlineCode>이므로, 원하는 요소에 속성만 추가하면 돼요.
      </Document.Paragraph>
      <CodeBlock code={INITIAL_FOCUS_ATTRIBUTE_CODE} className="mb-8" />

      <Document.Heading3>
        <InlineCode>initialFocusSelector</InlineCode> 옵션 사용하기
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        <InlineCode>initialFocusSelector</InlineCode> 옵션을 사용해서 임의의 CSS 선택자로 초기 포커스 대상을 지정할 수도 있어요.
      </Document.Paragraph>
      <CodeBlock code={INITIAL_FOCUS_SELECTOR_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const containerRef = useFocusTrap();

  // 컨테이너가 DOM에서 제거되어야 트랩이 해제되고 이전 포커스가 복원돼요.
  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      <h2>모달 제목</h2>
      <input type="text" placeholder="이름" />
      <button onClick={onClose}>닫기</button>
    </div>
  );
}`;

const INITIAL_FOCUS_ATTRIBUTE_CODE = `const containerRef = useFocusTrap();

<div ref={containerRef} role="dialog">
  <input type="text" />
  {/* data-initial-focus 속성이 있는 요소에 먼저 포커스돼요 */}
  <button data-initial-focus>여기에 먼저 포커스</button>
</div>;`;

const INITIAL_FOCUS_SELECTOR_CODE = `const containerRef = useFocusTrap({ initialFocusSelector: "#confirm-button" });

<div ref={containerRef} role="dialog">
  <input type="text" />
  <button id="confirm-button">확인</button>
</div>;`;

export default UsageSection;
