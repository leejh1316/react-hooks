import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import NoThrottleDemo from "../demos/NoThrottleDemo";
import ThrottleDemo, { THROTTLE_DEMO_CODE } from "../demos/ThrottleDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        스로틀 적용 전후의 차이를 직접 비교해 보세요. 미적용 데모는 마우스가 움직일 때마다 핸들러가 그대로 실행되지만, 적용 데모는
        이벤트가 아무리 자주 발생해도 핸들러가 500ms당 최대 한 번만 실행됩니다.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>스로틀 미적용</Document.Heading2>
      <Document.Paragraph mb={6}>
        영역 안에서 마우스를 움직여 보세요. <InlineCode>mousemove</InlineCode> 이벤트가 발생할 때마다 핸들러가 실행되어 이벤트 발생
        횟수와 핸들러 실행 횟수가 동일하게 증가합니다.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoThrottleDemo />
      </PreviewContainer>

      {/* 적용 데모 */}
      <Document.Heading2>스로틀 적용</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 동작이지만 핸들러를 <InlineCode>useThrottle</InlineCode>로 감쌌습니다. 이벤트 발생 횟수는 계속 증가해도 핸들러 실행 횟수는
        500ms당 한 번씩만 늘어납니다. <InlineCode>cancel</InlineCode> 버튼으로 대기 중인 trailing 호출을 취소하거나,{" "}
        <InlineCode>flush</InlineCode> 버튼으로 기다리지 않고 즉시 실행할 수 있습니다.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ThrottleDemo />
      </PreviewContainer>
      <CodeBlock code={THROTTLE_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>기본 사용법</Document.Heading2>
      <Document.Paragraph mb={6}>
        스로틀링할 함수와 제한 시간(<InlineCode>wait</InlineCode>, ms)을 전달하면 <InlineCode>throttle</InlineCode> 함수를 반환합니다.
        원본 함수 대신 <InlineCode>throttle</InlineCode>을 호출하세요. 인자는 원본 함수로 그대로 전달되며, trailing 실행 시에는 제한
        시간 동안 마지막으로 전달된 인자가 사용됩니다.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* leading / trailing 옵션 */}
      <Document.Heading2>
        <InlineCode>leading</InlineCode> / <InlineCode>trailing</InlineCode> 옵션
      </Document.Heading2>
      <Document.Paragraph>
        세 번째 인자로 옵션 객체를 전달해 실행 시점을 제어할 수 있습니다. 두 옵션 모두 기본값은 <InlineCode>true</InlineCode>입니다.
        단, 둘 다 <InlineCode>false</InlineCode>로 지정하면 원본 함수가 전혀 실행되지 않으므로 주의하세요.
      </Document.Paragraph>

      <Document.Heading3>
        방법 1. <InlineCode>{`{ trailing: false }`}</InlineCode> — 첫 호출만 즉시 실행
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        첫 호출은 즉시 실행하고, 제한 시간 동안 발생한 나머지 호출은 모두 무시합니다. 버튼 연타 방지처럼 "즉시 반응하되 반복은 막고
        싶을 때" 적합합니다.
      </Document.Paragraph>
      <CodeBlock code={LEADING_ONLY_CODE} className="mb-8" />

      <Document.Heading3>
        방법 2. <InlineCode>{`{ leading: false }`}</InlineCode> — 마지막 호출만 지연 실행
      </Document.Heading3>
      <Document.Paragraph mb={6}>
        첫 호출을 즉시 실행하지 않고, 제한 시간이 지난 뒤 마지막 호출만 실행합니다. 스크롤이 진행되는 동안이 아니라 일정 간격으로
        최종 상태를 반영하고 싶을 때 적합합니다.
      </Document.Paragraph>
      <CodeBlock code={TRAILING_ONLY_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  // scrollY 반영이 200ms당 최대 한 번으로 제한됩니다.
  const { throttle } = useThrottle((y: number) => setScrollY(y), 200);

  return (
    <div onScroll={(e) => throttle(e.currentTarget.scrollTop)} style={{ height: 300, overflowY: "scroll" }}>
      <p>스크롤 위치: {scrollY}px</p>
      <div style={{ height: 2000 }} />
    </div>
  );
}`;

const LEADING_ONLY_CODE = `const { throttle } = useThrottle(submit, 1000, { trailing: false });

// 첫 클릭은 즉시 실행되고, 이후 1초 동안의 클릭은 모두 무시됩니다.
<button onClick={() => throttle()}>제출</button>;`;

const TRAILING_ONLY_CODE = `const { throttle } = useThrottle((y: number) => setScrollY(y), 200, { leading: false });

// 즉시 실행되지 않고, 200ms가 지난 뒤 마지막 호출의 인자로 실행됩니다.
window.addEventListener("scroll", () => throttle(window.scrollY));`;

export default UsageSection;
