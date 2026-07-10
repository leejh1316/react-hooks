import { InlineCode } from "../ui/InlineCode";
import { Table } from "../ui/Table";

type AttributeTableRow = {
  name: string;
  value: string;
  description?: string;
};
interface AttributeTableProps extends React.ComponentProps<"table"> {
  rows: AttributeTableRow[];
}
const AttributeTable = ({ rows, ...props }: AttributeTableProps) => {
  return (
    <Table.Root {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Attribute</Table.Head>
          <Table.Head>Value</Table.Head>
          <Table.Head>Description</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, value, description }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <Table.CellLabel>Attribute</Table.CellLabel>
              <InlineCode>[{name}]</InlineCode>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Value</Table.CellLabel>
              <div className="font-code">{value}</div>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Description</Table.CellLabel>
              <div>{description || "—"}</div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export { AttributeTable };
export type { AttributeTableRow, AttributeTableProps };
