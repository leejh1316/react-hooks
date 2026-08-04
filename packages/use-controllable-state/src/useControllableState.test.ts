import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  describe("비제어 모드 (value 없음)", () => {
    it("defaultValue를 초기값으로 쓴다", () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: "a" }));

      expect(result.current[0]).toBe("a");
    });

    it("함수형 defaultValue는 첫 렌더에서 한 번만 평가된다", () => {
      const initializer = vi.fn(() => "a");
      const { result, rerender } = renderHook(() => useControllableState({ defaultValue: initializer }));

      rerender();

      expect(initializer).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe("a");
    });

    it("setValue가 내부 상태를 바꾸고 onChange도 호출한다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

      act(() => {
        result.current[1](1);
      });

      expect(result.current[0]).toBe(1);
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it("updater 함수 형태를 지원한다", () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(5);
    });
  });

  describe("제어 모드 (value 있음)", () => {
    it("value가 defaultValue보다 우선한다", () => {
      const { result } = renderHook(() => useControllableState({ value: "outer", defaultValue: "inner" }));

      expect(result.current[0]).toBe("outer");
    });

    it("setValue는 내부 상태를 바꾸지 않고 onChange만 호출한다", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState({ value: 0, onChange }));

      act(() => {
        result.current[1](1);
      });

      // 부모가 value를 바꿔주지 않으면 값은 그대로여야 한다.
      expect(result.current[0]).toBe(0);
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it("value prop이 바뀌면 그대로 반영된다", () => {
      const { result, rerender } = renderHook(({ value }: { value: number }) => useControllableState({ value }), {
        initialProps: { value: 0 },
      });

      rerender({ value: 1 });

      expect(result.current[0]).toBe(1);
    });

    it("updater 함수는 최신 외부 value를 기준으로 계산한다", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(({ value }: { value: number }) => useControllableState({ value, onChange }), {
        initialProps: { value: 10 },
      });

      rerender({ value: 20 });
      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(onChange).toHaveBeenCalledWith(21);
    });
  });

  it("값이 바뀌지 않으면 onChange를 호출하지 않는다", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

    act(() => {
      result.current[1](0);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("한 번 제어 모드였다면 value가 undefined가 되어도 제어 모드를 유지한다", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number | undefined }) => useControllableState({ value, defaultValue: 99 }),
      { initialProps: { value: 0 as number | undefined } },
    );

    rerender({ value: undefined });

    // isControlled를 useRef로 고정하므로 defaultValue(99)로 되돌아가지 않는다.
    expect(result.current[0]).toBeUndefined();
  });

  it("한 배치 안에서 updater를 두 번 호출하면 두 번째가 첫 번째 결과를 보지 못한다", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 1);
    });

    // 최신 값을 useEffect로 갱신되는 valueRef에서 읽기 때문에, 같은 배치의 두 호출이 모두 prev=0을 본다.
    // useState라면 2가 되지만 이 훅은 1이 된다. 연속 증가에는 쓸 수 없다는 뜻.
    expect(result.current[0]).toBe(1);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });
});
