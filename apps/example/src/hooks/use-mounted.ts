"use client";

import { useEffect, useState } from "react";

/**
 * 훅들이 localStorage / sessionStorage를 읽는 시점은 클라이언트뿐이므로
 * 서버 렌더링 결과와 값이 달라질 수 있다.
 * 스토리지 기반 UI는 마운트 이후에 그려서 hydration 불일치를 피한다.
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
