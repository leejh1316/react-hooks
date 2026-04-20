// 1. cleanup 처리
// 2. ref 참조 병합
// 3. callbackRef 형식 지정
// 4. 모든 ref 유형 지원 (함수형, 객체형, null)

import type { Ref, RefCallback } from "react";
import { useCallback } from "react";

// MutableRef, RefObject, RefCallback 지원
type AnyRef<T> = Ref<T> | undefined;

export function setRef<T>(ref: AnyRef<T>, value: T): void | (() => void) {
  // callbackRef 형식의 경우 React19에서 cleanup 처리가 있을 수 있으므로 클린업 리턴 처리
  // RefCallback
  if (typeof ref === "function") {
    return ref(value);
  }
  // RefObject, MutableRef
  else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

function composeRefs<T>(...refs: AnyRef<T>[]): RefCallback<T> {
  return (value: T) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, value);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          // cleanup이 있는 경우 cleanup 함수 실행 (react 19)
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            // cleanup이 없는 ref는 null로 초기화
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

function useComposedRefs<T>(...refs: AnyRef<T>[]): RefCallback<T> {
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
