# @leejaehyeok/use-pagination

[English](./README.md) | [한국어](./README-ko.md)

A React hook for building flexible pagination UI with customizable page ranges, ellipsis, and navigation controls. Supports both controlled and uncontrolled modes.

## 📦 Installation

```bash
npm install @leejaehyeok/use-pagination
```

## 🚀 Quick Start

The hook returns pagination data and navigation methods to build a pagination component.

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
        Current Page: {page} / {totalPages}
      </p>

      <button onClick={handlePrevious} disabled={isFirstPage}>
        Previous
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
        Next
      </button>
    </div>
  );
}
```

## 🧠 Key Features

- **Flexible Range:** Customize `siblings` (pages around current) and `boundaries` (pages at start/end) to create various pagination layouts.
- **Smart Ellipsis:** Automatically shows ellipsis (`...`) based on page gaps.
- **Navigation Methods:** `handleNext()`, `handlePrevious()`, `handleSkipNext()`, `handleSkipPrevious()`, and `setPage()`.
- **State Helpers:** `isFirstPage` and `isLastPage` flags for easy UI control.
- **Controlled & Uncontrolled:** Supports both modes via `currentPage`/`onPageChange` props or `defaultPage`.

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-pagination)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
