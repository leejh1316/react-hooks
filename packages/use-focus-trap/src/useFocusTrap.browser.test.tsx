import { useState } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { useFocusTrap } from "./useFocusTrap";

type TrapProps = {
  initialFocusSelector?: string;
  markInitialFocus?: boolean;
  children?: React.ReactNode;
};

function Trap({ initialFocusSelector, markInitialFocus, children }: TrapProps) {
  const containerRef = useFocusTrap(initialFocusSelector ? { initialFocusSelector } : {});

  return (
    <div ref={containerRef} data-testid="trap">
      {children ?? (
        <>
          <button>first</button>
          <button {...(markInitialFocus ? { "data-initial-focus": "" } : {})}>second</button>
          <button>third</button>
        </>
      )}
    </div>
  );
}

/** 열기/닫기를 통해 트랩의 마운트·언마운트를 만든다. */
function Toggleable({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button data-testid="opener" onClick={() => setOpen(true)}>
        open
      </button>
      {open && (
        <Trap>
          <button data-testid="close" onClick={() => setOpen(false)}>
            close
          </button>
          <button>other</button>
        </Trap>
      )}
    </>
  );
}

const button = (name: string) => page.getByRole("button", { name });

describe("useFocusTrap", () => {
  describe("초기 포커스", () => {
    it("첫 번째 포커스 가능 요소로 포커스를 옮긴다", async () => {
      render(<Trap />);

      await expect.element(button("first")).toHaveFocus();
    });

    it("data-initial-focus가 있으면 그 요소로 옮긴다", async () => {
      render(<Trap markInitialFocus />);

      await expect.element(button("second")).toHaveFocus();
    });

    it("initialFocusSelector를 직접 지정할 수 있다", async () => {
      render(
        <Trap initialFocusSelector="[data-my-focus]">
          <button>first</button>
          <button data-my-focus>picked</button>
        </Trap>,
      );

      await expect.element(button("picked")).toHaveFocus();
    });

    it("[알려진 한계] 포커스 대상이 없고 컨테이너에 tabindex도 없으면 포커스가 옮겨지지 않는다", () => {
      render(
        <Trap>
          <p>nothing focusable</p>
        </Trap>,
      );

      // 구현은 마지막 대안으로 컨테이너에 focus()를 호출하지만,
      // tabindex 없는 div는 포커스를 받을 수 없어 body에 그대로 남는다.
      expect(document.activeElement).toBe(document.body);
    });

    it("컨테이너에 tabIndex를 주면 마지막 대안이 실제로 동작한다", async () => {
      function TrapWithTabIndex() {
        const containerRef = useFocusTrap();

        return (
          <div ref={containerRef} tabIndex={-1} data-testid="trap">
            <p>nothing focusable</p>
          </div>
        );
      }
      render(<TrapWithTabIndex />);

      await expect.element(page.getByTestId("trap")).toHaveFocus();
    });
  });

  describe("Tab 순환", () => {
    it("마지막 요소에서 Tab을 누르면 첫 번째로 돌아온다", async () => {
      render(<Trap />);
      await expect.element(button("first")).toHaveFocus();

      await userEvent.tab(); // first -> second
      await expect.element(button("second")).toHaveFocus();

      await userEvent.tab(); // second -> third (마지막)
      await expect.element(button("third")).toHaveFocus();

      await userEvent.tab(); // third -> first 로 순환

      await expect.element(button("first")).toHaveFocus();
    });

    it("첫 번째 요소에서 Shift+Tab을 누르면 마지막으로 간다", async () => {
      render(<Trap />);
      await expect.element(button("first")).toHaveFocus();

      await userEvent.tab({ shift: true });

      await expect.element(button("third")).toHaveFocus();
    });

    it("중간에서는 평소처럼 이동한다", async () => {
      render(<Trap />);

      await userEvent.tab(); // first -> second
      await userEvent.tab({ shift: true }); // second -> first

      await expect.element(button("first")).toHaveFocus();
    });
  });

  describe("동적으로 요소가 바뀔 때", () => {
    it("나중에 추가된 요소도 순환에 포함된다", async () => {
      function Growing() {
        const [extra, setExtra] = useState(false);
        const containerRef = useFocusTrap();

        return (
          <div ref={containerRef}>
            <button onClick={() => setExtra(true)}>first</button>
            <button>second</button>
            {extra && <button>third</button>}
          </div>
        );
      }
      render(<Growing />);

      // 추가 전에는 second가 마지막이므로 second에서 Tab -> first
      await userEvent.click(button("first")); // extra 추가 + first 포커스
      await expect.element(button("third")).toBeInTheDocument();

      // MutationObserver가 목록을 갱신했다면 third가 마지막이 된다.
      await userEvent.tab(); // first -> second
      await userEvent.tab(); // second -> third
      await expect.element(button("third")).toHaveFocus();

      await userEvent.tab(); // third -> first 로 순환

      await expect.element(button("first")).toHaveFocus();
    });

    it("disabled가 된 요소는 순환에서 빠진다", async () => {
      function Disabling() {
        const [disabled, setDisabled] = useState(false);
        const containerRef = useFocusTrap();

        return (
          <div ref={containerRef}>
            <button onClick={() => setDisabled(true)}>first</button>
            <button disabled={disabled}>second</button>
            <button>third</button>
          </div>
        );
      }
      render(<Disabling />);

      await userEvent.click(button("first")); // second를 disabled로
      await expect.element(button("second")).toBeDisabled();

      // second가 빠졌으므로 first에서 Tab을 누르면 third로 간다.
      await userEvent.tab();

      await expect.element(button("third")).toHaveFocus();
    });
  });

  describe("언마운트", () => {
    it("트랩에 들어오기 전 포커스를 복원한다", async () => {
      render(<Toggleable />);

      await userEvent.click(page.getByTestId("opener"));
      await expect.element(page.getByTestId("close")).toHaveFocus();

      await userEvent.click(page.getByTestId("close"));

      await expect.element(page.getByTestId("opener")).toHaveFocus();
    });
  });
});
