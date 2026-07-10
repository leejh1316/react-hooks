import clsx from "clsx";
import { forwardRef } from "react";
import { InlineCode } from "../ui/InlineCode";
import { Table } from "../ui/Table";
import { DescriptionTooltip } from "../ui/DescriptionTooltip";

type ReturnTableRow = {
  name: string;
  type: string;
  description?: string;
};

interface ReturnTableProps extends React.ComponentProps<"table"> {
  rows: ReturnTableRow[];
}

const ReturnTable = forwardRef<React.ComponentRef<"table">, ReturnTableProps>(({ rows, className, ...props }, forwardedRef) => {
  return (
    <Table.Root className={clsx(className)} ref={forwardedRef} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Type</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, type, description }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <Table.CellLabel>Name</Table.CellLabel>
              <div className="flex items-center gap-1">
                <InlineCode>{name}</InlineCode>
                <DescriptionTooltip description={description} />
              </div>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Type</Table.CellLabel>
              <div className="font-code">{type}</div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
});
ReturnTable.displayName = "ReturnTable";

export { ReturnTable };
export type { ReturnTableRow, ReturnTableProps };
