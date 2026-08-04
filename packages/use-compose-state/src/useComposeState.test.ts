import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useComposedState } from "./useComposeState";

describe("useComposedState", () => {
  it("모든 setter에 같은 값을 전달한다", () => {
    const setA = vi.fn();
    const setB = vi.fn();
    const { result } = renderHook(() => useComposedState<number>(setA, setB));

    act(() => {
      result.current(1);
    });

    expect(setA).toHaveBeenCalledWith(1);
    expect(setB).toHaveBeenCalledWith(1);
  });

  it("updater 형태는 각 setter가 자기 자신의 prev를 받는다", () => {
    const { result } = renderHook(() => {
      const [a, setA] = useState(1);
      const [b, setB] = useState(100);
      const setBoth = useComposedState<number>(setA, setB);
      return { a, b, setBoth };
    });

    act(() => {
      result.current.setBoth((prev) => prev + 1);
    });

    expect(result.current.a).toBe(2);
    expect(result.current.b).toBe(101);
  });

  it("setter 배열이 매 렌더 새로 만들어져도 반환된 setState 참조는 그대로다", () => {
    const { result, rerender } = renderHook(() => {
      const [, setA] = useState(0);
      const [, setB] = useState(0);
      // 매 렌더 새 배열이 만들어지는 상황을 재현
      return useComposedState<number>(setA, setB);
    });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("렌더 중 교체된 setter를 반영한다 (useLatestRef로 최신 목록을 읽으므로)", () => {
    const initial = vi.fn();
    const replaced = vi.fn();
    const { result, rerender } = renderHook(({ setter }: { setter: (value: number) => void }) => useComposedState<number>(setter), {
      initialProps: { setter: initial as (value: number) => void },
    });

    rerender({ setter: replaced });
    act(() => {
      result.current(1);
    });

    expect(initial).not.toHaveBeenCalled();
    expect(replaced).toHaveBeenCalledWith(1);
  });
});
