import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { getDelta, getDirection, isDisabledElement } from "./utils";
import { Direction } from "./types";

export interface NavigationDetail {
  activeIndex: number;
  activeElement: HTMLElement;
  direction: Direction;
  event: React.KeyboardEvent;
}

type Orientation = "horizontal" | "vertical" | "both";

export type RovingFocusOptions = {
  itemSelector: string;
  orientation?: Orientation;
  loop?: boolean;
  colSkipCount?: number;
  initialIndex?: number;
  clickOnNavigate?: boolean;
  scrollIntoView?: boolean | ScrollIntoViewOptions;
  enableHome?: boolean;
  enableEnd?: boolean;
  onNavigate?: (detail: NavigationDetail) => void;
  onUnderflow?: () => void;
  onOverflow?: () => void;
};

const defaultOptions: Required<RovingFocusOptions> = {
  itemSelector: "[data-roving-item]",
  orientation: "both",
  loop: false,
  colSkipCount: 0,
  initialIndex: 0,
  clickOnNavigate: false,
  scrollIntoView: false,
  enableHome: true,
  enableEnd: true,
  onNavigate: () => {},
  onUnderflow: () => {},
  onOverflow: () => {},
};

const KEYBOARD_NAVIGATION: Record<Orientation, string[]> = {
  horizontal: ["ArrowLeft", "ArrowRight"],
  vertical: ["ArrowUp", "ArrowDown"],
  both: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
};

const HOME_KEY = "Home";
const END_KEY = "End";

export function useRovingFocus(options: RovingFocusOptions) {
  const {
    itemSelector,
    orientation,
    loop,
    colSkipCount,
    initialIndex,
    clickOnNavigate,
    scrollIntoView,
    enableHome,
    enableEnd,
    onNavigate,
    onUnderflow,
    onOverflow,
  } = { ...defaultOptions, ...options };

  // 비제어 패턴 — prop 변경 이후에도 갱신하지 않음 (의도적)
  const activeIndexRef = useRef(initialIndex);
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  // 콜백 최신 참조 유지 (stale closure 방지)
  const onNavigateRef = useRef(onNavigate);
  const onUnderflowRef = useRef(onUnderflow);
  const onOverflowRef = useRef(onOverflow);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);
  useEffect(() => {
    onUnderflowRef.current = onUnderflow;
  }, [onUnderflow]);
  useEffect(() => {
    onOverflowRef.current = onOverflow;
  }, [onOverflow]);

  const allowedKeys = useMemo(() => {
    const keys = [...KEYBOARD_NAVIGATION[orientation]];
    if (enableHome) keys.push(HOME_KEY);
    if (enableEnd) keys.push(END_KEY);
    return keys;
  }, [orientation, enableHome, enableEnd]);

  // tabIndex 일괄 갱신 — MutationObserver, focusin 두 곳에서 공통 사용
  const updateTabIndices = useCallback((activeIdx: number) => {
    itemRefs.current.forEach((el, idx) => {
      if (el) el.tabIndex = idx === activeIdx ? 0 : -1;
    });
  }, []);

  // MutationObserver로 itemRefs 동기화
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncItems = () => {
      itemRefs.current = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      updateTabIndices(activeIndexRef.current);
    };

    const observer = new MutationObserver(syncItems);
    observer.observe(container, { childList: true, subtree: true });
    syncItems();

    return () => observer.disconnect();
  }, [itemSelector, updateTabIndices]);

  // focusin으로 activeIndexRef 동기화 (마우스 클릭 등 외부 포커스 반영)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const index = itemRefs.current.findIndex((el) => el?.contains(target));
      if (index !== -1) {
        activeIndexRef.current = index;
        updateTabIndices(index);
      }
    };

    container.addEventListener("focusin", handleFocusIn);
    return () => container.removeEventListener("focusin", handleFocusIn);
  }, [updateTabIndices]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!allowedKeys.includes(event.key)) return;
      event.preventDefault();

      const items = itemRefs.current;
      if (!items.length) return;

      const current = activeIndexRef.current;
      const total = items.length;
      let nextIndex: number | null = null;

      if (event.key === HOME_KEY) {
        for (let i = 0; i < total; i++) {
          if (!isDisabledElement(items[i])) {
            nextIndex = i;
            break;
          }
        }
      } else if (event.key === END_KEY) {
        for (let i = total - 1; i >= 0; i--) {
          if (!isDisabledElement(items[i])) {
            nextIndex = i;
            break;
          }
        }
      } else {
        const delta = getDelta(event.key, colSkipCount);
        const effectiveColCount = colSkipCount > 0 ? colSkipCount : 1;
        const isVertical = Math.abs(delta) > 1;

        const maxAttempts = isVertical ? Math.ceil(total / effectiveColCount) : total;

        let raw = current + delta;

        for (let attempts = 0; attempts < maxAttempts; attempts++) {
          if (isVertical) {
            if (raw < 0) {
              if (loop) {
                const col = current % effectiveColCount;
                const maxRowInCol = Math.floor((total - 1 - col) / effectiveColCount);
                raw = col + maxRowInCol * effectiveColCount;
              } else {
                onUnderflowRef.current?.();
                break;
              }
            } else if (raw >= total) {
              if (loop) {
                raw = current % effectiveColCount;
              } else {
                onOverflowRef.current?.();
                break;
              }
            }
          } else {
            if (raw < 0) {
              if (loop) {
                raw = total - 1;
              } else {
                onUnderflowRef.current?.();
                break;
              }
            } else if (raw >= total) {
              if (loop) {
                raw = 0;
              } else {
                onOverflowRef.current?.();
                break;
              }
            }
          }

          // 범위 보정 후 접근 — raw가 항상 유효 범위 내임이 보장된 상태
          if (!isDisabledElement(items[raw])) {
            nextIndex = raw;
            break;
          }

          raw += delta;
        }
      }

      if (nextIndex === null) return;

      const targetEl = items[nextIndex];
      if (!targetEl) return;

      activeIndexRef.current = nextIndex;
      targetEl.focus();

      if (scrollIntoView) {
        const scrollOptions = typeof scrollIntoView === "object" ? scrollIntoView : { block: "nearest" as const };
        targetEl.scrollIntoView(scrollOptions);
      }

      if (clickOnNavigate) {
        targetEl.click();
      }

      onNavigateRef.current?.({
        activeIndex: nextIndex,
        activeElement: targetEl,
        direction: getDirection(event.key),
        event,
      });
    },
    [allowedKeys, colSkipCount, loop, scrollIntoView, clickOnNavigate],
  );

  return { containerRef, handleKeyDown };
}
