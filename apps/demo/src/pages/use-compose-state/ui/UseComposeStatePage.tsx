import { useState } from "react";
import { useComposedState } from "@leejaehyeok/use-compose-state";
import { useControllableState } from "@leejaehyeok/use-controllable-state";
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
    </div>
  );
}
