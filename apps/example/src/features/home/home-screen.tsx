"use client";

import { useEffect, useMemo, useState } from "react";
import { useDeferredLoading } from "@leejaehyeok/use-deferred-loading";

import { MenuCardSkeleton } from "@/features/home/menu-card";
import { CategoryChips } from "@/features/home/category-chips";
import { MenuDetailSheet } from "@/features/home/menu-detail-sheet";
import { MenuList } from "@/features/home/menu-list";
import { PromoBanner } from "@/features/home/promo-banner";
import { SearchBar } from "@/features/home/search-bar";
import { getMenuByCategory, searchMenu } from "@/lib/menu-data";
import type { CategoryId, MenuItem } from "@/lib/types";

export function HomeScreen() {
  const [category, setCategory] = useState<CategoryId>("recommend");
  const [query, setQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);

  const isSearchMode = query.trim().length > 0;

  /** 검색 API 호출을 흉내낸다. (약 420ms) */
  useEffect(() => {
    if (!isSearchMode) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchResults(searchMenu(query));
      setIsSearching(false);
    }, 420);

    return () => clearTimeout(timer);
  }, [query, isSearchMode]);

  /**
   * useDeferredLoading: 150ms 안에 끝나는 검색에는 스켈레톤을 아예 띄우지 않고,
   * 한 번 띄웠다면 최소 350ms는 유지해 깜빡임을 막는다.
   */
  const showSkeleton = useDeferredLoading(isSearching, { delay: 150, minDisplayDuration: 350 });

  const categoryItems = useMemo(() => getMenuByCategory(category), [category]);
  const listItems = isSearchMode ? searchResults : categoryItems;

  return (
    <div className="pb-4">
      <PromoBanner />
      <SearchBar query={query} setQuery={setQuery} />

      {isSearchMode ? (
        <div className="mt-4">
          <p className="text-muted-foreground mb-2 px-4 text-xs">
            <strong className="text-foreground">&ldquo;{query}&rdquo;</strong> 검색 결과
          </p>

          {showSkeleton ? (
            <div className="flex flex-col gap-2 px-4">
              <MenuCardSkeleton />
              <MenuCardSkeleton />
              <MenuCardSkeleton />
            </div>
          ) : (
            <MenuList items={listItems} resetKey={`search:${query}`} onSelect={setSelectedMenu} />
          )}
        </div>
      ) : (
        <>
          <CategoryChips value={category} onChange={setCategory} />
          <div className="mt-4">
            <MenuList items={listItems} resetKey={`category:${category}`} onSelect={setSelectedMenu} />
          </div>
        </>
      )}

      <MenuDetailSheet key={selectedMenu?.id ?? "none"} menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
    </div>
  );
}
