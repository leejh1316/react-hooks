import { serializer, useLocalStorage } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: serializer.set()
   "즐겨찾기한 도시" 집합처럼 고유성 보장과 has() 멤버십 검사가
   핵심인 데이터를 Set으로 다루고, serializer 헬퍼로 저장해요.
   선택 상태가 새로고침해도 유지돼요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/favorite-cities";
const CITIES = ["서울", "부산", "제주", "도쿄", "뉴욕", "파리", "런던"];

const SerializerDemo = () => {
  const {
    value: favorites,
    setValue,
    removeValue,
  } = useLocalStorage({
    key: STORAGE_KEY,
    defaultValue: new Set<string>(),
    ...serializer.set<string>(),
  });

  const toggle = (city: string) => {
    setValue((prev) => {
      const next = new Set(prev);
      // has / add / delete 모두 O(1) — 즐겨찾기 여부 판단이 핵심 연산이에요.
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {CITIES.map((city) => (
          <Button key={city} variant={favorites.has(city) ? "primary" : "secondary"} onClick={() => toggle(city)}>
            {favorites.has(city) ? "★ " : "☆ "}
            {city}
          </Button>
        ))}
      </div>

      <p className="text-body-3 text-ink-secondary">
        스토리지에 저장된 문자열: <span className="font-code text-ink-primary font-semibold">{JSON.stringify(Array.from(favorites))}</span>
      </p>

      <Button variant="secondary" onClick={removeValue}>
        즐겨찾기 전체 해제 (removeValue)
      </Button>

      <p className="text-caption-1 text-ink-tertiary select-none">도시를 즐겨찾기하고 새로고침해 보세요. 즐겨찾기 상태가 유지돼요.</p>
    </div>
  );
};

export default SerializerDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const SERIALIZER_DEMO_CODE = `import { serializer, useLocalStorage } from "@leejaehyeok/use-browser-storage";

function FavoriteCities() {
  // 즐겨찾기한 도시 집합 — 중복이 구조적으로 불가능하고 has() 멤버십 검사가 O(1)이라 Set이 적합해요.
  // Set은 JSON.stringify로 직렬화되지 않으므로 serializer.set() 헬퍼를 스프레드해요.
  const { value: favorites, setValue } = useLocalStorage({
    key: "favorite-cities",
    defaultValue: new Set<string>(),
    ...serializer.set<string>(),
  });

  const toggle = (city: string) => {
    setValue((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  };

  return ["서울", "부산", "제주"].map((city) => (
    <button key={city} onClick={() => toggle(city)}>
      {favorites.has(city) ? "★ " : "☆ "}
      {city}
    </button>
  ));
}`;
