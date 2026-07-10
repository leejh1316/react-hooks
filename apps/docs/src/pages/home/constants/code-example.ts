/* ──────────────────────────────────────────────
   Code Example
   ────────────────────────────────────────────── */

export const CODE_EXAMPLE_FILE_NAME = "SearchInput.tsx";

export const CODE_EXAMPLE = `import { useState } from "react";
import { useDebounce } from "@leejaehyeok/use-debounce";

function SearchInput() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // debouncedKeyword로 검색 API 호출
  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
}`;
