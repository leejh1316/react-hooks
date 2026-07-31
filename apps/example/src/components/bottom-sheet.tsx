"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { useComposedRefs } from "@leejaehyeok/use-compose-ref";
import { useLatestRef } from "@leejaehyeok/use-latest-ref";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

/**
 * 모바일 바텀시트.
 * - useFocusTrap : 시트가 열려 있는 동안 Tab 포커스를 시트 내부에 가둔다.
 * - useComposedRefs : 포커스 트랩 ref + 내부 ref + 외부에서 넘어온 ref를 하나로 합성한다.
 * - useLatestRef : Escape 키 핸들러를 한 번만 등록하면서도 항상 최신 onClose를 호출한다.
 */
export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
  { open, onClose, title, description, children, footer, className },
  forwardedRef,
) {
  const focusTrapRef = useFocusTrap({ initialFocusSelector: "[data-initial-focus]" });
  const panelRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs<HTMLDivElement>(focusTrapRef, panelRef, forwardedRef);

  const onCloseRef = useLatestRef(onClose);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCloseRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onClose}
        className="animate-in fade-in absolute inset-0 cursor-default bg-black/45 duration-200"
      />
      <div className="relative mx-auto flex w-full max-w-[430px] justify-center px-0">
        <div
          ref={composedRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "bg-card animate-in slide-in-from-bottom flex max-h-[82dvh] w-full flex-col rounded-t-3xl border-t shadow-2xl duration-300",
            className,
          )}
        >
          <div className="flex items-start gap-3 px-5 pb-3 pt-4">
            <div className="min-w-0 flex-1">
              <div className="bg-border mx-auto mb-3 h-1 w-10 rounded-full" />
              <h2 className="truncate text-base font-semibold">{title}</h2>
              {description ? <p className="text-muted-foreground mt-0.5 truncate text-xs">{description}</p> : null}
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="시트 닫기" onClick={onClose} className="mt-3 shrink-0">
              <X />
            </Button>
          </div>

          <div className="scrollbar-slim flex-1 overflow-y-auto px-5 pb-2">{children}</div>

          {footer ? <div className="bg-card border-t px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
});
