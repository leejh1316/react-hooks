import { useLatestRef } from "@leejaehyeok/use-latest-ref";
import React, { useCallback } from "react";

function updateState<S>(setter: React.Dispatch<React.SetStateAction<S>>, next: React.SetStateAction<S>): void {
  if (typeof next === "function") {
    setter((prevState) => (next as (prevState: S) => S)(prevState));
  } else {
    setter(next);
  }
}

function useComposedState<S>(...setters: React.Dispatch<React.SetStateAction<S>>[]) {
  const settersRef = useLatestRef(setters);

  const setState = useCallback<React.Dispatch<React.SetStateAction<S>>>((next) => {
    settersRef.current.forEach((setter) => {
      updateState(setter, next);
    });
  }, []);

  return setState;
}

export { useComposedState };
