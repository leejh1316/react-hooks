import { Button } from "@src/components/ui";
import { useState } from "react";
import StarRating from "./StarRating";

/* ──────────────────────────────────────────────
   Demo: useControllableState 미적용 (비교용)
   value prop을 useState 초기값으로만 사용해 부모 상태와 별점이 서로 어긋나요
   ────────────────────────────────────────────── */

const NoControllableRatingDemo = () => {
  const [parentValue, setParentValue] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <InternalStateRating value={parentValue} />

      <div className="border-line-regular flex h-14 w-full max-w-sm items-center justify-center rounded-lg border">
        <span className="text-body-3 text-ink-tertiary">부모 상태: {parentValue}점</span>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setParentValue(5)}>
          부모 상태를 5점으로
        </Button>
        <Button onClick={() => setParentValue(0)}>부모 상태 초기화</Button>
      </div>
    </div>
  );
};

/* value prop을 useState 초기값으로만 사용하는 패턴 — 마운트 이후의 value 변경은 무시돼요 */
const InternalStateRating = ({ value }: { value: number }) => {
  const [rating, setRating] = useState(value);

  return <StarRating value={rating} onSelect={setRating} />;
};

export default NoControllableRatingDemo;
