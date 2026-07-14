import { BehaviorTable, type BehaviorTableRow } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const OverviewSection = () => {
  return (
    <section>
      <Document.Heading1>개요</Document.Heading1>
      <Document.Paragraph mb={8}>
        <InlineCode>useComposedRefs</InlineCode>는 여러 개의 ref를 하나의 callback ref로 병합해 주는 훅이에요. React 엘리먼트의{" "}
        <InlineCode>ref</InlineCode> 속성에는 ref를 하나만 전달할 수 있는데, forwardRef로 전달받은 외부 ref와 컴포넌트 내부에서 쓰는 ref를
        같은 엘리먼트에 함께 연결해야 하는 상황이 자주 생겨요. 이 훅에 ref들을 전달하면 엘리먼트가 연결·해제될 때 모든 ref에 값이 자동으로
        전파되므로, 객체형 ref(<InlineCode>useRef</InlineCode>)와 함수형 ref(callback ref)를 섞어서 몇 개든 함께 사용할 수 있어요.
      </Document.Paragraph>

      <Document.Heading2>주요 동작</Document.Heading2>
      <BehaviorTable rows={BEHAVIOR_ROWS} />
    </section>
  );
};

/* ──────────────────────────────────────────────
   Behavior Data
   ────────────────────────────────────────────── */

/** 훅의 주요 동작 요약 */
const BEHAVIOR_ROWS: BehaviorTableRow[] = [
  {
    name: "여러 ref 병합",
    description:
      "전달한 모든 ref를 하나의 callback ref로 합쳐요. 엘리먼트가 연결되면 모든 ref에 같은 엘리먼트가 순서대로 전파되고, 해제되면 모두 정리돼요.",
  },
  {
    name: "모든 ref 유형 지원",
    description:
      "객체형 ref(RefObject / MutableRefObject), 함수형 ref(RefCallback)를 섞어서 전달할 수 있어요. null / undefined가 섞여 있어도 안전하게 건너뛰므로 조건부 ref도 그대로 전달할 수 있어요.",
  },
  {
    name: "React 19 cleanup 지원",
    description:
      "React 19에서 callback ref가 cleanup 함수를 반환하면 이를 기억해 두었다가 엘리먼트 해제 시 실행해요. cleanup을 반환하지 않은 ref는 기존 방식대로 null로 초기화돼요.",
  },
  {
    name: "메모이제이션",
    description:
      "병합된 callback ref는 useCallback으로 메모이제이션돼요. 전달한 ref들의 참조가 유지되는 동안 병합된 ref도 동일한 참조를 유지하므로, 엘리먼트에 ref가 불필요하게 재연결되지 않아요.",
  },
];

export default OverviewSection;
