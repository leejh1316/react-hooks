"use client";

import { useCallback } from "react";
import { useCustomEventState } from "@leejaehyeok/use-custom-event-state";

export type ToastTone = "default" | "success" | "danger";

export type ToastPayload = {
  id: number;
  message: string;
  tone: ToastTone;
};

const TOAST_KEY = "brewly/toast";

/**
 * Context / 전역 스토어 없이 토스트를 띄운다.
 * useCustomEventState가 window CustomEvent로 상태를 브로드캐스트하므로
 * Provider로 감싸지 않은 컴포넌트에서도 같은 key만 알면 구독/발행이 가능하다.
 */
export function useToast() {
  const [toast, dispatch] = useCustomEventState<ToastPayload | null>(TOAST_KEY, null);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "default") => {
      dispatch({ id: Date.now(), message, tone });
    },
    [dispatch],
  );

  const hideToast = useCallback(() => {
    dispatch(null);
  }, [dispatch]);

  return { toast, showToast, hideToast };
}
