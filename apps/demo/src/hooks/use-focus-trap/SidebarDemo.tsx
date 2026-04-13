import React, { useEffect } from "react";
import { useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

export function SidebarDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  useEffect(() => {
    // if (isOpen) {
    //   const first = (containerRef.current as HTMLElement | null)?.querySelector<HTMLElement>(
    //     "button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    //   );
    //   first?.focus();
    // }
  }, [isOpen]);

  return (
    <section className="demo-section">
      <h2>Sidebar / Drawer</h2>
      <p className="description">
        사이드바가 열린 동안 <kbd className="kbd">Tab</kbd>이 패널 내부에서만 순환합니다 · <kbd className="kbd">Esc</kbd>로 닫기
      </p>
      <button className="ctrl-btn" onClick={() => setIsOpen(true)}>
        사이드바 열기
      </button>

      {isOpen && (
        <>
          <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
          <aside ref={containerRef} className="sidebar" aria-label="설정 패널" onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}>
            <div className="sidebar-header">
              <h3>설정</h3>
              <button className="sidebar-close" aria-label="닫기" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <div className="sidebar-body">
              <label className="sidebar-field">
                <span>이름</span>
                <input type="text" placeholder="이름 입력" />
              </label>
              <label className="sidebar-field">
                <span>이메일</span>
                <input type="email" placeholder="이메일 입력" />
              </label>
              <label className="sidebar-field">
                <span>알림</span>
                <select>
                  <option>모두</option>
                  <option>중요만</option>
                  <option>없음</option>
                </select>
              </label>
              <button className="ctrl-btn sidebar-save-btn">저장</button>
            </div>
          </aside>
        </>
      )}
    </section>
  );
}
