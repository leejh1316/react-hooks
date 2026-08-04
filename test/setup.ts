import { afterEach, vi } from "vitest";

// node/browser 두 프로젝트가 함께 쓰는 정리 로직.
// 스토리지 훅(use-browser-storage, use-snooze)이 실제 localStorage/sessionStorage를 쓰므로
// 테스트 간 값이 새지 않도록 매번 비운다.
afterEach(() => {
  // 스토리지를 비우기 전에 먼저 되돌린다. localStorage를 stub한 테스트가 있으면
  // 아래 clear()가 stub된 값을 건드리게 되기 때문이다.
  vi.unstubAllGlobals();
  localStorage.clear();
  sessionStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
