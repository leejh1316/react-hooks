import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { useIntersectionObserverGroup } from "./useIntersectionObserverGroup";

const CONTAINER_HEIGHT = 100;
const ITEM_HEIGHT = 150;

type GroupProps = Parameters<typeof useIntersectionObserverGroup>[0];

/** states를 "key:visible/entered" 목록으로 눌러서 비교하기 쉽게 만든다. */
function Group({ keys = ["a", "b", "c"], ...options }: GroupProps & { keys?: string[] }) {
  const { setContainerRef, reset, states } = useIntersectionObserverGroup({ root: "container", ...options });

  return (
    <>
      <div data-testid="states">
        {Object.entries(states)
          .map(([key, s]) => `${key}:${s.isVisible ? "visible" : "hidden"}/${s.hasEntered ? "entered" : "never"}`)
          .sort()
          .join(" ")}
      </div>
      <button onClick={() => reset()}>reset all</button>
      <button onClick={() => reset("a")}>reset a</button>
      <div ref={setContainerRef} data-testid="scroll" style={{ height: CONTAINER_HEIGHT, overflow: "auto" }}>
        {keys.map((key) => (
          <div key={key} data-intersection-key={key} style={{ height: ITEM_HEIGHT }}>
            {key}
          </div>
        ))}
      </div>
    </>
  );
}

const states = () => page.getByTestId("states");

const scrollTo = async (top: number) => {
  const scroll = page.getByTestId("scroll");
  await expect.element(scroll).toBeInTheDocument();
  (scroll.element() as HTMLElement).scrollTop = top;
};

describe("useIntersectionObserverGroup", () => {
  it("key별로 상태를 따로 관리한다", async () => {
    render(<Group />);

    // 컨테이너 맨 위에서는 a만 보인다.
    await expect.element(states()).toHaveTextContent("a:visible/entered");
    await expect.element(states()).toHaveTextContent("b:hidden/never");
  });

  it("스크롤에 따라 각 key의 상태가 바뀐다", async () => {
    render(<Group />);
    await expect.element(states()).toHaveTextContent("a:visible/entered");

    await scrollTo(ITEM_HEIGHT * 2);

    await expect.element(states()).toHaveTextContent("c:visible/entered");
    await expect.element(states()).toHaveTextContent("a:hidden/entered");
  });

  it("콜백에 key를 함께 넘긴다", async () => {
    const onEntered = vi.fn();
    const onChange = vi.fn();
    render(<Group onEntered={onEntered} onChange={onChange} />);

    await expect.element(states()).toHaveTextContent("a:visible/entered");

    expect(onEntered).toHaveBeenCalledWith("a", expect.anything(), expect.anything());
    expect(onChange).toHaveBeenCalledWith("a", "enter", expect.anything(), expect.anything());
  });

  it("enable: false면 상태를 채우지 않는다", async () => {
    render(<Group enable={false} />);

    await expect.element(page.getByTestId("scroll")).toBeInTheDocument();

    await expect.element(states()).toHaveTextContent("");
  });

  describe("once", () => {
    it("한 번 본 key는 벗어난 뒤 관찰이 해제된다", async () => {
      const onEntered = vi.fn();
      render(<Group once onEntered={onEntered} />);

      await expect.element(states()).toHaveTextContent("a:visible/entered");
      expect(onEntered).toHaveBeenCalledTimes(1);

      await scrollTo(ITEM_HEIGHT * 2);
      await expect.element(states()).toHaveTextContent("a:hidden/entered");

      // a가 다시 보이더라도 콜백이 오지 않는다.
      await scrollTo(0);
      await expect.element(states()).toHaveTextContent("a:hidden/entered");
      expect(onEntered).toHaveBeenCalledWith("a", expect.anything(), expect.anything());
      expect(onEntered.mock.calls.filter(([key]) => key === "a")).toHaveLength(1);
    });
  });

  describe("reset", () => {
    it("특정 key만 초기화한다", async () => {
      render(<Group />);
      await expect.element(states()).toHaveTextContent("a:visible/entered");

      await scrollTo(ITEM_HEIGHT * 2);
      await expect.element(states()).toHaveTextContent("a:hidden/entered");
      await expect.element(states()).toHaveTextContent("c:visible/entered");

      await userEvent.click(page.getByRole("button", { name: "reset a", exact: true }));

      // a는 hasEntered가 지워지고, c는 그대로 남는다.
      await expect.element(states()).toHaveTextContent("a:hidden/never");
      await expect.element(states()).toHaveTextContent("c:visible/entered");
    });

    it("인자가 없으면 전체를 초기화하고 다시 관찰한다", async () => {
      render(<Group />);
      await expect.element(states()).toHaveTextContent("a:visible/entered");

      await scrollTo(ITEM_HEIGHT * 2);
      await expect.element(states()).toHaveTextContent("a:hidden/entered");

      await userEvent.click(page.getByRole("button", { name: "reset all" }));

      // 다시 관찰이 시작되므로 현재 보이는 c부터 채워진다.
      await expect.element(states()).toHaveTextContent("c:visible/entered");
      await expect.element(states()).not.toHaveTextContent("a:hidden/entered");
    });
  });

  describe("MutationObserver", () => {
    it("나중에 추가된 타겟도 관찰한다", async () => {
      function Growing() {
        const [extra, setExtra] = useState(false);
        const { setContainerRef, states } = useIntersectionObserverGroup({ root: "container" });

        return (
          <>
            <div data-testid="states">{Object.keys(states).sort().join(",")}</div>
            <button onClick={() => setExtra(true)}>add</button>
            <div ref={setContainerRef} data-testid="scroll" style={{ height: CONTAINER_HEIGHT, overflow: "auto" }}>
              <div data-intersection-key="a" style={{ height: 20 }}>
                a
              </div>
              {extra && (
                <div data-intersection-key="b" style={{ height: 20 }}>
                  b
                </div>
              )}
            </div>
          </>
        );
      }
      render(<Growing />);
      await expect.element(states()).toHaveTextContent("a");

      await userEvent.click(page.getByRole("button", { name: "add" }));

      await expect.element(states()).toHaveTextContent("a,b");
    });

    it("제거된 타겟은 상태에서 빠진다", async () => {
      function Shrinking() {
        const [visible, setVisible] = useState(true);
        const { setContainerRef, states } = useIntersectionObserverGroup({ root: "container" });

        return (
          <>
            <div data-testid="states">{Object.keys(states).sort().join(",")}</div>
            <button onClick={() => setVisible(false)}>remove</button>
            <div ref={setContainerRef} data-testid="scroll" style={{ height: CONTAINER_HEIGHT, overflow: "auto" }}>
              <div data-intersection-key="a" style={{ height: 20 }}>
                a
              </div>
              {visible && (
                <div data-intersection-key="b" style={{ height: 20 }}>
                  b
                </div>
              )}
            </div>
          </>
        );
      }
      render(<Shrinking />);
      await expect.element(states()).toHaveTextContent("a,b");

      await userEvent.click(page.getByRole("button", { name: "remove" }));

      await expect.element(states()).toHaveTextContent("a");
    });
  });
});
