import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { usePrevRef } from "@leejaehyeok/use-prev-ref";

// setState((prev)=> newValue) 형태로 업데이트 함수를 사용할때의 타입정의
type StateUpdater<S> = (prevState: S) => S;

export type ControllableStateOptions<T> = {
  value?: T; // value가 undefined인 경우 내부상태 사용, value가 undefined가 아닌 경우 외부상태 사용
  defaultValue?: T | (() => T); // 내부상태의 초기값
  onChange?: (value: T) => void; // 상태 변경 시 호출되는 콜백 함수
};
export function useControllableState<T>(options: ControllableStateOptions<T>) {
  const { value: controlledValue, defaultValue, onChange } = options;
  const isControlled = useRef(controlledValue !== undefined); // 이후 value가 undefined가 되어도 제어모드로 간주하기 위해 useRef로 isControlled 관리
  const [state, setState] = useState(() => (typeof defaultValue === "function" ? (defaultValue as () => T)() : (defaultValue as T)));

  const value = isControlled.current ? controlledValue! : state;
  const prevValueRef = usePrevRef(value);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setValue: Dispatch<SetStateAction<T>> = useCallback((next: SetStateAction<T>) => {
    const prevValue = prevValueRef.current;
    const resolvedValue = typeof next === "function" ? (next as StateUpdater<T>)(prevValue) : next;
    if (Object.is(prevValue, resolvedValue)) return; // 값이 변경되지 않은 경우 onChange 호출 방지
    if (!isControlled.current) {
      setState(resolvedValue);
    }
    onChangeRef.current?.(resolvedValue);
  }, []);

  return [value, setValue] as const;
}
