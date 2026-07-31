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
        <InlineCode>useComposedState</InlineCode>는 여러 개의 state setter를 하나의 setter로 합쳐 주는 훅이에요. 부모가 소유한 제어 상태,
        컴포넌트 내부 상태, 로그·미리보기 같은 부가 상태처럼 하나로 합칠 수 없는 상태들이 항상 같은 값을 가져야 할 때, 갱신 지점마다
        setter를 나열해 호출하다 보면 하나를 빠뜨리기 쉬워요. 합성할 setter들을 이 훅에 전달하면 <InlineCode>useState</InlineCode>의
        setter와 똑같이 생긴 setter 하나를 돌려주고, 이 setter를 한 번 호출하는 것만으로 합성된 모든 상태가 함께 갱신돼요. 직접 값과 함수형
        업데이트를 모두 지원하며, 반환된 setter는 항상 같은 참조를 유지해요.
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
    name: "여러 setter 합성",
    description:
      "전달한 모든 setter를 하나의 setter로 합쳐요. 반환된 setState를 한 번 호출하면 전달한 순서대로 모든 setter가 호출되어 상태들이 함께 갱신돼요.",
  },
  {
    name: "useState와 동일한 인터페이스",
    description: "반환값의 타입이 React.Dispatch<React.SetStateAction<S>>라서, useState의 setter를 쓰던 자리에 그대로 바꿔 넣을 수 있어요.",
  },
  {
    name: "직접 값 전달",
    description: "setState(next) 형태로 값을 전달하면 합성된 모든 상태가 같은 값이 돼요.",
  },
  {
    name: "함수형 업데이트",
    description:
      "setState((prev) => next) 형태로 함수를 전달하면 각 setter가 자신의 이전 값에 함수를 적용해요. 상태들의 현재 값이 서로 다르면 결과도 각각 달라져요.",
  },
  {
    name: "고정된 참조",
    description:
      "반환된 setState는 빈 의존성 배열의 useCallback으로 만들어져 컴포넌트가 살아 있는 동안 항상 같은 참조를 유지해요. useEffect·useCallback의 의존성 배열이나 memo 컴포넌트의 props로 넘겨도 안전해요.",
  },
  {
    name: "최신 setter 목록 사용",
    description:
      "setter 목록은 useLatestRef로 매 렌더링마다 최신 상태로 유지돼요. 렌더링마다 setter의 개수나 종류가 바뀌어도 호출 시점의 최신 목록이 사용돼요.",
  },
  {
    name: "한 번의 리렌더링",
    description:
      "여러 setter를 연속으로 호출하지만 React 18의 자동 배칭 덕분에 하나의 이벤트에서 발생한 갱신은 한 번의 리렌더링으로 처리돼요.",
  },
];

export default OverviewSection;
