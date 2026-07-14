import { useLocalStorage } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: useLocalStorage
   같은 key를 사용하는 두 컴포넌트가 자동으로 동기화되고,
   값은 localStorage에 저장되어 새로고침해도 유지돼요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/nickname";

const EditorPanel = () => {
  const { value, setValue, removeValue } = useLocalStorage<string>({
    key: STORAGE_KEY,
    defaultValue: "",
    subscribe: true,
  });

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 A — 입력</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="닉네임을 입력해 보세요"
        className="border-line-regular text-body-3 text-ink-primary placeholder:text-ink-tertiary w-full rounded-xl border px-4 py-3 outline-none"
      />
      <Button variant="secondary" onClick={removeValue}>
        스토리지에서 삭제 (removeValue)
      </Button>
    </div>
  );
};

const ViewerPanel = () => {
  // 같은 key를 사용하므로 별도 설정 없이 컴포넌트 A와 자동으로 동기화돼요.
  const { value } = useLocalStorage<string>({
    key: STORAGE_KEY,
    defaultValue: "",
    subscribe: true,
  });

  return (
    <div className="border-line-regular flex w-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-caption-1 text-ink-tertiary font-semibold select-none">컴포넌트 B — 같은 key 사용</p>
      <p className="text-body-3 text-ink-secondary">
        저장된 값: <span className="text-ink-primary font-semibold">{value || "(없음)"}</span>
      </p>
      <p className="text-caption-2 text-ink-tertiary select-none">새로고침해도 값이 유지되고, 새 탭에서 열어도 동기화돼요.</p>
    </div>
  );
};

const LocalStorageDemo = () => (
  <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
    <EditorPanel />
    <ViewerPanel />
  </div>
);

export default LocalStorageDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const LOCAL_STORAGE_DEMO_CODE = `import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

const STORAGE_KEY = "nickname";

function Editor() {
  const { value, setValue, removeValue } = useLocalStorage<string>({
    key: STORAGE_KEY,
    defaultValue: "",
    subscribe: true, // 다른 탭에서의 변경도 자동 반영 (localStorage 전용)
  });

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={removeValue}>스토리지에서 삭제</button>
    </>
  );
}

function Viewer() {
  // 같은 key를 사용하면 같은 탭 안에서는 별도 설정 없이도 자동 동기화돼요.
  const { value } = useLocalStorage<string>({ key: STORAGE_KEY, defaultValue: "", subscribe: true });

  return <p>저장된 값: {value || "(없음)"}</p>;
}`;
