import { useControllableState } from "@leejaehyeok/use-controllable-state";
import StarRating from "./StarRating";

/* ──────────────────────────────────────────────
   ControllableRating — useControllableState 적용
   value를 전달하면 제어 모드, 생략하면 비제어 모드로 동작해요
   ────────────────────────────────────────────── */

type ControllableRatingProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

const ControllableRating = ({ value, defaultValue = 0, onChange }: ControllableRatingProps) => {
  const [rating, setRating] = useControllableState({ value, defaultValue, onChange });

  return <StarRating value={rating} onSelect={setRating} />;
};

export default ControllableRating;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const RATING_COMPONENT_CODE = `import { useControllableState } from "@leejaehyeok/use-controllable-state";

type RatingProps = {
  value?: number; // 전달하면 제어 모드
  defaultValue?: number; // 비제어 모드의 초기값
  onChange?: (value: number) => void;
};

function Rating({ value, defaultValue = 0, onChange }: RatingProps) {
  // value가 undefined면 내부 상태(defaultValue), 아니면 외부 상태(value)를 사용해요.
  const [rating, setRating] = useControllableState({ value, defaultValue, onChange });

  return (
    <div>
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} onClick={() => setRating(score)}>
          {score <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}`;
