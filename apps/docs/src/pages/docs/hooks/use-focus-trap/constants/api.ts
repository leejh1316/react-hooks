import type { ParameterTableRow, ReturnTableRow } from "@src/components/docs";

/** useFocusTrap(options) 인자 */
export const PARAMETER_ROWS: ParameterTableRow[] = [
  {
    name: "options",
    type: "FocusTrapOptions",
    defaultValue: "{}",
    description: "포커스 트랩의 동작을 제어하는 옵션 객체입니다. 생략할 수 있습니다.",
  },
];

/** FocusTrapOptions 필드 */
export const OPTION_ROWS: ParameterTableRow[] = [
  {
    name: "initialFocusSelector",
    type: "string",
    defaultValue: '"[data-initial-focus]"',
    description:
      "트랩 활성화 시 처음 포커스할 요소를 찾는 CSS 선택자입니다. 매칭되는 요소가 없으면 첫 번째 포커스 가능 요소, 그것도 없으면 컨테이너 자체에 포커스합니다.",
  },
];

/** useFocusTrap 반환값 */
export const RETURN_ROWS: ReturnTableRow[] = [
  {
    name: "containerRef",
    type: "(node: HTMLElement | null) => void",
    description:
      "포커스를 가둘 컨테이너 요소에 연결하는 callback ref입니다. 요소에 연결되면 트랩이 활성화되고, 요소가 언마운트되면 트랩이 해제되며 이전 포커스가 복원됩니다.",
  },
];
