import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import ComposedRefsDemo, { COMPOSED_REFS_DEMO_CODE } from "../demos/ComposedRefsDemo";
import ForwardRefDemo, { FORWARD_REF_DEMO_CODE } from "../demos/ForwardRefDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        병합할 ref들을 <InlineCode>useComposedRefs</InlineCode>에 순서대로 전달하고, 반환된 callback ref를 엘리먼트의{" "}
        <InlineCode>ref</InlineCode> 속성에 연결하면 돼요. 객체형 ref와 함수형 ref를 자유롭게 섞을 수 있어요.
      </Document.Paragraph>

      {/* 여러 ref 병합 데모 */}
      <Document.Heading2>여러 ref를 하나로 병합하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        객체형 ref와 함수형 ref를 하나의 input에 함께 연결한 예시예요. <InlineCode>objectRef로 포커스</InlineCode> 버튼은 객체형 ref가
        엘리먼트를 잘 받았다는 것을, 측정된 너비와 연결 로그는 함수형 ref가 같은 엘리먼트를 받았다는 것을 보여줘요.{" "}
        <InlineCode>마운트 해제</InlineCode> 버튼을 누르면 함수형 ref에 <InlineCode>null</InlineCode>이 전달되며 정리되는 것도 확인할 수
        있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ComposedRefsDemo />
      </PreviewContainer>
      <CodeBlock code={COMPOSED_REFS_DEMO_CODE} className="mb-8" />

      {/* forwardRef 데모 */}
      <Document.Heading2>forwardRef와 함께 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 대표적인 사용 사례예요. 재사용 컴포넌트가 부모에게서 ref를 전달받으면서(<InlineCode>forwardRef</InlineCode>) 내부 동작을 위한
        자체 ref도 필요할 때, 두 ref를 병합해 하나의 엘리먼트에 연결해요. 아래 데모에서 <InlineCode>지우기</InlineCode> 버튼은 컴포넌트
        내부 ref를, <InlineCode>부모 ref로 포커스 / 값 읽기</InlineCode> 버튼은 부모가 전달한 ref를 사용하지만 모두 같은 input을 가리켜요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ForwardRefDemo />
      </PreviewContainer>
      <CodeBlock code={FORWARD_REF_DEMO_CODE} className="mb-8" />

      {/* React 19 cleanup */}
      <Document.Heading2>React 19 cleanup 함수와 함께 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        React 19부터 callback ref는 cleanup 함수를 반환할 수 있어요. <InlineCode>useComposedRefs</InlineCode>는 각 ref가 반환한 cleanup을
        기억해 두었다가 엘리먼트가 해제될 때 실행해 줘요. cleanup을 반환하지 않은 ref는 기존 방식대로 <InlineCode>null</InlineCode>로
        초기화되므로, cleanup을 쓰는 ref와 쓰지 않는 ref를 섞어도 각각 올바르게 정리돼요.
      </Document.Paragraph>
      <CodeBlock code={CLEANUP_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const CLEANUP_CODE = `import { useCallback, useRef } from "react";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";

function ResizeObserverBox() {
  const objectRef = useRef<HTMLDivElement>(null);

  // React 19: callback ref가 cleanup 함수를 반환할 수 있어요.
  const observeRef = useCallback((el: HTMLDivElement) => {
    const observer = new ResizeObserver(([entry]) => {
      console.log("크기 변경:", entry.contentRect);
    });
    observer.observe(el);

    // 엘리먼트가 해제될 때 cleanup이 실행돼요.
    return () => observer.disconnect();
  }, []);

  // observeRef의 cleanup은 실행되고, objectRef는 null로 초기화돼요.
  const composedRef = useComposedRefs(objectRef, observeRef);

  return <div ref={composedRef}>크기를 관찰하는 박스</div>;
}`;

export default UsageSection;
