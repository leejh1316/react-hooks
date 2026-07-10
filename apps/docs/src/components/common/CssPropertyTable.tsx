import clsx from "clsx";
import { forwardRef } from "react";
import { InlineCode } from "../ui/InlineCode";
import { Table } from "../ui/Table";

type CssPropertyTableRow = {
  name: string;
  description: string;
};
interface CssPropertyTableProps extends React.ComponentProps<"table"> {
  rows: CssPropertyTableRow[];
}
const CssPropertyTable = forwardRef<React.ComponentRef<"table">, CssPropertyTableProps>(({ rows, className, ...props }, forwardedRef) => {
  return (
    <Table.Root className={clsx(className)} ref={forwardedRef} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Description</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, description }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <Table.CellLabel>Name</Table.CellLabel>
              <div className="flex items-center gap-1">
                <InlineCode>{name}</InlineCode>
              </div>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              <Table.CellLabel>Description</Table.CellLabel>
              <div className="">{description}</div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
});
CssPropertyTable.displayName = "CssPropertyTable";

export { CssPropertyTable };
export type { CssPropertyTableProps, CssPropertyTableRow };
