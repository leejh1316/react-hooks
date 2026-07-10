import clsx from "clsx";
import * as React from "react";
import { Card } from "./Card";

const TableRoot = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <Card className={clsx("relative w-full overflow-auto", className)}>
    <table ref={ref} className={clsx("text-body-3 w-full caption-bottom text-left")} {...props} />
  </Card>
));
TableRoot.displayName = "Table.Root";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={clsx("hidden md:table-header-group [&_tr]:border-b", className)} {...props} />
  ),
);
TableHeader.displayName = "Table.Header";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={clsx("[&_tr:last-child]:border-0", className)} {...props} />,
);
TableBody.displayName = "Table.Body";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx("border-line-light text-ink-secondary flex flex-col border-b py-3 transition-colors md:table-row md:py-0", className)}
    {...props}
  />
));
TableRow.displayName = "Table.Row";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={clsx("text-ink-secondary bg-neutral-50 px-4 py-3 text-left align-middle font-semibold", className)} {...props} />
));
TableHead.displayName = "Table.Head";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={clsx("flex items-center gap-2 px-4 py-1 align-middle md:table-cell md:py-3", className)} {...props} />
));
TableCell.displayName = "Table.Cell";

const TableCellLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} className={clsx("text-ink-tertiary min-w-16 font-medium md:hidden", className)} {...props} />
));
TableCellLabel.displayName = "Table.CellLabel";

const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  CellLabel: TableCellLabel,
};
export { Table };
