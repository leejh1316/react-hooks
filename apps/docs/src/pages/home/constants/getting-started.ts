/* ──────────────────────────────────────────────
   Getting Started Steps
   ────────────────────────────────────────────── */

export const GETTING_STARTED_STEPS = [
  {
    title: "패키지 설치",
    code: "npm add @leejaehyeok/use-debounce",
  },
  {
    title: "훅 가져오기",
    code: 'import { useDebounce } from "@leejaehyeok/use-debounce";',
  },
  {
    title: "사용하기",
    code: "const debouncedValue = useDebounce(value, 300);",
  },
] as const;
