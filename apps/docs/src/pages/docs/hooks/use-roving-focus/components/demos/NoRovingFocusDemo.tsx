/* ──────────────────────────────────────────────
   Demo: useRovingFocus 미적용
   모든 항목이 Tab 스톱이라 목록을 통과하려면
   항목 수만큼 Tab을 눌러야 해요
   ────────────────────────────────────────────── */

const MENU_ITEMS = ["홈", "검색", "알림", "메시지", "설정"];

const NoRovingFocusDemo = () => {
  return (
    <div className="flex w-full max-w-xs flex-col items-stretch gap-4">
      <div role="menu" aria-label="미적용 메뉴" className="border-line-regular flex flex-col gap-1 rounded-xl border p-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            role="menuitem"
            className="text-body-3 text-ink-secondary hover:bg-neutral-100 focus:ring-primary-500 rounded-lg px-3 py-2 text-left transition-colors focus:ring-2 focus:outline-none"
          >
            {item}
          </button>
        ))}
      </div>
      <button className="text-body-3 text-ink-secondary border-line-regular focus:ring-primary-500 rounded-lg border px-3 py-2 transition-colors hover:bg-neutral-100 focus:ring-2 focus:outline-none">
        목록 다음 액션 버튼
      </button>
      <p className="text-caption-2 text-ink-tertiary select-none">
        메뉴 첫 항목을 클릭한 뒤 Tab을 눌러보세요. 아래 버튼까지 가려면 Tab을 5번 눌러야 하고, 방향키는 동작하지 않아요.
      </p>
    </div>
  );
};

export default NoRovingFocusDemo;
