import { useRef, useState, useCallback, forwardRef } from "react";
import { useComposedRefs, composeRefs } from "@leejaehyeok/use-compose-ref";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicDemo() {
  const internalRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [callbackLog, setCallbackLog] = useState<string[]>([]);

  const callbackRef = useCallback((el: HTMLDivElement | null) => {
    setCallbackLog((prev) => [
      el ? "콜백 ref: 엘리먼트 연결됨" : "콜백 ref: 엘리먼트 해제됨",
      ...prev.slice(0, 4),
    ]);
  }, []);

  const composedRef = useComposedRefs(internalRef, callbackRef);

  return (
    <DemoSection
      title="기본 사용법"
      description="useComposedRefs로 객체 ref와 콜백 ref를 단일 ref로 합성합니다. 합성된 ref를 엘리먼트에 전달하면 두 ref가 동시에 해당 엘리먼트를 참조합니다."
    >
      <div
        ref={composedRef}
        className="p-4 mb-4 text-center text-sm font-mono bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg"
      >
        대상 엘리먼트 (composedRef 연결됨)
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() =>
            setInfo(
              `internalRef.current: <${internalRef.current?.tagName?.toLowerCase() ?? "null"}>`,
            )
          }
        >
          internalRef 확인
        </Button>
      </div>
      {info && (
        <p className="mb-3 text-xs font-mono text-indigo-600 dark:text-indigo-400">{info}</p>
      )}
      <ul className="text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {callbackLog.length === 0 && (
          <li className="text-gray-400">콜백 ref 로그가 여기에 표시됩니다.</li>
        )}
        {callbackLog.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

const FancyInput = forwardRef<
  HTMLInputElement,
  { label: string; onFocus?: () => void }
>(function FancyInput({ label, onFocus }, externalRef) {
  const internalRef = useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(internalRef, externalRef);

  const handleAutoFocus = () => {
    internalRef.current?.focus();
    onFocus?.();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex gap-2">
        <input
          ref={composedRef}
          type="text"
          placeholder="입력..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <Button size="sm" variant="cancel" onClick={handleAutoFocus}>
          내부 포커스
        </Button>
      </div>
    </div>
  );
});

function ForwardRefDemo() {
  const externalRef = useRef<HTMLInputElement>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLog((prev) => [
      `[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${msg}`,
      ...prev.slice(0, 6),
    ]);

  return (
    <DemoSection
      title="forwardRef 패턴"
      description="컴포넌트 내부의 internalRef와 부모로부터 전달받은 forwardedRef를 useComposedRefs로 합성합니다. 컴포넌트 라이브러리에서 가장 흔한 활용 패턴입니다."
    >
      <div className="mb-4">
        <FancyInput
          label="FancyInput (internalRef + forwardedRef 합성)"
          onFocus={() => addLog("FancyInput 내부에서 포커스 이동")}
          ref={externalRef}
        />
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => {
            const val = externalRef.current?.value;
            addLog(`externalRef.current.value: "${val ?? ""}"`);
          }}
        >
          외부 ref 값 읽기
        </Button>
        <Button
          variant="cancel"
          onClick={() => {
            externalRef.current?.focus();
            addLog("부모에서 externalRef로 포커스 이동");
          }}
        >
          부모에서 포커스
        </Button>
      </div>
      <ul className="min-h-12 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 로그가 나타납니다.</li>
        )}
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

function ChildWithCleanup({ onLog }: { onLog: (msg: string) => void }) {
  const ref1 = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        onLog("ref1: 엘리먼트 연결됨");
        return () => onLog("ref1: cleanup 실행");
      }
    },
    [onLog],
  );

  const ref2 = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        onLog("ref2: 엘리먼트 연결됨");
        return () => onLog("ref2: cleanup 실행");
      }
    },
    [onLog],
  );

  const composed = useComposedRefs(ref1, ref2);

  return (
    <div
      ref={composed}
      className="p-3 text-center text-sm font-mono bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
    >
      마운트된 엘리먼트 (cleanup ref 2개 연결됨)
    </div>
  );
}

function CleanupDemo() {
  const [visible, setVisible] = useState(true);
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback(
    (msg: string) =>
      setLog((prev) => [
        `[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${msg}`,
        ...prev.slice(0, 9),
      ]),
    [],
  );

  return (
    <DemoSection
      title="React 19 Cleanup 지원"
      description="콜백 ref가 cleanup 함수를 반환하면(React 19), composeRefs가 모든 cleanup을 수집해 엘리먼트 해제 시 일괄 실행합니다. cleanup이 없는 ref는 자동으로 null로 초기화합니다."
    >
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setVisible((v) => !v)} variant={visible ? "danger" : "primary"}>
          {visible ? "언마운트" : "마운트"}
        </Button>
        <Button variant="cancel" onClick={() => setLog([])}>
          로그 초기화
        </Button>
      </div>
      <div className="mb-4 min-h-14">
        {visible && <ChildWithCleanup onLog={addLog} />}
      </div>
      <ul className="min-h-16 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {log.length === 0 && (
          <li className="text-gray-400">마운트/언마운트하면 로그가 나타납니다.</li>
        )}
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

function ComposeRefsDemo() {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const [info, setInfo] = useState<string[]>([]);

  const composed = composeRefs(ref1, ref2);

  return (
    <DemoSection
      title="composeRefs (훅 없이 사용)"
      description="useComposedRefs의 내부 구현인 composeRefs를 직접 사용합니다. useCallback 메모이제이션 없이 매 렌더마다 새 ref 콜백을 생성하며, 정적 컴포넌트나 한 번만 마운트되는 경우에 적합합니다."
    >
      <button
        ref={composed}
        className="px-4 py-2 mb-4 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 cursor-pointer"
        onClick={() =>
          setInfo([
            `ref1.current === ref2.current: ${ref1.current === ref2.current}`,
            `ref1.current: <${ref1.current?.tagName?.toLowerCase() ?? "null"}>`,
            `ref2.current: <${ref2.current?.tagName?.toLowerCase() ?? "null"}>`,
          ])
        }
      >
        두 ref가 같은 엘리먼트를 참조하는지 확인
      </button>
      <ul className="text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
        {info.length === 0 && (
          <li className="text-gray-400">버튼을 클릭하면 결과가 나타납니다.</li>
        )}
        {info.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </DemoSection>
  );
}

export function UseComposeRefPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-compose-ref"
        description="여러 ref를 하나의 콜백 ref로 합성합니다. 함수형·객체형·null 등 모든 ref 유형을 지원하며, React 19의 cleanup 함수도 자동으로 처리합니다."
      />
      <BasicDemo />
      <ForwardRefDemo />
      <CleanupDemo />
      <ComposeRefsDemo />
    </div>
  );
}
