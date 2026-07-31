import clsx from "clsx";

/* ──────────────────────────────────────────────
   StateBoard — 데모 공용 프레젠테이셔널 컴포넌트
   여러 상태의 현재 값을 나란히 보여주고
   값이 서로 일치하는지 배지로 표시해요
   ────────────────────────────────────────────── */

type StateBoardItem = {
  /** 상태를 갱신하는 setter 이름 */
  label: string;
  /** 상태의 역할 설명 */
  caption: string;
  /** 현재 값 */
  value: number;
};

type StateBoardProps = {
  /** 보드 좌측 상단에 표시할 제목 */
  title: string;
  /** 나란히 보여줄 상태 목록 */
  items: StateBoardItem[];
  /** 상태를 갱신하는 버튼들 */
  children?: React.ReactNode;
};

const StateBoard = ({ title, items, children }: StateBoardProps) => {
  const isSynced = items.every((item) => item.value === items[0].value);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption-1 text-ink-tertiary select-none font-semibold">{title}</p>
        <span
          className={clsx(
            "text-caption-2 select-none rounded-full px-2.5 py-1 font-semibold",
            isSynced ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
          )}
        >
          {isSynced ? "모든 값이 같아요" : "값이 어긋났어요"}
        </span>
      </div>

      <div className={clsx("grid gap-3", items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {items.map(({ label, caption, value }) => (
          <div key={label} className="border-line-regular flex flex-col items-center gap-1 rounded-xl border p-4">
            <span className="font-code text-caption-2 text-ink-tertiary select-none">{label}</span>
            <span className="text-title-3 text-ink-primary font-semibold">{value}</span>
            <span className="text-caption-2 text-ink-tertiary select-none text-center">{caption}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
};

export default StateBoard;
export type { StateBoardItem };
