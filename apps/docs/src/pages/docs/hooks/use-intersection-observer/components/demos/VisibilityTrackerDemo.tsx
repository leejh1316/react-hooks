import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";
import { useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Demo: 가시성 실시간 추적
   스크롤 컨테이너(root: "container")를 기준으로 타깃의
   진입/이탈 상태(isVisible, hasEntered)와 onChange 이벤트
   로그를 실시간으로 보여줘요
   ────────────────────────────────────────────── */

type LogEntry = {
  id: number;
  type: "enter" | "exit";
  time: string;
};

const StatusBadge = ({ label, active }: { label: string; active: boolean }) => (
  <span
    className={`text-caption-1 rounded-full px-3 py-1 font-semibold transition-colors ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
    }`}
  >
    {label}: {String(active)}
  </span>
);

const VisibilityTrackerDemo = () => {
  const logIdRef = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({
    root: "container",
    threshold: 0.5,
    onChange: (type) => {
      setLogs((prev) => [{ id: (logIdRef.current += 1), type, time: new Date().toLocaleTimeString("ko-KR") }, ...prev].slice(0, 4));
    },
  });

  return (
    <div className="w-full max-w-md">
      {/* 상태 배지 */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <StatusBadge label="isVisible" active={isVisible} />
        <StatusBadge label="hasEntered" active={hasEntered} />
      </div>

      {/* 스크롤 컨테이너 — root: "container"의 루트가 돼요 */}
      <div ref={setContainerRef} className="border-line-regular h-52 overflow-y-auto rounded-xl border bg-gray-50 p-4">
        <div className="text-caption-1 text-ink-tertiary flex h-44 items-center justify-center">아래로 스크롤해 보세요 ↓</div>
        <div
          data-intersection-target
          className={`flex h-24 items-center justify-center rounded-xl font-semibold text-white transition-colors duration-300 ${
            isVisible ? "bg-emerald-500" : "bg-gray-400"
          }`}
        >
          {isVisible ? "화면에 보여요 👀" : "관찰 대상"}
        </div>
        <div className="h-44" />
      </div>

      {/* onChange 이벤트 로그 */}
      <ul className="text-caption-1 font-code mt-3 flex h-20 flex-col gap-1 overflow-hidden">
        {logs.length === 0 && <li className="text-ink-tertiary">아직 이벤트가 없어요.</li>}
        {logs.map((log) => (
          <li key={log.id} className={log.type === "enter" ? "text-emerald-600" : "text-ink-tertiary"}>
            [{log.time}] onChange("{log.type}")
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisibilityTrackerDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const VISIBILITY_TRACKER_DEMO_CODE = `import { useIntersectionObserver } from "@leejaehyeok/use-intersection-observer";

function VisibilityTracker() {
  const { setContainerRef, isVisible, hasEntered } = useIntersectionObserver({
    root: "container", // 스크롤 컨테이너 자신을 교차 판정 루트로 사용해요
    threshold: 0.5, // 타깃이 50% 이상 보일 때 진입으로 판정해요
    onChange: (type, entry) => {
      console.log(\`onChange("\${type}")\`, entry.intersectionRatio);
    },
  });

  return (
    <div>
      <p>
        isVisible: {String(isVisible)} / hasEntered: {String(hasEntered)}
      </p>

      {/* callback ref를 스크롤 컨테이너에 연결해요 */}
      <div ref={setContainerRef} style={{ height: 200, overflowY: "auto" }}>
        <div style={{ height: 300 }}>아래로 스크롤해 보세요 ↓</div>
        {/* 기본 targetSelector인 [data-intersection-target]로 관찰 대상을 지정해요 */}
        <div data-intersection-target>{isVisible ? "화면에 보여요 👀" : "관찰 대상"}</div>
        <div style={{ height: 300 }} />
      </div>
    </div>
  );
}`;
