import { memo } from "react";
import { Button } from "@/shared/ui";

interface CallbackRefChildProps {
  onClick: () => void;
}

export const CallbackRefChild = memo(({ onClick }: CallbackRefChildProps) => (
  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3">
      자식 컴포넌트 (memo)
    </div>
    <Button size="sm" onClick={onClick}>
      콜백 실행
    </Button>
  </div>
));

CallbackRefChild.displayName = "CallbackRefChild";
