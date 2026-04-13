const FOCUSABLE_SELECTORS = [
  // 링크 - href 있어야 포커스 가능
  'a[href]:not([tabindex="-1"])',

  // 버튼
  'button:not([disabled]):not([tabindex="-1"])',

  // 입력 요소
  'input:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',

  // 파일, 범위, 체크박스 등 input 하위 타입
  'input[type="range"]:not([disabled]):not([tabindex="-1"])',
  'input[type="checkbox"]:not([disabled]):not([tabindex="-1"])',
  'input[type="radio"]:not([disabled]):not([tabindex="-1"])',

  // 편집 가능한 요소
  '[contenteditable]:not([contenteditable="false"]):not([tabindex="-1"])',

  // details > summary (summary 없으면 details 자체가 포커스)
  'details:not([tabindex="-1"]) > summary',
  'details:not([tabindex="-1"]):not(:has(> summary))',

  // tabindex로 명시적으로 포커스 지정된 요소
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function getFocusableElements(container: Document | Element = document): HTMLElement[] {
  return [...container.querySelectorAll(FOCUSABLE_SELECTORS)].filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    // 1. inert (자신 또는 조상)
    if (el.closest("[inert]")) return false;

    // 2. aria-hidden (자신 또는 조상)
    if (el.closest('[aria-hidden="true"]')) return false;

    // 3. hidden 속성 (자신 또는 조상)
    if (el.closest("[hidden]")) return false;

    // 4. CSS display: none / visibility: hidden
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;

    // 5. aria-disabled
    if (el.getAttribute("aria-disabled") === "true") return false;

    return true;
  }) as HTMLElement[];
}
