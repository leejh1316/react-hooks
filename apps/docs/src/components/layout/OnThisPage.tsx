import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { TOC, TOCItem, useComposedRefs } from "@timeless-ui/react";
import clsx from "clsx";
import { forwardRef, memo, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";

// TOC.Root컴포넌트 내부에 배치해야 함.
const OnThisPage = forwardRef<React.ComponentRef<"aside">, React.ComponentProps<"aside">>(({ className, ...props }, forwardedRef) => {
  const { containerRef, handleKeyDown } = useRovingFocus({ loop: true });
  const { hash, pathname } = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const composedRef = useComposedRefs(forwardedRef, scrollContainerRef, containerRef);

  // 내부 스크롤 위치 재조정
  const repositionScroll = useCallback((triggeredElement: HTMLAnchorElement) => {
    if (!scrollContainerRef.current) return;
    if (triggeredElement) {
      const containerHeight = scrollContainerRef.current.clientHeight;
      const linkTop = triggeredElement.offsetTop;
      const linkHeight = triggeredElement.clientHeight;
      scrollContainerRef.current.scrollTo({ top: linkTop - linkHeight - containerHeight / 3, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    // 선택한 목차로 브라우저 스크롤 이동
    if (hash) {
      const element = document.getElementById(decodeURIComponent(hash.replace("#", "")));
      if (element) {
        const headerHeight = getComputedStyle(document.documentElement).getPropertyValue("--h-header").trim();
        const offset = 12;
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - parseInt(headerHeight) - offset,
        });
      }
    }
  }, [hash]);

  useEffect(() => {
    // 페이지가 바뀌면 내부 스크롤을 맨 위로 이동
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0 });
    }
  }, [pathname]);

  return (
    <aside ref={composedRef} className={clsx(className, "")} {...props} onKeyDown={handleKeyDown}>
      <div className="space-y-4 pb-20">
        <h4 className="text-body-3 text-ink-primary font-semibold">목차</h4>
        <nav className="flex flex-col">
          <TOC.Content>
            {(item, activeId) => <Item key={item.id} onActive={repositionScroll} {...item} isActive={item.id === activeId} />}
          </TOC.Content>
        </nav>
      </div>
    </aside>
  );
});

interface ItemProps extends Omit<TOCItem, "element"> {
  isActive: boolean;
  onActive: (triggeredElement: HTMLAnchorElement) => void;
}
const Item = memo(({ onActive, isActive, ...item }: ItemProps) => {
  const itemRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (isActive) {
      onActive(itemRef.current!);
    }
  }, [isActive]);
  return (
    <Link
      data-roving-item
      ref={itemRef}
      to={`#${item.id}`}
      data-level={item.level}
      style={{
        paddingLeft: (item.level - 2) * 12,
      }}
      className={clsx(
        "text-body-4 hover:text-ink-primary block py-1 transition-colors",
        "has-[+_[data-level='2']]:mb-2",
        isActive ? "text-ink-primary font-semibold" : "text-ink-tertiary",
      )}
    >
      {item.text}
    </Link>
  );
});
export default OnThisPage;
