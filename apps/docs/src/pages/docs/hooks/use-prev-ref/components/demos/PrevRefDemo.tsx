import { usePrevRef } from "@leejaehyeok/use-prev-ref";
import { Button } from "@src/components/ui";
import { useState } from "react";
import PlanPicker, { type Plan } from "./PlanPicker";

/* ──────────────────────────────────────────────
   Demo: usePrevRef 적용
   이벤트 핸들러에서 prevPlanRef.current를 읽으면
   정확히 직전 선택으로 되돌릴 수 있어요
   ────────────────────────────────────────────── */

const PrevRefDemo = () => {
  const [plan, setPlan] = useState<Plan>("Basic");
  const prevPlanRef = usePrevRef(plan);
  const [restoreLog, setRestoreLog] = useState<string | null>(null);

  // 이벤트 핸들러에서 읽으면 .current에 정확히 직전 선택이 담겨 있어요.
  const restore = () => {
    const prevPlan = prevPlanRef.current;

    setRestoreLog(`${plan} → ${prevPlan} 되돌리기 완료`);
    setPlan(prevPlan);
  };

  return (
    <PlanPicker
      title="usePrevRef로 직전 선택 추적"
      selected={plan}
      onSelect={setPlan}
      status={restoreLog ?? `현재: ${plan} · 요금제를 바꾼 뒤 되돌리기를 눌러 보세요`}
      statusTone={restoreLog ? "success" : "neutral"}
    >
      <Button variant="secondary" onClick={restore}>
        직전 선택으로 되돌리기
      </Button>
    </PlanPicker>
  );
};

export default PrevRefDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const PREV_REF_DEMO_CODE = `import { useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

function PlanSelector() {
  const [plan, setPlan] = useState("Basic");
  const prevPlanRef = usePrevRef(plan);

  // 이벤트 핸들러에서 읽으면 .current에 정확히 직전 선택이 담겨 있어요.
  const restore = () => setPlan(prevPlanRef.current);

  return (
    <>
      <button onClick={() => setPlan("Pro")}>Pro</button>
      <button onClick={restore}>직전 선택으로 되돌리기</button>
    </>
  );
}`;
