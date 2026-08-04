import { afterEach, describe, expect, it } from "vitest";
import { getFocusableElements } from "./getFocusableElements";

let container: HTMLElement | null = null;

/** 실제 문서에 붙여야 getComputedStyle이 의미 있는 값을 준다. */
function mount(html: string) {
  container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

const idsOf = (elements: HTMLElement[]) => elements.map((element) => element.id);

afterEach(() => {
  container?.remove();
  container = null;
});

describe("getFocusableElements", () => {
  it("일반적인 포커스 가능 요소를 DOM 순서대로 모은다", () => {
    const node = mount(`
      <a id="link" href="#x">link</a>
      <button id="button">button</button>
      <input id="input" />
      <textarea id="textarea"></textarea>
      <select id="select"><option>a</option></select>
      <div id="editable" contenteditable="true">editable</div>
      <div id="tabbable" tabindex="0">tabbable</div>
    `);

    expect(idsOf(getFocusableElements(node))).toEqual(["link", "button", "input", "textarea", "select", "editable", "tabbable"]);
  });

  it("input의 하위 타입도 포함한다", () => {
    const node = mount(`
      <input id="range" type="range" />
      <input id="checkbox" type="checkbox" />
      <input id="radio" type="radio" />
    `);

    expect(idsOf(getFocusableElements(node))).toEqual(["range", "checkbox", "radio"]);
  });

  it("href 없는 a는 제외한다", () => {
    const node = mount(`<a id="no-href">link</a><button id="button">b</button>`);

    expect(idsOf(getFocusableElements(node))).toEqual(["button"]);
  });

  it("disabled 요소를 제외한다", () => {
    const node = mount(`
      <button id="ok">ok</button>
      <button id="disabled" disabled>no</button>
      <input id="disabled-input" disabled />
    `);

    expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
  });

  it('tabindex="-1" 요소를 제외한다', () => {
    const node = mount(`<button id="ok">ok</button><button id="skip" tabindex="-1">no</button>`);

    expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
  });

  it('contenteditable="false"는 제외한다', () => {
    const node = mount(`<div id="not-editable" contenteditable="false">no</div><button id="ok">ok</button>`);

    expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
  });

  it('aria-disabled="true"인 요소를 제외한다', () => {
    const node = mount(`<button id="ok">ok</button><button id="no" aria-disabled="true">no</button>`);

    expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
  });

  describe("조상 때문에 접근할 수 없는 경우", () => {
    it("inert 조상 아래는 제외한다", () => {
      const node = mount(`<button id="ok">ok</button><div inert><button id="no">no</button></div>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });

    it('aria-hidden="true" 조상 아래는 제외한다', () => {
      const node = mount(`<button id="ok">ok</button><div aria-hidden="true"><button id="no">no</button></div>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });

    it("hidden 조상 아래는 제외한다", () => {
      const node = mount(`<button id="ok">ok</button><div hidden><button id="no">no</button></div>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });
  });

  describe("CSS로 감춰진 경우", () => {
    it("display: none인 요소를 제외한다", () => {
      const node = mount(`<button id="ok">ok</button><button id="no" style="display:none">no</button>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });

    it("visibility: hidden인 요소를 제외한다", () => {
      const node = mount(`<button id="ok">ok</button><button id="no" style="visibility:hidden">no</button>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });

    it("[알려진 한계] display: none인 조상 아래 요소는 걸러지지 않는다", () => {
      const node = mount(`<button id="ok">ok</button><div style="display:none"><button id="no">no</button></div>`);

      // display는 상속되지 않으므로 감춰진 조상 밑의 자식은 computed display가 여전히 "inline-block"이다.
      // 그래서 자기 자신의 style만 보는 현재 구현은 이 버튼을 포커스 가능하다고 판단한다.
      // (visibility는 상속되므로 visibility:hidden 조상은 정상적으로 걸러진다.)
      expect(idsOf(getFocusableElements(node))).toEqual(["ok", "no"]);
    });

    it("visibility: hidden인 조상 아래 요소는 제외한다 (visibility는 상속되므로)", () => {
      const node = mount(`<button id="ok">ok</button><div style="visibility:hidden"><button id="no">no</button></div>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["ok"]);
    });
  });

  describe("details / summary", () => {
    it("summary가 있으면 summary가 포커스 대상이다", () => {
      const node = mount(`<details><summary id="summary">more</summary><p>body</p></details>`);

      expect(idsOf(getFocusableElements(node))).toEqual(["summary"]);
    });

    it("summary가 없으면 details 자체가 포커스 대상이다", () => {
      const node = mount(`<details id="details"><p>body</p></details>`);

      // ':has()' 셀렉터에 의존하는 분기다.
      expect(idsOf(getFocusableElements(node))).toEqual(["details"]);
    });
  });

  it("포커스 가능한 요소가 없으면 빈 배열", () => {
    const node = mount(`<p>text</p><span>more</span>`);

    expect(getFocusableElements(node)).toEqual([]);
  });
});
