import clsx from "clsx";
import { forwardRef } from "react";
import { Table } from "../ui/Table";

type BehaviorTableRow = {
  name: string;
  description: string;
};

interface BehaviorTableProps extends React.ComponentProps<"table"> {
  rows: BehaviorTableRow[];
}

const BehaviorTable = forwardRef<React.ComponentRef<"table">, BehaviorTableProps>(({ rows, className, ...props }, forwardedRef) => {
  return (
    <Table.Root className={clsx(className)} ref={forwardedRef} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-44">동작</Table.Head>
          <Table.Head>설명</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(({ name, description }) => (
          <Table.Row key={name}>
            <Table.Cell>
              {/* <Table.CellLabel>동작</Table.CellLabel> */}
              <span className="text-ink-primary font-medium">{name}</span>
            </Table.Cell>
            <Table.Cell className="items-stretch">
              {/* <Table.CellLabel>설명</Table.CellLabel> */}
              <div>{description}</div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
});
BehaviorTable.displayName = "BehaviorTable";

export { BehaviorTable };
export type { BehaviorTableRow, BehaviorTableProps };
