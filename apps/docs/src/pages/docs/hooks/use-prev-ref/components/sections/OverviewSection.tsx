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
        <InlineCode>usePrevRef</InlineCode>는 직전 렌더링 사이클의 값을 ref에 담아 두는 훅이에요. 값이 어떻게 바뀌었는지(증가·감소, 이전
        선택, 변화 여부)를 알아야 하는 로직에서 현재 값과 <InlineCode>prevRef.current</InlineCode>를 비교하면 돼요. 값을 상태가 아니라 ref에
        기록하므로 이전 값이 갱신돼도 리렌더링이 발생하지 않아요. 다만 갱신 시점이 <InlineCode>useEffect</InlineCode>의 cleanup이라서,
        이벤트 핸들러나 <InlineCode>useEffect</InlineCode>처럼 커밋 이후에 읽어야 정확한 1단계 이전 값을 얻을 수 있어요.
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
    name: "이전 값 보관",
    description:
      "value가 바뀌면 이전 effect의 cleanup이 실행되면서 직전 값을 ref에 기록해요. 상태가 아니라 ref이므로 이전 값이 갱신돼도 리렌더링이 발생하지 않아요.",
  },
  {
    name: "커밋 이후 정확한 이전 값",
    description:
      "이벤트 핸들러, useEffect, 비동기 콜백처럼 커밋이 끝난 뒤 읽으면 .current가 정확히 1단계 이전 값이에요. 이 훅이 의도한 사용 방식이에요.",
  },
  {
    name: "렌더링 중 읽기 주의",
    description:
      "JSX나 렌더 함수 본문에서 읽으면 cleanup이 아직 실행되기 전이라 2단계 이전 값이 나와요. 첫 변경에서만 우연히 1단계 이전 값과 같아요.",
  },
  {
    name: "첫 렌더링 초기값",
    description: "useRef(value)로 초기화되므로 첫 렌더링에서는 .current가 undefined가 아니라 전달한 값 자체예요.",
  },
  {
    name: "값 비교 기준",
    description:
      "의존성 배열([value]) 기준의 Object.is 비교예요. 값이 그대로인 리렌더링에서는 갱신되지 않으므로 .current는 '직전에 달랐던 값'을 가리켜요. 객체·배열은 참조가 바뀔 때마다 갱신돼요.",
  },
  {
    name: "타입 유지",
    description: "제네릭 T를 그대로 유지해 MutableRefObject<T>를 반환해요. 원시값·객체·배열·함수 등 어떤 타입이든 그대로 담을 수 있어요.",
  },
];

export default OverviewSection;
