import { useCallback, useEffect, useRef, useState } from "react";

type UseSnoozeOptions = {
  key: string;
  duration: "day" | number;
  storageType?: "local" | "session";
  autoReactivate?: boolean;
};

type UseSnoozeFn = (options: UseSnoozeOptions) => [boolean, () => void];

function normalizeDuration(duration: "day" | number): number {
  if (duration === "day") return 1000 * 60 * 60 * 24;
  return duration;
}

function getStorage(storageType: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  return storageType === "local" ? window.localStorage : window.sessionStorage;
}

function getInitialIsActive(key: string, storageType: "local" | "session"): boolean {
  const storage = getStorage(storageType);
  if (!storage) return false;
  const stored = storage.getItem(key);
  if (!stored) return true;
  return Date.now() >= parseInt(stored);
}

export const useSnooze: UseSnoozeFn = (options) => {
  const { key, duration, storageType = "local", autoReactivate = false } = options;

  const [isActive, setIsActive] = useState<boolean>(() => getInitialIsActive(key, storageType));

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedDuration = normalizeDuration(duration);

  const snooze = useCallback(() => {
    const storage = getStorage(storageType);
    if (!storage) return;
    storage.setItem(key, (Date.now() + normalizedDuration).toString());
    setIsActive(false);
  }, [key, storageType, normalizedDuration]);

  useEffect(() => {
    if (!autoReactivate || isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const storage = getStorage(storageType);
    const stored = storage?.getItem(key);
    const remaining = stored ? parseInt(stored) - Date.now() : normalizedDuration;

    if (remaining <= 0) {
      setIsActive(true);
      return;
    }

    timerRef.current = setTimeout(() => setIsActive(true), remaining);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoReactivate, isActive, key, storageType, normalizedDuration]);

  return [isActive, snooze];
};
