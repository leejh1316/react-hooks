import { describe, expect, it } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useSessionStorage } from "./useSessionStorage";

const KEY = "counter";

describe("useSessionStorage", () => {
  it("스토리지가 비어 있으면 defaultValue를 쓴다", () => {
    const { result } = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    expect(result.current.value).toBe(0);
  });

  it("sessionStorage에 저장한다 (localStorage는 건드리지 않는다)", () => {
    const { result } = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.setValue(3);
    });

    expect(sessionStorage.getItem(KEY)).toBe("3");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("sessionStorage에 있던 값으로 시작한다", () => {
    sessionStorage.setItem(KEY, "8");

    const { result } = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    expect(result.current.value).toBe(8);
  });

  it("removeValue가 sessionStorage에서 지운다", () => {
    sessionStorage.setItem(KEY, "8");
    const { result } = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe(0);
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("같은 key를 쓰는 다른 인스턴스도 함께 갱신된다", () => {
    const first = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));
    const second = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      first.result.current.setValue(9);
    });

    expect(second.result.current.value).toBe(9);
  });

  it("storage 이벤트를 구독하지 않는다 (sessionStorage는 탭 간 공유되지 않으므로)", () => {
    const { result } = renderHook(() => useSessionStorage({ key: KEY, defaultValue: 0 }));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: "42" }));
    });

    // useSessionStorage에는 subscribe 옵션 경로가 없다.
    expect(result.current.value).toBe(0);
  });
});
