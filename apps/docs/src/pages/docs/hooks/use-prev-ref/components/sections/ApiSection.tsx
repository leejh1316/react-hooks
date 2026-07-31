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
        패키지는 <InlineCode>usePrevRef</InlineCode> 훅 하나를 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph mb={4}>
        <InlineCode>useRef</InlineCode>가 만든 ref 객체를 그대로 반환해요. 컴포넌트가 살아 있는 동안 ref 객체의 참조는 바뀌지 않으므로
        의존성 배열에 넣어도 안전하고, <InlineCode>.current</InlineCode>가 갱신돼도 리렌더링은 발생하지 않아요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />

      {/* 옵션 */}
      <Document.Heading2>옵션</Document.Heading2>
      <Document.Paragraph mb={4}>
        이 훅은 별도의 옵션 객체를 받지 않아요. 동작을 좌우하는 것은 <InlineCode>추적할 값</InlineCode>과{" "}
        <InlineCode>.current를 읽는 시점</InlineCode> 두 가지예요.
      </Document.Paragraph>

      <Document.Heading3>추적할 값</Document.Heading3>
      <Document.Paragraph mb={4}>
        인자로 전달한 값이 곧 추적 대상이에요. 내부적으로 <InlineCode>useEffect</InlineCode>의 의존성 배열에 그대로 들어가므로{" "}
        <InlineCode>Object.is</InlineCode> 비교로 변화를 판단해요. 값이 그대로인 리렌더링에서는 갱신되지 않고, 객체·배열처럼 렌더링마다 새
        참조가 만들어지는 값은 내용이 같아도 매번 갱신돼요. 특정 필드만 추적하려면 <InlineCode>usePrevRef(user.id)</InlineCode>처럼 원시값을
        전달하세요.
      </Document.Paragraph>

      <Document.Heading3>.current를 읽는 시점</Document.Heading3>
      <Document.Paragraph mb={4}>
        ref 갱신이 <InlineCode>useEffect</InlineCode>의 cleanup에서 일어나기 때문에, 언제 읽느냐에 따라 값이 달라져요. 커밋이 끝난 뒤 읽는
        경우에만 1단계 이전 값이 보장돼요.
      </Document.Paragraph>
      <BehaviorTable rows={READ_TIMING_ROWS} className="mb-6" />
      <CodeBlock code={READ_TIMING_CODE} />

      {/* 주의사항 */}
      <Document.Heading2>주의사항</Document.Heading2>

      <Document.Heading3>렌더링 중에는 읽지 마세요</Document.Heading3>
      <Document.Paragraph mb={4}>
        JSX나 렌더 함수 본문에서 <InlineCode>.current</InlineCode>를 읽으면 2단계 이전 값이 나와요. 첫 변경에서만 우연히 1단계 이전 값과
        일치하기 때문에, 화면에 이전 값을 표시해야 한다면 <InlineCode>useEffect</InlineCode>에서 읽은 값을 상태로 옮겨 렌더링하세요.
      </Document.Paragraph>

      <Document.Heading3>useLayoutEffect에서도 아직 갱신 전이에요</Document.Heading3>
      <Document.Paragraph mb={4}>
        훅이 사용하는 <InlineCode>useEffect</InlineCode>(passive effect)의 cleanup은 <InlineCode>useLayoutEffect</InlineCode>보다 늦게
        실행돼요. 그래서 <InlineCode>useLayoutEffect</InlineCode>에서 읽으면 렌더링 중에 읽은 것과 같은 2단계 이전 값이에요. 이전 값 비교는{" "}
        <InlineCode>useEffect</InlineCode>에서 하세요.
      </Document.Paragraph>

      <Document.Heading3>이전 값이 바뀌어도 리렌더링되지 않아요</Document.Heading3>
      <Document.Paragraph mb={4}>
        상태가 아니라 ref이므로 <InlineCode>.current</InlineCode>가 갱신돼도 화면은 다시 그려지지 않아요. 이전 값의 변화에 반응해 UI를
        바꿔야 한다면 <InlineCode>useEffect</InlineCode>에서 상태로 옮기세요.
      </Document.Paragraph>

      <Document.Heading3>첫 렌더링에는 이전 값이 없어요</Document.Heading3>
      <Document.Paragraph mb={4}>
        <InlineCode>useRef(value)</InlineCode>로 초기화되므로 첫 렌더링에서는 <InlineCode>.current</InlineCode>가 전달한 값과 같아요.{" "}
        <InlineCode>undefined</InlineCode>로 초기 상태를 구분하는 방식은 쓸 수 없으니, 최초 실행을 구분해야 한다면 별도의 플래그를 두세요.
      </Document.Paragraph>

      <Document.Heading3>.current에 직접 값을 쓰지 마세요</Document.Heading3>
      <Document.Paragraph>
        반환값은 읽기 전용이 아닌 <InlineCode>MutableRefObject&lt;T&gt;</InlineCode>라 값을 직접 대입할 수 있지만, 훅이 관리하는 값이므로
        다음 갱신 때 덮어써져요. 읽기 전용으로만 사용하세요.
      </Document.Paragraph>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { usePrevRef } from "@leejaehyeok/use-prev-ref";`;

const SIGNATURE_CODE = `function usePrevRef<T>(value: T): React.MutableRefObject<T>;`;

const READ_TIMING_CODE = `function Counter() {
  const [count, setCount] = useState(0); // 0 → 1 → 2 → 3 으로 증가시킨 뒤
  const prevRef = usePrevRef(count);

  // ❌ 렌더링 중 — count가 3일 때 1 (2단계 이전)
  console.log(prevRef.current);

  // ❌ useLayoutEffect — count가 3일 때 1 (passive cleanup 실행 전)
  useLayoutEffect(() => console.log(prevRef.current), [count, prevRef]);

  // ✅ useEffect — count가 3일 때 2 (1단계 이전)
  useEffect(() => console.log(prevRef.current), [count, prevRef]);

  // ✅ 이벤트 핸들러 — 클릭 시점의 count가 3이면 2 (1단계 이전)
  return <button onClick={() => console.log(prevRef.current)}>이전 값 확인</button>;
}`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** usePrevRef(value) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "value",
    type: "T",
    description:
      "이전 값을 추적할 대상이에요. 상태, props, 계산된 값 등 어떤 값이든 전달할 수 있어요. useEffect의 의존성 배열에 그대로 들어가므로 Object.is 비교로 변화를 판단하며, 객체·배열은 참조가 바뀔 때마다 갱신돼요.",
  },
];

/** usePrevRef 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "prevRef",
    type: "React.MutableRefObject<T>",
    description:
      "직전 값이 담긴 ref 객체예요. .current로 읽으며, 첫 렌더링에서는 전달한 값 자체로 시작해요. ref 객체 자체의 참조는 컴포넌트가 살아 있는 동안 바뀌지 않고, .current가 갱신돼도 리렌더링은 발생하지 않아요.",
  },
];

/** .current를 읽는 시점별 동작 */
const READ_TIMING_ROWS: BehaviorTableRow[] = [
  {
    name: "이벤트 핸들러",
    description: "✅ 1단계 이전 값이에요. 클릭·입력 등 커밋이 끝난 뒤 실행되는 코드라면 언제나 정확해요.",
  },
  {
    name: "useEffect",
    description:
      "✅ 1단계 이전 값이에요. React가 커밋에서 모든 cleanup을 실행한 뒤 effect를 실행하므로, effect 시점에는 ref 갱신이 끝나 있어요.",
  },
  {
    name: "비동기 콜백",
    description: "✅ setTimeout, fetch 응답 처리 등 나중에 실행되는 콜백에서도 호출 시점 기준의 1단계 이전 값이에요.",
  },
  {
    name: "렌더링 중 (JSX·렌더 함수 본문)",
    description: "❌ 2단계 이전 값이에요. cleanup이 아직 실행되기 전이라, 첫 변경에서만 우연히 1단계 이전 값과 같아요.",
  },
  {
    name: "useLayoutEffect",
    description: "❌ 2단계 이전 값이에요. passive effect의 cleanup이 layout effect보다 늦게 실행되기 때문이에요.",
  },
];

export default ApiSection;
