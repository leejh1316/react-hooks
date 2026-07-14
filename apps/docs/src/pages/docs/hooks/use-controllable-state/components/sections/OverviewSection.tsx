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
        <InlineCode>useControllableState</InlineCode>는 하나의 컴포넌트가 제어(controlled) 모드와 비제어(uncontrolled) 모드를 모두
        지원하도록 상태를 관리해 주는 훅이에요. <InlineCode>value</InlineCode>를 전달하면 부모가 소유한 외부 상태를 그대로 사용하고,
        전달하지 않으면 <InlineCode>defaultValue</InlineCode>로 초기화된 내부 상태를 사용해요. 어느 모드든 값이 실제로 변경될 때만{" "}
        <InlineCode>onChange</InlineCode>가 호출되므로, input·select 같은 폼 요소나 토글·아코디언·별점처럼{" "}
        <InlineCode>value / defaultValue / onChange</InlineCode> props를 받는 재사용 컴포넌트를 만들 때 유용하게 사용할 수 있어요.
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
    name: "모드 결정",
    description:
      "첫 렌더에서 value가 undefined가 아니면 제어 모드, undefined면 비제어 모드로 고정돼요. 이후 value가 undefined로 바뀌어도 모드는 유지돼요.",
  },
  {
    name: "제어 모드",
    description:
      "value prop을 그대로 반환하고, setValue는 내부 상태를 바꾸지 않고 onChange만 호출해요. 실제 값 갱신은 부모 컴포넌트가 담당해요.",
  },
  {
    name: "비제어 모드",
    description: "defaultValue로 초기화된 내부 useState로 값을 관리하고, setValue 호출 시 내부 상태를 갱신한 뒤 onChange를 호출해요.",
  },
  {
    name: "불필요한 업데이트 방지",
    description: "Object.is로 이전 값과 비교해서 값이 같으면 상태 갱신과 onChange 호출을 모두 생략해요.",
  },
  {
    name: "함수형 업데이트",
    description: "setValue((prev) => next) 형태의 업데이트 함수를 지원하고, prev에는 현재 최신 값이 전달돼요.",
  },
  {
    name: "lazy 초기화",
    description: "defaultValue에 함수를 전달하면 useState처럼 첫 렌더에서 한 번만 실행해 초기값을 계산해요.",
  },
  {
    name: "안정된 setValue 참조",
    description: "setValue는 useCallback으로 메모이제이션되어 리렌더링 사이에 참조가 변하지 않아요. useEffect 의존성으로 안전하게 사용할 수 있어요.",
  },
  {
    name: "최신 onChange 보장",
    description: "onChange를 ref로 관리해서 리렌더링마다 새로운 콜백을 전달해도 항상 최신 콜백이 호출돼요.",
  },
];

export default OverviewSection;
