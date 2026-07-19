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
        패키지는 <InlineCode>useRovingFocus</InlineCode> 훅과 <InlineCode>RovingFocusOptions</InlineCode>,{" "}
        <InlineCode>NavigationDetail</InlineCode>, <InlineCode>Direction</InlineCode> 타입을 named export 해요.
      </Document.Paragraph>
      <CodeBlock code={IMPORT_CODE} className="mb-4" />
      <CodeBlock code={SIGNATURE_CODE} language="ts" />

      {/* Parameters */}
      <Document.Heading2>Parameters</Document.Heading2>
      <ParameterTable rows={PARAMETER_ROWS} />

      <Document.Heading3>RovingFocusOptions</Document.Heading3>
      <ParameterTable rows={OPTION_ROWS} />

      {/* Returns */}
      <Document.Heading2>Returns</Document.Heading2>
      <Document.Paragraph>
        컨테이너 요소에 연결하는 두 개의 바인딩을 반환해요. <InlineCode>containerRef</InlineCode>는 <InlineCode>callback ref</InlineCode>
        라서 연결/해제 시점에 맞춰 MutationObserver와 focusin 리스너가 정확히 등록/정리돼요.
      </Document.Paragraph>
      <ReturnTable rows={RETURN_ROWS} />

      {/* Types */}
      <Document.Heading2>Types</Document.Heading2>
      <Document.Heading3>NavigationDetail</Document.Heading3>
      <Document.Paragraph mb={4}>
        <InlineCode>onNavigate</InlineCode> 콜백의 인자로 전달되는 객체예요.
      </Document.Paragraph>
      <ReturnTable rows={NAVIGATION_DETAIL_ROWS} />

      <Document.Heading3>Direction</Document.Heading3>
      <Document.Paragraph mb={4}>이동을 일으킨 키에 대응하는 방향 문자열이에요.</Document.Paragraph>
      <CodeBlock code={DIRECTION_TYPE_CODE} language="ts" />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const IMPORT_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import type { RovingFocusOptions, NavigationDetail, Direction } from "@leejaehyeok/use-roving-focus";`;

const SIGNATURE_CODE = `function useRovingFocus(options?: RovingFocusOptions): {
  containerRef: (node: HTMLElement | null) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
};

type RovingFocusOptions = {
  itemSelector?: string; // 아이템을 찾는 CSS 선택자 (기본값: "[data-roving-item]")
  orientation?: "horizontal" | "vertical" | "both"; // 사용할 방향키 축 (기본값: "both")
  loop?: boolean; // 경계에서 반대쪽으로 순환 (기본값: false)
  colSkipCount?: number; // 그리드 열 수 — ↑/↓ 점프 폭 (기본값: 0)
  initialIndex?: number; // 초기 활성 아이템 인덱스 (기본값: 0)
  clickOnNavigate?: boolean; // 이동 즉시 click() 호출 (기본값: false)
  scrollIntoView?: boolean | ScrollIntoViewOptions; // 이동 시 자동 스크롤 (기본값: false)
  enableHome?: boolean; // Home 키 사용 (기본값: true)
  enableEnd?: boolean; // End 키 사용 (기본값: true)
  onNavigate?: (detail: NavigationDetail) => void; // 이동 성공 시 호출
  onUnderflow?: () => void; // loop: false에서 첫 아이템 경계 도달 시 호출
  onOverflow?: () => void; // loop: false에서 마지막 아이템 경계 도달 시 호출
};`;

const DIRECTION_TYPE_CODE = `type Direction = "up" | "down" | "left" | "right" | "home" | "end";`;

/* ──────────────────────────────────────────────
   API Data
   ────────────────────────────────────────────── */

/** useRovingFocus(options) 인자 */
const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "RovingFocusOptions",
    defaultValue: "{}",
    description: "키보드 내비게이션 동작을 제어하는 옵션 객체예요. 생략할 수 있어요.",
  },
];

/** RovingFocusOptions 필드 */
const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "itemSelector",
    type: "string",
    defaultValue: '"[data-roving-item]"',
    description: "컨테이너 안에서 내비게이션 대상 아이템을 찾는 CSS 선택자예요.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical" | "both"',
    defaultValue: '"both"',
    description:
      "사용할 방향키 축이에요. horizontal은 ←/→, vertical은 ↑/↓, both는 네 방향키를 모두 사용해요. 지정하지 않은 축의 방향키는 가로채지 않아요.",
  },
  {
    name: "loop",
    type: "boolean",
    defaultValue: "false",
    description:
      "경계에서 반대쪽으로 순환할지 여부예요. false면 경계에서 멈추고 onUnderflow / onOverflow가 호출돼요. colSkipCount 사용 시 세로 이동은 같은 열 안에서 순환해요.",
  },
  {
    name: "colSkipCount",
    type: "number",
    defaultValue: "0",
    description:
      "그리드 구조에서의 열 수예요. 0보다 크면 ↑/↓ 이동이 이 값만큼 점프해 2차원 그리드 내비게이션이 돼요. 0이면 모든 방향키가 한 칸씩 이동해요.",
  },
  {
    name: "initialIndex",
    type: "number",
    defaultValue: "0",
    description:
      "처음 활성(tabIndex 0)으로 지정할 아이템의 인덱스예요. 마운트 시점에만 적용되는 비제어 옵션이라 이후에 값을 바꿔도 반영되지 않아요.",
  },
  {
    name: "clickOnNavigate",
    type: "boolean",
    defaultValue: "false",
    description: "방향키·Home·End로 이동한 직후 대상 아이템의 click()을 호출할지 여부예요. 자동 활성화 탭 패턴에 사용해요.",
  },
  {
    name: "scrollIntoView",
    type: "boolean | ScrollIntoViewOptions",
    defaultValue: "false",
    description:
      "이동한 아이템이 보이도록 scrollIntoView()를 호출할지 여부예요. true면 { block: 'nearest' }로 동작하고, 객체를 넘기면 그대로 사용해요.",
  },
  {
    name: "enableHome",
    type: "boolean",
    defaultValue: "true",
    description: "Home 키로 첫 번째 활성 아이템으로 이동하는 기능을 사용할지 여부예요.",
  },
  {
    name: "enableEnd",
    type: "boolean",
    defaultValue: "true",
    description: "End 키로 마지막 활성 아이템으로 이동하는 기능을 사용할지 여부예요.",
  },
  {
    name: "onNavigate",
    type: "(detail: NavigationDetail) => void",
    defaultValue: "() => {}",
    description: "이동이 성공할 때마다 호출되는 콜백이에요. 새 활성 인덱스, 대상 요소, 이동 방향, 원본 키보드 이벤트를 전달받아요.",
  },
  {
    name: "onUnderflow",
    type: "() => void",
    defaultValue: "() => {}",
    description: "loop가 false일 때 첫 번째 아이템에서 이전 방향으로 이동을 시도하면 호출돼요.",
  },
  {
    name: "onOverflow",
    type: "() => void",
    defaultValue: "() => {}",
    description: "loop가 false일 때 마지막 아이템에서 다음 방향으로 이동을 시도하면 호출돼요.",
  },
];

/** useRovingFocus 반환값 */
const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "containerRef",
    type: "(node: HTMLElement | null) => void",
    description:
      "아이템들을 감싸는 컨테이너 요소에 연결하는 callback ref예요. 연결되면 MutationObserver와 focusin 리스너가 등록되어 아이템 목록·tabIndex·활성 인덱스가 자동 관리되고, 해제되면 모두 정리돼요.",
  },
  {
    name: "handleKeyDown",
    type: "(event: React.KeyboardEvent) => void",
    description:
      "컨테이너의 onKeyDown에 연결하는 키보드 핸들러예요. orientation에 해당하는 방향키와 Home / End를 처리하고, input · textarea · contentEditable에서 발생한 이벤트는 무시해요.",
  },
];

/** NavigationDetail 필드 */
const NAVIGATION_DETAIL_ROWS: ReturnTableRow[] = [
  {
    name: "activeIndex",
    type: "number",
    description: "이동 후 새로 활성화된 아이템의 인덱스예요.",
  },
  {
    name: "activeElement",
    type: "HTMLElement",
    description: "이동 후 포커스된 아이템 요소예요.",
  },
  {
    name: "direction",
    type: "Direction",
    description: '이동을 일으킨 키에 대응하는 방향이에요. ("up" | "down" | "left" | "right" | "home" | "end")',
  },
  {
    name: "event",
    type: "React.KeyboardEvent",
    description: "이동을 일으킨 원본 키보드 이벤트예요.",
  },
];

export default ApiSection;
