import { serializer, useLocalStorage } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: serializer.set()
   JSON.stringify로 직렬화할 수 없는 Set을 serializer 헬퍼로
   localStorage에 저장합니다. 선택 상태가 새로고침해도 유지됩니다
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/selected-tags";
const TAGS = ["React", "TypeScript", "Vite", "Tailwind"];

const SerializerDemo = () => {
  const {
    value: selected,
    setValue,
    removeValue,
  } = useLocalStorage({
    key: STORAGE_KEY,
    defaultValue: new Set<string>(),
    ...serializer.set<string>(),
  });

  const toggle = (tag: string) => {
    setValue((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {TAGS.map((tag) => (
          <Button key={tag} variant={selected.has(tag) ? "primary" : "secondary"} onClick={() => toggle(tag)}>
            {tag}
          </Button>
        ))}
      </div>

      <p className="text-body-3 text-ink-secondary">
        스토리지에 저장된 문자열:{" "}
        <span className="font-code text-ink-primary font-semibold">{JSON.stringify(Array.from(selected))}</span>
      </p>

      <Button variant="secondary" onClick={removeValue}>
        전체 해제 (removeValue)
      </Button>

      <p className="text-caption-1 text-ink-tertiary select-none">태그를 선택하고 새로고침해 보세요. 선택 상태가 유지됩니다.</p>
    </div>
  );
};

export default SerializerDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SERIALIZER_DEMO_CODE = `import { serializer, useLocalStorage } from "@leejaehyeok/use-browser-storage";

function TagSelector() {
  // Set은 JSON.stringify로 직렬화되지 않으므로 serializer.set() 헬퍼를 스프레드합니다.
  const { value: selected, setValue } = useLocalStorage({
    key: "selected-tags",
    defaultValue: new Set<string>(),
    ...serializer.set<string>(),
  });

  const toggle = (tag: string) => {
    setValue((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return ["React", "TypeScript"].map((tag) => (
    <button key={tag} onClick={() => toggle(tag)}>
      {selected.has(tag) ? "✓ " : ""}
      {tag}
    </button>
  ));
}`;
