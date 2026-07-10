/** useFocusTrap 문서 페이지에서 사용하는 코드 조각 모음 */

export const INSTALL_CODE = `# pnpm
pnpm add @leejaehyeok/use-focus-trap

# npm
npm install @leejaehyeok/use-focus-trap

# yarn
yarn add @leejaehyeok/use-focus-trap`;

export const IMPORT_CODE = `import { useFocusTrap } from "@leejaehyeok/use-focus-trap";`;

export const SIGNATURE_CODE = `function useFocusTrap(options?: FocusTrapOptions): (node: HTMLElement | null) => void;

type FocusTrapOptions = {
  /** 초기 포커스 대상 CSS 선택자 (기본값: "[data-initial-focus]") */
  initialFocusSelector?: string;
};`;

export const BASIC_USAGE_CODE = `import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const containerRef = useFocusTrap();

  // 컨테이너가 DOM에서 제거되어야 트랩이 해제되고 이전 포커스가 복원됩니다.
  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      <h2>모달 제목</h2>
      <input type="text" placeholder="이름" />
      <button onClick={onClose}>닫기</button>
    </div>
  );
}`;

export const INITIAL_FOCUS_ATTRIBUTE_CODE = `const containerRef = useFocusTrap();

<div ref={containerRef} role="dialog">
  <input type="text" />
  {/* data-initial-focus 속성이 있는 요소에 먼저 포커스됩니다 */}
  <button data-initial-focus>여기에 먼저 포커스</button>
</div>;`;

export const INITIAL_FOCUS_SELECTOR_CODE = `const containerRef = useFocusTrap({ initialFocusSelector: "#confirm-button" });

<div ref={containerRef} role="dialog">
  <input type="text" />
  <button id="confirm-button">확인</button>
</div>;`;

export const DEMO_CODE = `import { useState } from "react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";

function FocusTrapDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap();

  return (
    <>
      <button onClick={() => setIsOpen(true)}>다이얼로그 열기</button>

      {isOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <h5 id="dialog-title">프로필 편집</h5>
          {/* data-initial-focus가 있어 이름 입력에 먼저 포커스됩니다 */}
          <input data-initial-focus type="text" placeholder="이름" />
          <input type="email" placeholder="이메일" />
          <button onClick={() => setIsOpen(false)}>취소</button>
          <button onClick={() => setIsOpen(false)}>저장</button>
        </div>
      )}
    </>
  );
}`;

export const HOOK_SOURCE_CODE = `// 특정 컨테이너 내에서 포커스가 순환하도록 하는 훅입니다.

import { useCallback, useRef } from "react";
import { getFocusableElements } from "./utils";

type FocusTrapOptions = {
  initialFocusSelector?: string;
};

export function useFocusTrap(options: FocusTrapOptions = {}) {
  const { initialFocusSelector = "[data-initial-focus]" } = options;
  const cleanupRef = useRef<(() => void) | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const containerRef = useCallback((node: HTMLElement | null) => {
    // node가 null이면 (언마운트 or ref 변경) 이전 클린업 실행
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    }

    if (!node) return;

    restoreFocusRef.current = document.activeElement as HTMLElement;

    let focusableElements = getFocusableElements(node);
    const initialFocusElement = node.querySelector<HTMLElement>(initialFocusSelector);
    const initFocusTarget = initialFocusElement || focusableElements[0] || node;

    initFocusTarget.focus();

    const observer = new MutationObserver(() => {
      focusableElements = getFocusableElements(node);
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-hidden", "aria-disabled", "hidden", "inert", "tabindex"],
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    node.addEventListener("keydown", handleKeyDown);

    cleanupRef.current = () => {
      node.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return containerRef;
}`;

export const GET_FOCUSABLE_ELEMENTS_CODE = `const FOCUSABLE_SELECTORS = [
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
}`;

export const SKILL_INSTALL_CODE = `# 모노레포의 SKILL 정의를 프로젝트 스킬 디렉터리로 복사
cp -r packages/use-focus-trap/skills/use-focus-trap .claude/skills/use-focus-trap`;
