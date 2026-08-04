import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { useDeferredLoading } from "./useDeferredLoading";

const DELAY = 100;
const MIN_DISPLAY = 300;

const setup = (initialLoading: boolean) =>
  renderHook(({ isLoading }: { isLoading: boolean }) => useDeferredLoading(isLoading, { delay: DELAY, minDisplayDuration: MIN_DISPLAY }), {
    initialProps: { isLoading: initialLoading },
  });

/** 타이머를 진행시키면서 그 사이 예약된 상태 업데이트를 함께 흘려보낸다. */
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("useDeferredLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("로딩이 시작되어도 delay 전에는 표시하지 않는다", () => {
    const { result } = setup(true);

    expect(result.current).toBe(false);

    advance(DELAY - 1);

    expect(result.current).toBe(false);
  });

  it("delay가 지나면 표시한다", () => {
    const { result } = setup(true);

    advance(DELAY);

    expect(result.current).toBe(true);
  });

  it("delay 전에 로딩이 끝나면 아예 표시하지 않는다", () => {
    const { result, rerender } = setup(true);

    advance(DELAY - 1);
    rerender({ isLoading: false });
    advance(DELAY * 10);

    expect(result.current).toBe(false);
  });

  it("표시된 뒤에는 minDisplayDuration 동안 유지한다", () => {
    const { result, rerender } = setup(true);

    advance(DELAY);
    expect(result.current).toBe(true);

    // 표시 직후 로딩이 끝나도 최소 표시 시간을 채운다.
    rerender({ isLoading: false });
    advance(MIN_DISPLAY - 1);
    expect(result.current).toBe(true);

    advance(1);
    expect(result.current).toBe(false);
  });

  it("로딩이 minDisplayDuration보다 오래 걸렸으면 즉시 숨긴다", () => {
    const { result, rerender } = setup(true);

    advance(DELAY);
    advance(MIN_DISPLAY);

    rerender({ isLoading: false });

    expect(result.current).toBe(false);
  });

  it("처음부터 로딩이 아니면 계속 숨긴 상태다", () => {
    const { result } = setup(false);

    advance(DELAY * 10);

    expect(result.current).toBe(false);
  });

  it("언마운트 시 최소 표시 시간 타이머까지 정리한다", () => {
    const { rerender, unmount } = setup(true);

    advance(DELAY);
    rerender({ isLoading: false });
    // 최소 표시 시간을 채우기 위한 타이머가 예약된 상태
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("최소 표시 시간을 기다리는 중 로딩이 다시 시작되면 숨기지 않는다", () => {
    const { result, rerender } = setup(true);

    advance(DELAY);
    rerender({ isLoading: false });
    advance(MIN_DISPLAY / 2);
    expect(result.current).toBe(true);

    // 아직 최소 표시 시간이 남은 상태에서 다시 로딩 시작
    rerender({ isLoading: true });
    advance(MIN_DISPLAY);

    expect(result.current).toBe(true);
  });
});
