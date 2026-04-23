import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { RefCallback, useCallback, useRef, useState } from "react";
import { IntersectionBaseOptions } from "./types";

type IntersectionObserverOption = IntersectionBaseOptions & {
  targetSelector?: string;
  onEntered?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  onExited?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  onChange?: (type: "enter" | "exit", entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
};
function useIntersectionObserver(options?: IntersectionObserverOption) {
  const {
    root = null,
    once = false,
    targetSelector = "[data-intersection-target]",
    onEntered,
    onExited,
    onChange,
    ...observerOptions
  } = options || {};

  const [targetState, setTargetState] = useState(() => ({
    isVisible: false,
    hasEntered: false,
  }));

  const onceRef = useRef(once);
  const rootRef = useRef(root);
  const targetRef = useRef<Element | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const intersectionRef = useRef<IntersectionObserver | null>(null);

  const isTriggeredOnceRef = useRef(false);
  const onEnteredRef = useLatestRef(onEntered);
  const onExitedRef = useLatestRef(onExited);
  const onChangeRef = useLatestRef(onChange);

  const cleanup = useCallback(() => {
    intersectionRef.current?.disconnect();
  }, []);

  const reset = useCallback(() => {
    if (!containerRef.current || !targetRef.current) {
      console.warn(`[use-intersection-observer] 관찰할 요소가 없습니다. reset이 실패했습니다.`);
      return;
    }
    intersectionRef.current?.unobserve(targetRef.current);
    isTriggeredOnceRef.current = false;
    setTargetState(() => ({
      isVisible: false,
      hasEntered: false,
    }));
    intersectionRef.current?.observe(targetRef.current);
  }, []);

  const observeCallback = useCallback<IntersectionObserverCallback>((entries, observer) => {
    const entry = entries[0];
    const isVisible = entry.isIntersecting;

    targetRef.current = entry.target;
    onChangeRef.current?.(isVisible ? "enter" : "exit", entry, observer);

    if (isVisible) {
      isTriggeredOnceRef.current ||= onceRef.current;
      onEnteredRef.current?.(entry, observer);
      setTargetState(() => ({ isVisible, hasEntered: true }));
    } else {
      onExitedRef.current?.(entry, observer);
      setTargetState((prev) => ({ ...prev, isVisible }));
      if (isTriggeredOnceRef.current) {
        observer.unobserve(entry.target);
      }
    }
  }, []);

  const setContainerRef = useCallback<RefCallback<HTMLElement>>(
    (node) => {
      if (!node) {
        containerRef.current = null;
        cleanup();
        return;
      }
      containerRef.current = node;
      const observerRoot = rootRef.current === "container" ? node : null;
      const nodeList = node.querySelectorAll(targetSelector);
      const target = nodeList.length > 0 ? nodeList : node.firstElementChild;

      // target이 존재하지 않으면 관찰할 수 없으므로 early return
      if (!target) {
        console.warn(`[use-intersection-observer] 대상을 찾을 수 없습니다: "${targetSelector}"`);
        return;
      }
      // target이 두 개 이상이라면 첫 번째 요소만 관찰
      if (process.env.NODE_ENV) {
        if (target instanceof NodeList && target.length > 1) {
          console.warn(`여러 개의 요소가 발견되었습니다. 첫 번째 요소만 추적합니다.`);
        }
      }
      const observer = new IntersectionObserver(observeCallback, { ...observerOptions, root: observerRoot });
      const targetElement = target instanceof NodeList ? target[0] : target;
      intersectionRef.current = observer;
      observer.observe(targetElement);
    },
    [observeCallback],
  );

  return {
    setContainerRef,
    reset,
    ...targetState,
  };
}

export { useIntersectionObserver };
