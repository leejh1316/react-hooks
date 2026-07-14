import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { Button } from "@src/components/ui";
import { useState } from "react";
import { createPortal } from "react-dom";

/* ──────────────────────────────────────────────
   Demo: useFocusTrap 적용
   실제 Dialog처럼 오버레이 위에 띄워요
   ────────────────────────────────────────────── */

const FocusTrapDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

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
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="focus-trap-demo-title"
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false);
              }}
              className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            >
              <h5 id="focus-trap-demo-title" className="text-title-4 text-ink-primary mb-1 font-semibold">
                프로필 편집
              </h5>
              <p className="text-caption-1 text-ink-tertiary mb-4">
                Tab / Shift+Tab을 눌러도 포커스가 다이얼로그 밖으로 나가지 않아요. Esc 또는 버튼으로 닫으면 이전 포커스가 복원돼요.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  data-initial-focus
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

export default FocusTrapDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const FOCUS_TRAP_DEMO_CODE = `import { useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

function FocusTrapDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  return (
    <>
      <button onClick={() => setIsOpen(true)}>다이얼로그 열기</button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 — 클릭 시 닫기 */}
            <div aria-hidden="true" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50" />

            <div
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false);
              }}
              className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            >
              <h5 id="dialog-title">프로필 편집</h5>
              {/* data-initial-focus가 있어 이름 입력에 먼저 포커스돼요 */}
              <input data-initial-focus type="text" placeholder="이름" />
              <input type="email" placeholder="이메일" />
              <button onClick={() => setIsOpen(false)}>취소</button>
              <button onClick={() => setIsOpen(false)}>저장</button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}`;
