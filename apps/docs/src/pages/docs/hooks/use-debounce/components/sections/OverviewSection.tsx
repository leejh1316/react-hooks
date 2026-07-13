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
        훅을 호출하면 디바운싱된 <InlineCode>debounce</InlineCode> 함수와 타이머를 제어하는 <InlineCode>cancel</InlineCode>,{" "}
        <InlineCode>flush</InlineCode> 함수를 반환합니다. <InlineCode>debounce</InlineCode>를 연속으로 호출하면 실행이 계속 뒤로 미뤄지고,
        마지막 호출 이후 <InlineCode>wait</InlineCode> 시간 동안 추가 호출이 없을 때 원본 함수가 실행됩니다. <InlineCode>leading</InlineCode>{" "}
        / <InlineCode>trailing</InlineCode> 옵션으로 실행 시점을 세밀하게 제어할 수 있습니다. 검색어 자동완성, 입력 값 저장, API 연속 호출
        방지처럼 "이벤트가 멈춘 뒤 한 번만" 실행해야 하는 상황에 유용합니다.
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
    name: "디바운싱",
    description:
      "debounce가 호출될 때마다 타이머가 초기화되어 실행이 뒤로 미뤄지고, 마지막 호출 이후 wait 시간 동안 추가 호출이 없을 때 원본 함수가 실행됩니다.",
  },
  {
    name: "leading 실행",
    description: "leading: true(기본값)이면 대기 중인 타이머가 없는 첫 호출 시 원본 함수를 즉시 실행합니다.",
  },
  {
    name: "trailing 실행",
    description:
      "trailing: true(기본값)이면 마지막 호출을 wait 경과 후 마지막 인자로 실행합니다. leading으로 이미 즉시 실행된 단일 호출은 중복 실행하지 않습니다.",
  },
  {
    name: "최신 콜백 참조",
    description: "전달한 함수를 ref에 보관해 리렌더링으로 함수가 바뀌어도 항상 최신 함수가 실행됩니다(stale closure 방지).",
  },
  {
    name: "cancel / flush",
    description: "대기 중인 trailing 호출을 취소(cancel)하거나 기다리지 않고 즉시 실행(flush)할 수 있습니다.",
  },
  {
    name: "자동 정리",
    description: "컴포넌트가 언마운트되면 대기 중인 타이머가 자동으로 정리되어 언마운트 이후 실행을 방지합니다.",
  },
];

export default OverviewSection;
