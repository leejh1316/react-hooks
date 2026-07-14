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
        훅에 값을 전달하면 항상 그 최신 값을 담고 있는 <InlineCode>ref</InlineCode> 객체를 반환합니다. 반환된 ref는 컴포넌트 생명주기 동안
        동일한 참조를 유지하므로 <InlineCode>useEffect</InlineCode>나 <InlineCode>useCallback</InlineCode>의 의존성 배열에 원본 값을 넣지
        않고도 콜백·타이머·이벤트 핸들러 안에서 <InlineCode>ref.current</InlineCode>로 최신 값에 접근할 수 있습니다. setInterval 콜백의
        stale closure 방지, props로 받은 콜백을 안정적으로 참조하기 등 "의존성 배열은 비우고 싶지만 최신 값은 필요한" 상황에 유용합니다.
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
    name: "항상 최신 값 유지",
    description:
      "useLayoutEffect로 값이 바뀔 때마다 ref.current를 동기적으로 갱신합니다. 브라우저가 화면을 그리기 전에 반영되므로, 렌더링 이후 실행되는 어떤 콜백에서도 최신 값을 읽을 수 있습니다.",
  },
  {
    name: "안정적인 참조",
    description:
      "반환된 ref 객체는 컴포넌트 생명주기 동안 동일한 참조를 유지합니다. useEffect / useCallback의 의존성 배열에 넣어도 재실행·재생성을 일으키지 않습니다.",
  },
  {
    name: "리렌더링 없음",
    description: "ref.current 갱신은 상태 변경이 아니므로 리렌더링을 일으키지 않습니다. 값을 화면에 표시해야 한다면 useState를 사용하세요.",
  },
  {
    name: "stale closure 방지",
    description:
      "setInterval / setTimeout / 이벤트 리스너처럼 한 번 등록된 클로저가 오래 살아남는 곳에서 ref.current를 읽으면, 등록 시점이 아닌 실행 시점의 최신 값을 얻습니다.",
  },
];

export default OverviewSection;
