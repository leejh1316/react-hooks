import { useLocalStorage } from "@leejaehyeok/use-browser-storage";
import { Button } from "@src/components/ui";

/* ──────────────────────────────────────────────
   Demo: serializer 미적용
   기본 JSON.stringify는 Set을 "{}"로 직렬화해요.
   세션 중에는 메모리의 Set으로 동작하는 것처럼 보이지만,
   스토리지에는 빈 객체만 저장되어 새로고침하면 즐겨찾기가
   사라지고 value는 Set이 아닌 일반 객체가 돼요
   ────────────────────────────────────────────── */

const STORAGE_KEY = "docs/use-browser-storage/no-serializer-cities";
const CITIES = ["서울", "부산", "제주", "도쿄", "뉴욕", "파리", "런던"];

const NoSerializerDemo = () => {
  const { value, setValue, removeValue } = useLocalStorage({
    key: STORAGE_KEY,
    defaultValue: new Set<string>(),
    // serializer 미적용 — 기본 JSON.stringify가 사용돼요.
  });

  // 새로고침 후에는 JSON.parse("{}") 결과인 일반 객체가 들어와 Set 메서드가 없어요.
  const isSet = value instanceof Set;
  const favorites = isSet ? value : new Set<string>();

  const toggle = (city: string) => {
    const next = new Set(favorites);
    if (next.has(city)) next.delete(city);
    else next.add(city);
    setValue(next);
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
        스토리지에 저장된 문자열: <span className="font-code text-ink-primary font-semibold">{JSON.stringify(value)}</span>
      </p>

      <Button variant="secondary" onClick={removeValue}>
        즐겨찾기 전체 해제 (removeValue)
      </Button>

      <p className="text-caption-1 text-ink-tertiary select-none">
        즐겨찾기는 화면에 반영되지만, 스토리지에는 항상 빈 객체만 저장돼요. 도시를 즐겨찾기하고 새로고침해 보세요.
      </p>
    </div>
  );
};

export default NoSerializerDemo;

/* ──────────────────────────────────────────────
   Code Snippet
   ────────────────────────────────────────────── */

export const NO_SERIALIZER_DEMO_CODE = `import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

function FavoriteCities() {
  // ⚠ serializer 미적용 — 기본 JSON.stringify는 Set을 "{}"로 직렬화해요.
  const { value: favorites, setValue } = useLocalStorage({
    key: "favorite-cities",
    defaultValue: new Set<string>(),
  });

  // 세션 중에는 메모리의 Set으로 동작하는 것처럼 보이지만 스토리지에는 "{}"만 저장돼요.
  // 새로고침하면 JSON.parse("{}") 결과인 일반 객체가 들어와 즐겨찾기가 사라지고,
  // favorites.has(...)는 TypeError를 던져요.
  const toggle = (city: string) => {
    const next = new Set(favorites);
    if (next.has(city)) next.delete(city);
    else next.add(city);
    setValue(next);
  };

  return ["서울", "부산", "제주"].map((city) => (
    <button key={city} onClick={() => toggle(city)}>
      {favorites.has(city) ? "★ " : "☆ "}
      {city}
    </button>
  ));
}`;
