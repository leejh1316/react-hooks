import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { DemoSection, Button, Kbd } from "@/shared/ui";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <DemoSection
      title="Modal Dialog"
      description={
        <>
          <Kbd>Tab</Kbd> / <Kbd>Shift+Tab</Kbd>이 모달 내부에서 순환합니다 · <Kbd>Esc</Kbd>로
          닫기
        </>
      }
    >
      <Button ref={triggerRef} onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={containerRef}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(420px,calc(100vw-2rem))] bg-white dark:bg-slate-800 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-7"
          >
            <h3 id="modal-title" className="mt-0 mb-3 text-[1.1rem] font-semibold">
              정말 삭제하시겠습니까?
            </h3>
            <p className="mt-0 mb-6 text-[0.9rem] text-gray-500 dark:text-gray-400 leading-relaxed">
              이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="cancel" size="md" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button variant="danger" size="md" onClick={() => setIsOpen(false)}>
                삭제
              </Button>
            </div>
          </div>
        </>
      )}
    </DemoSection>
  );
}
