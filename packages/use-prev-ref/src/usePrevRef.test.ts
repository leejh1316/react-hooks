import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "../../../test/renderHook";
import { usePrevRef } from "./usePrevRef";

/**
 * 이 훅은 useEffect의 cleanup에서 ref를 갱신한다(README에 명시된 설계).
 * 그래서 "언제 읽는지"에 따라 보이는 값이 다르다.
 *   - 커밋이 끝난 뒤(이벤트 핸들러 등)  -> 직전 값. 의도된 사용법.
 *   - 렌더 본문 -> 두 렌더 전 값. README의 ⚠️ 항목.
 * 두 경우를 모두 고정해 둔다.
 */

/** 주어진 값들로 순서대로 렌더하고, 각 렌더 본문에서 읽힌 prevRef.current를 수집한다. */
function trackDuringRender([initial, ...rest]: number[]) {
  const seen: number[] = [];
  const { rerender } = renderHook(
    (value: number) => {
      const ref = usePrevRef(value);
      seen.push(ref.current);
      return ref;
    },
    { initialProps: initial },
  );

  for (const value of rest) {
    rerender(value);
  }

  return seen;
}

describe("usePrevRef", () => {
  it("초기 렌더에서는 현재 값을 담고 있다 (이전 값이 없으므로)", () => {
    const { result } = renderHook((value: number) => usePrevRef(value), { initialProps: 0 });

    expect(result.current.current).toBe(0);
  });

  describe("커밋 이후에 읽으면 (이벤트 핸들러에서 쓰는 경우)", () => {
    it("직전 렌더의 값을 준다", () => {
      const { result, rerender } = renderHook((value: number) => usePrevRef(value), { initialProps: 0 });

      rerender(1);
      expect(result.current.current).toBe(0);

      rerender(2);
      expect(result.current.current).toBe(1);

      rerender(3);
      expect(result.current.current).toBe(2);
    });

    it("값이 바뀌지 않은 리렌더에서는 마지막으로 달라진 값을 유지한다", () => {
      const { result, rerender } = renderHook((value: number) => usePrevRef(value), { initialProps: 0 });

      rerender(1);
      rerender(1);
      rerender(1);

      // deps가 그대로이므로 cleanup이 다시 실행되지 않는다.
      expect(result.current.current).toBe(0);
    });
  });

  describe("렌더 본문에서 읽으면 (README가 권하지 않는 사용법)", () => {
    it("두 렌더 전 값이 보인다", () => {
      const seen = trackDuringRender([0, 1, 2, 3]);

      // 세 번째 렌더(value=2)에서 1이 아니라 0이 보이는 것이 문서화된 동작이다.
      expect(seen).toEqual([0, 0, 0, 1]);
    });
  });

  it("StrictMode에서도 커밋 이후 값은 직전 값이다", () => {
    const { result, rerender } = renderHook((value: number) => usePrevRef(value), {
      initialProps: 0,
      wrapper: StrictMode,
    });

    rerender(1);
    rerender(2);

    expect(result.current.current).toBe(1);
  });
});
