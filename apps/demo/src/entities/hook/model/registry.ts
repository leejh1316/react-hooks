import { lazy } from "react";
import type { HookMeta } from "./types";

export const hookRegistry: HookMeta[] = [
  {
    id: "use-roving-focus",
    name: "use-roving-focus",
    description: "Roving tabindex 패턴으로 구현한 접근 가능한 키보드 내비게이션",
    tags: ["a11y", "keyboard"],
    Page: lazy(() => import("@/pages/use-roving-focus")),
  },
  {
    id: "use-focus-trap",
    name: "use-focus-trap",
    description: "모달·다이얼로그에서 포커스를 컨테이너 내부로 가두는 훅",
    tags: ["a11y", "focus"],
    Page: lazy(() => import("@/pages/use-focus-trap")),
  },
];
