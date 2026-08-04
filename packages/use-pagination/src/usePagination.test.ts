import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../../test/renderHook";
import { usePagination, type PaginationItem, type UsePaginationProps } from "./usePagination";

/** paginationRange를 "1 2 ... 10" 형태로 눌러서 비교하기 쉽게 만든다. */
const format = (items: PaginationItem[]) => items.map((item) => (item.type === "ellipsis" ? "..." : String(item.page))).join(" ");

const setup = (props: UsePaginationProps) => renderHook(() => usePagination(props));

describe("usePagination", () => {
  describe("totalPages 계산", () => {
    it("나누어떨어지지 않으면 올림한다", () => {
      const { result } = setup({ totalItems: 95, itemsPerPage: 10 });

      expect(result.current.totalPages).toBe(10);
    });
  });

  describe("paginationRange (siblings=1, boundaries=1)", () => {
    it("전체 페이지가 표시 한도 이하면 전부 나열한다", () => {
      const { result } = setup({ totalItems: 50, itemsPerPage: 10 });

      expect(format(result.current.paginationRange)).toBe("1 2 3 4 5");
    });

    it("첫 페이지 근처에서는 오른쪽에만 생략 부호를 넣는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 1 });

      expect(format(result.current.paginationRange)).toBe("1 2 3 4 5 ... 10");
    });

    it("마지막 페이지 근처에서는 왼쪽에만 생략 부호를 넣는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 10 });

      expect(format(result.current.paginationRange)).toBe("1 ... 6 7 8 9 10");
    });

    it("중간 페이지에서는 양쪽에 생략 부호를 넣는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 5 });

      expect(format(result.current.paginationRange)).toBe("1 ... 4 5 6 ... 10");
    });
  });

  describe("siblings / boundaries 옵션", () => {
    it("siblings를 늘리면 현재 페이지 주변이 넓어진다", () => {
      const { result } = setup({ totalItems: 200, itemsPerPage: 10, defaultPage: 10, siblings: 2 });

      expect(format(result.current.paginationRange)).toBe("1 ... 8 9 10 11 12 ... 20");
    });

    it("boundaries를 늘리면 양 끝이 넓어진다", () => {
      const { result } = setup({ totalItems: 200, itemsPerPage: 10, defaultPage: 10, siblings: 2, boundaries: 2 });

      expect(format(result.current.paginationRange)).toBe("1 2 ... 8 9 10 11 12 ... 19 20");
    });
  });

  describe("이동 함수", () => {
    it("handleNext / handlePrevious가 한 칸씩 움직인다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 5 });

      act(() => result.current.handleNext());
      expect(result.current.page).toBe(6);

      act(() => result.current.handlePrevious());
      expect(result.current.page).toBe(5);
    });

    it("마지막 페이지에서 handleNext는 아무것도 하지 않는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 10 });

      act(() => result.current.handleNext());

      expect(result.current.page).toBe(10);
    });

    it("첫 페이지에서 handlePrevious는 아무것도 하지 않는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 1 });

      act(() => result.current.handlePrevious());

      expect(result.current.page).toBe(1);
    });

    it("handleSkipNext는 siblings*2+1 만큼 점프한다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 1 });

      act(() => result.current.handleSkipNext());

      expect(result.current.page).toBe(4);
    });

    it("handleSkipPrevious도 같은 폭으로 되돌아간다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 10 });

      act(() => result.current.handleSkipPrevious());

      expect(result.current.page).toBe(7);
    });

    it("점프는 1 / totalPages 범위를 넘지 않는다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 9 });

      act(() => result.current.handleSkipNext());
      expect(result.current.page).toBe(10);

      act(() => result.current.handleSkipPrevious());
      expect(result.current.page).toBe(7);

      act(() => result.current.handleSkipPrevious());
      expect(result.current.page).toBe(4);

      act(() => result.current.handleSkipPrevious());
      expect(result.current.page).toBe(1);

      act(() => result.current.handleSkipPrevious());
      expect(result.current.page).toBe(1);
    });
  });

  describe("isFirstPage / isLastPage", () => {
    it("양 끝에서 각각 true가 된다", () => {
      const { result } = setup({ totalItems: 100, itemsPerPage: 10, defaultPage: 1 });

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);

      act(() => result.current.setPage(10));

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe("제어 모드", () => {
    it("currentPage가 주어지면 내부 상태를 바꾸지 않고 onPageChange만 호출한다", () => {
      const onPageChange = vi.fn();
      const { result } = renderHook(() => usePagination({ totalItems: 100, itemsPerPage: 10, currentPage: 3, onPageChange }));

      act(() => result.current.handleNext());

      expect(result.current.page).toBe(3);
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("currentPage가 바뀌면 반영된다", () => {
      const { result, rerender } = renderHook(
        ({ currentPage }: { currentPage: number }) => usePagination({ totalItems: 100, itemsPerPage: 10, currentPage }),
        { initialProps: { currentPage: 3 } },
      );

      rerender({ currentPage: 7 });

      expect(result.current.page).toBe(7);
    });
  });

  describe("totalPages가 줄어들 때", () => {
    it("현재 페이지가 범위를 벗어나면 마지막 페이지로 당겨온다", () => {
      const { result, rerender } = renderHook(
        ({ totalItems }: { totalItems: number }) => usePagination({ totalItems, itemsPerPage: 10, defaultPage: 10 }),
        { initialProps: { totalItems: 100 } },
      );
      expect(result.current.page).toBe(10);

      rerender({ totalItems: 30 });

      expect(result.current.totalPages).toBe(3);
      expect(result.current.page).toBe(3);
    });
  });

  describe("항목이 없는 경우", () => {
    it("totalPages가 0이 되고 page도 0으로 내려간다", () => {
      const { result } = setup({ totalItems: 0, itemsPerPage: 10 });

      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginationRange).toEqual([]);
      // page > totalPages 보정 effect가 page를 0으로 만든다.
      expect(result.current.page).toBe(0);
      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
    });
  });
});
