import { memo, useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
import { PAGE_ROUTES, RouteConfig } from "@src/router/router";
import clsx from "clsx";
import IconButton from "@src/components/ui/IconButton";
import { GITHUB_URL } from "@src/pages/home/constants/links";

/* ─── PC 전용 헤더 ─── */
const DesktopHeader = () => {
  return (
    <header className="sticky top-0 z-40 hidden items-center justify-center bg-white/70 backdrop-blur-md md:flex">
      <div className="max-w-page h-header flex w-full items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="text-headline-6 font-bold">
          @leejaehyeok/react-hooks
        </Link>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-x-2">
          <ul className="text-body-2 flex items-center gap-x-2 font-medium">
            <li>
              <Link to="/docs" className="text-ink-secondary hover:text-ink-primary rounded-lg p-3 transition-colors hover:bg-neutral-100">
                DOCS
              </Link>
            </li>
          </ul>
          {/* <IconButton
            name="github"
            size="md"
            onClick={() => window.open(GITHUB_URL, "_blank")}
            aria-label="GitHub"
            className="text-icon-secondary hover:text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
          /> */}
        </nav>
      </div>
    </header>
  );
};

/* ─── 모바일 전용 헤더 (메뉴 상태·드로어·포커스 트랩 소유) ─── */
const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { containerRef, handleKeyDown } = useRovingFocus({
    orientation: "vertical",
    loop: true,
  });
  const focusTrapRef = useFocusTrap();
  const location = useLocation();

  // 초기 포커스 판별 — 루트/docs 인덱스에서는 첫 번째 항목, 그 외에는 현재 경로에 해당하는 항목
  const isInitialFocus = useCallback(
    (route: RouteConfig, index: number) => {
      if (location.pathname === "/" || location.pathname === "/docs") {
        return index === 0;
      }
      return route.path === location.pathname;
    },
    [location.pathname],
  );

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // 메뉴 열려 있을 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <div ref={menuOpen ? focusTrapRef : undefined} className="sticky top-0 z-40 md:hidden">
      <header className={clsx("flex items-center justify-center backdrop-blur-md", menuOpen ? "bg-white" : "bg-white/70")}>
        <div className="max-w-page h-header flex w-full items-center justify-between px-5">
          {/* Logo */}
          <Link to="/" className="text-headline-6 font-bold">
            @leejaehyeok/react-hooks
          </Link>

          {/* GitHub + Hamburger */}
          <div className="flex items-center">
            {/* <IconButton
              name="github"
              size="md"
              onClick={() => window.open(GITHUB_URL, "_blank")}
              aria-label="GitHub"
              className="text-icon-secondary hover:text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
            /> */}
            <IconButton
              type="button"
              onClick={toggleMenu}
              size="md"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              className="text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
              name={menuOpen ? "x" : "menu"}
            />
          </div>
        </div>
      </header>

      {/* ─── Menu Overlay ─── */}
      {menuOpen && (
        <div className="top-(--h-header) fixed inset-0 z-30" ref={containerRef} onKeyDown={handleKeyDown}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu} />

          {/* Drawer */}
          <nav className="scrollbar-light absolute inset-y-0 right-0 w-72 overflow-y-auto bg-white px-5 py-6 shadow-lg">
            {Object.entries(PAGE_ROUTES).map(([key, category]) => (
              <div key={key} className="mb-6">
                <h4 className="text-caption-2 text-ink-tertiary mb-2 font-semibold uppercase tracking-wider">{category.title}</h4>
                <ul className="space-y-0.5">
                  {category.routes.map((route, index) => (
                    <li key={route.path}>
                      <NavLink
                        data-roving-item
                        data-initial-focus={isInitialFocus(route, index) || undefined}
                        to={route.path}
                        className={({ isActive }) =>
                          clsx(
                            "text-body-2 block rounded-md px-3 py-2 transition-colors",
                            isActive ? "font-semibold" : "text-ink-secondary hover:text-ink-primary hover:bg-neutral-50",
                          )
                        }
                      >
                        {route.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

const Header = memo(() => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
});

export default Header;
