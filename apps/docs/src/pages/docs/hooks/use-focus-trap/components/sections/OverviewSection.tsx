import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { Table } from "@src/components/ui/Table";

/* ──────────────────────────────────────────────
   Section Component
   ────────────────────────────────────────────── */

const OverviewSection = () => {
  return (
    <section>
      <Document.Heading1>개요</Document.Heading1>
      <Document.Paragraph mb={8}>
        훅을 호출하면 <InlineCode>callback ref</InlineCode>를 반환합니다. 이 ref를 컨테이너 요소에 연결하는 것만으로 트랩이
        활성화되며, 컨테이너가 언마운트되면 트랩이 해제되고 이전에 포커스되어 있던 요소로 포커스가 자동 복원됩니다. 내부적으로{" "}
        <InlineCode>MutationObserver</InlineCode>를 사용해 DOM 변화를 감지하므로, 트랩이 활성화된 뒤 추가되거나 비활성화된 요소도
        포커스 순환에 자동으로 반영됩니다.
      </Document.Paragraph>

      <Document.Heading2>주요 동작</Document.Heading2>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-44">동작</Table.Head>
            <Table.Head>설명</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {BEHAVIOR_ROWS.map(({ name, description }) => (
            <Table.Row key={name}>
              <Table.Cell>
                <Table.CellLabel>동작</Table.CellLabel>
                <span className="text-ink-primary font-medium">{name}</span>
              </Table.Cell>
              <Table.Cell className="items-stretch">
                <Table.CellLabel>설명</Table.CellLabel>
                <div>{description}</div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Behavior Data
   ────────────────────────────────────────────── */

type BehaviorRow = {
  name: string;
  description: string;
};

/** 훅의 주요 동작 요약 */
const BEHAVIOR_ROWS: BehaviorRow[] = [
  {
    name: "초기 포커스",
    description: "initialFocusSelector에 매칭되는 요소 → 첫 번째 포커스 가능 요소 → 컨테이너 자체 순서로 포커스합니다.",
  },
  {
    name: "Tab 순환",
    description: "마지막 포커스 가능 요소에서 Tab을 누르면 첫 번째 요소로 이동합니다.",
  },
  {
    name: "Shift+Tab 순환",
    description: "첫 번째 포커스 가능 요소에서 Shift+Tab을 누르면 마지막 요소로 이동합니다.",
  },
  {
    name: "동적 DOM 감지",
    description:
      "MutationObserver로 자식 노드 추가/제거와 disabled, aria-hidden, aria-disabled, hidden, inert, tabindex 속성 변화를 감지해 포커스 가능 요소 목록을 자동 갱신합니다.",
  },
  {
    name: "포커스 복원",
    description: "컨테이너가 언마운트되면 트랩 진입 전에 포커스되어 있던 요소로 포커스를 자동 복원합니다.",
  },
];

export default OverviewSection;
