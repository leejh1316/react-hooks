import { useRovingFocus, type NavigationDetail } from "@leejaehyeok/use-roving-focus";
import { useState } from "react";

/* ──────────────────────────────────────────────
   Demo: useRovingFocus 적용 (대표 데모)
   그룹 전체가 하나의 Tab 스톱이 되고,
   내부 이동은 방향키·Home·End로 해요
   ────────────────────────────────────────────── */

const MENU_ITEMS = [
  { label: "홈", disabled: false },
  { label: "검색", disabled: false },
  { label: "알림", disabled: true },
  { label: "메시지", disabled: false },
  { label: "설정", disabled: false },
];

const BasicRovingFocusDemo = () => {
  const [lastNavigation, setLastNavigation] = useState<Pick<NavigationDetail, "activeIndex" | "direction"> | null>(null);

  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical",
    loop: true,
    onNavigate: ({ activeIndex, direction }) => setLastNavigation({ activeIndex, direction }),
  });

  return (
    <div className="flex w-full max-w-xs flex-col items-stretch gap-4">
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        role="menu"
        aria-label="적용 메뉴"
        className="border-line-regular flex flex-col gap-1 rounded-xl border p-2"
      >
        {MENU_ITEMS.map(({ label, disabled }) => (
          <button
            key={label}
            data-roving-item
            role="menuitem"
            disabled={disabled}
            className="text-body-3 text-ink-secondary hover:bg-neutral-100 focus:ring-primary-500 rounded-lg px-3 py-2 text-left transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            {label}
            {disabled && <span className="text-caption-2 text-ink-tertiary ml-2">(disabled)</span>}
          </button>
        ))}
      </div>
      <button className="text-body-3 text-ink-secondary border-line-regular focus:ring-primary-500 rounded-lg border px-3 py-2 transition-colors hover:bg-neutral-100 focus:ring-2 focus:outline-none">
        목록 다음 액션 버튼
      </button>
      <div className="font-code text-caption-1 text-ink-secondary border-line-regular rounded-xl border p-3">
        {lastNavigation ? (
          <p>
            activeIndex: <span className="text-ink-primary font-semibold">{lastNavigation.activeIndex}</span> · direction:{" "}
            <span className="text-ink-primary font-semibold">{lastNavigation.direction}</span>
          </p>
        ) : (
          <p>↑ / ↓ / Home / End 키로 이동해 보세요</p>
        )}
      </div>
      <p className="text-caption-2 text-ink-tertiary select-none">
        메뉴 항목을 클릭한 뒤 ↑/↓로 이동해 보세요. disabled 항목은 건너뛰고, 끝에서 반대쪽으로 순환하며(loop), Tab을 누르면 목록을 한 번에
        빠져나가요.
      </p>
    </div>
  );
};

export default BasicRovingFocusDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const BASIC_ROVING_FOCUS_DEMO_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

function Menu() {
  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical", // ↑/↓ 키만 사용
    loop: true, // 끝에서 반대쪽으로 순환
    onNavigate: ({ activeIndex, direction }) => {
      console.log(activeIndex, direction);
    },
  });

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} role="menu">
      <button data-roving-item role="menuitem">홈</button>
      <button data-roving-item role="menuitem">검색</button>
      {/* disabled 항목은 방향키 이동 시 자동으로 건너뛰어요 */}
      <button data-roving-item role="menuitem" disabled>알림</button>
      <button data-roving-item role="menuitem">메시지</button>
      <button data-roving-item role="menuitem">설정</button>
    </div>
  );
}`;
