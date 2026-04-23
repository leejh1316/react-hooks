import { memo } from "react";
import { Button } from "@/shared/ui";

interface ComparisonChild2Props {
  onClick: () => void;
  title: string;
  creationCount: number;
}

export const ComparisonChild2 = memo(
  ({ onClick, title, creationCount }: ComparisonChild2Props) => (
    <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded">
      <div className="text-xs font-semibold mb-2">{title}</div>
      <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-2">
        useCallback 재생성 횟수: {creationCount}
      </div>
      <Button size="sm" onClick={onClick}>
        클릭
      </Button>
    </div>
  )
);

ComparisonChild2.displayName = "ComparisonChild2";
