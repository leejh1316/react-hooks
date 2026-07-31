"use client";

import { useCallback } from "react";
import { useSessionStorage } from "@leejaehyeok/use-browser-storage";

export const RECENT_VIEWED_KEY = "brewly/recent-viewed";

const MAX_RECENT_VIEWED = 8;

/** 최근 본 메뉴는 세션이 끝나면 사라져도 되는 정보라 sessionStorage에 저장한다. */
export function useRecentViewed() {
  const {
    value: recentIds,
    setValue,
    removeValue,
  } = useSessionStorage<string[]>({
    key: RECENT_VIEWED_KEY,
    defaultValue: [],
  });

  const pushRecentViewed = useCallback(
    (menuId: string) => {
      setValue((prev) => [menuId, ...prev.filter((id) => id !== menuId)].slice(0, MAX_RECENT_VIEWED));
    },
    [setValue],
  );

  return { recentIds, pushRecentViewed, clearRecentViewed: removeValue };
}
