import { useState } from "react";
import ControllableRating from "./ControllableRating";

/* ──────────────────────────────────────────────
   Demo: useControllableState 적용 — 비제어 모드
   value 없이 defaultValue만 전달해 컴포넌트가 스스로 상태를 관리해요
   ────────────────────────────────────────────── */

const UncontrolledRatingDemo = () => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ControllableRating defaultValue={3} onChange={(value) => setMessage(`onChange(${value}) 호출됨`)} />

      <div className="border-line-regular flex h-14 w-full max-w-sm items-center justify-center rounded-lg border">
        <span className="text-body-3 text-ink-tertiary">{message ?? "별을 클릭해 보세요 (defaultValue: 3)"}</span>
      </div>
    </div>
  );
};

export default UncontrolledRatingDemo;
