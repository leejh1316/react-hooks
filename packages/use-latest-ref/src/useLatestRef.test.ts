import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "../../../test/renderHook";
import { useLatestRef } from "./useLatestRef";

describe("useLatestRef", () => {
  it("초기 렌더에서 전달한 값을 그대로 담는다", () => {
    const { result } = renderHook((value: string) => useLatestRef(value), { initialProps: "first" });

    expect(result.current.current).toBe("first");
  });

  it("리렌더 후 최신 값으로 갱신된다", () => {
    const { result, rerender } = renderHook((value: string) => useLatestRef(value), { initialProps: "first" });

    rerender("second");

    expect(result.current.current).toBe("second");
  });

  it("매 렌더 새로 만들어지는 함수도 최신 참조를 가리킨다", () => {
    const first = () => "first";
    const second = () => "second";
    const { result, rerender } = renderHook((fn: () => string) => useLatestRef(fn), { initialProps: first });

    rerender(second);

    expect(result.current.current).toBe(second);
  });

  it("effect가 실행되는 시점에는 이미 최신 값이다", () => {
    const seenInEffect: string[] = [];
    const { rerender } = renderHook(
      (value: string) => {
        const ref = useLatestRef(value);
        useEffect(() => {
          seenInEffect.push(ref.current);
        });
        return ref;
      },
      { initialProps: "first" },
    );

    rerender("second");

    expect(seenInEffect).toEqual(["first", "second"]);
  });

  it("렌더 단계에서는 아직 이전 값을 담고 있다 (갱신이 useLayoutEffect에서 일어나므로)", () => {
    const seenDuringRender: string[] = [];
    const { rerender } = renderHook(
      (value: string) => {
        const ref = useLatestRef(value);
        seenDuringRender.push(ref.current);
        return ref;
      },
      { initialProps: "first" },
    );

    rerender("second");

    // 두 번째 렌더 본문에서는 아직 "first"다. 렌더 중에 이 ref를 읽으면 안 된다는 뜻이다.
    expect(seenDuringRender).toEqual(["first", "first"]);
  });
});
