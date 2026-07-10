import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { Table } from "@src/components/ui/Table";
import { BEHAVIOR_ROWS } from "../constants/behaviors";

const OverviewSection = () => {
  return (
    <section>
      <Document.Title>useFocusTrap</Document.Title>
      <Document.Description>
        모달, 다이얼로그, 드로어처럼 특정 컨테이너 안에 키보드 포커스를 가두어 Tab / Shift+Tab 포커스가 컨테이너 내부에서 순환하도록
        하는 React 훅입니다.
      </Document.Description>
      <Document.Paragraph>
        훅을 호출하면 <InlineCode>callback ref</InlineCode>를 반환합니다. 이 ref를 컨테이너 요소에 연결하는 것만으로 트랩이
        활성화되며, 컨테이너가 언마운트되면 트랩이 해제되고 이전에 포커스되어 있던 요소로 포커스가 자동 복원됩니다. 내부적으로{" "}
        <InlineCode>MutationObserver</InlineCode>를 사용해 DOM 변화를 감지하므로, 트랩이 활성화된 뒤 추가되거나 비활성화된 요소도
        포커스 순환에 자동으로 반영됩니다.
      </Document.Paragraph>

      <Document.Heading1>주요 동작</Document.Heading1>
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

export default OverviewSection;
