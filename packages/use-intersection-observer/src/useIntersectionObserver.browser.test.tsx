import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { useIntersectionObserver } from "./useIntersectionObserver";

const CONTAINER_HEIGHT = 100;
const SPACER_HEIGHT = 300;

type ScrollerProps = Parameters<typeof useIntersectionObserver>[0] & {
  targetCount?: number;
  withTarget?: boolean;
};

function Scroller({ targetCount = 1, withTarget = true, ...options }: ScrollerProps) {
  const { setContainerRef, reset, isVisible, hasEntered } = useIntersectionObserver({ root: "container", ...options });

  return (
    <>
      <div data-testid="state">{`${isVisible ? "visible" : "hidden"}/${hasEntered ? "entered" : "never"}`}</div>
      <button onClick={() => reset()}>reset</button>
      <div ref={setContainerRef} data-testid="scroll" style={{ height: CONTAINER_HEIGHT, overflow: "auto" }}>
        <div style={{ height: SPACER_HEIGHT }} />
        {withTarget &&
          Array.from({ length: targetCount }, (_, index) => (
            <div key={index} data-intersection-target style={{ height: 20 }}>
              target-{index}
            </div>
          ))}
        <div style={{ height: SPACER_HEIGHT }} />
      </div>
    </>
  );
}

const state = () => page.getByTestId("state");

// browser 프로젝트의 render는 act로 감싸지 않으므로 커밋이 동기적으로 끝나지 않는다.
// 스크롤 전에 컨테이너가 실제로 붙었는지 기다린다.
const scrollTo = async (top: number) => {
  const scroll = page.getByTestId("scroll");
  await expect.element(scroll).toBeInTheDocument();
  (scroll.element() as HTMLElement).scrollTop = top;
};

describe("useIntersectionObserver", () => {
  it("타겟이 보이기 전에는 숨김 상태다", async () => {
    render(<Scroller />);

    await expect.element(state()).toHaveTextContent("hidden/never");
  });

  it("타겟이 보이면 isVisible과 hasEntered가 켜진다", async () => {
    const onEntered = vi.fn();
    render(<Scroller onEntered={onEntered} />);

    await scrollTo(SPACER_HEIGHT);

    await expect.element(state()).toHaveTextContent("visible/entered");
    expect(onEntered).toHaveBeenCalled();
  });

  it("타겟이 벗어나면 isVisible만 꺼지고 hasEntered는 남는다", async () => {
    const onExited = vi.fn();
    render(<Scroller onExited={onExited} />);

    await scrollTo(SPACER_HEIGHT);
    await expect.element(state()).toHaveTextContent("visible/entered");

    await scrollTo(0);

    await expect.element(state()).toHaveTextContent("hidden/entered");
    expect(onExited).toHaveBeenCalled();
  });

  it("onChange에 enter / exit 종류를 넘긴다", async () => {
    const onChange = vi.fn();
    render(<Scroller onChange={onChange} />);

    await scrollTo(SPACER_HEIGHT);
    await expect.element(state()).toHaveTextContent("visible/entered");

    expect(onChange).toHaveBeenCalledWith("enter", expect.anything(), expect.anything());

    await scrollTo(0);
    await expect.element(state()).toHaveTextContent("hidden/entered");

    expect(onChange).toHaveBeenCalledWith("exit", expect.anything(), expect.anything());
  });

  describe("once", () => {
    it("한 번 보고 벗어난 뒤에는 더 이상 반응하지 않는다", async () => {
      const onEntered = vi.fn();
      render(<Scroller once onEntered={onEntered} />);

      await scrollTo(SPACER_HEIGHT);
      await expect.element(state()).toHaveTextContent("visible/entered");
      expect(onEntered).toHaveBeenCalledTimes(1);

      // 벗어날 때 관찰을 해제한다.
      await scrollTo(0);
      await expect.element(state()).toHaveTextContent("hidden/entered");

      // 다시 보이게 해도 콜백이 오지 않는다.
      await scrollTo(SPACER_HEIGHT);
      await expect.element(state()).toHaveTextContent("hidden/entered");
      expect(onEntered).toHaveBeenCalledTimes(1);
    });
  });

  describe("enable: false", () => {
    it("콜백과 상태 갱신을 모두 건너뛴다", async () => {
      const onEntered = vi.fn();
      render(<Scroller enable={false} onEntered={onEntered} />);

      await scrollTo(SPACER_HEIGHT);

      await expect.element(state()).toHaveTextContent("hidden/never");
      expect(onEntered).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("상태를 초기값으로 되돌리고 다시 관찰한다", async () => {
      render(<Scroller />);

      await scrollTo(SPACER_HEIGHT);
      await expect.element(state()).toHaveTextContent("visible/entered");

      await scrollTo(0);
      await expect.element(state()).toHaveTextContent("hidden/entered");

      await userEvent.click(page.getByRole("button", { name: "reset" }));

      // hasEntered까지 초기화된다.
      await expect.element(state()).toHaveTextContent("hidden/never");
    });
  });

  describe("타겟을 찾을 수 없을 때", () => {
    it("경고를 남긴다", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      // 타겟도 없고 firstElementChild도 없는 빈 컨테이너
      function Empty() {
        const { setContainerRef } = useIntersectionObserver();
        return <div ref={setContainerRef} />;
      }
      render(<Empty />);

      await vi.waitFor(() => expect(warn).toHaveBeenCalledWith(expect.stringContaining("대상을 찾을 수 없습니다")));
    });

    it("타겟 셀렉터에 맞는 요소가 없으면 첫 자식으로 대체한다", async () => {
      function Fallback() {
        const { setContainerRef, hasEntered } = useIntersectionObserver();
        return (
          <>
            <div data-testid="state">{hasEntered ? "entered" : "never"}</div>
            <div ref={setContainerRef}>
              <div style={{ height: 20 }}>first child</div>
            </div>
          </>
        );
      }
      render(<Fallback />);

      // 뷰포트 안에 있으므로 바로 관찰된다.
      await expect.element(state()).toHaveTextContent("entered");
    });
  });

  describe("타겟이 여러 개일 때", () => {
    it("첫 번째만 관찰하고 경고한다", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Scroller targetCount={3} />);

      await vi.waitFor(() => expect(warn).toHaveBeenCalledWith(expect.stringContaining("여러 개의 요소가 발견되었습니다")));
    });
  });
});
