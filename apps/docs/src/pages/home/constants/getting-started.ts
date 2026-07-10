/* ──────────────────────────────────────────────
   Getting Started Steps
   ────────────────────────────────────────────── */

export const GETTING_STARTED_STEPS = [
  {
    title: "패키지 설치",
    code: "npm add @leejaehyeok/use-focus-trap",
  },
  {
    title: "훅 가져오기",
    code: 'import { useFocusTrap } from "@leejaehyeok/use-focus-trap"',
  },
  {
    title: "사용하기",
    code: "const focusTrap = useFocusTrap()",
  },
] as const;
