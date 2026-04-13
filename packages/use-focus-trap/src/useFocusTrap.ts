// 특정 컨테이너 내에서 포커스가 순환하도록 하는 훅입니다.

import { useCallback, useRef } from "react";
import { getFocusableElements } from "./utils";

export function useFocusTrap() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const containerRef = useCallback((node: HTMLElement | null) => {
    // node가 null이면 (언마운트 or ref 변경) 이전 클린업 실행
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!node) return;

    let focusableElements = getFocusableElements(node);

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
}
