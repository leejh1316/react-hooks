"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

export const THEME_STORAGE_KEY = "brewly/theme";

export type ThemeMode = "light" | "dark";

/** 테마를 localStorage에 저장하고, 다른 탭에서 바꿔도 subscribe 옵션으로 함께 반영된다. */
export function useTheme() {
  const { value: theme, setValue: setTheme } = useLocalStorage<ThemeMode>({
    key: THEME_STORAGE_KEY,
    defaultValue: "light",
    subscribe: true,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
