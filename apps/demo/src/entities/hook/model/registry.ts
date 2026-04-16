import { lazy } from "react";
import type { HookMeta } from "./types";

export const hookRegistry: HookMeta[] = [
  {
    id: "use-throttle",
    name: "use-throttle",
    description: "일정 시간 동안 함수 호출 횟수를 제한합니다",
    tags: ["performance", "event"],
    Page: lazy(() => import("@/pages/use-throttle")),
  },
  {
    id: "use-debounce",
    name: "use-debounce",
    description: "마지막 호출로부터 일정 시간이 지난 후 함수를 실행합니다",
    tags: ["performance", "event"],
    Page: lazy(() => import("@/pages/use-debounce")),
  },
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
  {
    id: "use-snooze",
    name: "use-snooze",
    description: "배너·알림·팝업을 일정 시간 동안 숨기는 스누즈 기능을 제공합니다",
    tags: ["ui", "storage"],
    Page: lazy(() => import("@/pages/use-snooze")),
  },
  {
    id: "use-controllable-state",
    name: "use-controllable-state",
    description: "제어/비제어 컴포넌트 패턴을 단일 훅으로 구현합니다",
    tags: ["state", "ui"],
    Page: lazy(() => import("@/pages/use-controllable-state")),
  },
  {
    id: "use-pagination",
    name: "use-pagination",
    description: "페이지 번호·생략 기호·이전/다음/점프 이동을 포함한 페이지네이션 상태를 관리합니다",
    tags: ["state", "ui"],
    Page: lazy(() => import("@/pages/use-pagination")),
  },
  {
    id: "use-prev-ref",
    name: "use-prev-ref",
    description: "이전 렌더링 사이클의 값을 ref로 저장합니다",
    tags: ["state", "ref"],
    Page: lazy(() => import("@/pages/use-prev-ref")),
  },
];
