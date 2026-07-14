import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { RATING_COMPONENT_CODE } from "../demos/ControllableRating";
import ControlledRatingDemo from "../demos/ControlledRatingDemo";
import NoControllableRatingDemo from "../demos/NoControllableRatingDemo";
import UncontrolledRatingDemo from "../demos/UncontrolledRatingDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        useControllableState 적용 전후의 차이를 별점(Rating) 컴포넌트로 비교해 보세요. 미적용 컴포넌트는 부모 상태와 별점이 서로 어긋나지만,
        적용 컴포넌트는 props 구성만 바꿔서 비제어 모드와 제어 모드를 모두 지원해요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>useControllableState 없이 사용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>value</InlineCode> prop을 <InlineCode>useState</InlineCode>의 초기값으로만 사용한 예시예요. 별을 클릭해도 부모 상태는 그대로
        0점이고, 반대로 아래 버튼으로 부모 상태를 바꿔도 별점은 움직이지 않아요. prop이 마운트 시점의 초기값으로만 쓰이기 때문에 부모가 값을
        제어할 방법이 없고, 두 상태가 서로 어긋나요.
      </Document.Paragraph>
      <PreviewContainer className="mb-8">
        <NoControllableRatingDemo />
      </PreviewContainer>

      {/* 적용 — 컴포넌트 만들기 */}
      <Document.Heading2>useControllableState 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 별점 컴포넌트에 useControllableState를 적용한 예시예요. 훅에 <InlineCode>value</InlineCode>,{" "}
        <InlineCode>defaultValue</InlineCode>, <InlineCode>onChange</InlineCode>를 그대로 전달하면, 사용하는 쪽에서{" "}
        <InlineCode>value</InlineCode>를 넘기는지에 따라 제어/비제어 모드가 자동으로 결정돼요. 컴포넌트 내부 코드는 모드와 무관하게{" "}
        <InlineCode>useState</InlineCode>를 쓰듯 <InlineCode>[rating, setRating]</InlineCode>만 다루면 돼요.
      </Document.Paragraph>
      <CodeBlock code={RATING_COMPONENT_CODE} className="mb-8" />

      {/* 적용 데모 — 비제어 모드 */}
      <Document.Heading3>비제어 모드로 사용하기</Document.Heading3>
      <Document.Paragraph mb={6}>
        <InlineCode>value</InlineCode> 없이 <InlineCode>defaultValue</InlineCode>만 전달하면 컴포넌트가 내부 상태로 값을 관리해요. 부모는
        상태를 소유하지 않고도 <InlineCode>onChange</InlineCode>로 변경 사항만 전달받을 수 있어요. 같은 별점을 다시 클릭하면 값이 변하지
        않았으므로 onChange가 호출되지 않아요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <UncontrolledRatingDemo />
      </PreviewContainer>
      <CodeBlock code={UNCONTROLLED_USAGE_CODE} className="mb-8" />

      {/* 적용 데모 — 제어 모드 */}
      <Document.Heading3>제어 모드로 사용하기</Document.Heading3>
      <Document.Paragraph mb={6}>
        <InlineCode>value</InlineCode>와 <InlineCode>onChange</InlineCode>를 함께 전달하면 부모가 상태를 소유하는 제어 모드로 동작해요. 별을
        클릭하면 onChange를 통해 부모 상태가 갱신되고, 반대로 외부 버튼으로 부모 상태를 바꾸면 별점에 즉시 반영돼요. 여기서도 같은 별점을 다시
        클릭하면 onChange 호출 횟수가 늘어나지 않는 것을 확인할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ControlledRatingDemo />
      </PreviewContainer>
      <CodeBlock code={CONTROLLED_USAGE_CODE} className="mb-8" />

      {/* 함수형 업데이트 & lazy 초기화 */}
      <Document.Heading2>함수형 업데이트와 lazy 초기화</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>useState</InlineCode>와 마찬가지로 <InlineCode>setValue((prev) =&gt; next)</InlineCode> 형태의 업데이트 함수를 지원하고,{" "}
        <InlineCode>defaultValue</InlineCode>에 함수를 전달하면 첫 렌더에서 한 번만 실행되는 lazy 초기화로 동작해요. 초기값 계산 비용이 큰
        경우 유용해요.
      </Document.Paragraph>
      <CodeBlock code={UPDATER_USAGE_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const UNCONTROLLED_USAGE_CODE = `// 비제어 모드 — 컴포넌트가 스스로 상태를 관리해요.
<Rating defaultValue={3} onChange={(value) => console.log("변경됨:", value)} />`;

const CONTROLLED_USAGE_CODE = `function ReviewForm() {
  const [rating, setRating] = useState(0);

  return (
    <>
      {/* 제어 모드 — 부모가 상태를 소유하고, 별 클릭은 onChange로 전달돼요. */}
      <Rating value={rating} onChange={setRating} />

      {/* 외부에서 부모 상태를 바꾸면 별점에 즉시 반영돼요. */}
      <button onClick={() => setRating(0)}>초기화</button>
    </>
  );
}`;

const UPDATER_USAGE_CODE = `const [count, setCount] = useControllableState({
  // 함수를 전달하면 첫 렌더에서 한 번만 실행돼요 (lazy 초기화).
  defaultValue: () => computeExpensiveInitialValue(),
  onChange: (value) => console.log("변경됨:", value),
});

// 업데이트 함수를 사용할 수 있어요. prev에는 현재 최신 값이 전달돼요.
setCount((prev) => prev + 1);`;

export default UsageSection;
