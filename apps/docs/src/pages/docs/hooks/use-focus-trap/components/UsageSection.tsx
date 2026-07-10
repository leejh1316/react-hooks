import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { BASIC_USAGE_CODE, INITIAL_FOCUS_ATTRIBUTE_CODE, INITIAL_FOCUS_SELECTOR_CODE } from "../constants/code";

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph>
        훅이 반환하는 callback ref를 포커스를 가둘 컨테이너 요소의 <InlineCode>ref</InlineCode>에 연결하세요. 컨테이너가 마운트되는
        순간 트랩이 활성화되고, 조건부 렌더링 등으로 컨테이너가 DOM에서 제거되면 트랩이 해제되면서 이전 포커스가 복원됩니다.{" "}
        <InlineCode>display: none</InlineCode>으로 숨기는 방식은 트랩이 해제되지 않으므로, 반드시 컨테이너 자체를 조건부 렌더링해야
        합니다.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} />

      <Document.Heading2>초기 포커스 지정</Document.Heading2>
      <Document.Paragraph>
        트랩이 활성화될 때 처음 포커스할 요소를 두 가지 방법으로 지정할 수 있습니다. 지정하지 않으면 컨테이너 내 첫 번째 포커스 가능
        요소에, 포커스 가능 요소가 하나도 없으면 컨테이너 자체에 포커스됩니다.
      </Document.Paragraph>

      <Document.Heading3>
        방법 1. <InlineCode>data-initial-focus</InlineCode> 속성
      </Document.Heading3>
      <Document.Paragraph>
        기본 선택자가 <InlineCode>[data-initial-focus]</InlineCode>이므로, 원하는 요소에 속성만 추가하면 됩니다.
      </Document.Paragraph>
      <CodeBlock code={INITIAL_FOCUS_ATTRIBUTE_CODE} />

      <Document.Heading3>
        방법 2. <InlineCode>initialFocusSelector</InlineCode> 옵션
      </Document.Heading3>
      <Document.Paragraph>임의의 CSS 선택자를 옵션으로 전달해 초기 포커스 대상을 지정할 수 있습니다.</Document.Paragraph>
      <CodeBlock code={INITIAL_FOCUS_SELECTOR_CODE} />
    </section>
  );
};

export default UsageSection;
