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
        패키지는 <InlineCode>useDebounce</InlineCode> 훅 하나를 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>DebounceOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>debounce</InlineCode>, <InlineCode>cancel</InlineCode>, <InlineCode>flush</InlineCode>를 담은 객체를 반환해요. 세
        함수 모두 <InlineCode>useCallback</InlineCode>으로 메모이제이션되어 있어 의존성 배열에 안전하게 사용할 수 있어요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useDebounce } from "@leejaehyeok/use-debounce";`;

const SIGNATURE_CODE = `function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: DebounceOptions,
): {
  debounce: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
};

type DebounceOptions = {
  /** 첫 호출 즉시 실행 여부 (기본값: true) */
  leading?: boolean;
  /** 마지막 호출을 지연 시간 후에 실행할지 여부 (기본값: true) */
  trailing?: boolean;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useDebounce(func, wait, options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "func",
    type: "(...args: any[]) => void",
    description:
      "디바운싱할 함수예요. 내부적으로 ref에 보관되므로 리렌더링으로 함수가 바뀌어도 항상 최신 함수가 실행돼요.",
  },
  {
    name: "wait",
    type: "number",
    description: "지연 시간(ms)이에요. 마지막 호출 이후 이 시간 동안 추가 호출이 없을 때 함수가 실행돼요.",
  },
  {
    name: "options",
    type: "DebounceOptions",
    defaultValue: "{}",
    description: "leading / trailing 실행 시점을 제어하는 옵션 객체예요. 생략할 수 있어요.",
  },
];

/** DebounceOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "leading",
    type: "boolean",
    defaultValue: "true",
    description:
      "대기 중인 타이머가 없는 첫 호출 시 함수를 즉시 실행할지 여부예요. 입력이 멈춘 뒤에만 실행하는 일반적인 디바운스 동작을 원하면 false로 지정하세요.",
  },
  {
    name: "trailing",
    type: "boolean",
    defaultValue: "true",
    description:
      "마지막 호출을 지연 시간 경과 후 실행할지 여부예요. 실행 시에는 마지막으로 전달된 인자가 사용되며, leading으로 이미 즉시 실행된 단일 호출은 중복 실행하지 않아요.",
  },
];

/** useDebounce 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "debounce",
    type: "(...args: Parameters<T>) => void",
    description:
      "디바운싱된 함수예요. 원본 함수 대신 이 함수를 호출하세요. 인자는 원본 함수로 그대로 전달돼요.",
  },
  {
    name: "cancel",
    type: "() => void",
    description:
      "대기 중인 타이머와 마지막 인자를 폐기해 예약된 trailing 실행을 취소해요. 컴포넌트 언마운트 시 자동으로 호출돼요.",
  },
  {
    name: "flush",
    type: "() => void",
    description:
      "대기 중인 trailing 호출이 있다면 지연 시간을 기다리지 않고 마지막 인자로 즉시 실행한 뒤 타이머를 초기화해요. 대기 중인 호출이 없으면 아무 동작도 하지 않아요.",
  },
];

export default ApiSection;
