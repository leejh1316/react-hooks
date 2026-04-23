import { memo } from "react";
import { Button } from "@/shared/ui";

interface ComparisonChild1Props {
  onClick: () => void;
  title: string;
  creationCount: number;
}

export const ComparisonChild1 = memo(
  ({ onClick, title, creationCount }: ComparisonChild1Props) => (
    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded">
      <div className="text-xs font-semibold mb-2">{title}</div>
      <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-2">
        useCallback 재생성 횟수: {creationCount}
      </div>
      <Button size="sm" onClick={onClick}>
        클릭
      </Button>
    </div>
  )
);

ComparisonChild1.displayName = "ComparisonChild1";
