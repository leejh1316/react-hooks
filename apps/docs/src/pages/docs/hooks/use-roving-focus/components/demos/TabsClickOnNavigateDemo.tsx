import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import clsx from "clsx";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: clickOnNavigate 탭
   방향키로 포커스가 이동하는 즉시 click()이
   호출되어 탭이 자동 선택돼요 (WAI-ARIA 자동 활성화 탭 패턴)
   ────────────────────────────────────────────── */

const TABS = [
  { id: "account", label: "계정", content: "이름, 이메일 등 계정 정보를 관리해요." },
  { id: "security", label: "보안", content: "비밀번호와 2단계 인증을 설정해요." },
  { id: "notification", label: "알림", content: "푸시·이메일 알림 수신 여부를 선택해요." },
  { id: "billing", label: "결제", content: "결제 수단과 청구 내역을 확인해요." },
];

const TabsClickOnNavigateDemo = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "horizontal",
    loop: true,
    clickOnNavigate: true, // 포커스 이동 즉시 click() 호출 → 탭 자동 선택
  });

  const currentTab = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-3">
      <div ref={containerRef} onKeyDown={handleKeyDown} role="tablist" aria-label="설정 탭" className="border-line-regular flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            data-roving-item
            role="tab"
            aria-selected={tab.id === activeTab}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "text-body-3 focus:ring-primary-500 -mb-px rounded-t-lg border-b-2 px-4 py-2 transition-colors focus:ring-2 focus:outline-none",
              tab.id === activeTab
                ? "border-primary-500 text-ink-primary font-semibold"
                : "text-ink-tertiary hover:text-ink-secondary border-transparent",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="text-body-3 text-ink-secondary min-h-12 px-1">
        {currentTab.content}
      </div>
      <p className="text-caption-2 text-ink-tertiary select-none">
        탭을 클릭한 뒤 ←/→를 눌러보세요. 포커스가 이동하는 즉시 탭이 선택돼요(Enter를 누를 필요가 없어요).
      </p>
    </div>
  );
};

export default TabsClickOnNavigateDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const TABS_CLICK_ON_NAVIGATE_DEMO_CODE = `import { useState } from "react";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("account");

  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "horizontal", // ←/→ 키만 사용
    loop: true,
    clickOnNavigate: true, // 포커스 이동 즉시 click() 호출 → onClick으로 탭 선택
  });

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          data-roving-item
          role="tab"
          aria-selected={tab.id === activeTab}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}`;
