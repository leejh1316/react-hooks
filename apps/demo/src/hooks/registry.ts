import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export interface HookMeta {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  Page: LazyExoticComponent<ComponentType>;
}

export const hookRegistry: HookMeta[] = [
  {
    id: "use-roving-focus",
    name: "use-roving-focus",
    description: "Roving tabindex 패턴으로 구현한 접근 가능한 키보드 내비게이션",
    tags: ["a11y", "keyboard"],
    Page: lazy(() => import("./use-roving-focus/index")),
  },
  {
    id: "use-focus-trap",
    name: "use-focus-trap",
    description: "모달·다이얼로그에서 포커스를 컨테이너 내부로 가두는 훅",
    tags: ["a11y", "focus"],
    Page: lazy(() => import("./use-focus-trap/index")),
  },
];
