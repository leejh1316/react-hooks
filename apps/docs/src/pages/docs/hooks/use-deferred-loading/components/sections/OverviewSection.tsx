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
        <InlineCode>useDeferredLoading</InlineCode>은 로딩 상태(<InlineCode>isLoading</InlineCode>)를 받아 로딩이{" "}
        <InlineCode>delay</InlineCode> 시간 이상 지속될 때만 <InlineCode>true</InlineCode>가 되는 지연된 로딩 상태를 반환하는 훅이에요.
        네트워크 요청이 수십 ms 만에 끝나는 경우 스피너가 순간 나타났다 사라지면서 화면이 깜빡이는데, 이 훅을 사용하면 짧은 로딩에서는
        스피너를 아예 표시하지 않아요. 또한 스피너가 한 번 표시되면 <InlineCode>minDisplayDuration</InlineCode> 이상 유지되도록 보장하므로,
        표시 직후 바로 사라지는 어색한 UI도 방지할 수 있어요.
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
    name: "표시 지연",
    description: "isLoading이 true가 되어도 즉시 반영하지 않고, delay(기본 100ms)가 지난 후에만 isDeferredLoading을 true로 전환해요.",
  },
  {
    name: "깜빡임 방지",
    description: "delay가 지나기 전에 로딩이 끝나면 isDeferredLoading은 한 번도 true가 되지 않아요. 짧은 로딩에서는 스피너가 아예 표시되지 않아요.",
  },
  {
    name: "최소 표시 시간 보장",
    description:
      "isDeferredLoading이 한 번 true가 되면, 로딩이 그보다 먼저 끝나더라도 minDisplayDuration(기본 300ms)이 지난 후에 false로 전환돼요.",
  },
  {
    name: "타이머 자동 정리",
    description: "isLoading이나 옵션 값이 바뀌거나 컴포넌트가 언마운트되면 내부 타이머가 자동으로 정리돼요.",
  },
];

export default OverviewSection;
