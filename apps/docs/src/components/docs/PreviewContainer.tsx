import { Card } from "../ui/Card";

const PreviewContainer = ({ children, className = "" }: React.ComponentProps<typeof Card>) => (
  <Card className={`flex min-h-[200px] items-center justify-center rounded-2xl border bg-white p-10 ${className}`}>{children}</Card>
);
export { PreviewContainer };
