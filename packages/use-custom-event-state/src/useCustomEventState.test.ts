import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useCustomEventState } from "./useCustomEventState";

describe("useCustomEventState", () => {
  it("초기값을 그대로 반환한다", () => {
    const { result } = renderHook(() => useCustomEventState("key", 0));

    expect(result.current[0]).toBe(0);
  });

  it("함수형 초기값은 첫 렌더에서 한 번만 평가된다", () => {
    const initializer = vi.fn(() => 7);
    const { result, rerender } = renderHook(() => useCustomEventState("key", initializer));

    rerender();

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe(7);
  });

  it("dispatch로 상태를 바꾼다", () => {
    const { result } = renderHook(() => useCustomEventState("key", 0));

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("updater 함수 형태를 지원한다", () => {
    const { result } = renderHook(() => useCustomEventState("key", 0));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(5);
  });

  it("같은 key를 쓰는 다른 인스턴스도 함께 갱신된다", () => {
    const first = renderHook(() => useCustomEventState("shared", 0));
    const second = renderHook(() => useCustomEventState("shared", 0));

    act(() => {
      first.result.current[1](42);
    });

    expect(first.result.current[0]).toBe(42);
    expect(second.result.current[0]).toBe(42);
  });

  it("다른 key를 쓰는 인스턴스는 영향받지 않는다", () => {
    const a = renderHook(() => useCustomEventState("a", 0));
    const b = renderHook(() => useCustomEventState("b", 0));

    act(() => {
      a.result.current[1](1);
    });

    expect(a.result.current[0]).toBe(1);
    expect(b.result.current[0]).toBe(0);
  });

  it("key가 바뀌면 이전 key의 이벤트에는 반응하지 않는다", () => {
    const subject = renderHook(({ key }: { key: string }) => useCustomEventState(key, 0), {
      initialProps: { key: "before" },
    });
    // 이전 key로 dispatch할 별도 인스턴스
    const oldKeyEmitter = renderHook(() => useCustomEventState("before", 0));

    subject.rerender({ key: "after" });
    act(() => {
      oldKeyEmitter.result.current[1](99);
    });

    expect(subject.result.current[0]).toBe(0);
  });

  it("언마운트 시 리스너를 제거한다", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useCustomEventState("cleanup", 0));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(expect.stringContaining("use-custom-event-state:cleanup"), expect.any(Function));
  });

  it("함수 값 자체는 상태로 저장할 수 없다 (updater로 해석된다)", () => {
    const { result } = renderHook(() => useCustomEventState<string>("fn", "init"));

    act(() => {
      // 함수를 상태로 넣으려는 시도. 구현이 typeof === "function"으로 updater를 판별하므로
      // 저장되지 않고 호출되어 반환값이 상태가 된다.
      result.current[1]((() => "stored-as-return-value") as never);
    });

    expect(result.current[0]).toBe("stored-as-return-value");
  });
});
