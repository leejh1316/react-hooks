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
      <Document.Paragraph mb={4}>
        <InlineCode>useRovingFocus</InlineCode>는 WAI-ARIA의 <InlineCode>roving tabindex</InlineCode> 패턴을 구현한 훅이에요. 그룹 안에서
        활성 아이템 하나만 <InlineCode>tabIndex 0</InlineCode>을 갖고 나머지는 <InlineCode>-1</InlineCode>로 관리되므로, 그룹 전체가 하나의
        Tab 스톱이 되고 그룹 내부 이동은 방향키·Home·End 키로 해요. 메뉴, 탭, 툴바, 그리드, 리스트박스처럼 여러 항목으로 이루어진 위젯의
        키보드 접근성을 구현할 때 유용하게 사용할 수 있어요.
      </Document.Paragraph>
      <Document.Paragraph mb={8}>
        훅을 호출하면 컨테이너에 연결하는 <InlineCode>containerRef</InlineCode>와 키보드 이벤트를 처리하는{" "}
        <InlineCode>handleKeyDown</InlineCode>을 반환해요. 컨테이너에 두 바인딩을 연결하고 각 아이템에{" "}
        <InlineCode>data-roving-item</InlineCode> 속성만 추가하면 돼요. 내부적으로 <InlineCode>MutationObserver</InlineCode>로 아이템
        추가/제거를 감지해 목록과 tabIndex를 자동 갱신하고, <InlineCode>focusin</InlineCode> 이벤트로 마우스 클릭 등 외부 포커스 이동도
        활성 인덱스에 반영해요.
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
    name: "Roving tabindex",
    description: "활성 아이템만 tabIndex 0, 나머지는 -1로 유지해요. Tab 한 번으로 그룹에 들어오고, 다시 Tab을 누르면 그룹을 통과해요.",
  },
  {
    name: "방향키 이동",
    description:
      "orientation에 따라 ←/→(horizontal), ↑/↓(vertical), 또는 모두(both) 사용해요. colSkipCount를 지정하면 ↑/↓가 열 수만큼 점프해 그리드 이동이 돼요.",
  },
  {
    name: "disabled 스킵",
    description:
      "disabled, aria-disabled='true', aria-hidden='true', hidden 속성이 있는 아이템은 이동 시 자동으로 건너뛰어요. 이동 가능한 아이템이 없으면 포커스를 유지해요.",
  },
  {
    name: "Home / End",
    description: "Home은 첫 번째, End는 마지막 활성(disabled가 아닌) 아이템으로 즉시 이동해요. enableHome / enableEnd로 끌 수 있어요.",
  },
  {
    name: "경계 처리",
    description:
      "loop가 true면 끝에서 반대쪽으로 순환하고, false면 경계에서 멈추며 onUnderflow(시작) / onOverflow(끝) 콜백이 호출돼요.",
  },
  {
    name: "동적 아이템 감지",
    description: "MutationObserver(childList, subtree)로 아이템 추가/제거를 감지해 아이템 목록과 tabIndex를 자동 갱신해요.",
  },
  {
    name: "외부 포커스 동기화",
    description: "focusin 이벤트로 마우스 클릭 등 키보드 밖 포커스 이동도 활성 인덱스에 반영해요.",
  },
  {
    name: "입력 요소 보호",
    description:
      "포커스가 input, textarea 또는 contentEditable 요소에 있으면 방향키를 가로채지 않아요. 커서 이동 같은 기본 동작이 유지돼요.",
  },
];

export default OverviewSection;
