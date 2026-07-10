type BehaviorRow = {
  name: string;
  description: string;
};

/** 훅의 주요 동작 요약 */
export const BEHAVIOR_ROWS: BehaviorRow[] = [
  {
    name: "초기 포커스",
    description: "initialFocusSelector에 매칭되는 요소 → 첫 번째 포커스 가능 요소 → 컨테이너 자체 순서로 포커스합니다.",
  },
  {
    name: "Tab 순환",
    description: "마지막 포커스 가능 요소에서 Tab을 누르면 첫 번째 요소로 이동합니다.",
  },
  {
    name: "Shift+Tab 순환",
    description: "첫 번째 포커스 가능 요소에서 Shift+Tab을 누르면 마지막 요소로 이동합니다.",
  },
  {
    name: "동적 DOM 감지",
    description:
      "MutationObserver로 자식 노드 추가/제거와 disabled, aria-hidden, aria-disabled, hidden, inert, tabindex 속성 변화를 감지해 포커스 가능 요소 목록을 자동 갱신합니다.",
  },
  {
    name: "포커스 복원",
    description: "컨테이너가 언마운트되면 트랩 진입 전에 포커스되어 있던 요소로 포커스를 자동 복원합니다.",
  },
];

export type { BehaviorRow };
