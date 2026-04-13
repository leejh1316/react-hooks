import { useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { DemoSection, Button, Kbd } from "@/shared/ui";

export function SidebarDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  return (
    <DemoSection
      title="Sidebar / Drawer"
      description={
        <>
          사이드바가 열린 동안 <Kbd>Tab</Kbd>이 패널 내부에서만 순환합니다 · <Kbd>Esc</Kbd>로
          닫기
        </>
      }
    >
      <Button onClick={() => setIsOpen(true)}>사이드바 열기</Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside
            ref={containerRef}
            aria-label="설정 패널"
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            className="fixed top-0 right-0 bottom-0 z-50 w-[min(340px,100vw)] bg-white dark:bg-slate-800 shadow-[-4px_0_24px_rgba(0,0,0,0.12)] dark:shadow-[-4px_0_24px_rgba(0,0,0,0.4)] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-700">
              <h3 className="m-0 text-base font-semibold">설정</h3>
              <button
                aria-label="닫기"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-transparent border border-transparent rounded-md text-gray-500 dark:text-gray-400 text-sm cursor-pointer transition-colors duration-100
                  hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-50
                  focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 px-6 py-6 flex flex-col gap-4 overflow-y-auto">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">이름</span>
                <input
                  type="text"
                  placeholder="이름 입력"
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-inherit transition-colors duration-100
                    focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">이메일</span>
                <input
                  type="email"
                  placeholder="이메일 입력"
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-inherit transition-colors duration-100
                    focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">알림</span>
                <select
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-inherit transition-colors duration-100
                    focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15"
                >
                  <option>모두</option>
                  <option>중요만</option>
                  <option>없음</option>
                </select>
              </label>
              <Button fullWidth className="mt-2">
                저장
              </Button>
            </div>
          </aside>
        </>
      )}
    </DemoSection>
  );
}
