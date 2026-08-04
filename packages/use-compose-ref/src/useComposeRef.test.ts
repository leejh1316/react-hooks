import { createRef, type Ref } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "../../../test/renderHook";
import { composeRefs, setRef, useComposedRefs } from "./useComposeRef";

describe("setRef", () => {
  it("객체형 ref의 current를 채운다", () => {
    const ref = createRef<string>();

    setRef(ref, "value");

    expect(ref.current).toBe("value");
  });

  it("콜백형 ref를 호출하고 반환값을 그대로 넘긴다", () => {
    const cleanup = () => {};
    const callback = vi.fn(() => cleanup);

    const returned = setRef(callback, "value");

    expect(callback).toHaveBeenCalledWith("value");
    expect(returned).toBe(cleanup);
  });

  it("null / undefined ref는 조용히 무시한다", () => {
    expect(() => setRef(null, "value")).not.toThrow();
    expect(() => setRef(undefined, "value")).not.toThrow();
  });
});

describe("composeRefs", () => {
  it("모든 ref에 같은 값을 전달한다", () => {
    const objectRef = createRef<string>();
    const callbackRef = vi.fn();

    composeRefs<string>(objectRef, callbackRef, null, undefined)("value");

    expect(objectRef.current).toBe("value");
    expect(callbackRef).toHaveBeenCalledWith("value");
  });

  it("cleanup을 반환하는 ref가 없으면 undefined를 반환한다 (React 18 경로)", () => {
    const objectRef = createRef<string>();
    const callbackRef = vi.fn();

    const returned = composeRefs<string>(objectRef, callbackRef)("value");

    expect(returned).toBeUndefined();
  });

  it("cleanup을 반환하는 ref가 하나라도 있으면 합성 cleanup을 반환한다 (React 19 경로)", () => {
    const objectRef = createRef<string>();
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);

    const returned = composeRefs<string>(objectRef, callbackRef)("value");

    expect(typeof returned).toBe("function");

    returned!();

    // cleanup을 준 ref는 그 cleanup을 실행하고,
    expect(cleanup).toHaveBeenCalledTimes(1);
    // cleanup이 없던 ref는 null로 초기화된다.
    expect(objectRef.current).toBeNull();
  });

  it("합성 cleanup은 cleanup 없는 콜백 ref도 null로 호출한다", () => {
    const plainCallback = vi.fn();
    const cleanupCallback = vi.fn(() => vi.fn());

    const returned = composeRefs<string>(plainCallback, cleanupCallback)("value");
    returned!();

    expect(plainCallback).toHaveBeenNthCalledWith(1, "value");
    expect(plainCallback).toHaveBeenNthCalledWith(2, null);
  });
});

describe("useComposedRefs", () => {
  it("반환된 콜백 ref가 모든 ref를 채운다", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const element = document.createElement("div");

    const { result } = renderHook(() => useComposedRefs<HTMLDivElement>(objectRef, callbackRef));
    result.current(element);

    expect(objectRef.current).toBe(element);
    expect(callbackRef).toHaveBeenCalledWith(element);
  });

  it("ref 개수가 렌더마다 바뀌면 새로 추가된 ref는 채워지지 않는다", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const first = createRef<HTMLDivElement>();
    const second = createRef<HTMLDivElement>();
    const element = document.createElement("div");

    const { result, rerender } = renderHook(({ refs }: { refs: Ref<HTMLDivElement>[] }) => useComposedRefs<HTMLDivElement>(...refs), {
      initialProps: { refs: [first] as Ref<HTMLDivElement>[] },
    });

    rerender({ refs: [first, second] });
    result.current(element);

    expect(first.current).toBe(element);
    // refs 배열을 그대로 useCallback deps로 넘기기 때문에, 배열 길이가 바뀌면
    // React가 메모된 콜백을 갱신하지 않는다. 새 ref는 조용히 누락된다.
    expect(second.current).toBeNull();
    expect(consoleError.mock.calls[0]?.[0]).toContain("changed size between renders");
  });
});
