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
        <InlineCode>useIntersectionObserverGroup</InlineCode>은 컨테이너 하나를 기준으로 그 안의 <strong>여러 자식 요소</strong>의 뷰포트
        진입·이탈을 <strong>키(key) 기반</strong>으로 한꺼번에 추적하는 훅이에요. 자식 요소에{" "}
        <InlineCode>keyAttribute</InlineCode>(기본값 <InlineCode>data-intersection-key</InlineCode>) 속성으로 키를 지정하면, 키별 상태 맵(
        <InlineCode>states</InlineCode>)으로 각 요소의 가시성을 읽을 수 있어요. 내부적으로 <InlineCode>IntersectionObserver</InlineCode>와{" "}
        <InlineCode>MutationObserver</InlineCode>를 조합해 나중에 추가되거나 제거되는 요소도 자동으로 감시하므로, 스크롤 스파이, 리스트
        아이템 진입 애니메이션, 요소별 노출 트래킹처럼 하나의 컨테이너에서 여러 요소를 추적해야 할 때 유용하게 사용할 수 있어요. 단일
        요소만 관찰한다면 <InlineCode>useIntersectionObserver</InlineCode>를 사용하세요.
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
    name: "타깃 수집",
    description:
      "컨테이너에서 keyAttribute(기본값 data-intersection-key)가 있는 모든 자식 요소를 찾아 각각 관찰해요. 속성 값이 states의 키가 돼요. 속성 값이 비어 있으면 경고를 출력하고 해당 요소는 무시돼요.",
  },
  {
    name: "키별 상태 맵",
    description:
      "states는 키별로 { isVisible, hasEntered, target }을 담는 Record예요. 교차 이벤트가 발생한 키의 항목만 갱신되고, 아직 교차 이벤트가 없는 키는 undefined이므로 옵셔널 체이닝으로 접근해야 해요.",
  },
  {
    name: "진입/이탈 감지",
    description:
      'threshold 기준으로 각 타깃이 루트와 교차하면 해당 키의 isVisible과 hasEntered가 true가 되고 onEntered(key), onChange(key, "enter")가 호출돼요. 이탈하면 isVisible이 false가 되고(hasEntered는 유지) onExited(key), onChange(key, "exit")가 호출돼요.',
  },
  {
    name: "동적 DOM 감지",
    description:
      "MutationObserver로 자식 노드 추가/제거를 감지해요. 추가된 타깃은 자동으로 관찰을 시작하고, 제거된 타깃은 관찰이 해제되면서 states에서 해당 키가 삭제돼요.",
  },
  {
    name: "once 관찰 중단",
    description:
      "once: true면 키별로 독립적으로 적용돼요. 최초 진입을 기록한 타깃은 루트를 벗어나는 시점에 관찰이 중단되고, 나머지 타깃은 계속 관찰돼요.",
  },
  {
    name: "enable 일시 중지",
    description:
      "enable: false면 관찰 자체는 유지하되 콜백 실행과 상태 갱신을 모두 건너뛰어요. 내부에서 최신 값을 ref로 참조하므로 옵저버를 다시 만들지 않고도 토글할 수 있어요.",
  },
  {
    name: "reset 재시작",
    description:
      "reset(key)는 해당 키의 상태만 초기화하고 그 타깃을 다시 관찰해요. reset()은 전체 상태를 비우고 옵저버를 새로 만들어 모든 타깃을 처음부터 다시 관찰해요. once로 중단된 관찰을 재시작할 때 유용해요.",
  },
  {
    name: "자동 정리",
    description: "컨테이너가 언마운트되면 IntersectionObserver와 MutationObserver가 모두 disconnect되어 관찰이 자동으로 해제돼요.",
  },
];

export default OverviewSection;
