"use client";

import { useEffect, useState } from "react";
import { useThrottle } from "@leejaehyeok/use-throttle";

/**
 * 스크롤 위치가 임계값을 넘었는지 여부.
 * scroll 이벤트는 초당 수십 번 발생하므로 useThrottle로 상태 갱신 횟수를 제한한다.
 */
export function useScrolled(threshold = 40) {
  const [isScrolled, setIsScrolled] = useState(false);

  const { throttle, cancel } = useThrottle((scrollY: number) => {
    setIsScrolled(scrollY > threshold);
  }, 120);

  useEffect(() => {
    const handleScroll = () => throttle(window.scrollY);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancel();
    };
  }, [throttle, cancel]);

  return isScrolled;
}
