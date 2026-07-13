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
        패키지는 <InlineCode>useThrottle</InlineCode> 훅 하나를 named export 합니다.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>ThrottleOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>throttle</InlineCode>, <InlineCode>cancel</InlineCode>, <InlineCode>flush</InlineCode>를 담은 객체를 반환합니다. 세
        함수 모두 <InlineCode>useCallback</InlineCode>으로 메모이제이션되어 있어 의존성 배열에 안전하게 사용할 수 있습니다.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useThrottle } from "@leejaehyeok/use-throttle";`;

const SIGNATURE_CODE = `function useThrottle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: ThrottleOptions,
): {
  throttle: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
};

type ThrottleOptions = {
  /** 첫 호출 즉시 실행 여부 (기본값: true) */
  leading?: boolean;
  /** 마지막 호출을 제한 시간 후에 실행할지 여부 (기본값: true) */
  trailing?: boolean;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useThrottle(func, wait, options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "func",
    type: "(...args: any[]) => void",
    description:
      "스로틀링할 함수입니다. 내부적으로 ref에 보관되므로 리렌더링으로 함수가 바뀌어도 항상 최신 함수가 실행됩니다.",
  },
  {
    name: "wait",
    type: "number",
    description: "실행 간격 제한 시간(ms)입니다. 이 시간당 최대 한 번만 함수가 실행됩니다.",
  },
  {
    name: "options",
    type: "ThrottleOptions",
    defaultValue: "{}",
    description: "leading / trailing 실행 시점을 제어하는 옵션 객체입니다. 생략할 수 있습니다.",
  },
];

/** ThrottleOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "leading",
    type: "boolean",
    defaultValue: "true",
    description: "첫 호출 시 함수를 즉시 실행할지 여부입니다. false이면 첫 호출도 제한 시간 이후로 미뤄집니다.",
  },
  {
    name: "trailing",
    type: "boolean",
    defaultValue: "true",
    description:
      "제한 시간 동안 발생한 마지막 호출을 제한 시간 경과 후 실행할지 여부입니다. 실행 시에는 마지막으로 전달된 인자가 사용됩니다.",
  },
];

/** useThrottle 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "throttle",
    type: "(...args: Parameters<T>) => void",
    description:
      "스로틀링된 함수입니다. 원본 함수 대신 이 함수를 호출하세요. 인자는 원본 함수로 그대로 전달됩니다.",
  },
  {
    name: "cancel",
    type: "() => void",
    description:
      "대기 중인 타이머와 마지막 인자를 폐기해 예약된 trailing 실행을 취소합니다. 컴포넌트 언마운트 시 자동으로 호출됩니다.",
  },
  {
    name: "flush",
    type: "() => void",
    description:
      "대기 중인 trailing 호출이 있다면 제한 시간을 기다리지 않고 마지막 인자로 즉시 실행한 뒤 타이머를 초기화합니다. 대기 중인 호출이 없으면 아무 동작도 하지 않습니다.",
  },
];

export default ApiSection;
