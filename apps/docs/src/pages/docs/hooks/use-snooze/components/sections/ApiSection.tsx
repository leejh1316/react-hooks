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
        패키지는 <InlineCode>useSnooze</InlineCode> 훅 하나를 named export 해요. 옵션 타입은 별도로 export되지 않으므로 아래 시그니처를
        참고하세요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>UseSnoozeOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>[isActive, snooze]</InlineCode> 형태의 튜플을 반환해요. <InlineCode>useState</InlineCode>처럼 구조 분해로 받아 원하는
        이름을 붙여 사용할 수 있어요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useSnooze } from "@leejaehyeok/use-snooze";`;

const SIGNATURE_CODE = `function useSnooze(options: UseSnoozeOptions): [boolean, () => void];

type UseSnoozeOptions = {
  /** 만료 시각을 저장할 스토리지 key */
  key: string;
  /** 숨김 기간 — "day"(24시간) 또는 밀리초(ms) 단위 숫자 */
  duration: "day" | number;
  /** 저장할 스토리지 종류 (기본값: "local") */
  storageType?: "local" | "session";
  /** 만료 시 재마운트 없이 자동 재활성화 (기본값: false) */
  autoReactivate?: boolean;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useSnooze(options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "UseSnoozeOptions",
    description: "스누즈 동작을 제어하는 옵션 객체예요. key와 duration은 필수예요.",
  },
];

/** UseSnoozeOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "key",
    type: "string",
    description:
      "만료 시각을 저장할 스토리지 key예요. 스누즈 대상마다 고유해야 하며, 같은 key를 쓰면 스누즈 상태가 공유돼요. 다른 저장값과 충돌하지 않도록 접두사를 붙이는 것을 권장해요.",
  },
  {
    name: "duration",
    type: '"day" | number',
    description: '숨김 기간이에요. "day"는 24시간(86,400,000ms)으로 변환되고, 숫자는 밀리초(ms) 단위로 해석돼요.',
  },
  {
    name: "storageType",
    type: '"local" | "session"',
    defaultValue: '"local"',
    description:
      '"local"은 localStorage에 저장되어 브라우저를 닫아도 유지되고, "session"은 sessionStorage에 저장되어 현재 탭에서만 유지돼요.',
  },
  {
    name: "autoReactivate",
    type: "boolean",
    defaultValue: "false",
    description:
      "true면 만료 시각에 맞춰 타이머를 걸어 재마운트 없이도 isActive가 자동으로 true로 돌아와요. false면 다음에 스토리지를 읽는 시점(마운트)에 활성화돼요.",
  },
];

/** useSnooze 반환값 (튜플) */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "[0] isActive",
    type: "boolean",
    description:
      "요소를 노출해야 하는지 여부예요. 스누즈되지 않았거나 만료 시각이 지났으면 true, 스누즈 중이면 false예요. SSR 환경에서는 false로 시작해요.",
  },
  {
    name: "[1] snooze",
    type: "() => void",
    description:
      "요소를 숨기는 함수예요. 호출하면 만료 시각(현재 시각 + duration)을 스토리지에 저장하고 isActive를 false로 바꿔요. 스토리지를 사용할 수 없는 환경에서는 아무 동작도 하지 않아요.",
  },
];

export default ApiSection;
