import { useState, useCallback } from "react";
import { useOverflow } from "@leejaehyeok/use-overflow";
import { DemoPageHeader, DemoSection, Button } from "@/shared/ui";

function BasicOverflowDetectionDemo() {
  const { containerRef, isOverflow } = useOverflow();
  const description = "플렉스박스 컨테이너에 고정 너비의 아이템들을 추가하면, 마지막 아이템이 컨테이너 경계를 넘을 때 자동으로 감지됩니다.";

  return (
    <DemoSection title="기본 오버플로우 감지" description={description}>
      <div className="mb-4">
        <div
          ref={containerRef}
          className="flex gap-3 w-full h-20 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-x-auto"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0 w-24 h-full bg-indigo-500 text-white text-sm font-medium rounded-md"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm">
        {isOverflow ? (
          <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md inline-block font-medium">
            ⚠️ 오버플로우 감지됨 - 수평 스크롤 필요
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md inline-block font-medium">
            ✓ 모든 아이템이 컨테이너에 맞음
          </span>
        )}
      </div>
    </DemoSection>
  );
}

function DynamicItemsDemo() {
  const [items, setItems] = useState<number[]>([1, 2, 3]);
  const { containerRef, isOverflow } = useOverflow();
  const description =
    "아이템을 동적으로 추가하거나 제거할 때 MutationObserver가 자동으로 변화를 감지하고 오버플로우 상태를 업데이트합니다.";

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, prev.length + 1]);
  }, []);

  const removeLastItem = useCallback(() => {
    setItems((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  return (
    <DemoSection title="동적 아이템 추가/제거" description={description}>
      <div className="mb-4">
        <div
          ref={containerRef}
          className="flex gap-3 w-full h-20 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-x-auto mb-4"
        >
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center flex-shrink-0 w-20 h-full bg-blue-500 text-white text-sm font-medium rounded-md"
            >
              {item}
            </div>
          ))}
          {items.length === 0 && <div className="flex items-center justify-center w-full text-gray-400 text-sm">아이템을 추가하세요</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={addItem}>+ 아이템 추가</Button>
        <Button variant="cancel" onClick={removeLastItem} disabled={items.length === 0}>
          - 아이템 제거
        </Button>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <span>
          아이템 개수: <strong className="text-gray-900 dark:text-white">{items.length}</strong>
        </span>
        {isOverflow ? (
          <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md font-medium">
            ⚠️ 오버플로우 중
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md font-medium">
            ✓ 정상
          </span>
        )}
      </div>
    </DemoSection>
  );
}

function MarkedItemsDemo() {
  const [items, setItems] = useState<number[]>([1, 2, 3, 4]);
  const { containerRef, isOverflow } = useOverflow();
  const description =
    "data-overflow-item 속성을 가진 아이템들만 감시하도록 제한할 수 있습니다. 다른 요소들은 무시되므로 더 정확하고 효율적인 감시가 가능합니다.";

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, prev.length + 1]);
  }, []);

  const removeItem = useCallback(() => {
    setItems((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  return (
    <DemoSection title="마크된 아이템 패턴" description={description}>
      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">🔍 data-overflow-item 속성이 있는 아이템만 감시됩니다</div>
        <div
          ref={containerRef}
          className="flex gap-3 items-center w-full h-20 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-x-auto"
        >
          <div className="flex-shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">필터:</div>

          {items.map((item) => (
            <div
              key={item}
              data-overflow-item
              className="flex items-center justify-center flex-shrink-0 w-20 h-full bg-purple-500 text-white text-sm font-medium rounded-md"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button onClick={addItem}>+ 추가</Button>
        <Button variant="cancel" onClick={removeItem} disabled={items.length === 0}>
          - 제거
        </Button>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <span>
          마크된 아이템: <strong className="text-gray-900 dark:text-white">{items.length}</strong>
        </span>
        {isOverflow ? (
          <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md font-medium">
            ⚠️ 오버플로우
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md font-medium">
            ✓ 정상
          </span>
        )}
      </div>
    </DemoSection>
  );
}

function ResponsiveDemo() {
  const [containerWidth, setContainerWidth] = useState(100);
  const { containerRef, isOverflow } = useOverflow();
  const description = "컨테이너의 너비를 조정하면 ResizeObserver가 크기 변화를 감지하고 오버플로우 상태를 자동으로 업데이트합니다.";

  return (
    <DemoSection title="반응형 감지" description={description}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          컨테이너 너비: <span className="font-mono text-indigo-500">{containerWidth}%</span>
        </label>
        <input
          type="range"
          min="20"
          max="100"
          value={containerWidth}
          onChange={(e) => setContainerWidth(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
      <div style={{ width: `${containerWidth}%` }} className="transition-all duration-300 mx-auto mb-4">
        <div
          ref={containerRef}
          className="flex gap-3 w-full h-16 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-x-auto"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0 w-24 h-full bg-emerald-500 text-white text-sm font-medium rounded-md"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <span>
          컨테이너 너비: <strong className="text-gray-900 dark:text-white">{containerWidth}%</strong>
        </span>
        {isOverflow ? (
          <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md font-medium">
            ⚠️ 오버플로우
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md font-medium">
            ✓ 정상
          </span>
        )}
      </div>
    </DemoSection>
  );
}

function TextOverflowDemo() {
  const [containerWidth, setContainerWidth] = useState(100);
  const [showMore, setShowMore] = useState(false);
  const { containerRef, isOverflow } = useOverflow();
  const description = '실제 네비게이션 UI에서는 오버플로우 감지 후 "More" 버튼을 클릭하면 숨겨진 탭들이 드롭다운 메뉴로 나타납니다.';

  const allTabs = ["Home", "Products", "Services", "Pricing", "Docs", "Blog", "Contact", "Support"];
  const visibleTabsCount = 4;
  const visibleTabs = allTabs.slice(0, visibleTabsCount);
  const hiddenTabs = allTabs.slice(visibleTabsCount);

  return (
    <DemoSection title="네비게이션 탭 오버플로우" description={description}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          컨테이너 너비: <span className="font-mono text-indigo-500">{containerWidth}%</span>
        </label>
        <input
          type="range"
          min="30"
          max="100"
          value={containerWidth}
          onChange={(e) => setContainerWidth(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded mb-2">
          💡 컨테이너 너비를 줄이면 오버플로우가 감지되고 "⋮ More" 버튼이 나타납니다. 클릭하면 숨겨진 탭들을 볼 수 있습니다.
        </div>
        <div style={{ width: `${containerWidth}%` }} className="transition-all duration-300 mx-auto relative">
          <div className="flex gap-1 items-stretch">
            <div
              ref={containerRef}
              className="flex gap-1 items-center flex-1 h-12 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-hidden"
            >
              {visibleTabs.map((tab, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-500 transition-colors whitespace-nowrap"
                >
                  {tab}
                </button>
              ))}
            </div>
            {isOverflow && (
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center justify-center w-12 h-12 ml-1 text-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="더보기 메뉴"
                >
                  ⋮
                </button>
                {showMore && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-max">
                    {hiddenTabs.map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => setShowMore(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm">
        {isOverflow ? (
          <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md inline-block font-medium">
            ⚠️ 탭이 넘쳤습니다 - "⋮" 클릭해서 더보기
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md inline-block font-medium">
            ✓ 모든 탭이 표시됩니다
          </span>
        )}
      </div>
    </DemoSection>
  );
}

export function UseOverflowPage() {
  const headerDescription =
    "컨테이너의 자식 요소들이 경계를 초과하는지 감지하는 훅입니다. ResizeObserver와 MutationObserver를 활용하여 정확하고 효율적으로 오버플로우 상태를 추적합니다.";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <DemoPageHeader title="use-overflow" description={headerDescription} />
      <BasicOverflowDetectionDemo />
      <DynamicItemsDemo />
      <MarkedItemsDemo />
      <ResponsiveDemo />
      <TextOverflowDemo />
    </div>
  );
}
