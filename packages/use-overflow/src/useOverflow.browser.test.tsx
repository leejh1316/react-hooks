import { useState } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { useOverflow } from "./useOverflow";

const ITEM_WIDTH = 100;

type RowProps = {
  width?: number;
  itemCount?: number;
  /** [data-overflow-item] 마킹 없이 자식만 두는 경우 */
  unmarked?: boolean;
};

function Row({ width = 500, itemCount = 2, unmarked }: RowProps) {
  const { containerRef, isOverflow } = useOverflow();

  return (
    <>
      <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
      <div ref={containerRef} data-testid="container" style={{ width, display: "flex", overflow: "hidden" }}>
        {Array.from({ length: itemCount }, (_, index) => (
          <div key={index} {...(unmarked ? {} : { "data-overflow-item": "" })} style={{ width: ITEM_WIDTH, flex: "0 0 auto" }} />
        ))}
      </div>
    </>
  );
}

const status = () => page.getByTestId("status");

describe("useOverflow", () => {
  // 측정이 ResizeObserver -> rAF를 거치므로 expect.element로 재시도하며 기다린다.
  it("자식 총 폭이 컨테이너보다 넓으면 오버플로우로 판단한다", async () => {
    render(<Row width={200} itemCount={10} />);

    await expect.element(status()).toHaveTextContent("overflow");
  });

  it("자식이 컨테이너 안에 들어가면 오버플로우가 아니다", async () => {
    render(<Row width={500} itemCount={2} />);

    await expect.element(status()).toHaveTextContent("fit");
  });

  it("자식이 없으면 오버플로우가 아니다", async () => {
    render(<Row width={100} itemCount={0} />);

    await expect.element(status()).toHaveTextContent("fit");
  });

  it("[data-overflow-item] 마킹이 없으면 children 전체를 측정한다", async () => {
    render(<Row width={200} itemCount={10} unmarked />);

    await expect.element(status()).toHaveTextContent("overflow");
  });

  describe("컨테이너 크기가 바뀔 때", () => {
    it("좁아지면 오버플로우로 바뀐다", async () => {
      function Resizable() {
        const [width, setWidth] = useState(500);
        const { containerRef, isOverflow } = useOverflow();

        return (
          <>
            <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
            <button onClick={() => setWidth(150)}>shrink</button>
            <div ref={containerRef} style={{ width, display: "flex", overflow: "hidden" }}>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} data-overflow-item style={{ width: ITEM_WIDTH, flex: "0 0 auto" }} />
              ))}
            </div>
          </>
        );
      }
      render(<Resizable />);
      await expect.element(status()).toHaveTextContent("fit");

      await userEvent.click(page.getByRole("button", { name: "shrink" }));

      await expect.element(status()).toHaveTextContent("overflow");
    });

    it("넓어지면 다시 오버플로우가 아니게 된다", async () => {
      function Resizable() {
        const [width, setWidth] = useState(150);
        const { containerRef, isOverflow } = useOverflow();

        return (
          <>
            <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
            <button onClick={() => setWidth(500)}>grow</button>
            <div ref={containerRef} style={{ width, display: "flex", overflow: "hidden" }}>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} data-overflow-item style={{ width: ITEM_WIDTH, flex: "0 0 auto" }} />
              ))}
            </div>
          </>
        );
      }
      render(<Resizable />);
      await expect.element(status()).toHaveTextContent("overflow");

      await userEvent.click(page.getByRole("button", { name: "grow" }));

      await expect.element(status()).toHaveTextContent("fit");
    });
  });

  describe("자식이 늘거나 줄 때", () => {
    it("자식이 추가되면 MutationObserver가 다시 측정한다", async () => {
      function Growing() {
        const [count, setCount] = useState(2);
        const { containerRef, isOverflow } = useOverflow();

        return (
          <>
            <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
            <button onClick={() => setCount(10)}>add</button>
            <div ref={containerRef} style={{ width: 300, display: "flex", overflow: "hidden" }}>
              {Array.from({ length: count }, (_, index) => (
                <div key={index} data-overflow-item style={{ width: ITEM_WIDTH, flex: "0 0 auto" }} />
              ))}
            </div>
          </>
        );
      }
      render(<Growing />);
      await expect.element(status()).toHaveTextContent("fit");

      await userEvent.click(page.getByRole("button", { name: "add" }));

      await expect.element(status()).toHaveTextContent("overflow");
    });

    it("자식이 제거되면 다시 측정한다", async () => {
      function Shrinking() {
        const [count, setCount] = useState(10);
        const { containerRef, isOverflow } = useOverflow();

        return (
          <>
            <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
            <button onClick={() => setCount(2)}>remove</button>
            <div ref={containerRef} style={{ width: 300, display: "flex", overflow: "hidden" }}>
              {Array.from({ length: count }, (_, index) => (
                <div key={index} data-overflow-item style={{ width: ITEM_WIDTH, flex: "0 0 auto" }} />
              ))}
            </div>
          </>
        );
      }
      render(<Shrinking />);
      await expect.element(status()).toHaveTextContent("overflow");

      await userEvent.click(page.getByRole("button", { name: "remove" }));

      await expect.element(status()).toHaveTextContent("fit");
    });
  });

  describe("컨테이너에 padding이 있을 때", () => {
    it("[알려진 오차] border-box 폭과 비교하므로 padding만큼 어긋난다", async () => {
      // 컨테이너 content 폭 200, padding 좌우 50씩 -> border-box 폭 300.
      // 자식 총 폭 250은 content 영역(200)을 넘지만,
      // 구현은 lastChildRight(= padding-left 50 + 250 = 300)를 border-box 폭 300과 비교한다.
      function Padded() {
        const { containerRef, isOverflow } = useOverflow();

        return (
          <>
            <div data-testid="status">{isOverflow ? "overflow" : "fit"}</div>
            <div
              ref={containerRef}
              style={{ width: 200, padding: "0 50px", boxSizing: "content-box", display: "flex", overflow: "hidden" }}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} data-overflow-item style={{ width: 50, flex: "0 0 auto" }} />
              ))}
            </div>
          </>
        );
      }
      render(<Padded />);

      // 실제로는 content 영역을 넘쳤지만 fit으로 판정된다.
      await expect.element(status()).toHaveTextContent("fit");
    });
  });
});
