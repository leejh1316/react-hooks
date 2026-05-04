import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";
import { useControllableState } from "@leejaehyeok/use-controllable-state";
import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";
import { useLocalStorage, useSessionStorage } from "@leejaehyeok/use-browser-storage";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const setBoth = useComposedState(setA, setB);

  const inSync = a === b;

  return (
    <DemoSection
      title="기본 동작 — 두 상태 동시 제어"
      description="useComposedState는 여러 setState를 하나의 setter로 합성합니다. 합성된 setter를 호출하면 모든 상태가 동시에 업데이트됩니다. 함수형 업데이트도 지원합니다."
    >
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">State A</div>
          <div className="text-3xl font-bold font-mono text-indigo-500">{a}</div>
        </div>
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">State B</div>
          <div className="text-3xl font-bold font-mono text-indigo-500">{b}</div>
        </div>
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">동기화 여부</div>
          <div className={`text-sm font-semibold font-mono ${inSync ? "text-green-500" : "text-red-400"}`}>
            {inSync ? "in sync" : "out of sync"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Button variant="cancel" size="sm" onClick={() => setA((p) => p + 1)}>A만 +1</Button>
        <Button variant="cancel" size="sm" onClick={() => setB((p) => p + 1)}>B만 +1</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setBoth((p) => p + 1)}>둘 다 +1</Button>
        <Button size="sm" onClick={() => setBoth((p) => p - 1)}>둘 다 −1</Button>
        <Button variant="danger" size="sm" onClick={() => setBoth(0)}>리셋</Button>
      </div>
    </DemoSection>
  );
}

function NotificationDemo() {
  const [messages, setMessages] = useState(4);
  const [alerts, setAlerts] = useState(2);
  const [updates, setUpdates] = useState(7);

  const clearAll = useComposedState(setMessages, setAlerts, setUpdates);
  const total = messages + alerts + updates;

  return (
    <DemoSection
      title="여러 알림 배지 일괄 초기화"
      description="세 가지 알림 카운터가 각각 독립적인 useState로 관리됩니다. useComposedState로 세 setter를 합성하면 '모두 읽음' 버튼 하나로 전체를 초기화할 수 있습니다."
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "메시지", count: messages, add: setMessages, color: "bg-indigo-500" },
          { label: "알림", count: alerts, add: setAlerts, color: "bg-amber-500" },
          { label: "업데이트", count: updates, add: setUpdates, color: "bg-emerald-500" },
        ].map(({ label, count, add, color }) => (
          <div
            key={label}
            className="relative p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center cursor-pointer group"
            onClick={() => add((p) => p + 1)}
          >
            <div className="text-xs text-gray-400 mb-2 font-semibold">{label}</div>
            <div className="text-2xl font-bold font-mono">{count}</div>
            {count > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full ${color} text-white text-[0.65rem] font-bold flex items-center justify-center`}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
            <div className="mt-2 text-[0.7rem] text-gray-400 group-hover:text-indigo-400 transition-colors">
              클릭하여 추가
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="danger" onClick={() => clearAll(0)} disabled={total === 0}>
          모두 읽음 처리
        </Button>
        {total > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            미확인 알림 총 <strong className="text-gray-800 dark:text-gray-100">{total}</strong>개
          </span>
        )}
        {total === 0 && <span className="text-sm text-green-500">모든 알림을 확인했습니다.</span>}
      </div>
    </DemoSection>
  );
}

interface TagInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function TagInput({ label, value, onChange }: TagInputProps) {
  return (
    <div>
      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full px-3 py-2 text-sm rounded-md border transition-colors",
          "bg-white dark:bg-gray-900",
          "border-gray-200 dark:border-gray-600",
          "focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-400",
        ].join(" ")}
      />
    </div>
  );
}

function FormResetDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<{ name: string; email: string; message: string } | null>(null);

  const resetAll = useComposedState(setName, setEmail, setMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted({ name, email, message });
    resetAll("");
  };

  const isFilled = name || email || message;

  return (
    <DemoSection
      title="폼 필드 일괄 초기화"
      description="각 입력 필드는 독립적인 useState로 관리됩니다. useComposedState로 세 setter를 합성하면 제출 후 resetAll('') 한 번으로 전체 필드를 비울 수 있습니다."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-5">
        <TagInput label="이름" value={name} onChange={setName} />
        <TagInput label="이메일" value={email} onChange={setEmail} />
        <TagInput label="메시지" value={message} onChange={setMessage} />

        <div className="flex gap-2 pt-1">
          <Button type="submit" disabled={!isFilled}>제출 후 초기화</Button>
          <Button variant="cancel" type="button" onClick={() => resetAll("")} disabled={!isFilled}>
            직접 초기화
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">마지막 제출</div>
          {Object.entries(submitted).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="text-gray-400 w-16 shrink-0">{key}</span>
              <span className="font-mono text-gray-800 dark:text-gray-100 truncate">
                {val || <em className="text-gray-400">비어 있음</em>}
              </span>
            </div>
          ))}
        </div>
      )}
    </DemoSection>
  );
}

// ─── useControllableState 연계 데모 ───────────────────────────────────────────

interface VolumeControlProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

function VolumeControl({ label = "볼륨", value, defaultValue = 50, onChange }: VolumeControlProps) {
  const [volume, setVolume] = useControllableState<number>({ value, defaultValue, onChange });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold font-mono text-indigo-500 w-8 text-right">{volume}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-75"
          style={{ width: `${volume}%` }}
        />
      </div>
    </div>
  );
}

function ValueDisplay({ label, value, color = "text-indigo-500" }: { label: string; value: number; color?: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
      <div className="text-xs text-gray-400 mb-1 font-medium">{label}</div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
      <div className="mt-1.5 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-current rounded-full transition-all duration-75" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// 비제어 모드: VolumeControl이 자체 상태를 관리하고, onChange로 외부 상태를 동기화
function UncontrolledSyncDemo() {
  const [mirrorA, setMirrorA] = useState(50);
  const [mirrorB, setMirrorB] = useState(50);

  // 두 외부 상태를 합성 — VolumeControl의 onChange에 연결
  const syncMirrors = useComposedState(setMirrorA, setMirrorB);

  return (
    <DemoSection
      title="비제어 모드 + onChange로 외부 상태 동기화"
      description="VolumeControl은 내부적으로 useControllableState를 사용합니다. defaultValue만 전달하면 비제어 모드로 동작해 슬라이더가 자체 상태를 관리합니다. useComposedState로 합성한 setter를 onChange에 연결하면, 슬라이더 값이 바뀔 때 외부 Mirror A·B도 동시에 업데이트됩니다."
    >
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">슬라이더 (비제어)</p>
        <VolumeControl defaultValue={50} onChange={(v) => syncMirrors(v)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ValueDisplay label="Mirror A (외부 상태)" value={mirrorA} color="text-violet-500" />
        <ValueDisplay label="Mirror B (외부 상태)" value={mirrorB} color="text-violet-500" />
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        슬라이더의 내부 상태는 VolumeControl이 직접 관리합니다. Mirror A·B는 onChange 콜백을 통해서만 업데이트됩니다.
      </p>
    </DemoSection>
  );
}

// 제어 모드: 부모가 상태를 소유하고, useComposedState로 여러 채널을 일괄 제어
function ControlledSyncDemo() {
  const [master, setMaster] = useState(70);
  const [channelA, setChannelA] = useState(70);
  const [channelB, setChannelB] = useState(70);

  // 마스터 + 채널 A·B 세 setter를 합성
  const syncAll = useComposedState(setMaster, setChannelA, setChannelB);

  const presets = [
    { label: "음소거", value: 0 },
    { label: "낮음", value: 30 },
    { label: "중간", value: 60 },
    { label: "최대", value: 100 },
  ];

  return (
    <DemoSection
      title="제어 모드 + 프리셋으로 여러 채널 일괄 변경"
      description="VolumeControl을 제어 모드(value prop 전달)로 사용합니다. 슬라이더를 움직이면 onChange → syncAll이 호출되어 master·채널A·채널B가 모두 함께 바뀝니다. 프리셋 버튼은 syncAll(value)를 직접 호출해 슬라이더와 두 채널을 한 번에 변경합니다."
    >
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">마스터 슬라이더 (제어)</p>
        <VolumeControl label="Master" value={master} onChange={(v) => syncAll(v)} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <ValueDisplay label="Channel A" value={channelA} color="text-emerald-500" />
        <ValueDisplay label="Channel B" value={channelB} color="text-emerald-500" />
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">프리셋</p>
        <div className="flex flex-wrap gap-2">
          {presets.map(({ label, value }) => (
            <Button
              key={label}
              variant={master === value ? "ghost" : "cancel"}
              size="sm"
              onClick={() => syncAll(value)}
            >
              {label}&nbsp;<span className="font-mono opacity-60">{value}</span>
            </Button>
          ))}
        </div>
      </div>
    </DemoSection>
  );
}

// ─── Demo: useComposedState + useCustomEventState ───────────────────────────────

const EVENT_CHANNELS = [
  { channelKey: "ccs-panel-visitors", label: "방문자", color: "text-indigo-500", badge: "bg-indigo-500" },
  { channelKey: "ccs-panel-orders", label: "주문", color: "text-emerald-500", badge: "bg-emerald-500" },
  { channelKey: "ccs-panel-errors", label: "오류", color: "text-red-500", badge: "bg-red-500" },
] as const;

function StatPanel({ channelKey, label, color, badge }: (typeof EVENT_CHANNELS)[number]) {
  const [count, dispatch] = useCustomEventState(channelKey, 0);

  return (
    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
      <div className={`text-3xl font-bold font-mono ${color}`}>{count}</div>
      <div className="flex gap-1.5 mt-1">
        <Button size="sm" variant="cancel" onClick={() => dispatch((p) => p + 1)}>
          +1
        </Button>
        <Button size="sm" variant="cancel" onClick={() => dispatch((p) => Math.max(0, p - 1))}>
          −1
        </Button>
      </div>
      <div className={`w-2 h-2 rounded-full ${badge} mt-1`} />
    </div>
  );
}

function CustomEventSyncDemo() {
  const [visitors, dispatchVisitors] = useCustomEventState("ccs-panel-visitors", 0);
  const [orders, dispatchOrders] = useCustomEventState("ccs-panel-orders", 0);
  const [errors, dispatchErrors] = useCustomEventState("ccs-panel-errors", 0);

  const resetAll = useComposedState(dispatchVisitors, dispatchOrders, dispatchErrors);
  const randomizeAll = () => {
    const next = () => Math.floor(Math.random() * 99) + 1;
    dispatchVisitors(next());
    dispatchOrders(next());
    dispatchErrors(next());
  };

  const total = visitors + orders + errors;

  return (
    <DemoSection
      title="useCustomEventState dispatch 합성"
      description="useCustomEventState가 반환하는 dispatch는 React.Dispatch와 동일한 시그니처입니다. 세 채널의 dispatch를 useComposedState에 넘기면 하나의 setter로 합성되어, 버튼 하나로 모든 CustomEvent 채널을 동시에 업데이트할 수 있습니다."
    >
      <div className="flex gap-3 mb-4">
        {EVENT_CHANNELS.map((ch) => (
          <StatPanel key={ch.channelKey} {...ch} />
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="danger" onClick={() => resetAll(0)} disabled={total === 0}>
          전체 리셋
        </Button>
        <Button variant="cancel" onClick={randomizeAll}>
          랜덤 값 설정
        </Button>
        <span className="text-xs text-gray-400 font-mono ml-auto">
          합계: <span className="text-indigo-500 font-bold">{total}</span>
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        StatPanel은 각각 독립된 컴포넌트로, 자신의 채널만 알고 있습니다. 부모가{" "}
        <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.75em]">useComposedState</code>로
        세 dispatch를 합성하여 크로스-컴포넌트 상태를 일괄 제어합니다.
      </p>
    </DemoSection>
  );
}

// ─── Demo: useComposedState + useLocalStorage + useSessionStorage ────────────────

function StorageMirrorDemo() {
  const { value: localDraft, setValue: setLocalDraft, removeValue: clearLocal } = useLocalStorage({
    key: "ccs-draft-local",
    defaultValue: "",
  });
  const { value: sessionDraft, setValue: setSessionDraft, removeValue: clearSession } = useSessionStorage({
    key: "ccs-draft-session",
    defaultValue: "",
  });

  const syncBoth = useComposedState(setLocalDraft, setSessionDraft);
  const clearBoth = () => {
    clearLocal();
    clearSession();
  };

  return (
    <DemoSection
      title="useLocalStorage · useSessionStorage setValue 합성"
      description="useLocalStorage와 useSessionStorage가 반환하는 setValue도 React.Dispatch와 동일한 시그니처입니다. useComposedState로 두 setter를 합성하면, 입력 한 번으로 영속 스토리지(localStorage)와 세션 스토리지(sessionStorage)를 동시에 업데이트할 수 있습니다."
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            메모 (입력 시 양쪽 스토리지 동시 저장)
          </label>
          <textarea
            value={localDraft}
            onChange={(e) => syncBoth(e.target.value)}
            placeholder="여기에 입력하면 localStorage와 sessionStorage 모두에 저장됩니다"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                localStorage
              </span>
              <span className="ml-auto text-[0.65rem] text-gray-400">새로고침 후에도 유지</span>
            </div>
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 min-h-6 break-all">
              {localDraft || <span className="text-gray-300 dark:text-gray-600">(비어있음)</span>}
            </p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                sessionStorage
              </span>
              <span className="ml-auto text-[0.65rem] text-gray-400">탭 닫으면 삭제</span>
            </div>
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 min-h-6 break-all">
              {sessionDraft || <span className="text-gray-300 dark:text-gray-600">(비어있음)</span>}
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={clearBoth}
          disabled={!localDraft && !sessionDraft}
        >
          양쪽 모두 초기화
        </Button>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.75em]">syncBoth</code>는
          setLocalDraft와 setSessionDraft를 합성한 setter입니다. onChange에서 한 번만 호출해도 두 스토리지가 동시에
          업데이트됩니다.
        </p>
      </div>
    </DemoSection>
  );
}

// ─── Demo: useControllableState + useLocalStorage ───────────────────────────────

const THEME_SWATCHES = [
  { id: "indigo", label: "인디고", bg: "bg-indigo-500", ring: "ring-indigo-400", text: "text-indigo-500" },
  { id: "emerald", label: "에메랄드", bg: "bg-emerald-500", ring: "ring-emerald-400", text: "text-emerald-500" },
  { id: "rose", label: "로즈", bg: "bg-rose-500", ring: "ring-rose-400", text: "text-rose-500" },
  { id: "amber", label: "앰버", bg: "bg-amber-500", ring: "ring-amber-400", text: "text-amber-500" },
  { id: "violet", label: "바이올렛", bg: "bg-violet-500", ring: "ring-violet-400", text: "text-violet-500" },
] as const;

type ThemeId = (typeof THEME_SWATCHES)[number]["id"];

interface ThemePickerProps {
  value?: ThemeId;
  defaultValue?: ThemeId;
  onChange?: (value: ThemeId) => void;
}

function ThemePicker({ value, defaultValue = "indigo", onChange }: ThemePickerProps) {
  const [selected, setSelected] = useControllableState<ThemeId>({ value, defaultValue, onChange });

  return (
    <div className="flex gap-2.5">
      {THEME_SWATCHES.map(({ id, label, bg, ring }) => (
        <button
          key={id}
          title={label}
          onClick={() => setSelected(id)}
          className={[
            "w-8 h-8 rounded-full transition-all duration-150 cursor-pointer border-0",
            bg,
            selected === id
              ? `ring-2 ring-offset-2 ${ring} scale-110`
              : "opacity-60 hover:opacity-90 hover:scale-105",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function ControllableWithStorageDemo() {
  const { value: savedTheme, setValue: setSavedTheme, removeValue: resetTheme } = useLocalStorage<ThemeId>({
    key: "ccs-user-theme",
    defaultValue: "indigo",
  });
  const [liveTheme, setLiveTheme] = useState<ThemeId>(savedTheme);

  // 비제어 컴포넌트의 onChange: localStorage 저장 + liveTheme 미러 동시 업데이트
  const onChangeUncontrolled = useComposedState(setSavedTheme, setLiveTheme);

  const liveSwatch = THEME_SWATCHES.find((s) => s.id === liveTheme);
  const savedSwatch = THEME_SWATCHES.find((s) => s.id === savedTheme);

  return (
    <DemoSection
      title="useControllableState onChange + useLocalStorage setValue 합성"
      description="비제어 모드 ThemePicker는 내부적으로 useControllableState로 자체 상태를 관리합니다. onChange를 useComposedState로 합성하면, 색상 선택 한 번으로 localStorage 영속화와 외부 미러 상태 업데이트가 동시에 일어납니다. 제어 모드 위젯은 localStorage 값을 value로 받으므로 비제어 위젯의 선택이 즉시 반영됩니다. 반대로 제어 위젯을 변경해도 비제어 위젯은 defaultValue로 초기화된 자체 상태를 유지합니다."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        {/* 비제어 모드 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              비제어 모드
            </span>
          </div>
          <p className="text-xs text-gray-400">
            내부 상태 자체 관리.{" "}
            <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.7em]">
              onChange = useComposedState(setSavedTheme, setLiveTheme)
            </code>
          </p>
          <ThemePicker defaultValue={savedTheme} onChange={onChangeUncontrolled} />
          <div className="space-y-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">onChange 수신값</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${liveSwatch?.bg}`} />
                <span className={liveSwatch?.text}>{liveTheme}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">localStorage 저장값</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${savedSwatch?.bg}`} />
                <span className="text-emerald-500">{savedTheme}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 제어 모드 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              제어 모드
            </span>
          </div>
          <p className="text-xs text-gray-400">
            localStorage 값을{" "}
            <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.7em]">value</code>로 전달.
            비제어 위젯의 변경이 localStorage를 통해 즉시 반영됩니다.
          </p>
          <ThemePicker value={savedTheme} onChange={setSavedTheme} />
          <div className="space-y-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">value (from localStorage)</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${savedSwatch?.bg}`} />
                <span className="text-indigo-500">{savedTheme}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="cancel" size="sm" onClick={resetTheme} disabled={savedTheme === "indigo"}>
          테마 초기화
        </Button>
        <p className="text-xs text-gray-400">
          새로고침 후에도 localStorage에 저장된 테마가 복원됩니다.
        </p>
      </div>
    </DemoSection>
  );
}

export function UseComposeStatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-compose-state"
        description="여러 setState 디스패처를 하나의 setter로 합성합니다. 합성된 setter를 호출하면 등록된 모든 상태가 동시에 업데이트됩니다."
      />
      <BasicDemo />
      <NotificationDemo />
      <FormResetDemo />
      <UncontrolledSyncDemo />
      <ControlledSyncDemo />
      <CustomEventSyncDemo />
      <StorageMirrorDemo />
      <ControllableWithStorageDemo />
    </div>
  );
}
