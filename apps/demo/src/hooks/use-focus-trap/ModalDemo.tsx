import React, { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <section className="demo-section">
      <h2>Modal Dialog</h2>
      <p className="description">
        <kbd className="kbd">Tab</kbd> / <kbd className="kbd">Shift+Tab</kbd>이 모달 내부에서 순환합니다 · <kbd className="kbd">Esc</kbd>로
        닫기
      </p>
      <button className="ctrl-btn" ref={triggerRef} onClick={() => setIsOpen(true)}>
        모달 열기
      </button>

      {isOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={containerRef}
            className="modal"
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          >
            <h3 id="modal-title" className="modal-title">
              정말 삭제하시겠습니까?
            </h3>
            <p className="modal-body">이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setIsOpen(false)}>
                취소
              </button>
              <button className="modal-btn modal-btn--danger" onClick={() => setIsOpen(false)}>
                삭제
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
