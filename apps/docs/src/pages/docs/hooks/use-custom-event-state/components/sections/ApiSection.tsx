import { CodeBlock, ParameterTable, ReturnTable, type ParameterTableRow, type ReturnTableRow } from "@src/components/docs";
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
        패키지는 <InlineCode>useCustomEventState</InlineCode> 훅 하나를 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>useState</InlineCode>와 동일한 형태의 <InlineCode>readonly [state, dispatch]</InlineCode> 튜플을 반환해요.{" "}
        <InlineCode>dispatch</InlineCode>는 <InlineCode>useCallback</InlineCode>으로 메모이제이션되어 key가 바뀌지 않는 한 참조가
        유지되므로, 의존성 배열이나 <InlineCode>memo</InlineCode> 컴포넌트에 안전하게 전달할 수 있어요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";`;

const SIGNATURE_CODE = `function useCustomEventState<S>(
  key: string,
  initialState: S | (() => S),
): readonly [S, React.Dispatch<React.SetStateAction<S>>];`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useCustomEventState(key, initialState) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "key",
    type: "string",
    defaultValue: "—",
    description:
      '동기화할 상태를 식별하는 키예요. 같은 key를 사용하는 모든 훅 인스턴스가 상태를 공유해요. 내부적으로 "@leejaehyeok/use-custom-event-state:" 접두사가 붙으므로 다른 이벤트와 충돌하지 않아요.',
  },
  {
    name: "initialState",
    type: "S | (() => S)",
    defaultValue: "—",
    description:
      "상태의 초기값이에요. 함수를 전달하면 useState의 lazy initializer처럼 첫 렌더링에서 한 번만 실행돼요. 각 훅 인스턴스는 마운트 시점에 자신의 initialState로 시작해요.",
  },
];

/** useCustomEventState 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "state",
    type: "S",
    description: "현재 상태 값이에요. 같은 key로 dispatch가 발생할 때마다 갱신돼요.",
  },
  {
    name: "dispatch",
    type: "React.Dispatch<React.SetStateAction<S>>",
    description:
      "상태를 갱신하는 함수예요. 값 또는 업데이트 함수((prev) => next)를 전달할 수 있고, 호출하면 같은 key를 구독 중인 모든 훅 인스턴스(자신 포함)의 상태가 함께 갱신돼요.",
  },
];

export default ApiSection;
