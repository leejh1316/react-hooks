import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useLocalStorage, useLocalStorageWithTTL } from "./useLocalStorage";
import { serializer, ttl } from "./utils";

const KEY = "counter";
const NOW = new Date("2026-01-01T00:00:00.000Z").getTime();

const dispatchStorageEvent = (init: StorageEventInit) => window.dispatchEvent(new StorageEvent("storage", init));

describe("useLocalStorage", () => {
  it("스토리지가 비어 있으면 defaultValue를 쓴다", () => {
    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    expect(result.current.value).toBe(0);
  });

  it("스토리지에 값이 있으면 그 값으로 시작한다", () => {
    localStorage.setItem(KEY, "5");

    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    expect(result.current.value).toBe(5);
  });

  it("setValue가 상태와 스토리지를 함께 갱신한다", () => {
    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.setValue(3);
    });

    expect(result.current.value).toBe(3);
    expect(localStorage.getItem(KEY)).toBe("3");
  });

  it("updater 함수 형태도 스토리지에 반영한다", () => {
    localStorage.setItem(KEY, "10");
    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.setValue((prev) => prev + 1);
    });

    expect(result.current.value).toBe(11);
    expect(localStorage.getItem(KEY)).toBe("11");
  });

  it("removeValue가 스토리지에서 지우고 defaultValue로 되돌린다", () => {
    localStorage.setItem(KEY, "7");
    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe(0);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("같은 key를 쓰는 다른 인스턴스도 함께 갱신된다", () => {
    const first = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));
    const second = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      first.result.current.setValue(9);
    });

    expect(first.result.current.value).toBe(9);
    expect(second.result.current.value).toBe(9);
  });

  it("같은 key 인스턴스가 여러 개면 updater 한 번에 인스턴스마다 스토리지를 쓴다", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const first = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));
    renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));
    setItem.mockClear();

    act(() => {
      first.result.current.setValue((prev) => prev + 1);
    });

    // updater를 CustomEvent로 브로드캐스트하고 각 인스턴스가 자기 setState 안에서 저장하므로
    // 인스턴스 수만큼 setItem이 호출된다. 값은 같아서 결과는 맞지만 쓰기가 중복된다.
    expect(setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(KEY)).toBe("1");
  });

  it("다른 key끼리는 영향을 주지 않는다", () => {
    const a = renderHook(() => useLocalStorage({ key: "a", defaultValue: 0 }));
    const b = renderHook(() => useLocalStorage({ key: "b", defaultValue: 0 }));

    act(() => {
      a.result.current.setValue(1);
    });

    expect(a.result.current.value).toBe(1);
    expect(b.result.current.value).toBe(0);
  });

  describe("subscribe", () => {
    it("true면 다른 탭의 storage 이벤트를 반영한다", () => {
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0, subscribe: true }));

      act(() => {
        dispatchStorageEvent({ key: KEY, newValue: "42" });
      });

      expect(result.current.value).toBe(42);
    });

    it("값이 지워지면 defaultValue로 되돌린다", () => {
      localStorage.setItem(KEY, "5");
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0, subscribe: true }));

      act(() => {
        dispatchStorageEvent({ key: KEY, newValue: null });
      });

      expect(result.current.value).toBe(0);
    });

    it("파싱할 수 없는 값이 오면 무시한다", () => {
      localStorage.setItem(KEY, "5");
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0, subscribe: true }));

      act(() => {
        dispatchStorageEvent({ key: KEY, newValue: "{not json" });
      });

      expect(result.current.value).toBe(5);
    });

    it("기본값(false)이면 storage 이벤트를 무시한다", () => {
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

      act(() => {
        dispatchStorageEvent({ key: KEY, newValue: "42" });
      });

      expect(result.current.value).toBe(0);
    });
  });

  describe("커스텀 serializer", () => {
    it("Date를 ISO 문자열로 저장하고 다시 읽는다", () => {
      const date = new Date("2026-06-01T00:00:00.000Z");
      const { serialize, deserialize } = serializer.date();
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: new Date(0), serialize, deserialize }));

      act(() => {
        result.current.setValue(date);
      });

      expect(localStorage.getItem(KEY)).toBe("2026-06-01T00:00:00.000Z");

      // 새로 마운트해도 같은 값을 읽어온다.
      const remounted = renderHook(() => useLocalStorage({ key: KEY, defaultValue: new Date(0), serialize, deserialize }));
      expect(remounted.result.current.value).toEqual(date);
    });

    it("Map도 왕복한다", () => {
      const { serialize, deserialize } = serializer.map<string, number>();
      const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: new Map<string, number>(), serialize, deserialize }));

      act(() => {
        result.current.setValue(new Map([["a", 1]]));
      });

      const remounted = renderHook(() => useLocalStorage({ key: KEY, defaultValue: new Map<string, number>(), serialize, deserialize }));
      expect(remounted.result.current.value).toEqual(new Map([["a", 1]]));
    });
  });

  it("저장에 실패하면 console.error로 알린다", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const { result } = renderHook(() => useLocalStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.setValue(1);
    });

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("Failed to set item in localStorage"), "QUOTA_EXCEEDED");
    // 스토리지 저장은 실패했지만 화면 상태는 갱신된다.
    expect(result.current.value).toBe(1);
  });
});

describe("useLocalStorageWithTTL", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("만료 전에는 저장된 값을 읽는다", () => {
    const { result } = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0, ttl: ttl.minutes(1) }));

    act(() => {
      result.current.setValue(5);
    });

    vi.advanceTimersByTime(59_000);
    const remounted = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0, ttl: ttl.minutes(1) }));

    expect(remounted.result.current.value).toBe(5);
  });

  it("만료된 뒤에 마운트하면 defaultValue를 쓴다", () => {
    const { result } = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0, ttl: ttl.minutes(1) }));

    act(() => {
      result.current.setValue(5);
    });

    vi.advanceTimersByTime(61_000);
    const remounted = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0, ttl: ttl.minutes(1) }));

    expect(remounted.result.current.value).toBe(0);
    // 만료된 키는 읽는 시점에 제거된다.
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("ttl을 주지 않으면 만료되지 않는다", () => {
    const { result } = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.setValue(5);
    });

    vi.advanceTimersByTime(ttl.days(365));
    const remounted = renderHook(() => useLocalStorageWithTTL({ key: KEY, defaultValue: 0 }));

    expect(remounted.result.current.value).toBe(5);
  });
});
