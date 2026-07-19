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
        <InlineCode>useSnooze</InlineCode>는 "오늘 하루 보지 않기", "일주일간 숨기기" 같은 스누즈(Snooze) 기능을 구현하는 훅이에요. 노출
        여부를 나타내는 <InlineCode>isActive</InlineCode>와 요소를 숨기는 <InlineCode>snooze</InlineCode> 함수를 튜플로 반환하고,{" "}
        <InlineCode>snooze()</InlineCode>를 호출하면 만료 시각(현재 시각 + duration)이 웹 스토리지에 저장돼요. 이후 컴포넌트가 마운트될 때
        저장된 만료 시각과 현재 시각을 비교해 노출 여부를 결정하므로, 새로고침하거나 다시 방문해도 숨김 상태가 그대로 유지돼요. 팝업, 배너,
        툴팁, 공지처럼 사용자가 일정 기간 숨길 수 있어야 하는 UI를 만들 때 유용하게 사용할 수 있어요.
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
    name: "스누즈 저장",
    description: "snooze()를 호출하면 만료 시각(현재 시각 + duration)을 스토리지에 key로 저장하고 isActive를 false로 바꿔요.",
  },
  {
    name: "초기 상태 판별",
    description:
      "마운트 시점에 스토리지에서 key를 읽어요. 저장된 값이 없으면 활성(true), 만료 시각이 지났으면 활성, 아직 남았으면 비활성(false)이에요.",
  },
  {
    name: "duration 정규화",
    description: '"day"는 24시간(86,400,000ms)으로 변환되고, 숫자는 밀리초(ms) 단위로 그대로 사용돼요.',
  },
  {
    name: "자동 재활성화",
    description:
      "autoReactivate가 true면 만료 시각에 맞춰 타이머를 걸어 재마운트 없이도 isActive가 자동으로 true로 돌아와요. false면 다음에 스토리지를 읽는 시점(마운트)에 활성화돼요.",
  },
  {
    name: "컴포넌트별 독립 상태",
    description:
      "스토리지만 공유될 뿐 상태가 컴포넌트 간에 자동 동기화되지는 않아요. 한 컴포넌트에서 snooze()해도 같은 key를 쓰는 이미 마운트된 다른 컴포넌트의 isActive는 바뀌지 않아요.",
  },
  {
    name: "SSR 안전",
    description:
      "window가 없는 환경에서는 스토리지에 접근하지 않아요. 서버 렌더링 시 초기값은 false(숨김)이고, snooze()는 아무 동작도 하지 않아요.",
  },
];

export default OverviewSection;
