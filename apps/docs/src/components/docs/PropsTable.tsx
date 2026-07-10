import clsx from "clsx";
import { forwardRef } from "react";
import { InlineCode } from "../ui/InlineCode";
import { Table } from "../ui/Table";
import { DescriptionTooltip } from "../ui/DescriptionTooltip";

type PropsTableRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
};
interface PropsTableProps extends React.ComponentProps<"table"> {
  rows: PropsTableRow[];
}
const PropsTable = forwardRef<React.ComponentRef<"table">, PropsTableProps>(({ rows, className, ...props }, forwardedRef) => {
  return (
    <Table.Root className={clsx(className)} ref={forwardedRef} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Prop</Table.Head>
          <Table.Head>Type</Table.Head>
          <Table.Head>Default</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, type, defaultValue, description }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <Table.CellLabel>Prop</Table.CellLabel>
              <div className="flex items-center gap-1">
                <InlineCode>{name}</InlineCode>
                <DescriptionTooltip description={description} />
              </div>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Type</Table.CellLabel>
              <div className="font-code">{type}</div>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Default</Table.CellLabel>
              <div className="font-code">{defaultValue || "—"}</div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
});
PropsTable.displayName = "PropsTable";

export { PropsTable };
export type { PropsTableRow, PropsTableProps };
