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
        <InlineCode>useCustomEventState</InlineCode>는 브라우저의 <InlineCode>CustomEvent</InlineCode> API를 이용해 같은{" "}
        <InlineCode>key</InlineCode>를 사용하는 여러 컴포넌트의 상태를 동기화하는 훅이에요. <InlineCode>useState</InlineCode>와 동일한{" "}
        <InlineCode>[state, dispatch]</InlineCode> 튜플을 반환하고, <InlineCode>dispatch</InlineCode>를 호출하면{" "}
        <InlineCode>window</InlineCode>에 이벤트가 발행되어 같은 key를 구독 중인 모든 훅 인스턴스의 상태가 함께 갱신돼요. Provider나 prop
        drilling 없이 컴포넌트 트리의 위치와 무관하게 상태를 공유할 수 있고, window 레벨 이벤트를 사용하므로 같은 페이지의 서로 다른 React
        루트(마이크로 프론트엔드 등) 사이에서도 동작해요.
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
    name: "상태 동기화",
    description: "같은 key를 사용하는 모든 훅 인스턴스가 dispatch 한 번으로 함께 갱신돼요. dispatch를 호출한 컴포넌트 자신도 포함돼요.",
  },
  {
    name: "함수형 업데이트",
    description:
      "useState처럼 값 대신 업데이트 함수((prev) => next)를 전달할 수 있어요. 각 인스턴스가 자신의 이전 상태에 함수를 적용해요.",
  },
  {
    name: "지연 초기화",
    description: "initialState에 함수를 전달하면 useState의 lazy initializer처럼 첫 렌더링에서 한 번만 실행돼요.",
  },
  {
    name: "이벤트 네임스페이스",
    description:
      '이벤트 이름에 "@leejaehyeok/use-custom-event-state:" 접두사가 자동으로 붙어 다른 라이브러리나 앱 코드의 이벤트와 충돌하지 않아요.',
  },
  {
    name: "key 변경 대응",
    description: "key가 바뀌면 이전 key의 구독을 해제하고 새 key를 구독해요. 상태 값은 다음 dispatch가 발생할 때까지 유지돼요.",
  },
  {
    name: "동기화 범위",
    description:
      "window 이벤트 기반이므로 같은 탭(페이지) 안에서만 동기화돼요. 다른 탭과의 동기화나 새로고침 후 유지가 필요하면 useBrowserStorage를 사용하세요.",
  },
];

export default OverviewSection;
