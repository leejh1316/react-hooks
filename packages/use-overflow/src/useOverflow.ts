import { RefCallback, useCallback, useEffect, useRef, useState } from "react";

interface UseOverflowResult {
  containerRef: (node: HTMLElement | null) => void;
  isOverflow: boolean;
}
// 컨테이너 노드와 자식 노드들의 크기 변화를 관찰하여 오버플로우 여부를 판단하는 훅
// 렌더링 실행순서
// MutationObserver -> (rAF) -> Style  -> Layout -> ResizeObserver -> Paint
export function useOverflow(): UseOverflowResult {
  const containerNodeRef = useRef<HTMLElement | null>(null);
  const containerResizeObserverRef = useRef<ResizeObserver | null>(null);
  const itemResizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const rafHandleRef = useRef<number | null>(null);

  const [isOverflow, setIsOverflow] = useState(false);

  const measure = useCallback(() => {
    const containerNode = containerNodeRef.current;
    if (!containerNode) return;

    const markedItems = Array.from(containerNode.querySelectorAll<Element>("[data-overflow-item]"));
    const children = markedItems.length > 0 ? markedItems : Array.from(containerNode.children);

    if (children.length === 0) {
      setIsOverflow(false);
      return;
    }

    const containerRect = containerNode.getBoundingClientRect();
    const lastChild = children[children.length - 1];
    const lastChildRight = lastChild.getBoundingClientRect().right - containerRect.left;

    setIsOverflow((prev) => {
      const next = lastChildRight > containerRect.width;
      return prev === next ? prev : next;
    });
  }, []);

  const scheduleRecalculate = useCallback(() => {
    if (rafHandleRef.current !== null) {
      cancelAnimationFrame(rafHandleRef.current);
    }
    rafHandleRef.current = requestAnimationFrame(() => {
      rafHandleRef.current = null;
      measure();
    });
  }, [measure]);

  const cleanup = useCallback(() => {
    if (rafHandleRef.current !== null) {
      cancelAnimationFrame(rafHandleRef.current);
      rafHandleRef.current = null;
    }
    containerResizeObserverRef.current?.disconnect();
    itemResizeObserverRef.current?.disconnect();
    mutationObserverRef.current?.disconnect();
  }, []);

  const containerRef = useCallback<RefCallback<HTMLElement>>(
    (node) => {
      if (node === null) {
        cleanup();
        containerNodeRef.current = null;
        return;
      }

      if (node === containerNodeRef.current) return;

      containerNodeRef.current = node;

      const itemResizeObserver = new ResizeObserver(measure);
      itemResizeObserverRef.current = itemResizeObserver;

      const markedItems = Array.from(node.querySelectorAll<Element>("[data-overflow-item]"));
      const initialChildren = markedItems.length > 0 ? markedItems : Array.from(node.children);

      for (const child of initialChildren) {
        itemResizeObserver.observe(child);
      }

      const mutationObserver = new MutationObserver((mutations) => {
        const isMarkedStrategy = node.querySelectorAll("[data-overflow-item]").length > 0;

        for (const mutation of mutations) {
          for (const added of Array.from(mutation.addedNodes)) {
            if (!(added instanceof Element)) continue;
            if (isMarkedStrategy) {
              if (added.hasAttribute("data-overflow-item")) {
                itemResizeObserver.observe(added);
              }
            } else {
              itemResizeObserver.observe(added);
            }
          }
          for (const removed of Array.from(mutation.removedNodes)) {
            if (removed instanceof Element) {
              itemResizeObserver.unobserve(removed);
            }
          }
        }

        scheduleRecalculate();
      });
      mutationObserverRef.current = mutationObserver;
      mutationObserver.observe(node, { childList: true, subtree: true });

      const containerResizeObserver = new ResizeObserver(measure);
      containerResizeObserverRef.current = containerResizeObserver;
      containerResizeObserver.observe(node);
    },
    [measure, scheduleRecalculate, cleanup],
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { containerRef, isOverflow };
}
