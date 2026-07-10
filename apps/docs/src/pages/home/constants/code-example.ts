/* ──────────────────────────────────────────────
   Code Example
   ────────────────────────────────────────────── */

export const CODE_EXAMPLE_FILE_NAME = "Modal.tsx";

export const CODE_EXAMPLE = `import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

function Modal({ isOpen, onClose }) {
  const containerRef = useFocusTrap();

  // 컨테이너가 제거되면 트랩이 해제되고 이전 포커스가 복원됩니다
  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      <input type="text" placeholder="이름" />
      <button onClick={onClose}>닫기</button>
    </div>
  );
}`;
