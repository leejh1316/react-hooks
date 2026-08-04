import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { RovingFocusOptions } from "./useRovingFocus";
import { useRovingFocus } from "./useRovingFocus";

type ToolbarProps = RovingFocusOptions & {
  labels?: string[];
  disabledLabels?: string[];
  withInput?: boolean;
};

function Toolbar({ labels = ["a", "b", "c"], disabledLabels = [], withInput, ...options }: ToolbarProps) {
  const { containerRef, handleKeyDown } = useRovingFocus(options);

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {withInput && <input data-roving-item data-testid="input" />}
      {labels.map((label) => (
        <button key={label} data-roving-item disabled={disabledLabels.includes(label)}>
          {label}
        </button>
      ))}
    </div>
  );
}

const button = (name: string) => page.getByRole("button", { name });

/** 첫 항목을 클릭해 focusin으로 activeIndex를 맞춘 뒤 시작한다. */
async function startAt(name: string) {
  await userEvent.click(button(name));
  await expect.element(button(name)).toHaveFocus();
}

describe("useRovingFocus", () => {
  describe("방향키 이동", () => {
    it("ArrowRight로 다음 항목, ArrowLeft로 이전 항목으로 간다", async () => {
      render(<Toolbar />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");
      await expect.element(button("b")).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      await expect.element(button("c")).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");
      await expect.element(button("b")).toHaveFocus();
    });

    it("orientation: horizontal이면 상하 키를 무시한다", async () => {
      render(<Toolbar orientation="horizontal" />);
      await startAt("a");

      await userEvent.keyboard("{ArrowDown}");

      await expect.element(button("a")).toHaveFocus();
    });

    it("orientation: vertical이면 좌우 키를 무시한다", async () => {
      render(<Toolbar orientation="vertical" />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");
      await expect.element(button("a")).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      await expect.element(button("b")).toHaveFocus();
    });
  });

  describe("경계 처리", () => {
    it("loop가 꺼져 있으면 끝에서 멈추고 onOverflow를 호출한다", async () => {
      const onOverflow = vi.fn();
      render(<Toolbar onOverflow={onOverflow} />);
      await startAt("c");

      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("c")).toHaveFocus();
      expect(onOverflow).toHaveBeenCalled();
    });

    it("loop가 꺼져 있으면 처음에서 멈추고 onUnderflow를 호출한다", async () => {
      const onUnderflow = vi.fn();
      render(<Toolbar onUnderflow={onUnderflow} />);
      await startAt("a");

      await userEvent.keyboard("{ArrowLeft}");

      await expect.element(button("a")).toHaveFocus();
      expect(onUnderflow).toHaveBeenCalled();
    });

    it("loop가 켜져 있으면 끝에서 처음으로 순환한다", async () => {
      render(<Toolbar loop />);
      await startAt("c");

      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("a")).toHaveFocus();
    });

    it("loop가 켜져 있으면 처음에서 끝으로 순환한다", async () => {
      render(<Toolbar loop />);
      await startAt("a");

      await userEvent.keyboard("{ArrowLeft}");

      await expect.element(button("c")).toHaveFocus();
    });
  });

  describe("disabled 항목", () => {
    it("이동 중에 건너뛴다", async () => {
      render(<Toolbar labels={["a", "b", "c"]} disabledLabels={["b"]} />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("c")).toHaveFocus();
    });

    it("연속으로 disabled여도 그 다음까지 건너뛴다", async () => {
      render(<Toolbar labels={["a", "b", "c", "d"]} disabledLabels={["b", "c"]} />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("d")).toHaveFocus();
    });
  });

  describe("Home / End", () => {
    it("Home은 첫 항목, End는 마지막 항목으로 간다", async () => {
      render(<Toolbar labels={["a", "b", "c", "d"]} />);
      await startAt("b");

      await userEvent.keyboard("{End}");
      await expect.element(button("d")).toHaveFocus();

      await userEvent.keyboard("{Home}");
      await expect.element(button("a")).toHaveFocus();
    });

    it("Home / End도 disabled 항목을 건너뛴다", async () => {
      render(<Toolbar labels={["a", "b", "c", "d"]} disabledLabels={["a", "d"]} />);
      await startAt("b");

      await userEvent.keyboard("{End}");
      await expect.element(button("c")).toHaveFocus();

      await userEvent.keyboard("{Home}");
      await expect.element(button("b")).toHaveFocus();
    });

    it("enableEnd: false면 End를 무시한다", async () => {
      render(<Toolbar enableEnd={false} />);
      await startAt("a");

      await userEvent.keyboard("{End}");

      await expect.element(button("a")).toHaveFocus();
    });
  });

  describe("colSkipCount (그리드)", () => {
    it("상하 키가 열 수만큼 건너뛴다", async () => {
      // 3열 x 2행
      render(<Toolbar labels={["a", "b", "c", "d", "e", "f"]} colSkipCount={3} />);
      await startAt("b");

      await userEvent.keyboard("{ArrowDown}");
      await expect.element(button("e")).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      await expect.element(button("b")).toHaveFocus();
    });

    it("같은 열 안에서 순환한다", async () => {
      render(<Toolbar labels={["a", "b", "c", "d", "e", "f"]} colSkipCount={3} loop />);
      await startAt("b");

      // b(0행 1열) 에서 위로 -> 같은 열의 마지막 행 e
      await userEvent.keyboard("{ArrowUp}");

      await expect.element(button("e")).toHaveFocus();
    });
  });

  describe("입력 요소", () => {
    it("input에 포커스가 있으면 방향키를 가로채지 않는다", async () => {
      render(<Toolbar withInput />);
      await userEvent.click(page.getByTestId("input"));
      await expect.element(page.getByTestId("input")).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");

      // 커서 이동에 쓰이도록 그대로 둔다.
      await expect.element(page.getByTestId("input")).toHaveFocus();
    });
  });

  describe("roving tabindex", () => {
    it("활성 항목만 tabindex 0이고 나머지는 -1이다", async () => {
      render(<Toolbar />);
      await startAt("a");

      await expect.element(button("a")).toHaveAttribute("tabindex", "0");
      await expect.element(button("b")).toHaveAttribute("tabindex", "-1");

      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("a")).toHaveAttribute("tabindex", "-1");
      await expect.element(button("b")).toHaveAttribute("tabindex", "0");
    });
  });

  describe("콜백", () => {
    it("onNavigate에 이동 결과를 넘긴다", async () => {
      const onNavigate = vi.fn();
      render(<Toolbar onNavigate={onNavigate} />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");

      expect(onNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          direction: "right",
          activeElement: expect.any(HTMLElement),
        }),
      );
    });

    it("clickOnNavigate가 켜져 있으면 이동한 항목을 클릭한다", async () => {
      const onClick = vi.fn();

      function Clickable() {
        const { containerRef, handleKeyDown } = useRovingFocus({ clickOnNavigate: true });

        return (
          <div ref={containerRef} onKeyDown={handleKeyDown}>
            <button data-roving-item>a</button>
            <button data-roving-item onClick={onClick}>
              b
            </button>
          </div>
        );
      }
      render(<Clickable />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("동적으로 항목이 바뀔 때", () => {
    it("MutationObserver가 새 항목을 목록에 넣는다", async () => {
      function Growing() {
        const { containerRef, handleKeyDown } = useRovingFocus();

        return (
          <div ref={containerRef} onKeyDown={handleKeyDown}>
            <button data-roving-item>a</button>
            <button data-roving-item>b</button>
            <button data-roving-item>c</button>
          </div>
        );
      }
      render(<Growing />);
      await startAt("a");

      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{ArrowRight}");

      await expect.element(button("c")).toHaveFocus();
    });
  });
});
