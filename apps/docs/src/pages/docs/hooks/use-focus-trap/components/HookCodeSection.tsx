import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { GET_FOCUSABLE_ELEMENTS_CODE, HOOK_SOURCE_CODE } from "../constants/code";

const HookCodeSection = () => {
  return (
    <section>
      <Document.Heading1>훅 코드</Document.Heading1>
      <Document.Paragraph>
        <InlineCode>useFocusTrap</InlineCode>의 전체 구현입니다. callback ref가 연결될 때 초기 포커스 → <InlineCode>MutationObserver</InlineCode>{" "}
        관찰 시작 → <InlineCode>keydown</InlineCode> 리스너 등록 순으로 트랩을 구성하고, ref가 해제될 때 리스너와 observer를 정리한 뒤
        이전 포커스를 복원합니다.
      </Document.Paragraph>
      <CodeBlock code={HOOK_SOURCE_CODE} />

      <Document.Heading2>getFocusableElements (내부 유틸)</Document.Heading2>
      <Document.Paragraph>
        포커스 가능 요소를 판별하는 내부 유틸입니다. 1단계로 CSS 셀렉터(<InlineCode>querySelectorAll</InlineCode>)로 후보를 수집하고,
        2단계로 <InlineCode>inert</InlineCode>, <InlineCode>aria-hidden</InlineCode>, <InlineCode>hidden</InlineCode>(자신 또는 조상),{" "}
        <InlineCode>display: none</InlineCode> / <InlineCode>visibility: hidden</InlineCode>, <InlineCode>aria-disabled</InlineCode>{" "}
        조건으로 추가 필터링합니다. 이 함수는 패키지 외부로 export 되지 않습니다.
      </Document.Paragraph>
      <CodeBlock code={GET_FOCUSABLE_ELEMENTS_CODE} language="ts" />
    </section>
  );
};

export default HookCodeSection;
