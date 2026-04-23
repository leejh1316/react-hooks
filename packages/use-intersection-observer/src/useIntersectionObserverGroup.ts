import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import { RefCallback, useCallback, useRef, useState } from "react";
import { IntersectionBaseOptions } from "./types";

type IntersectionGroupOption = IntersectionBaseOptions & {
  keyAttribute?: string;
  onEntered?: (key: string, entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  onExited?: (key: string, entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
  onChange?: (key: string, type: "enter" | "exit", entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;
};

type TargetState = {
  isVisible: boolean;
  hasEntered: boolean;
};

type GroupStates = Record<string, TargetState>;

function useIntersectionObserverGroup(options?: IntersectionGroupOption) {
  const {
    root = null,
    once = false,
    keyAttribute = "data-intersection-key",
    onEntered,
    onExited,
    onChange,
    ...observerOptions
  } = options || {};

  const [states, setStates] = useState<GroupStates>(() => ({}));

  const onceRef = useRef(once);
  const rootRef = useRef(root);
  const containerRef = useRef<HTMLElement | null>(null);

  const intersectionRef = useRef<IntersectionObserver | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  const isTriggeredOnceRef = useRef<Record<string, boolean>>({});
  const onEnteredRef = useLatestRef(onEntered);
  const onExitedRef = useLatestRef(onExited);
  const onChangeRef = useLatestRef(onChange);

  const cleanup = useCallback(() => {
    intersectionRef.current?.disconnect();
    mutationRef.current?.disconnect();
  }, []);

  const reset = useCallback((key?: string) => {
    if (!containerRef.current) {
      console.warn(`[use-intersection-observer-group] 컨테이너가 없습니다. reset이 실패했습니다.`);
      return;
    }

    if (key) {
      const target = containerRef.current.querySelector(`[${keyAttribute}="${key}"]`);
      if (target instanceof Element) {
        intersectionRef.current?.unobserve(target);
        isTriggeredOnceRef.current[key] = false;
        setStates((prev) => ({
          ...prev,
          [key]: { isVisible: false, hasEntered: false },
        }));
        intersectionRef.current?.observe(target);
      }
    } else {
      intersectionRef.current?.disconnect();
      isTriggeredOnceRef.current = {};
      setStates(() => ({}));

      const targets = containerRef.current.querySelectorAll(`[${keyAttribute}]`);
      const observerRoot = rootRef.current === "container" ? containerRef.current : null;
      const observer = new IntersectionObserver(intersectionObserveCallback, { ...observerOptions, root: observerRoot });
      intersectionRef.current = observer;
      targets.forEach((target) => {
        observer.observe(target);
      });
    }
  }, []);

  const mutationObserverCallback = useCallback<MutationCallback>((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        const targets = [...(node.hasAttribute(keyAttribute) ? [node] : []), ...Array.from(node.querySelectorAll(`[${keyAttribute}]`))];
        targets.forEach((target) => {
          intersectionRef.current?.observe(target);
        });
      });
      mutation.removedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        const targets = [...(node.hasAttribute(keyAttribute) ? [node] : []), ...Array.from(node.querySelectorAll(`[${keyAttribute}]`))];
        targets.forEach((target) => {
          const key = target.getAttribute(keyAttribute);
          if (!key) return;
          intersectionRef.current?.unobserve(target);
          delete isTriggeredOnceRef.current[key];
          setStates((prev) => {
            const newStates = { ...prev };
            delete newStates[key];
            return newStates;
          });
        });
      });
    });
  }, []);

  const intersectionObserveCallback = useCallback<IntersectionObserverCallback>((entries, observer) => {
    setStates((prev) => {
      const newStates = { ...prev };
      entries.forEach((entry) => {
        const key = entry.target.getAttribute(keyAttribute);
        if (!key) {
          console.warn(`[use-intersection-observer-group] ${keyAttribute} 속성이 없습니다.`);
          return;
        }

        const isVisible = entry.isIntersecting;
        const oldState = prev[key];

        onChangeRef.current?.(key, isVisible ? "enter" : "exit", entry, observer);

        if (isVisible) {
          isTriggeredOnceRef.current[key] ||= onceRef.current;
          onEnteredRef.current?.(key, entry, observer);
          newStates[key] = { isVisible, hasEntered: true };
        } else {
          onExitedRef.current?.(key, entry, observer);
          newStates[key] = { isVisible, hasEntered: oldState?.hasEntered ?? false };
          if (isTriggeredOnceRef.current[key]) {
            observer.unobserve(entry.target);
          }
        }
      });
      return newStates;
    });
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
      const targets = node.querySelectorAll(`[${keyAttribute}]`);

      const observer = new IntersectionObserver(intersectionObserveCallback, { ...observerOptions, root: observerRoot });
      intersectionRef.current = observer;

      const mutation = new MutationObserver(mutationObserverCallback);
      mutation.observe(node, {
        childList: true,
        subtree: true,
      });
      mutationRef.current = mutation;

      if (targets.length === 0) {
        return;
      }

      targets.forEach((target) => {
        observer.observe(target);
      });
    },
    [intersectionObserveCallback],
  );

  return {
    setContainerRef,
    reset,
    states,
  };
}

export { useIntersectionObserverGroup };
