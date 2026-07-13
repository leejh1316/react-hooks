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
        스토리지 종류(local / session)와 TTL 만료 여부에 따라 <InlineCode>useLocalStorage</InlineCode>,{" "}
        <InlineCode>useLocalStorageWithTTL</InlineCode>, <InlineCode>useSessionStorage</InlineCode>,{" "}
        <InlineCode>useSessionStorageWithTTL</InlineCode> 네 가지 훅을 제공합니다. 네 훅 모두 <InlineCode>value</InlineCode> /{" "}
        <InlineCode>setValue</InlineCode> / <InlineCode>removeValue</InlineCode>를 반환하므로 <InlineCode>useState</InlineCode>처럼
        사용하면 값이 스토리지에 자동으로 저장됩니다. 훅 없이 스토리지를 직접 다루는 <InlineCode>browserStorage</InlineCode> 유틸과 TTL
        계산을 돕는 <InlineCode>ttl</InlineCode>, Map·Set 등 특수 타입 직렬화를 돕는 <InlineCode>serializer</InlineCode> 헬퍼도 함께
        제공합니다.
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
    name: "상태 영속화",
    description:
      "setValue로 값을 갱신하면 컴포넌트 상태와 스토리지에 동시에 반영됩니다. 함수형 업데이트(setValue(prev => next))를 지원합니다.",
  },
  {
    name: "초기값 복원",
    description:
      "마운트 시 스토리지에서 값을 읽어 초기 상태로 사용합니다. 키가 없거나 읽기에 실패하면 defaultValue를 사용합니다.",
  },
  {
    name: "같은 탭 내 동기화",
    description: "같은 key를 사용하는 모든 컴포넌트가 커스텀 이벤트로 자동 동기화됩니다. 별도 설정이 필요 없습니다.",
  },
  {
    name: "크로스탭 동기화",
    description:
      "subscribe: true이면 다른 탭에서 변경된 값이 현재 탭에 자동 반영됩니다. 브라우저 스펙상 localStorage 훅에서만 동작합니다.",
  },
  {
    name: "TTL 자동 만료",
    description:
      "WithTTL 훅은 값의 유효 시간(ms)을 지정할 수 있습니다. 만료된 값은 읽는 시점에 스토리지에서 삭제되고 defaultValue로 초기화됩니다.",
  },
  {
    name: "커스텀 직렬화",
    description:
      "기본 JSON.stringify / JSON.parse 대신 serialize / deserialize 옵션을 지정할 수 있습니다. Map, Set, Date, URL, BigInt는 serializer 헬퍼를 제공합니다.",
  },
  {
    name: "SSR / 에러 안전",
    description:
      "스토리지에 접근할 수 없는 환경(SSR, Private 모드)에서는 defaultValue로 안전하게 동작합니다. 쓰기 실패 시 console.error로 기록하고 UI 상태는 낙관적으로 업데이트됩니다.",
  },
];

export default OverviewSection;
