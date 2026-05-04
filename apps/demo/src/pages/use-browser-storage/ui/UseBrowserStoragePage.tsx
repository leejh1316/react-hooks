import { useEffect, useRef, useState } from "react";
import {
  useLocalStorage,
  useLocalStorageWithTTL,
  useSessionStorage,
  browserStorage,
  serializer,
  ttl,
} from "@leejaehyeok/use-browser-storage";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

// ─── Demo 1: useLocalStorage — 사용자 환경설정 ──────────────────────────────────

type Theme = "light" | "dark" | "system";
type Language = "ko" | "en" | "ja";

const THEME_LABELS: Record<Theme, string> = { light: "라이트", dark: "다크", system: "시스템" };
const LANG_LABELS: Record<Language, string> = { ko: "한국어", en: "English", ja: "日本語" };

function LocalStorageBasicDemo() {
  const {
    value: nickname,
    setValue: setNickname,
    removeValue: removeNickname,
  } = useLocalStorage({
    key: "demo-nickname",
    defaultValue: "",
  });
  const { value: theme, setValue: setTheme } = useLocalStorage<Theme>({
    key: "demo-theme",
    defaultValue: "system",
  });
  const { value: language, setValue: setLanguage } = useLocalStorage<Language>({
    key: "demo-language",
    defaultValue: "ko",
  });

  return (
    <DemoSection
      title="useLocalStorage — 사용자 환경설정 영속화"
      description="localStorage에 값을 저장하여 페이지를 새로고침해도 유지됩니다. 아래 값을 변경한 뒤 브라우저를 새로고침하면 그대로 복원되는 것을 확인할 수 있습니다."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">닉네임</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Button variant="cancel" onClick={removeNickname}>
              초기화
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">테마</label>
          <div className="flex gap-1.5">
            {(["light", "dark", "system"] as Theme[]).map((t) => (
              <Button key={t} size="sm" variant={theme === t ? "primary" : "cancel"} onClick={() => setTheme(t)}>
                {THEME_LABELS[t]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">언어</label>
          <div className="flex gap-1.5">
            {(["ko", "en", "ja"] as Language[]).map((l) => (
              <Button key={l} size="sm" variant={language === l ? "primary" : "cancel"} onClick={() => setLanguage(l)}>
                {LANG_LABELS[l]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400 space-y-1">
          <div>
            <span className="text-gray-400">demo-nickname: </span>
            <span className="text-indigo-500">{nickname || "(비어있음)"}</span>
          </div>
          <div>
            <span className="text-gray-400">demo-theme: </span>
            <span className="text-indigo-500">{theme}</span>
          </div>
          <div>
            <span className="text-gray-400">demo-language: </span>
            <span className="text-indigo-500">{language}</span>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}

// ─── Demo 2: useLocalStorage — 크로스 탭 동기화 ─────────────────────────────────

function CrossTabSyncDemo() {
  const { value: syncValue, setValue: setSyncValue } = useLocalStorage({
    key: "demo-cross-tab-msg",
    defaultValue: "안녕하세요!",
    subscribe: true,
  });

  return (
    <DemoSection
      title="useLocalStorage — 크로스 탭 동기화 (subscribe)"
      description="subscribe: true를 설정하면 다른 탭에서 같은 키로 값을 변경했을 때 현재 탭도 자동으로 업데이트됩니다. 이 페이지를 새 탭으로 열고 아래 값을 바꿔보세요."
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={syncValue}
            onChange={(e) => setSyncValue(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-lg">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">현재 값</div>
          <div className="text-sm font-mono text-indigo-700 dark:text-indigo-300">{syncValue}</div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.75em]">subscribe: true</code>로 설정하면 window의{" "}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[0.75em]">storage</code> 이벤트를 구독하여 다른 탭의
          변경사항을 실시간으로 수신합니다.
        </p>
      </div>
    </DemoSection>
  );
}

// ─── Demo 3: TTL — 만료 시간 설정 ───────────────────────────────────────────────

function TTLDemo() {
  const TTL_SECONDS = 15;
  const {
    value: token,
    setValue: setToken,
    removeValue: removeToken,
  } = useLocalStorageWithTTL({
    key: "demo-ttl-token",
    defaultValue: "",
    ttl: ttl.seconds(TTL_SECONDS),
  });

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [token]);

  const getRemaining = () => {
    const raw = localStorage.getItem("demo-ttl-token");
    if (!raw) return null;
    try {
      const { expiresAt } = JSON.parse(raw);
      if (expiresAt === null) return null;
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      return remaining;
    } catch {
      return null;
    }
  };

  const remaining = getRemaining();
  const isExpired = token === "" && remaining === null;

  const handleSet = () => {
    setToken(`token_${Math.random().toString(36).slice(2, 9)}`);
  };

  return (
    <DemoSection
      title="useLocalStorageWithTTL — TTL 만료 시간"
      description={`ttl 헬퍼로 만료 시간을 지정하면 시간이 지난 뒤 값이 자동으로 삭제됩니다. 아래 토큰은 ${TTL_SECONDS}초 뒤 만료됩니다.`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button onClick={handleSet}>토큰 발급 (${TTL_SECONDS}초 유효)</Button>
          <Button variant="danger" onClick={removeToken} disabled={!token}>
            즉시 삭제
          </Button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">토큰</span>
            <span className="font-mono text-indigo-500">{token || "(없음)"}</span>
          </div>
          {remaining !== null && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">남은 시간</span>
              <span className={`font-mono font-bold ${remaining <= 5 ? "text-red-500" : "text-emerald-500"}`}>{remaining}초</span>
            </div>
          )}
          {isExpired && <div className="text-xs text-red-400">토큰이 만료되었습니다. 새로 발급하세요.</div>}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(["ms", "seconds", "minutes", "hours", "days", "weeks"] as const).map((unit) => (
            <div key={unit} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center text-xs font-mono">
              <div className="text-gray-400 mb-0.5">ttl.{unit}(1)</div>
              <div className="text-indigo-500">
                {unit === "ms" && "1ms"}
                {unit === "seconds" && "1,000ms"}
                {unit === "minutes" && "60,000ms"}
                {unit === "hours" && "3.6M ms"}
                {unit === "days" && "86.4M ms"}
                {unit === "weeks" && "604.8M ms"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoSection>
  );
}

// ─── Demo 4: useSessionStorage vs useLocalStorage ───────────────────────────────

function SessionVsLocalDemo() {
  const { value: localNote, setValue: setLocalNote } = useLocalStorage({
    key: "demo-note-local",
    defaultValue: "",
  });
  const { value: sessionNote, setValue: setSessionNote } = useSessionStorage({
    key: "demo-note-session",
    defaultValue: "",
  });

  return (
    <DemoSection
      title="useSessionStorage vs useLocalStorage — 생명주기 비교"
      description="localStorage는 브라우저를 닫아도 유지되고, sessionStorage는 탭을 닫으면 삭제됩니다. 두 입력창에 텍스트를 입력한 뒤 탭을 닫았다 다시 열어보세요."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">localStorage</span>
          </div>
          <p className="text-xs text-gray-400">탭·브라우저 닫아도 유지</p>
          <textarea
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            placeholder="여기에 입력하면 새로고침 후에도 남아있습니다"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">sessionStorage</span>
          </div>
          <p className="text-xs text-gray-400">탭을 닫으면 삭제됨</p>
          <textarea
            value={sessionNote}
            onChange={(e) => setSessionNote(e.target.value)}
            placeholder="여기에 입력하면 탭을 닫으면 사라집니다"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>
      </div>
    </DemoSection>
  );
}

// ─── Demo 5: Custom Serializers ─────────────────────────────────────────────────

function SerializerDemo() {
  const { value: favorites, setValue: setFavorites } = useLocalStorage<Set<string>>({
    key: "demo-favorites-set",
    defaultValue: new Set(),
    ...serializer.set<string>(),
  });

  const { value: tagCounts, setValue: setTagCounts } = useLocalStorage<Map<string, number>>({
    key: "demo-tag-counts-map",
    defaultValue: new Map(),
    ...serializer.map<string, number>(),
  });

  const { value: savedDate, setValue: setSavedDate } = useLocalStorage<Date>({
    key: "demo-saved-date",
    defaultValue: new Date(),
    ...serializer.date(),
  });

  const ITEMS = ["React", "TypeScript", "Vite", "Tailwind", "Zustand", "Jotai"];
  const TAGS = ["frontend", "backend", "devops", "design", "testing"];

  const toggleFavorite = (item: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const incrementTag = (tag: string) => {
    setTagCounts((prev) => {
      const next = new Map(prev);
      next.set(tag, (next.get(tag) ?? 0) + 1);
      return next;
    });
  };

  const resetTag = (tag: string) => {
    setTagCounts((prev) => {
      const next = new Map(prev);
      next.delete(tag);
      return next;
    });
  };

  return (
    <DemoSection
      title="serializer — Map · Set · Date 직렬화"
      description="JSON은 Map, Set, Date를 직렬화할 수 없습니다. 내장 serializer 헬퍼를 사용하면 이러한 타입을 localStorage에 저장할 수 있습니다."
    >
      <div className="space-y-5">
        {/* Set serializer */}
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            serializer.set() — 즐겨찾기 (Set&lt;string&gt;)
          </div>
          <div className="flex flex-wrap gap-2">
            {ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => toggleFavorite(item)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                  favorites.has(item)
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                {favorites.has(item) ? "★" : "☆"} {item}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs font-mono text-gray-400">Set: [{[...favorites].join(", ") || "비어있음"}]</div>
        </div>

        {/* Map serializer */}
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            serializer.map() — 태그 카운트 (Map&lt;string, number&gt;)
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <div key={tag} className="flex items-center gap-1">
                <button
                  onClick={() => incrementTag(tag)}
                  className="px-3 py-1.5 text-sm rounded-l-full border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
                {tagCounts.has(tag) && (
                  <>
                    <span className="px-2 py-1.5 text-xs font-mono bg-indigo-500 text-white border border-indigo-500">
                      {tagCounts.get(tag)}
                    </span>
                    <button
                      onClick={() => resetTag(tag)}
                      className="px-2 py-1.5 text-xs rounded-r-full border border-l-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </>
                )}
                {!tagCounts.has(tag) && (
                  <span className="px-2 py-1.5 rounded-r-full border border-l-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs text-gray-300 dark:text-gray-600">
                    0
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Date serializer */}
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            serializer.date() — 저장 시각 (Date)
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => setSavedDate(new Date())}>
              지금 시각 저장
            </Button>
            <span className="text-sm font-mono text-indigo-500">
              {savedDate instanceof Date && !isNaN(savedDate.getTime()) ? savedDate.toLocaleString("ko-KR") : "(없음)"}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400">새로고침해도 저장된 Date 객체가 복원됩니다.</p>
        </div>
      </div>
    </DemoSection>
  );
}

// ─── Demo 6: browserStorage 저수준 API ──────────────────────────────────────────

function BrowserStorageUtilDemo() {
  const [storageType, setStorageType] = useState<"local" | "session">("local");
  const [inputKey, setInputKey] = useState("my-key");
  const [inputValue, setInputValue] = useState("hello");
  const [log, setLog] = useState<{ op: string; result: string; ok: boolean }[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const logRef = useRef(log);
  logRef.current = log;

  const addLog = (op: string, result: string, ok: boolean) => {
    setLog((prev) => [{ op, result, ok }, ...prev].slice(0, 8));
  };

  const refreshKeys = () => {
    const result = browserStorage.keys(storageType);
    setKeys(result.success ? result.value : []);
  };

  useEffect(() => {
    refreshKeys();
  }, [storageType]);

  const handleGet = () => {
    const result = browserStorage.get(storageType, inputKey);
    if (result.success) {
      addLog(`get("${inputKey}")`, JSON.stringify(result.value), true);
    } else {
      addLog(`get("${inputKey}")`, result.error, false);
    }
  };

  const handleSet = () => {
    const result = browserStorage.set(storageType, inputKey, inputValue);
    addLog(`set("${inputKey}", "${inputValue}")`, result.success ? "OK" : result.error, result.success);
    refreshKeys();
  };

  const handleRemove = () => {
    const result = browserStorage.remove(storageType, inputKey);
    addLog(`remove("${inputKey}")`, result.success ? "OK" : result.error, result.success);
    refreshKeys();
  };

  const handleHas = () => {
    const exists = browserStorage.has(storageType, inputKey);
    addLog(`has("${inputKey}")`, String(exists), exists);
  };

  const handleClear = () => {
    const result = browserStorage.clear(storageType);
    addLog(`clear()`, result.success ? "OK" : result.error, result.success);
    refreshKeys();
  };

  const handleKeys = () => {
    const result = browserStorage.keys(storageType);
    if (result.success) {
      addLog(`keys()`, `[${result.value.join(", ")}]`, true);
    } else {
      addLog(`keys()`, result.error, false);
    }
    refreshKeys();
  };

  return (
    <DemoSection
      title="browserStorage — 저수준 유틸 API"
      description="useLocalStorage 같은 훅 없이도 browserStorage 유틸 객체를 직접 사용해 스토리지를 조작할 수 있습니다. get, set, remove, has, clear, keys 등의 메서드를 제공합니다."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["local", "session"] as const).map((type) => (
            <Button key={type} size="sm" variant={storageType === type ? "primary" : "cancel"} onClick={() => setStorageType(type)}>
              {type}Storage
            </Button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">key</label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">value (set 시 사용)</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleGet}>
            get
          </Button>
          <Button size="sm" onClick={handleSet}>
            set
          </Button>
          <Button size="sm" variant="cancel" onClick={handleHas}>
            has
          </Button>
          <Button size="sm" variant="cancel" onClick={handleKeys}>
            keys
          </Button>
          <Button size="sm" variant="danger" onClick={handleRemove}>
            remove
          </Button>
          <Button size="sm" variant="danger" onClick={handleClear}>
            clear
          </Button>
        </div>

        {/* 현재 키 목록 */}
        {keys.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-1">현재 {storageType}Storage 키 목록</div>
            <div className="flex flex-wrap gap-1.5">
              {keys.map((k) => (
                <span
                  key={k}
                  className="px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 로그 */}
        {log.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-400">실행 로그</div>
            {log.map((entry, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono">
                <span className={entry.ok ? "text-emerald-500" : "text-red-500"}>{entry.ok ? "✓" : "✗"}</span>
                <span className="text-gray-500 dark:text-gray-400 shrink-0">{entry.op}</span>
                <span className={`ml-auto ${entry.ok ? "text-indigo-500" : "text-red-400"}`}>{entry.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DemoSection>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────────

export function UseBrowserStoragePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader
        title="use-browser-storage"
        description="localStorage·sessionStorage를 React 훅으로 관리합니다. TTL 만료, 커스텀 직렬화(Map·Set·Date), 크로스 탭 동기화를 기본으로 지원하며, browserStorage 저수준 유틸 API도 함께 제공합니다."
      />
      <LocalStorageBasicDemo />
      <CrossTabSyncDemo />
      <TTLDemo />
      <SessionVsLocalDemo />
      <SerializerDemo />
      <BrowserStorageUtilDemo />
    </div>
  );
}
