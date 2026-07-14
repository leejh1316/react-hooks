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
        <InlineCode>useIntersectionObserver</InlineCode>는 브라우저의 <InlineCode>IntersectionObserver</InlineCode> API를 React 훅으로 감싼
        훅이에요. 훅이 반환하는 <InlineCode>callback ref</InlineCode>를 컨테이너 요소에 연결하는 것만으로 관찰이 시작되고, 컨테이너 내부에서{" "}
        <InlineCode>targetSelector</InlineCode>에 매칭되는 타깃 요소의 뷰포트 진입·이탈을 감지해요. 현재 가시성(
        <InlineCode>isVisible</InlineCode>)과 진입 이력(<InlineCode>hasEntered</InlineCode>)을 상태로 제공하고,{" "}
        <InlineCode>onEntered</InlineCode> / <InlineCode>onExited</InlineCode> / <InlineCode>onChange</InlineCode> 콜백으로 사이드 이펙트를
        처리할 수 있어요. 스크롤 애니메이션 트리거, 무한 스크롤, lazy loading, 요소 노출 추적 등에 유용하게 사용할 수 있어요.
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
    name: "타깃 탐색",
    description:
      "컨테이너에서 targetSelector(기본값 [data-intersection-target])에 매칭되는 첫 번째 요소를 관찰해요. 매칭되는 요소가 없으면 컨테이너의 firstElementChild를 관찰하고, 둘 다 없으면 경고를 출력한 뒤 관찰하지 않아요. 매칭되는 요소가 2개 이상이면 개발 환경에서 경고가 출력돼요.",
  },
  {
    name: "진입 감지",
    description:
      'threshold 기준으로 타깃이 루트와 교차하면 isVisible과 hasEntered가 true가 되고 onEntered, onChange("enter")가 호출돼요.',
  },
  {
    name: "이탈 감지",
    description:
      '교차가 끝나면 isVisible이 false가 되고(hasEntered는 유지) onExited, onChange("exit")가 호출돼요.',
  },
  {
    name: "once 관찰 중단",
    description: "once: true면 최초 진입을 기록하고, 이후 타깃이 뷰포트를 벗어나는 시점에 관찰을 중단해 상태가 더 이상 갱신되지 않아요.",
  },
  {
    name: "enable 일시 중지",
    description:
      "enable: false면 관찰 자체는 유지하되 콜백 실행과 상태 갱신을 모두 건너뛰어요. 내부에서 최신 값을 ref로 참조하므로 옵저버를 다시 만들지 않고도 토글할 수 있어요.",
  },
  {
    name: "reset 재시작",
    description:
      "reset()을 호출하면 isVisible / hasEntered / target 상태가 초기화되고 같은 타깃을 처음부터 다시 관찰해요. once로 중단된 관찰을 재시작할 때 유용해요.",
  },
  {
    name: "자동 정리",
    description: "컨테이너가 언마운트되면 observer.disconnect()가 호출되어 관찰이 자동으로 해제돼요.",
  },
];

export default OverviewSection;
