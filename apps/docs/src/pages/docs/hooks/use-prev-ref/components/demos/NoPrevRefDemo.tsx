import { Button } from "@src/components/ui";
import { useState } from "react";
import PlanPicker, { type Plan } from "./PlanPicker";

/* ──────────────────────────────────────────────
   Demo: usePrevRef 미적용 (비교용)
   직전 선택을 어디에도 보관하지 않아서
   되돌리기가 기본값으로만 이동해요
   ────────────────────────────────────────────── */

const DEFAULT_PLAN: Plan = "Basic";

const NoPrevRefDemo = () => {
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);

  // 이전 선택을 알 수 없으니 기본값으로 되돌리는 것 말고는 방법이 없어요.
  const restore = () => setPlan(DEFAULT_PLAN);

  return (
    <PlanPicker
      title="이전 값 추적 없이"
      selected={plan}
      onSelect={setPlan}
      status={`현재: ${plan} · 이전 선택: 알 수 없어요`}
      statusTone="danger"
    >
      <Button variant="secondary" onClick={restore}>
        되돌리기 (기본값으로만 이동)
      </Button>
    </PlanPicker>
  );
};

export default NoPrevRefDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const NO_PREV_REF_DEMO_CODE = `import { useState } from "react";

const DEFAULT_PLAN = "Basic";

function PlanSelector() {
  const [plan, setPlan] = useState(DEFAULT_PLAN);

  // 이전 선택을 알 수 없으니 기본값으로 되돌리는 것 말고는 방법이 없어요.
  const restore = () => setPlan(DEFAULT_PLAN);

  return (
    <>
      <button onClick={() => setPlan("Pro")}>Pro</button>
      <button onClick={restore}>되돌리기</button>
    </>
  );
}`;
