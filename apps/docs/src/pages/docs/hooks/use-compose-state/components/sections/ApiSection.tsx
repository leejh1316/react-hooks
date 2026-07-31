import {
  BehaviorTable,
  CodeBlock,
  ParameterTable,
  ReturnTable,
  type BehaviorTableRow,
  type ParameterTableRow,
  type ReturnTableRow,
} from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const ApiSection = () => {
  return (
    <section>
      <Document.Heading1>API</Document.Heading1>
      <Document.Paragraph mb={6}>
        패키지는 <InlineCode>useComposedState</InlineCode> 훅 하나를 named export 해요. 패키지 이름은{" "}
        <InlineCode>use-compose-state</InlineCode>지만 훅 이름은 <InlineCode>useComposedState</InlineCode>라는 점에 주의하세요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph mb={4}>
        <InlineCode>useState</InlineCode>의 setter와 동일한 타입(
        <InlineCode>React.Dispatch&lt;React.SetStateAction&lt;S&gt;&gt;</InlineCode>
        )을 반환해요. 빈 의존성 배열의 <InlineCode>useCallback</InlineCode>으로 만들어지므로 컴포넌트가 살아 있는 동안 참조가 바뀌지 않아요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />

      {/* 옵션 */}
      <Document.Heading2>옵션</Document.Heading2>
      <Document.Paragraph mb={4}>
        이 훅은 별도의 옵션 객체를 받지 않아요. 동작을 조절하는 축은 <InlineCode>합성할 setter 목록</InlineCode>과{" "}
        <InlineCode>반환된 setter에 전달하는 인자의 형태</InlineCode> 두 가지뿐이에요.
      </Document.Paragraph>

      <Document.Heading3>합성할 setter 목록</Document.Heading3>
      <Document.Paragraph mb={4}>
        인자로 나열한 setter가 곧 합성 대상이에요. 개수 제한이 없고, <InlineCode>useState</InlineCode>의 setter뿐 아니라{" "}
        <InlineCode>React.Dispatch&lt;React.SetStateAction&lt;S&gt;&gt;</InlineCode> 타입을 만족하는 함수라면 무엇이든 전달할 수 있어요.
        전달한 순서대로 호출되며, 인자를 하나도 전달하지 않으면 아무 일도 하지 않는 setter가 반환돼요.
      </Document.Paragraph>

      <Document.Heading3>
        setState 인자 — <InlineCode>React.SetStateAction&lt;S&gt;</InlineCode>
      </Document.Heading3>
      <Document.Paragraph mb={4}>반환된 setter에 전달하는 값의 형태에 따라 합성된 상태들이 갱신되는 방식이 달라져요.</Document.Paragraph>
      <BehaviorTable rows={SET_STATE_ACTION_ROWS} className="mb-6" />
      <CodeBlock code={SET_STATE_ACTION_CODE} />

      {/* 주의사항 */}
      <Document.Heading2>주의사항</Document.Heading2>

      <Document.Heading3>모든 setter는 같은 상태 타입을 공유해야 해요</Document.Heading3>
      <Document.Paragraph mb={4}>
        제네릭 <InlineCode>S</InlineCode>는 하나뿐이므로 서로 다른 타입의 상태를 합성할 수는 없어요. 타입이 다른 상태를 함께 갱신해야 한다면
        상태를 하나의 객체로 합치거나, 훅을 타입별로 나누어 사용하세요.
      </Document.Paragraph>

      <Document.Heading3>SetStateAction을 처리하지 못하는 콜백은 전달하지 마세요</Document.Heading3>
      <Document.Paragraph mb={4}>
        함수형 업데이트를 전달하면 각 setter에도 업데이터 함수가 그대로 전달돼요. <InlineCode>(value: S) =&gt; void</InlineCode> 형태의 일반
        콜백(예: <InlineCode>onChange</InlineCode>)은 함수를 값으로 받아 잘못 동작하므로, 이런 콜백과 합성할 때는 직접 값만 전달하거나
        업데이터를 해석하는 래퍼로 감싸 전달하세요.
      </Document.Paragraph>
      <CodeBlock code={PLAIN_CALLBACK_CODE} className="mb-6" />

      <Document.Heading3>함수 자체를 상태로 저장할 때는 한 번 감싸세요</Document.Heading3>
      <Document.Paragraph mb={4}>
        <InlineCode>useState</InlineCode>와 마찬가지로 전달한 함수는 항상 업데이터로 해석돼요. 함수 자체를 상태 값으로 저장하려면{" "}
        <InlineCode>setState(() =&gt; myFunction)</InlineCode>처럼 한 번 감싸서 전달하세요.
      </Document.Paragraph>

      <Document.Heading3>렌더링 도중에는 호출하지 마세요</Document.Heading3>
      <Document.Paragraph mb={4}>
        setter 목록은 <InlineCode>useLatestRef</InlineCode>가 <InlineCode>useLayoutEffect</InlineCode>에서 갱신해요. 이벤트 핸들러나
        effect에서 호출하면 항상 최신 목록이 사용되지만, 렌더링 도중에 호출하면 이전 렌더링의 setter 목록이 사용될 수 있어요.
      </Document.Paragraph>

      <Document.Heading3>상태를 하나로 합칠 수 있다면 그 편이 나아요</Document.Heading3>
      <Document.Paragraph>
        이 훅은 부모가 소유한 상태, 다른 컴포넌트가 내려준 setter처럼 애초에 하나로 합칠 수 없는 상태들을 함께 갱신하기 위한 도구예요. 한
        컴포넌트 안에서 직접 만든 상태들이 항상 같은 값을 가져야 한다면, 여러 상태를 합성하는 대신 상태를 하나로 두고 필요한 곳에서 파생
        값을 계산하는 편이 더 단순해요.
      </Document.Paragraph>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useComposedState } from "@leejaehyeok/use-compose-state";`;

const SIGNATURE_CODE = `function useComposedState<S>(
  ...setters: React.Dispatch<React.SetStateAction<S>>[]
): React.Dispatch<React.SetStateAction<S>>;`;

const SET_STATE_ACTION_CODE = `const [countA, setCountA] = useState(1); // 현재 값: 1
const [countB, setCountB] = useState(5); // 현재 값: 5

const setCount = useComposedState(setCountA, setCountB);

setCount(10); // 직접 값 → countA: 10, countB: 10
setCount((prev) => prev + 1); // 함수형 업데이트 → countA: 11, countB: 11
// 두 상태의 값이 서로 달랐다면(1, 5) 함수형 업데이트의 결과도 각각 달라져요. → 2, 6`;

const PLAIN_CALLBACK_CODE = `type Props = {
  onChange: (value: number) => void; // SetStateAction을 처리하지 못하는 일반 콜백
};

function Stepper({ onChange }: Props) {
  const [count, setCount] = useState(0);

  // ⚠️ 위험: 함수형 업데이트를 쓰면 onChange가 값 대신 업데이터 함수를 받게 돼요.
  const setAll = useComposedState(setCount, onChange);

  // ✅ 권장: 업데이터를 값으로 풀어 주는 래퍼로 감싸서 전달하세요.
  //    렌더링마다 새로 만들어져도 훅이 호출 시점의 최신 setter를 사용하므로 안전해요.
  const handleChange: React.Dispatch<React.SetStateAction<number>> = (next) => {
    onChange(typeof next === "function" ? next(count) : next);
  };
  const setAllSafely = useComposedState(setCount, handleChange);

  return <button onClick={() => setAllSafely((prev) => prev + 1)}>+1</button>;
}`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useComposedState(...setters) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "...setters",
    type: "React.Dispatch<React.SetStateAction<S>>[]",
    description:
      "합성할 state setter들이에요. 개수 제한 없이 나열할 수 있고, 전달한 순서대로 호출돼요. 모두 같은 상태 타입 S를 공유해야 하며, S는 전달한 setter들로부터 추론돼요. 의존성 배열로 사용되지 않으므로 렌더링마다 개수나 순서가 달라져도 괜찮아요.",
  },
];

/** useComposedState 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "setState",
    type: "React.Dispatch<React.SetStateAction<S>>",
    description:
      "합성된 setter예요. 한 번 호출하면 전달한 모든 setter가 순서대로 호출되어 상태들이 함께 갱신돼요. 컴포넌트가 살아 있는 동안 참조가 고정되고, 호출 시점에는 항상 최신 setter 목록이 사용돼요.",
  },
];

/** setState에 전달하는 인자 형태별 동작 */
const SET_STATE_ACTION_ROWS: BehaviorTableRow[] = [
  {
    name: "직접 값 (S)",
    description: "setState(next) 형태로 값을 전달하면 모든 setter에 같은 값이 전달되어 합성된 상태들이 모두 같은 값이 돼요.",
  },
  {
    name: "함수형 업데이트 ((prev: S) => S)",
    description:
      "setState((prev) => next) 형태로 함수를 전달하면 각 setter가 자신의 이전 값에 함수를 적용해요. 상태들의 현재 값이 서로 다르면 결과도 각각 달라지므로, 값을 하나로 맞추려면 직접 값을 전달하세요.",
  },
];

export default ApiSection;
