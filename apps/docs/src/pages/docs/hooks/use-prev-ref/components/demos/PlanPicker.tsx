import clsx from "clsx";

/* ──────────────────────────────────────────────
   PlanPicker — 데모 공용 프레젠테이셔널 컴포넌트
   요금제 선택 칩과 현재 선택, 상태 문구를 보여줘요
   ────────────────────────────────────────────── */

const PLANS = ["Basic", "Pro", "Max"] as const;
type Plan = (typeof PLANS)[number];

type PlanPickerProps = {
  /** 보드 좌측 상단에 표시할 제목 */
  title: string;
  /** 현재 선택된 요금제 */
  selected: Plan;
  /** 칩을 눌렀을 때 호출돼요 */
  onSelect: (plan: Plan) => void;
  /** 하단에 표시할 상태 문구 */
  status: string;
  /** 상태 문구의 색상 톤 */
  statusTone?: "neutral" | "success" | "danger";
  /** 되돌리기 등 추가 버튼 */
  children?: React.ReactNode;
};

const STATUS_TONE_CLASS = {
  neutral: "text-ink-tertiary",
  success: "text-emerald-600",
  danger: "text-rose-600",
} as const;

const PlanPicker = ({ title, selected, onSelect, status, statusTone = "neutral", children }: PlanPickerProps) => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <p className="text-caption-1 text-ink-tertiary select-none font-semibold">{title}</p>

    <div className="flex gap-2">
      {PLANS.map((plan) => (
        <button
          key={plan}
          type="button"
          onClick={() => onSelect(plan)}
          aria-pressed={plan === selected}
          className={clsx(
            "text-body-3 flex-1 cursor-pointer rounded-xl border px-4 py-3 font-medium transition-colors",
            plan === selected
              ? "border-ink-primary bg-ink-primary text-ink-white"
              : "border-line-regular text-ink-secondary hover:bg-neutral-50",
          )}
        >
          {plan}
        </button>
      ))}
    </div>

    <p className={clsx("text-caption-1 font-code min-h-5 text-center", STATUS_TONE_CLASS[statusTone])}>{status}</p>

    <div className="flex flex-wrap justify-center gap-2">{children}</div>
  </div>
);

export default PlanPicker;
export { PLANS };
export type { Plan };
