import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import clsx from "clsx";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 옵션 조정 플레이그라운드
   orientation / loop / colSkipCount / clickOnNavigate /
   scrollIntoView / enableHome / enableEnd를 실시간으로
   바꿔가며 키보드 내비게이션 동작을 확인해요
   ────────────────────────────────────────────── */

type Orientation = "horizontal" | "vertical" | "both";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
  <label className="text-caption-1 text-ink-secondary flex cursor-pointer items-center gap-2 select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-ink-primary h-4 w-4 cursor-pointer"
    />
    <span className="font-code">{label}</span>
  </label>
);

const ORIENTATIONS: Orientation[] = ["horizontal", "vertical", "both"];

const DISABLED_INDICES = [2, 6];

const OptionsPlaygroundDemo = () => {
  const [orientation, setOrientation] = useState<Orientation>("both");
  const [loop, setLoop] = useState(true);
  const [colSkipCount, setColSkipCount] = useState(4);
  const [itemCount, setItemCount] = useState(12);
  const [clickOnNavigate, setClickOnNavigate] = useState(false);
  const [scrollIntoView, setScrollIntoView] = useState(false);
  const [enableHome, setEnableHome] = useState(true);
  const [enableEnd, setEnableEnd] = useState(true);
  const [hasDisabledItems, setHasDisabledItems] = useState(false);

  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);
  const logIdRef = useRef(0);

  const appendLog = (text: string) => {
    setLogs((prev) => [{ id: logIdRef.current++, text }, ...prev].slice(0, 5));
  };

  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation,
    loop,
    colSkipCount,
    clickOnNavigate,
    scrollIntoView,
    enableHome,
    enableEnd,
    onNavigate: ({ activeIndex, direction }) => appendLog(`onNavigate → index: ${activeIndex}, direction: ${direction}`),
    onUnderflow: () => appendLog("onUnderflow → 첫 아이템 경계에 도달했어요"),
    onOverflow: () => appendLog("onOverflow → 마지막 아이템 경계에 도달했어요"),
  });

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {/* 옵션 컨트롤 */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
            orientation: <span className="text-ink-primary font-code">{orientation}</span>
          </span>
          <div className="flex gap-1">
            {ORIENTATIONS.map((value) => (
              <button
                key={value}
                onClick={() => setOrientation(value)}
                className={clsx(
                  "text-caption-1 font-code cursor-pointer rounded-lg border px-2 py-1 transition-colors",
                  value === orientation
                    ? "border-ink-primary bg-ink-primary text-ink-white font-semibold"
                    : "border-line-regular text-ink-secondary hover:bg-neutral-100",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
            colSkipCount: <span className="text-ink-primary font-code">{colSkipCount}</span>
            {colSkipCount === 0 && <span className="font-normal"> (1차원 이동)</span>}
          </span>
          <input
            type="range"
            min={0}
            max={6}
            value={colSkipCount}
            onChange={(e) => setColSkipCount(Number(e.target.value))}
            className="accent-ink-primary w-full cursor-pointer"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption-1 text-ink-tertiary font-semibold select-none">
            아이템 수: <span className="text-ink-primary font-code">{itemCount}</span>
          </span>
          <input
            type="range"
            min={4}
            max={20}
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            className="accent-ink-primary w-full cursor-pointer"
          />
        </label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Checkbox label="loop" checked={loop} onChange={setLoop} />
          <Checkbox label="clickOnNavigate" checked={clickOnNavigate} onChange={setClickOnNavigate} />
          <Checkbox label="scrollIntoView" checked={scrollIntoView} onChange={setScrollIntoView} />
          <Checkbox label="enableHome" checked={enableHome} onChange={setEnableHome} />
          <Checkbox label="enableEnd" checked={enableEnd} onChange={setEnableEnd} />
          <Checkbox label="disabled 포함" checked={hasDisabledItems} onChange={setHasDisabledItems} />
        </div>
      </div>

      {/* 아이템 영역 — colSkipCount > 0이면 그리드, 0이면 한 줄 배치 */}
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        role="toolbar"
        aria-label="플레이그라운드 아이템"
        className={clsx("border-line-regular max-h-56 gap-1 overflow-y-auto rounded-xl border p-2", colSkipCount > 0 ? "grid" : "flex flex-wrap")}
        style={colSkipCount > 0 ? { gridTemplateColumns: `repeat(${colSkipCount}, minmax(0, 1fr))` } : undefined}
      >
        {Array.from({ length: itemCount }, (_, index) => {
          const disabled = hasDisabledItems && DISABLED_INDICES.includes(index);
          return (
            <button
              key={index}
              data-roving-item
              disabled={disabled}
              onClick={() => clickOnNavigate && appendLog(`click → 아이템 ${index}`)}
              className="text-body-3 text-ink-secondary focus:ring-primary-500 h-10 min-w-10 shrink-0 rounded-lg transition-colors hover:bg-neutral-100 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {index}
            </button>
          );
        })}
      </div>

      {/* 이벤트 로그 */}
      <div className="font-code text-caption-1 border-line-regular min-h-24 w-full rounded-xl border p-4 leading-relaxed">
        {logs.length === 0 ? (
          <p className="text-ink-tertiary">아이템을 클릭한 뒤 방향키 / Home / End 키를 눌러보세요</p>
        ) : (
          logs.map((log, index) => (
            <p key={log.id} className={clsx(index === 0 ? "text-ink-primary font-semibold" : "text-ink-tertiary")}>
              {log.text}
            </p>
          ))
        )}
      </div>

      <p className="text-caption-2 text-ink-tertiary select-none">
        colSkipCount를 0으로 낮추면 ↑/↓도 한 칸씩 이동하고, loop를 끄면 경계에서 onUnderflow / onOverflow가 호출돼요. itemSelector와
        initialIndex는 마운트 시점에 적용되는 옵션이라 플레이그라운드에서 제외했어요.
      </p>
    </div>
  );
};

export default OptionsPlaygroundDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const OPTIONS_PLAYGROUND_DEMO_CODE = `import { useRovingFocus } from "@leejaehyeok/use-roving-focus";

// 옵션은 렌더링마다 반영되므로 상태와 연결하면 실시간으로 동작이 바뀌어요.
const { containerRef, handleKeyDown } = useRovingFocus({
  orientation, // "horizontal" | "vertical" | "both"
  loop, // 경계에서 반대쪽으로 순환
  colSkipCount, // 그리드 열 수 — ↑/↓ 점프 폭 (0이면 1차원 이동)
  clickOnNavigate, // 포커스 이동 즉시 click() 호출
  scrollIntoView, // 이동한 아이템이 보이도록 자동 스크롤
  enableHome, // Home 키로 첫 아이템 이동
  enableEnd, // End 키로 마지막 아이템 이동
  onNavigate: ({ activeIndex, direction }) => console.log(activeIndex, direction),
  onUnderflow: () => console.log("첫 아이템 경계"),
  onOverflow: () => console.log("마지막 아이템 경계"),
});`;
