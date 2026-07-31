"use client";

import * as React from "react";
import { Clock, Search, X } from "lucide-react";
import { useDebounce } from "@leejaehyeok/use-debounce";
import { useComposedState } from "@leejaehyeok/use-compose-state";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

import { ClientOnly } from "@/components/client-only";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const RECENT_KEYWORD_KEY = "brewly/recent-keywords";

const MAX_RECENT = 6;

type SearchBarProps = {
  /** 실제 검색에 사용되는 값. 입력값과 분리해 debounce 이후에만 갱신한다. */
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchBar({ query, setQuery }: SearchBarProps) {
  const [keyword, setKeyword] = React.useState(query);

  /**
   * useComposedState: 입력값(keyword) 과 검색어(query) 두 상태를 하나의 setter로 합성.
   * 최근 검색어를 눌렀을 때는 debounce를 기다리지 않고 두 상태를 한 번에 갱신한다.
   */
  const setKeywordAndQuery = useComposedState<string>(setKeyword, setQuery);

  const {
    value: recentKeywords,
    setValue: setRecentKeywords,
    removeValue: clearRecentKeywords,
  } = useLocalStorage<string[]>({
    key: RECENT_KEYWORD_KEY,
    defaultValue: [],
  });

  const pushRecentKeyword = React.useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setRecentKeywords((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_RECENT));
    },
    [setRecentKeywords],
  );

  /** 입력이 멈춘 뒤 300ms 후에만 실제 검색어를 갱신한다. (leading: false) */
  const { debounce: debouncedSearch, cancel: cancelSearch } = useDebounce(
    (value: string) => {
      setQuery(value);
      pushRecentKeyword(value);
    },
    300,
    { leading: false },
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleReset = () => {
    cancelSearch();
    setKeywordAndQuery("");
  };

  const handleRecentClick = (value: string) => {
    cancelSearch();
    setKeywordAndQuery(value);
    pushRecentKeyword(value);
  };

  return (
    <div className="px-4 pt-3">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input value={keyword} onChange={handleChange} placeholder="메뉴, 재료, 태그로 검색" aria-label="메뉴 검색" className="pl-9 pr-9" />
        {keyword ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="검색어 지우기"
            onClick={handleReset}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <X />
          </Button>
        ) : null}
      </div>

      <ClientOnly>
        {recentKeywords.length > 0 ? (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <Clock className="text-muted-foreground size-3.5 shrink-0" />
            <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
              {recentKeywords.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleRecentClick(item)}
                  className={cn(
                    "border-border text-muted-foreground hover:bg-accent shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs transition-colors",
                    item === query && "border-brand text-brand font-medium",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <button type="button" onClick={clearRecentKeywords} className="text-muted-foreground shrink-0 text-[11px] underline">
              전체삭제
            </button>
          </div>
        ) : null}
      </ClientOnly>
    </div>
  );
}
