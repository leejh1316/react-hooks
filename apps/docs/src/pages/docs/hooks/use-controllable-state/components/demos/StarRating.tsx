import { Star } from "lucide-react";

/* ──────────────────────────────────────────────
   StarRating — 데모 공용 프레젠테이셔널 컴포넌트
   값과 선택 핸들러만 받아 별점 UI를 그려요
   ────────────────────────────────────────────── */

type StarRatingProps = {
  value: number;
  onSelect: (score: number) => void;
};

const StarRating = ({ value, onSelect }: StarRatingProps) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((score) => (
      <button
        key={score}
        type="button"
        aria-label={`${score}점`}
        onClick={() => onSelect(score)}
        className="cursor-pointer transition-transform hover:scale-110"
      >
        <Star size={28} className={score <= value ? "text-primary-500 fill-current" : "text-icon-tertiary"} />
      </button>
    ))}
  </div>
);

export default StarRating;
