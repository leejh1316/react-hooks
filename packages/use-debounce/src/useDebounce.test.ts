import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../../test/renderHook";
import { useDebounce } from "./useDebounce";

const WAIT = 100;

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("기본값 (leading: true, trailing: true)", () => {
    it("첫 호출을 즉시 실행한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT));

      result.current.debounce("a");

      expect(fn).toHaveBeenCalledExactlyOnceWith("a");
    });

    it("대기 시간 안의 연속 호출은 leading 1회 + 마지막 인자 1회로 합쳐진다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT));

      result.current.debounce("a");
      result.current.debounce("b");
      result.current.debounce("c");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, "a");
      expect(fn).toHaveBeenNthCalledWith(2, "c");
    });

    it("호출이 한 번뿐이면 trailing으로 중복 실행하지 않는다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT));

      result.current.debounce("a");
      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("leading: false", () => {
    it("첫 호출을 즉시 실행하지 않고 대기 후 마지막 인자로 실행한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { leading: false }));

      result.current.debounce("a");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledExactlyOnceWith("a");
    });
  });

  describe("trailing: false", () => {
    it("leading만 실행하고 마지막 호출은 버린다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { trailing: false }));

      result.current.debounce("a");
      result.current.debounce("b");
      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledExactlyOnceWith("a");
    });
  });

  describe("leading: false, trailing: false", () => {
    it("아무것도 실행되지 않는다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { leading: false, trailing: false }));

      result.current.debounce("a");
      vi.advanceTimersByTime(WAIT * 5);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("대기 중인 trailing 호출을 취소한다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { leading: false }));

      result.current.debounce("a");
      result.current.cancel();
      vi.advanceTimersByTime(WAIT);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("flush", () => {
    it("대기 중인 호출을 즉시 실행하고 타이머를 비운다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { leading: false }));

      result.current.debounce("a");
      result.current.flush();
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      vi.advanceTimersByTime(WAIT);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("leading으로 이미 실행된 직후에 호출하면 같은 인자로 한 번 더 실행된다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT));

      result.current.debounce("a");
      result.current.flush();

      // lastArgsRef가 leading 실행 후에도 비워지지 않기 때문에 중복 실행된다.
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "a");
    });

    it("대기 중인 호출이 없으면 아무것도 하지 않는다", () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebounce(fn, WAIT, { leading: false }));

      result.current.flush();

      expect(fn).not.toHaveBeenCalled();
    });
  });

  it("언마운트 시 대기 중인 호출을 취소한다", () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(fn, WAIT, { leading: false }));

    result.current.debounce("a");
    unmount();
    vi.advanceTimersByTime(WAIT);

    expect(fn).not.toHaveBeenCalled();
  });

  it("콜백이 교체되면 최신 콜백을 실행한다", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ fn }: { fn: () => void }) => useDebounce(fn, WAIT, { leading: false }), {
      initialProps: { fn: first as () => void },
    });

    result.current.debounce();
    rerender({ fn: second });
    vi.advanceTimersByTime(WAIT);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
