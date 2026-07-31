export type HookUsage = {
  name: string;
  where: string;
};

/** 화면별로 어떤 훅이 어디에 쓰였는지 (앱 우측 하단 '훅' 버튼에서 확인) */
export const HOOK_USAGE: Record<string, HookUsage[]> = {
  "/": [
    { name: "useThrottle", where: "스크롤 시 헤더 축소 · 상단 이동 버튼" },
    { name: "useSnooze", where: "프로모션 배너 '오늘 하루 보지 않기'" },
    { name: "useDebounce", where: "메뉴 검색 입력 (300ms)" },
    { name: "useComposedState", where: "최근 검색어 클릭 시 입력값 + 검색어 동시 갱신" },
    { name: "useLocalStorage", where: "최근 검색어 · 장바구니 저장" },
    { name: "useDeferredLoading", where: "검색 결과 스켈레톤 (짧은 로딩은 표시하지 않음)" },
    { name: "useRovingFocus", where: "카테고리 칩 ← → 키보드 이동" },
    { name: "useOverflow", where: "카테고리 칩이 넘칠 때 '전체' 버튼 노출" },
    { name: "useIntersectionObserver", where: "메뉴 목록 무한 스크롤 트리거" },
    { name: "useIntersectionObserverGroup", where: "메뉴 카드 노출(impression) 집계" },
    { name: "useFocusTrap", where: "메뉴 상세 바텀시트 포커스 가두기" },
    { name: "useComposeRef", where: "바텀시트의 트랩 ref + 내부 ref 합성" },
    { name: "useLatestRef", where: "바텀시트 Escape 핸들러 · 토스트 자동 닫기" },
    { name: "useControllableState", where: "수량 스테퍼 (비제어 모드)" },
    { name: "usePrevRef", where: "수량 증감 방향 애니메이션" },
    { name: "useCustomEventState", where: "Provider 없이 토스트 전역 공유" },
  ],
  "/cart": [
    { name: "useLocalStorage", where: "장바구니 영속화 · 탭 간 동기화" },
    { name: "useControllableState", where: "수량 스테퍼 (제어 모드)" },
    { name: "usePrevRef", where: "결제 금액 증감 표시" },
    { name: "useDeferredLoading", where: "주문 처리 중 버튼 로딩" },
    { name: "useFocusTrap", where: "주문 완료 · 전체 삭제 바텀시트" },
    { name: "useCustomEventState", where: "토스트 알림" },
  ],
  "/reviews": [
    { name: "usePagination", where: "리뷰 목록 페이지네이션 (ellipsis 포함)" },
    { name: "useDeferredLoading", where: "페이지 이동 시 스켈레톤" },
    { name: "usePrevRef", where: "이전 → 현재 페이지 이동 방향 표시" },
    { name: "useRovingFocus", where: "평점 필터 칩 키보드 이동" },
    { name: "useSessionStorage", where: "마지막으로 본 리뷰 페이지 기억" },
  ],
  "/me": [
    { name: "useLocalStorage", where: "다크 모드 · 알림 설정 저장" },
    { name: "useSessionStorage", where: "최근 본 메뉴" },
    { name: "useSnooze", where: "프로모션 배너 스누즈 상태 확인" },
    { name: "useCustomEventState", where: "설정 변경 토스트" },
    { name: "useDebounce", where: "닉네임 자동 저장 (500ms)" },
    { name: "useFocusTrap", where: "데이터 초기화 확인 시트" },
  ],
};
