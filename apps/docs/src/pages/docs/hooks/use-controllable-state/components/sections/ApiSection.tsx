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
        패키지는 <InlineCode>useControllableState</InlineCode> 훅과 옵션 타입인 <InlineCode>ControllableStateOptions&lt;T&gt;</InlineCode>를
        named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>ControllableStateOptions&lt;T&gt;</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>useState</InlineCode>와 동일한 형태의 <InlineCode>[value, setValue]</InlineCode> 튜플을 반환하므로, 기존{" "}
        <InlineCode>useState</InlineCode> 코드를 그대로 대체할 수 있어요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useControllableState, type ControllableStateOptions } from "@leejaehyeok/use-controllable-state";`;

const SIGNATURE_CODE = `function useControllableState<T>(options: ControllableStateOptions<T>): readonly [T, Dispatch<SetStateAction<T>>];

type ControllableStateOptions<T> = {
  /** 외부에서 제어하는 값. undefined가 아니면 제어 모드로 동작해요. */
  value?: T;
  /** 비제어 모드에서 사용할 초기값. 함수를 전달하면 lazy 초기화돼요. */
  defaultValue?: T | (() => T);
  /** 값이 실제로 변경될 때 호출되는 콜백이에요. */
  onChange?: (value: T) => void;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useControllableState(options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "ControllableStateOptions<T>",
    description: "제어/비제어 모드와 상태 동작을 결정하는 옵션 객체예요. 모든 필드가 optional이지만 객체 자체는 반드시 전달해야 해요.",
  },
];

/** ControllableStateOptions<T> 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "value",
    type: "T | undefined",
    description:
      "외부에서 제어하는 값이에요. 첫 렌더에서 undefined가 아니면 제어 모드로 고정되고, 이 값이 그대로 반환돼요. 제어 모드에서는 onChange를 받아 부모가 직접 value를 갱신해야 해요.",
  },
  {
    name: "defaultValue",
    type: "T | (() => T)",
    description:
      "비제어 모드에서 사용할 내부 상태의 초기값이에요. 함수를 전달하면 useState처럼 첫 렌더에서 한 번만 실행돼요. 제어 모드에서는 무시돼요.",
  },
  {
    name: "onChange",
    type: "(value: T) => void",
    description:
      "값이 변경될 때 호출되는 콜백이에요. Object.is 비교로 이전 값과 같으면 호출되지 않아요. ref로 관리되므로 인라인 함수를 전달해도 항상 최신 콜백이 호출돼요.",
  },
];

/** useControllableState 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "value",
    type: "T",
    description: "현재 값이에요. 제어 모드에서는 options.value를, 비제어 모드에서는 내부 상태를 반환해요.",
  },
  {
    name: "setValue",
    type: "Dispatch<SetStateAction<T>>",
    description:
      "값을 갱신하는 setter예요. 새 값 또는 (prev) => next 형태의 업데이트 함수를 받아요. 비제어 모드에서는 내부 상태를 갱신한 뒤 onChange를 호출하고, 제어 모드에서는 onChange만 호출해요. useCallback으로 메모이제이션되어 참조가 안정적이에요.",
  },
];

export default ApiSection;
