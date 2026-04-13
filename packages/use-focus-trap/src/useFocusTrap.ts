// 특정 컨테이너 내에서 포커스가 순환하도록 하는 훅입니다.

import { useEffect, useRef } from "react";
import { getFocusableElements } from "./utils";

export function useFocusTrap() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let focusableElements = getFocusableElements(container);

    const observer = new MutationObserver(() => {
      focusableElements = getFocusableElements(container);
    });

    observer.observe(container, {
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

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return { containerRef };
}
