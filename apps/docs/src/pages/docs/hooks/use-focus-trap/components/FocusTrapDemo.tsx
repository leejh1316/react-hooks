import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { useState } from "react";

/** useFocusTrap 훅을 실제로 사용하는 라이브 데모 */
const FocusTrapDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-ink-primary text-ink-white text-body-3 rounded-lg px-5 py-2.5 font-semibold transition-opacity hover:opacity-85"
      >
        다이얼로그 열기
      </button>

      {isOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="focus-trap-demo-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          className="border-line-regular w-full max-w-sm rounded-xl border bg-white p-5 shadow-lg"
        >
          <h5 id="focus-trap-demo-title" className="text-title-4 text-ink-primary mb-1 font-semibold">
            프로필 편집
          </h5>
          <p className="text-caption-1 text-ink-tertiary mb-4">
            Tab / Shift+Tab을 눌러도 포커스가 다이얼로그 밖으로 나가지 않습니다. Esc 또는 버튼으로 닫으면 이전 포커스가 복원됩니다.
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
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="border-line-regular text-ink-secondary text-body-3 rounded-lg border px-4 py-2 font-medium transition-colors hover:bg-neutral-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-ink-primary text-ink-white text-body-3 rounded-lg px-4 py-2 font-semibold transition-opacity hover:opacity-85"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTrapDemo;
