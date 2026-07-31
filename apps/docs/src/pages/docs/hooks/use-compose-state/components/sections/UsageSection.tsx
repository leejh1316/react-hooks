import { CodeBlock, PreviewContainer } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import ComposedStateDemo, { COMPOSED_STATE_DEMO_CODE } from "../demos/ComposedStateDemo";
import FunctionalUpdateDemo, { FUNCTIONAL_UPDATE_DEMO_CODE } from "../demos/FunctionalUpdateDemo";
import NoComposedStateDemo, { NO_COMPOSED_STATE_DEMO_CODE } from "../demos/NoComposedStateDemo";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const UsageSection = () => {
  return (
    <section>
      <Document.Heading1>사용 방법</Document.Heading1>
      <Document.Paragraph mb={8}>
        합성할 setter들을 <InlineCode>useComposedState</InlineCode>에 순서대로 전달하고, 반환된 setter를 기존 setter 대신 호출하면 돼요.
        아래 두 데모는 주문 수량을 세 개의 상태(주문 요약 / 미리보기 / 최근 선택)로 나눠 관리하는 같은 화면을, 훅 미적용과 적용으로 각각
        구현한 예시예요.
      </Document.Paragraph>

      {/* 미적용 데모 */}
      <Document.Heading2>setter를 직접 나열해 호출하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        훅을 적용하지 않았을 때의 동작을 보여주는 예시예요. <InlineCode>수량 +1</InlineCode> 버튼은 setter 3개를 모두 호출하지만,{" "}
        <InlineCode>초기화</InlineCode> 버튼은 <InlineCode>setLastQuantity</InlineCode> 호출이 빠져 있어요. 초기화를 눌러 값이 어긋나는 것을
        확인해 보세요. 이렇게 갱신 지점이 늘어날수록 호출부마다 setter를 빠짐없이 나열해야 하고, 하나만 빠뜨려도 상태가 어긋나요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <NoComposedStateDemo />
      </PreviewContainer>
      <CodeBlock code={NO_COMPOSED_STATE_DEMO_CODE} className="mb-8" />

      {/* 적용 데모 */}
      <Document.Heading2>useComposedState 적용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        같은 화면에 <InlineCode>useComposedState</InlineCode>를 적용한 예시예요. 세 개의 setter를 한 번 합성해 두면 호출부에서는 합성된{" "}
        <InlineCode>setQuantity</InlineCode>만 호출하면 되므로, 갱신 지점이 늘어나도 호출 누락이 생기지 않아요. 버튼을 아무리 눌러도 세
        상태의 값이 항상 같게 유지되는 것을 확인할 수 있어요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <ComposedStateDemo />
      </PreviewContainer>
      <CodeBlock code={COMPOSED_STATE_DEMO_CODE} className="mb-8" />

      {/* 기본 사용법 */}
      <Document.Heading2>여러 상태를 하나의 setter로 갱신하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 단순한 사용 예시예요. 합성할 setter들을 인자로 나열하기만 하면 되고, 별도의 옵션 객체는 없어요. 합성한 setter들은 모두 같은
        상태 타입(<InlineCode>S</InlineCode>)을 공유해야 하며, 타입은 전달한 setter들로부터 자동으로 추론돼요. 반환된 setter는{" "}
        <InlineCode>useState</InlineCode>의 setter와 똑같이 동작하므로, 기존 setter를 쓰던 자리에 그대로 바꿔 넣을 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={BASIC_USAGE_CODE} className="mb-8" />

      {/* 함수형 업데이트 데모 */}
      <Document.Heading2>직접 값과 함수형 업데이트 구분하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        <InlineCode>setState(next)</InlineCode>처럼 직접 값을 전달하면 합성된 모든 상태가 같은 값이 되지만,{" "}
        <InlineCode>setState((prev) =&gt; next)</InlineCode>처럼 함수를 전달하면 각 setter가 자신의 이전 값에 함수를 적용해요. 아래 데모에서{" "}
        <InlineCode>A만 +3</InlineCode>으로 두 상태의 값을 어긋뜨린 뒤 두 버튼을 각각 눌러 보세요. 함수형 업데이트는 어긋난 차이를 그대로
        유지한 채 각자 +1 되고, 직접 값은 두 상태를 같은 값으로 맞춰요.
      </Document.Paragraph>
      <PreviewContainer className="mb-4">
        <FunctionalUpdateDemo />
      </PreviewContainer>
      <CodeBlock code={FUNCTIONAL_UPDATE_DEMO_CODE} className="mb-8" />

      {/* 외부 상태와 내부 상태 합성 */}
      <Document.Heading2>외부 상태와 내부 상태 함께 갱신하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        가장 대표적인 사용 사례예요. 부모가 소유한 상태의 setter를 props로 전달받아 컴포넌트 내부 상태의 setter와 합성하면, 컴포넌트
        안에서는 setter 하나만 호출해도 부모와 내부 상태가 함께 갱신돼요. props로 받은 setter는 렌더링마다 참조가 바뀔 수 있지만, 훅이
        setter 목록을 항상 최신으로 유지하므로 안심하고 전달해도 돼요.
      </Document.Paragraph>
      <CodeBlock code={EXTERNAL_STATE_CODE} className="mb-8" />

      {/* 고정된 참조 활용 */}
      <Document.Heading2>의존성 배열에서 활용하기</Document.Heading2>
      <Document.Paragraph mb={6}>
        반환된 setter는 컴포넌트가 살아 있는 동안 항상 같은 참조를 유지해요. 그래서 <InlineCode>useEffect</InlineCode>나{" "}
        <InlineCode>useCallback</InlineCode>의 의존성 배열에 넣어도 effect가 다시 실행되지 않고, <InlineCode>memo</InlineCode>로 감싼 자식
        컴포넌트에 props로 넘겨도 불필요한 리렌더링을 만들지 않아요.
      </Document.Paragraph>
      <CodeBlock code={STABLE_REFERENCE_CODE} className="mb-8" />

      {/* 동적 setter 목록 */}
      <Document.Heading2>조건에 따라 setter 목록 바꾸기</Document.Heading2>
      <Document.Paragraph mb={6}>
        setter 목록을 의존성 배열로 사용하지 않고 매 렌더링마다 최신 값으로 갱신하기 때문에, 렌더링마다 setter의 개수나 순서가 달라져도
        괜찮아요. 조건에 따라 합성 대상을 켜고 끄는 식으로 사용할 수 있어요.
      </Document.Paragraph>
      <CodeBlock code={DYNAMIC_SETTERS_CODE} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const BASIC_USAGE_CODE = `import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

function Counter() {
  const [count, setCount] = useState(0);
  const [mirroredCount, setMirroredCount] = useState(0);

  // 합성할 setter들을 나열하면 하나의 setter가 만들어져요.
  // 상태 타입 S는 전달한 setter들로부터 자동으로 추론돼요. (여기서는 number)
  const setBothCount = useComposedState(setCount, setMirroredCount);

  return (
    <>
      <p>{count} / {mirroredCount}</p>

      {/* 직접 값 — 두 상태 모두 10이 돼요. */}
      <button onClick={() => setBothCount(10)}>10으로 설정</button>

      {/* 함수형 업데이트 — 두 상태 모두 자신의 이전 값 + 1이 돼요. */}
      <button onClick={() => setBothCount((prev) => prev + 1)}>+1 증가</button>
    </>
  );
}`;

const EXTERNAL_STATE_CODE = `import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";

type KeywordFieldProps = {
  // 부모가 useState로 만든 setter를 그대로 내려줘요.
  onKeywordChange: React.Dispatch<React.SetStateAction<string>>;
};

function KeywordField({ onKeywordChange }: KeywordFieldProps) {
  const [draft, setDraft] = useState("");

  // 부모의 상태와 내부 상태를 하나의 setter로 합성해요.
  const setKeyword = useComposedState(onKeywordChange, setDraft);

  return (
    <>
      {/* 한 번의 호출로 부모 상태와 내부 상태가 함께 갱신돼요. */}
      <input value={draft} onChange={(event) => setKeyword(event.target.value)} />
      <button onClick={() => setKeyword("")}>지우기</button>
    </>
  );
}

function SearchPage() {
  const [keyword, setKeyword] = useState("");

  return <KeywordField onKeywordChange={setKeyword} />;
}`;

const STABLE_REFERENCE_CODE = `const setStep = useComposedState(setCurrentStep, setProgressStep);

// setStep의 참조가 고정되어 있어 effect가 다시 실행되지 않아요.
useEffect(() => {
  const timer = setInterval(() => setStep((prev) => prev + 1), 1000);
  return () => clearInterval(timer);
}, [setStep]);

// memo 컴포넌트에 넘겨도 불필요한 리렌더링이 발생하지 않아요.
return <StepController onStepChange={setStep} />;`;

const DYNAMIC_SETTERS_CODE = `const [volume, setVolume] = useState(50);
const [mirroredVolume, setMirroredVolume] = useState(50);

// setter 목록은 의존성 배열이 아니라 최신 값으로 유지되는 ref에 담기므로,
// 렌더링마다 개수나 순서가 달라져도 호출 시점의 최신 목록이 사용돼요.
const setAllVolume = useComposedState(...(isMirrored ? [setVolume, setMirroredVolume] : [setVolume]));`;

export default UsageSection;
