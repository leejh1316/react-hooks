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
        패키지는 <InlineCode>useIntersectionObserver</InlineCode> 훅을 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>IntersectionObserverOption</Document.Heading3>
      <Document.Paragraph mb={6}>
        네이티브 <InlineCode>IntersectionObserverInit</InlineCode>의 <InlineCode>rootMargin</InlineCode>,{" "}
        <InlineCode>threshold</InlineCode>를 그대로 지원하고, <InlineCode>root</InlineCode>는 <InlineCode>"container"</InlineCode> 리터럴로
        대체되어 있어요.
      </Document.Paragraph>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        <InlineCode>setContainerRef</InlineCode>는 <InlineCode>useEffect</InlineCode> 기반이 아닌 <InlineCode>callback ref</InlineCode>라서,
        ref가 연결/해제되는 시점에 정확히 맞춰 관찰이 시작/해제돼요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";`;

const SIGNATURE_CODE = `function useIntersectionObserver(options?: IntersectionObserverOption): {
  setContainerRef: RefCallback<HTMLElement>;
  reset: () => void;
  isVisible: boolean;
  hasEntered: boolean;
  target: Element | null;
};

type IntersectionObserverOption = {
  /** 교차 판정 기준 루트 (기본값: null = 브라우저 뷰포트) */
  root?: "container" | null;
  /** 루트 경계 여백 (CSS margin 형식) */
  rootMargin?: string;
  /** 교차 비율 임계값 (0.0 ~ 1.0) */
  threshold?: number | number[];
  /** true면 최초 진입 이후 관찰 중단 (기본값: false) */
  once?: boolean;
  /** false면 콜백 호출과 상태 갱신을 건너뜀 (기본값: true) */
  enable?: boolean;
  /** 관찰 대상을 찾는 CSS 선택자 (기본값: "[data-intersection-target]") */
  targetSelector?: string;
  /** 타깃이 진입할 때 호출 */
  onEntered?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  /** 타깃이 이탈할 때 호출 */
  onExited?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  /** 진입/이탈 모두에서 호출 */
  onChange?: (type: "enter" | "exit", entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
};`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useIntersectionObserver(options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "IntersectionObserverOption",
    defaultValue: "{}",
    description: "관찰 동작을 제어하는 옵션 객체예요. 생략할 수 있어요.",
  },
];

/** IntersectionObserverOption 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "root",
    type: '"container" | null',
    defaultValue: "null",
    description:
      'null이면 브라우저 뷰포트를 루트로 사용하고, "container"면 setContainerRef가 연결된 컨테이너 자신을 루트로 사용해요. "container" 사용 시 컨테이너에 overflow: auto 또는 scroll이 설정되어 있어야 해요.',
  },
  {
    name: "rootMargin",
    type: "string",
    defaultValue: '"0px"',
    description: '루트의 경계를 CSS margin 형식으로 확장/축소해요. 예: "0px 0px 200px 0px"으로 설정하면 200px 먼저 진입으로 판정돼요.',
  },
  {
    name: "threshold",
    type: "number | number[]",
    defaultValue: "0",
    description: "콜백이 호출되는 교차 비율 임계값이에요 (0.0 ~ 1.0). 0.5면 타깃이 50% 이상 보일 때 진입으로 판정돼요.",
  },
  {
    name: "once",
    type: "boolean",
    defaultValue: "false",
    description:
      "true면 최초 진입을 기록하고, 이후 타깃이 루트를 벗어나는 시점에 관찰을 중단해요. 중단된 관찰은 reset()으로 다시 시작할 수 있어요.",
  },
  {
    name: "enable",
    type: "boolean",
    defaultValue: "true",
    description:
      "false면 교차 이벤트가 발생해도 콜백 호출과 상태 갱신을 모두 건너뛰어요. 최신 값을 ref로 참조하므로 옵저버 재생성 없이 토글할 수 있어요.",
  },
  {
    name: "targetSelector",
    type: "string",
    defaultValue: '"[data-intersection-target]"',
    description:
      "컨테이너 내부에서 관찰할 요소를 찾는 CSS 선택자예요. 매칭되는 요소가 없으면 컨테이너의 firstElementChild를 관찰하고, 여러 개면 첫 번째 요소만 관찰해요.",
  },
  {
    name: "onEntered",
    type: "(entry: IntersectionObserverEntry, observer: IntersectionObserver) => void",
    description: "타깃이 루트에 진입할 때 호출돼요.",
  },
  {
    name: "onExited",
    type: "(entry: IntersectionObserverEntry, observer: IntersectionObserver) => void",
    description: "타깃이 루트에서 이탈할 때 호출돼요.",
  },
  {
    name: "onChange",
    type: '(type: "enter" | "exit", entry, observer) => void',
    description: '진입과 이탈 모두에서 호출돼요. 첫 번째 인자 type으로 "enter" / "exit"를 구분할 수 있어요.',
  },
];

/** useIntersectionObserver 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "setContainerRef",
    type: "RefCallback<HTMLElement>",
    description:
      "관찰을 시작할 컨테이너 요소에 연결하는 callback ref예요. 연결되면 targetSelector로 타깃을 찾아 관찰을 시작하고, 언마운트되면 관찰이 해제돼요.",
  },
  {
    name: "isVisible",
    type: "boolean",
    description: "타깃이 현재 루트와 교차 중이면 true예요.",
  },
  {
    name: "hasEntered",
    type: "boolean",
    description: "타깃이 한 번이라도 진입한 적이 있으면 true예요. 이탈해도 유지되고, reset()으로만 초기화돼요.",
  },
  {
    name: "target",
    type: "Element | null",
    description: "실제로 관찰 중인 DOM 요소예요. 최초 교차 이벤트가 발생하기 전에는 null이므로 옵셔널 체이닝으로 접근하세요.",
  },
  {
    name: "reset",
    type: "() => void",
    description:
      "isVisible / hasEntered / target 상태를 초기화하고 같은 타깃을 처음부터 다시 관찰해요. 컨테이너나 타깃이 없으면 경고를 출력하고 아무 동작도 하지 않아요.",
  },
];

export default ApiSection;
