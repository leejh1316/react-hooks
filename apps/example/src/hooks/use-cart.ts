"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

import type { CartLine, MenuItem, TemperatureOption } from "@/lib/types";

export const CART_STORAGE_KEY = "brewly/cart";

function lineKey(menuId: string, option: TemperatureOption) {
  return `${menuId}__${option}`;
}

/**
 * 장바구니 상태.
 * useLocalStorage 하나로 (1) 새로고침 후에도 유지 (2) 같은 탭의 모든 컴포넌트 동기화
 * (3) subscribe 옵션으로 다른 탭의 변경까지 반영된다.
 */
export function useCart() {
  const {
    value: lines,
    setValue,
    removeValue,
  } = useLocalStorage<CartLine[]>({
    key: CART_STORAGE_KEY,
    defaultValue: [],
    subscribe: true,
  });

  const addItem = useCallback(
    (menu: MenuItem, option: TemperatureOption, quantity: number) => {
      setValue((prev) => {
        const key = lineKey(menu.id, option);
        const exists = prev.some((line) => lineKey(line.id, line.option) === key);

        if (exists) {
          return prev.map((line) => (lineKey(line.id, line.option) === key ? { ...line, quantity: line.quantity + quantity } : line));
        }

        return [...prev, { id: menu.id, name: menu.name, emoji: menu.emoji, price: menu.price, option, quantity }];
      });
    },
    [setValue],
  );

  const updateQuantity = useCallback(
    (menuId: string, option: TemperatureOption, quantity: number) => {
      setValue((prev) =>
        prev.flatMap((line) => {
          if (lineKey(line.id, line.option) !== lineKey(menuId, option)) return [line];
          if (quantity <= 0) return [];
          return [{ ...line, quantity }];
        }),
      );
    },
    [setValue],
  );

  const removeItem = useCallback(
    (menuId: string, option: TemperatureOption) => {
      setValue((prev) => prev.filter((line) => lineKey(line.id, line.option) !== lineKey(menuId, option)));
    },
    [setValue],
  );

  const totalCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const totalPrice = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);

  return { lines, addItem, updateQuantity, removeItem, clearCart: removeValue, totalCount, totalPrice };
}
