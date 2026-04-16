# @leejaehyeok/use-pagination

[English](./README.md) | [한국어](./README-ko.md)

페이지네이션 UI를 쉽게 구축하기 위한 React 훅입니다. 커스터마이저 가능한 페이지 범위, 생략 기호(ellipsis), 네비게이션 컨트롤을 제공하며 제어/비제어 모드를 모두 지원합니다.

## 📦 설치

```bash
npm install @leejaehyeok/use-pagination
```

## 🚀 빠른 시작

훅은 페이지네이션 데이터와 네비게이션 메서드를 반환하여 페이지네이션 컴포넌트를 구축할 수 있습니다.

```tsx
import React, { useState } from "react";
import { usePagination } from "@leejaehyeok/use-pagination";

export default function Pagination() {
  const { page, totalPages, setPage, handleNext, handlePrevious, paginationRange, isFirstPage, isLastPage } = usePagination({
    totalItems: 100,
    itemsPerPage: 10,
    siblings: 1,
    boundaries: 1,
    defaultPage: 1,
  });

  return (
    <div>
      <p>
        현재 페이지: {page} / {totalPages}
      </p>

      <button onClick={handlePrevious} disabled={isFirstPage}>
        이전
      </button>

      {paginationRange.map((item) =>
        item.type === "page" ? (
          <button key={item.key} onClick={() => setPage(item.page)} style={{ fontWeight: page === item.page ? "bold" : "normal" }}>
            {item.page}
          </button>
        ) : (
          <span key={item.key}>...</span>
        ),
      )}

      <button onClick={handleNext} disabled={isLastPage}>
        다음
      </button>
    </div>
  );
}
```

## 🧠 주요 기능

- **유연한 범위 설정:** `siblings` (현재 페이지 주변 페이지 수)와 `boundaries` (앞/뒤 경계 페이지 수)를 커스터마이징하여 다양한 페이지네이션 레이아웃을 만들 수 있습니다.
- **스마트 생략 기호:** 페이지 간격에 따라 자동으로 생략 기호(`...`)를 표시합니다.
- **네비게이션 메서드:** `handleNext()`, `handlePrevious()`, `handleSkipNext()`, `handleSkipPrevious()`, `setPage()` 메서드를 제공합니다.
- **상태 헬퍼:** `isFirstPage`와 `isLastPage` 플래그로 UI 제어를 쉽게 합니다.
- **제어/비제어 모드:** `currentPage`/`onPageChange` props를 통한 제어 모드 또는 `defaultPage`를 통한 비제어 모드를 지원합니다.

## 🔗 링크

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-throttle)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 라이선스

MIT © [leejh1316](https://github.com/leejh1316)
