import { useControllableState } from "@leejaehyeok/use-controllable-state";
import { useEffect } from "react";

// 유틸리티 함수: 특정 범위의 숫자 배열 생성
const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

interface PageItem {
  type: "page";
  page: number;
  key: string; // React 렌더링을 위한 고유 키
}

interface EllipsisItem {
  type: "ellipsis";
  key: string;
}

export type PaginationItem = PageItem | EllipsisItem;
export interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  siblings?: number;
  boundaries?: number;
  defaultPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  siblings = 1,
  boundaries = 1,
  defaultPage = 1,
  currentPage,
  onPageChange = () => {},
}: UsePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [page, setPage] = useControllableState({
    value: currentPage,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const jumpStep = siblings * 2 + 1;

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSkipNext = () => {
    const targetPage = Math.min(page + jumpStep, totalPages);
    setPage(targetPage);
  };

  const handleSkipPrevious = () => {
    const targetPage = Math.max(page - jumpStep, 1);
    setPage(targetPage);
  };

  const paginationRange: PaginationItem[] = (() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
    // 모든 페이지를 표시하는 경우
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages).map((p) => ({ type: "page", page: p, key: `page-${p}` }));
    }
    const leftSiblingIndex = Math.max(page - siblings, 1);
    const rightSiblingIndex = Math.min(page + siblings, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 1;
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaries;

    const firstPageRange = range(1, boundaries);
    const lastPageRange = range(totalPages - boundaries + 1, totalPages);

    // 오른쪽 점만 표시하는 경우 (예: 1 2 3 4 5 ... 10)
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      const leftRange = range(1, leftItemCount);

      const leftItems = leftRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);
      const lastItems = lastPageRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);

      return [...leftItems, { type: "ellipsis", key: "right-ellipsis" }, ...lastItems];
    }

    // 왼쪽 점만 표시하는 경우 (예: 1 ... 6 7 8 9 10)
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = siblings * 2 + boundaries + 2;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);

      const firstItems = firstPageRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);
      const rightItems = rightRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);

      return [...firstItems, { type: "ellipsis", key: "left-ellipsis" }, ...rightItems];
    }

    // 양쪽 점을 모두 표시하는 경우 (예: 1 ... 4 5 6 ... 10)
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);

      const firstItems = firstPageRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);
      const middleItems = middleRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);
      const lastItems = lastPageRange.map((p) => ({ type: "page", page: p, key: `page-${p}` }) as PageItem);

      return [
        ...firstItems,
        { type: "ellipsis", key: "left-ellipsis" },
        ...middleItems,
        { type: "ellipsis", key: "right-ellipsis" },
        ...lastItems,
      ];
    }
    return [];
  })();

  useEffect(() => {
    // totalPages가 변경될 때 현재 페이지가 범위를 벗어나지 않도록 조정
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages]);

  return {
    /** 현재 페이지 번호 */
    page,
    /** 전체 페이지 수 */
    totalPages,
    /** 특정 페이지로 이동하는 함수 */
    setPage,
    /** 다음 페이지로 이동하는 함수 */
    handleNext,
    /** 이전 페이지로 이동하는 함수 */
    handlePrevious,
    /** 점프하여 다음 페이지로 이동하는 함수 */
    handleSkipNext,
    /** 점프하여 이전 페이지로 이동하는 함수 */
    handleSkipPrevious,
    /** 렌더링할 페이지 배열 */
    paginationRange,
    /** 첫 페이지 여부 */
    isFirstPage: page === 1,
    /** 마지막 페이지 여부 */
    isLastPage: page === totalPages,
  };
};
