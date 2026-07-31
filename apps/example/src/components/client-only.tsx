"use client";

import type { ReactNode } from "react";

import { useMounted } from "@/hooks/use-mounted";

type ClientOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** 스토리지 값에 의존하는 영역을 감싸 hydration 불일치를 방지한다. */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isMounted = useMounted();

  if (!isMounted) return <>{fallback}</>;

  return <>{children}</>;
}
