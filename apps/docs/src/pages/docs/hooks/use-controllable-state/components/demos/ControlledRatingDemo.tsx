import { Button } from "@src/components/ui";
import { useState } from "react";
import ControllableRating from "./ControllableRating";

/* ──────────────────────────────────────────────
   Demo: useControllableState 적용 — 제어 모드
   부모가 value + onChange로 상태를 소유하고 외부 버튼으로도 제어해요
   ────────────────────────────────────────────── */

const ControlledRatingDemo = () => {
  const [rating, setRating] = useState(0);
  const [changeCount, setChangeCount] = useState(0);

  const handleChange = (value: number) => {
    setRating(value);
    setChangeCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ControllableRating value={rating} onChange={handleChange} />

      <div className="border-line-regular flex h-14 w-full max-w-sm items-center justify-center rounded-lg border">
        <span className="text-body-3 text-ink-tertiary">
          부모 상태: {rating}점 · onChange 호출 {changeCount}회
        </span>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setRating(5)}>
          5점으로 설정
        </Button>
        <Button onClick={() => setRating(0)}>초기화</Button>
      </div>
    </div>
  );
};

export default ControlledRatingDemo;
