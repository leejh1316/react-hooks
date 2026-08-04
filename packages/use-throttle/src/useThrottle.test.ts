import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../../test/renderHook";
import { useThrottle } from "./useThrottle";

const WAIT = 100;

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("기본값 (leading: true, trailing: true)", () => {
    it("첫 호출을 즉시 실행하고 대기 시간 안의 호출은 흘려보낸다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle("a");
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      result.current.throttle("b");
      result.current.throttle("c");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("대기 시간이 지나면 마지막 인자로 한 번 더 실행한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle("a");
      result.current.throttle("b");
      result.current.throttle("c");
      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, "a");
      expect(fn).toHaveBeenNthCalledWith(2, "c");
    });

    it("더 이상 호출이 없으면 재귀 타이머가 멈춘다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle("a");
      result.current.throttle("b");
      vi.advanceTimersByTime(WAIT); // trailing 실행 + 다음 주기 타이머 예약
      vi.advanceTimersByTime(WAIT); // 남은 인자가 없으므로 타이머 종료

      expect(fn).toHaveBeenCalledTimes(2);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("일정 간격으로 계속 호출하면 그 간격마다 실행된다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle(1); // leading
      for (const value of [2, 3, 4, 5, 6]) {
        vi.advanceTimersByTime(WAIT / 2);
        result.current.throttle(value);
      }
      vi.advanceTimersByTime(WAIT);

      // leading 1회 + 주기마다 trailing. 호출 횟수(6)보다 적게 실행되어야 한다.
      expect(fn.mock.calls.length).toBeGreaterThan(1);
      expect(fn.mock.calls.length).toBeLessThan(6);
    });
  });

  describe("leading: false", () => {
    it("첫 호출을 즉시 실행하지 않는다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT, { leading: false }));

      result.current.throttle("a");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledExactlyOnceWith("a");
    });
  });

  describe("trailing: false", () => {
    it("leading만 실행하고 흘려보낸 인자는 버린다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT, { trailing: false }));

      result.current.throttle("a");
      result.current.throttle("b");
      vi.advanceTimersByTime(WAIT * 3);

      expect(fn).toHaveBeenCalledExactlyOnceWith("a");
    });
  });

  describe("cancel", () => {
    it("대기 중인 trailing 호출을 취소한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT, { leading: false }));

      result.current.throttle("a");
      result.current.cancel();
      vi.advanceTimersByTime(WAIT);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("flush", () => {
    it("흘려보낸 마지막 인자를 즉시 실행한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle("a"); // leading으로 실행
      result.current.throttle("b"); // 흘려보내진 인자
      result.current.flush();

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("leading 실행 직후에는 남은 인자가 없어 아무것도 하지 않는다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, WAIT));

      result.current.throttle("a");
      result.current.flush();

      // debounce와 달리 leading 실행 시 lastArgs를 비우기 때문에 중복 실행되지 않는다.
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  it("언마운트 시 대기 중인 호출을 취소한다", () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useThrottle(fn, WAIT, { leading: false }));

    result.current.throttle("a");
    unmount();
    vi.advanceTimersByTime(WAIT);

    expect(fn).not.toHaveBeenCalled();
  });

  it("콜백이 교체되면 최신 콜백을 실행한다", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ fn }: { fn: () => void }) => useThrottle(fn, WAIT, { leading: false }), {
      initialProps: { fn: first as () => void },
    });

    result.current.throttle();
    rerender({ fn: second });
    vi.advanceTimersByTime(WAIT);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
