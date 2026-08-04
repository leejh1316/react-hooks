import { describe, expect, it } from "vitest";
import { getDelta } from "./getDelta";
import { getDirection } from "./getDirection";
import { isDisabledElement } from "./isDisabled";

describe("getDelta", () => {
  it("좌우 키는 항상 한 칸씩 움직인다", () => {
    expect(getDelta("ArrowRight", 0)).toBe(1);
    expect(getDelta("ArrowLeft", 0)).toBe(-1);
    expect(getDelta("ArrowRight", 5)).toBe(1);
    expect(getDelta("ArrowLeft", 5)).toBe(-1);
  });

  it("colSkipCount가 없으면 상하 키도 한 칸씩 움직인다", () => {
    expect(getDelta("ArrowDown", 0)).toBe(1);
    expect(getDelta("ArrowUp", 0)).toBe(-1);
  });

  it("colSkipCount가 있으면 상하 키가 열 수만큼 건너뛴다 (그리드)", () => {
    expect(getDelta("ArrowDown", 3)).toBe(3);
    expect(getDelta("ArrowUp", 3)).toBe(-3);
  });

  it("그 외 키는 0", () => {
    expect(getDelta("Enter", 3)).toBe(0);
    expect(getDelta("Home", 3)).toBe(0);
  });
});

describe("getDirection", () => {
  it("키를 방향 문자열로 옮긴다", () => {
    expect(getDirection("ArrowRight")).toBe("right");
    expect(getDirection("ArrowLeft")).toBe("left");
    expect(getDirection("ArrowDown")).toBe("down");
    expect(getDirection("ArrowUp")).toBe("up");
    expect(getDirection("Home")).toBe("home");
    expect(getDirection("End")).toBe("end");
  });

  it("알 수 없는 키는 right로 떨어진다", () => {
    expect(getDirection("Enter")).toBe("right");
  });
});

describe("isDisabledElement", () => {
  const element = (html: string) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as HTMLElement;
  };

  it("null은 비활성으로 본다", () => {
    expect(isDisabledElement(null)).toBe(true);
  });

  it("평범한 버튼은 활성", () => {
    expect(isDisabledElement(element("<button>ok</button>"))).toBe(false);
  });

  it.each([
    ["disabled", "<button disabled>x</button>"],
    ['aria-disabled="true"', '<button aria-disabled="true">x</button>'],
    ['aria-hidden="true"', '<button aria-hidden="true">x</button>'],
    ["hidden", "<button hidden>x</button>"],
  ])("%s가 있으면 비활성", (_label, html) => {
    expect(isDisabledElement(element(html))).toBe(true);
  });

  it('aria-disabled="false"는 활성', () => {
    expect(isDisabledElement(element('<button aria-disabled="false">x</button>'))).toBe(false);
  });
});
