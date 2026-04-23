import { memo } from "react";
import { Button } from "@/shared/ui";

interface PropsCallbackChildProps {
  onClick: () => void;
  creationCount: number;
}

export const PropsCallbackChild = memo(({ onClick, creationCount }: PropsCallbackChildProps) => (
  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
    <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-3">
      자식 컴포넌트 (memo)
    </div>
    <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-3">
      useCallback 재생성 횟수: {creationCount}
    </div>
    <Button size="sm" onClick={onClick}>
      콜백 실행
    </Button>
  </div>
));

PropsCallbackChild.displayName = "PropsCallbackChild";
