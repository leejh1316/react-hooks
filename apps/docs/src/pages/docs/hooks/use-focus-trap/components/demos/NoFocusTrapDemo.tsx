import { Button } from "@src/components/ui";
import { useState } from "react";
import { createPortal } from "react-dom";

/* ──────────────────────────────────────────────
   Demo: 포커스 트랩 미적용 (비교용)
   동일한 Dialog UI지만 Tab 포커스가 다이얼로그 밖으로 벗어납니다
   ────────────────────────────────────────────── */

const NoFocusTrapDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full justify-center">
      <Button size="lg" onClick={() => setIsOpen(true)}>
        다이얼로그 열기
      </Button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 배경 오버레이 — 클릭 시 닫기 */}
            <div aria-hidden="true" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50" />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="no-focus-trap-demo-title"
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false);
              }}
              className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            >
              <h5 id="no-focus-trap-demo-title" className="text-title-4 text-ink-primary mb-1 font-semibold">
                프로필 편집
              </h5>
              <p className="text-caption-1 text-ink-tertiary mb-4">
                열려도 포커스가 다이얼로그로 이동하지 않고, Tab / Shift+Tab을 누르면 포커스가 다이얼로그 밖으로 벗어납니다. 닫아도 이전
                포커스가 복원되지 않습니다.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="이름"
                  className="border-line-regular text-body-3 focus:border-primary-500 w-full rounded-lg border px-3 py-2 outline-none"
                />
                <input
                  type="email"
                  placeholder="이메일"
                  className="border-line-regular text-body-3 focus:border-primary-500 w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  취소
                </Button>
                <Button onClick={() => setIsOpen(false)}>저장</Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default NoFocusTrapDemo;
