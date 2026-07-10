import clsx from "clsx";
import { forwardRef } from "react";
import { InlineCode } from "../ui/InlineCode";
import { Table } from "../ui/Table";
import { DescriptionTooltip } from "../ui/DescriptionTooltip";

type ParameterTableRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
};
interface ParameterTableProps extends React.ComponentProps<"table"> {
  rows: ParameterTableRow[];
}
const ParameterTable = forwardRef<React.ComponentRef<"table">, ParameterTableProps>(({ rows, className, ...props }, forwardedRef) => {
  return (
    <Table.Root className={clsx(className)} ref={forwardedRef} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Type</Table.Head>
          <Table.Head>Default</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, type, defaultValue, description }) => (
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
ParameterTable.displayName = "ParameterTable";

export { ParameterTable };
export type { ParameterTableRow, ParameterTableProps };
