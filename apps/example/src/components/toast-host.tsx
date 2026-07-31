"use client";

import { useEffect } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TONE_ICON = {
  default: Info,
  success: CircleCheck,
  danger: CircleAlert,
};

/**
 * 앱 전역 토스트.
 * useCustomEventState 덕분에 Provider가 없어도 어느 컴포넌트에서든 showToast를 호출할 수 있고,
 * 자동 닫기 타이머는 useLatestRef로 항상 최신 hideToast를 참조한다.
 */
export function ToastHost() {
  const { toast, hideToast } = useToast();
  const hideToastRef = useLatestRef(hideToast);

  const toastId = toast?.id;

  useEffect(() => {
    if (!toastId) return;

    const timer = setTimeout(() => hideToastRef.current(), 2400);
    return () => clearTimeout(timer);
  }, [toastId, hideToastRef]);

  if (!toast) return null;

  const Icon = TONE_ICON[toast.tone];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4" role="status" aria-live="polite">
      <div
        key={toast.id}
        className={cn(
          "animate-in fade-in slide-in-from-bottom-4 flex w-full max-w-[398px] items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg duration-200",
          toast.tone === "danger" ? "bg-destructive text-white" : "bg-foreground text-background",
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1">{toast.message}</span>
      </div>
    </div>
  );
}
