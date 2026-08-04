import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useSnooze } from "./useSnooze";

const KEY = "snooze-key";
const NOW = new Date("2026-01-01T00:00:00.000Z").getTime();
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_HOUR = 1000 * 60 * 60;

describe("useSnooze", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("저장된 값이 없으면 활성 상태로 시작한다", () => {
    const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

    expect(result.current[0]).toBe(true);
  });

  it("snooze()를 호출하면 비활성이 되고 만료 시각을 저장한다", () => {
    const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(KEY)).toBe(String(NOW + ONE_HOUR));
  });

  it("만료 시각이 아직 남아 있으면 비활성으로 시작한다", () => {
    localStorage.setItem(KEY, String(NOW + ONE_HOUR));

    const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

    expect(result.current[0]).toBe(false);
  });

  it("만료 시각이 지났으면 활성으로 시작한다", () => {
    localStorage.setItem(KEY, String(NOW - 1));

    const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

    expect(result.current[0]).toBe(true);
  });

  it('duration: "day"를 24시간으로 환산한다', () => {
    const { result } = renderHook(() => useSnooze({ key: KEY, duration: "day" }));

    act(() => {
      result.current[1]();
    });

    expect(localStorage.getItem(KEY)).toBe(String(NOW + ONE_DAY));
  });

  describe("autoReactivate", () => {
    it("true면 남은 시간이 지날 때 스스로 다시 활성화된다", () => {
      localStorage.setItem(KEY, String(NOW + ONE_HOUR));
      const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR, autoReactivate: true }));
      expect(result.current[0]).toBe(false);

      act(() => {
        vi.advanceTimersByTime(ONE_HOUR);
      });

      expect(result.current[0]).toBe(true);
    });

    it("남은 시간 전에는 계속 비활성이다", () => {
      localStorage.setItem(KEY, String(NOW + ONE_HOUR));
      const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR, autoReactivate: true }));

      act(() => {
        vi.advanceTimersByTime(ONE_HOUR - 1);
      });

      expect(result.current[0]).toBe(false);
    });

    it("기본값(false)이면 시간이 지나도 스스로 활성화되지 않는다", () => {
      localStorage.setItem(KEY, String(NOW + ONE_HOUR));
      const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

      act(() => {
        vi.advanceTimersByTime(ONE_HOUR * 2);
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe('storageType: "session"', () => {
    it("sessionStorage에 저장한다", () => {
      const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR, storageType: "session" }));

      act(() => {
        result.current[1]();
      });

      expect(sessionStorage.getItem(KEY)).toBe(String(NOW + ONE_HOUR));
      expect(localStorage.getItem(KEY)).toBeNull();
    });
  });

  it("key가 다르면 서로 영향을 주지 않는다", () => {
    const a = renderHook(() => useSnooze({ key: "a", duration: ONE_HOUR }));
    const b = renderHook(() => useSnooze({ key: "b", duration: ONE_HOUR }));

    act(() => {
      a.result.current[1]();
    });

    expect(a.result.current[0]).toBe(false);
    expect(b.result.current[0]).toBe(true);
  });

  it("저장된 값이 숫자가 아니면 비활성으로 굳는다", () => {
    localStorage.setItem(KEY, "not-a-number");

    const { result } = renderHook(() => useSnooze({ key: KEY, duration: ONE_HOUR }));

    // parseInt가 NaN을 내고 `Date.now() >= NaN`이 false가 되므로 활성으로 복귀하지 못한다.
    // autoReactivate 없이는 이 상태에서 벗어날 방법이 없다.
    expect(result.current[0]).toBe(false);

    act(() => {
      vi.advanceTimersByTime(ONE_HOUR * 100);
    });

    expect(result.current[0]).toBe(false);
  });
});
