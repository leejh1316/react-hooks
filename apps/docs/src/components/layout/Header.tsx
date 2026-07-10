import { memo, useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useFocusTrap } from "@leejaehyeok/use-focus-trap";
import { PAGE_ROUTES } from "@src/router/router";
import clsx from "clsx";
import IconButton from "@src/components/ui/IconButton";

const githubUrl = "https://github.com/leejh1316/react-hooks";
const Header = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const focusTrapRef = useFocusTrap();
  const location = useLocation();

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // 모바일 메뉴 열려 있을 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleMenu = useCallback(() => setMobileOpen((prev) => !prev), []);

  return (
    <div ref={mobileOpen ? focusTrapRef : undefined}>
      <header className="border-line-light sticky top-0 z-40 flex items-center justify-center border-b bg-white/70 backdrop-blur-md">
        <div className="max-w-page h-header flex w-full items-center justify-between px-5">
          {/* Logo */}
          <Link to="/" className="text-headline-6 font-bold">
            @leejaehyeok/react-hooks
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-x-2 md:flex">
            <ul className="text-body-2 flex items-center gap-x-2 font-medium">
              <li>
                <Link
                  to="/docs/accordion"
                  className="text-ink-secondary hover:text-ink-primary rounded-lg p-3 transition-colors hover:bg-neutral-100"
                >
                  DOCS
                </Link>
              </li>
            </ul>
            <IconButton
              name="github"
              size="md"
              onClick={() => window.open(githubUrl, "_blank")}
              aria-label="GitHub"
              className="text-icon-secondary hover:text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
            />
          </nav>

          {/* Mobile: GitHub + Hamburger */}
          <div className="flex items-center md:hidden">
            <IconButton
              name="github"
              size="md"
              onClick={() => window.open(githubUrl, "_blank")}
              aria-label="GitHub"
              className="text-icon-secondary hover:text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
            />
            <IconButton
              type="button"
              onClick={toggleMenu}
              size="md"
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
              className="text-icon-primary rounded-lg transition-colors hover:bg-neutral-100"
              name={mobileOpen ? "x" : "menu"}
            />
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Overlay ─── */}
      {mobileOpen && (
        <div className={clsx("top-(--h-header) fixed inset-0 z-30 md:hidden")}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu} />

          {/* Drawer */}
          <nav className={clsx("scrollbar-light absolute inset-y-0 right-0 w-72 overflow-y-auto bg-white px-5 py-6 shadow-lg")}>
            {Object.entries(PAGE_ROUTES).map(([key, category]) => (
              <div key={key} className="mb-6">
                <h4 className="text-caption-2 text-ink-tertiary mb-2 font-semibold uppercase tracking-wider">{category.title}</h4>
                <ul className="space-y-0.5">
                  {category.routes.map((route, index) => (
                    <li key={route.path}>
                      <NavLink
                        data-initial-focus={index === 0 ? true : undefined}
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
});

export default Header;
