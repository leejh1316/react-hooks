import { NavLink } from "react-router";
import { PAGE_ROUTES } from "@src/router/router";
import clsx from "clsx";
import { useRovingFocus } from "@leejaehyeok/use-roving-focus";
const Sidebar = ({ className, ...props }: React.ComponentPropsWithoutRef<"aside">) => {
  const { containerRef, handleKeyDown } = useRovingFocus({
    loop: true,
  });
  return (
    <aside {...props} className={clsx(className)} ref={containerRef} onKeyDown={handleKeyDown}>
      <nav className="space-y-8 pb-20">
        <div>
          <h4 className="text-caption-2 text-ink-tertiary mb-1 font-semibold uppercase tracking-wider">Getting Started</h4>
          <ul>
            <li>
              <NavLink
                data-roving-item
                to="/docs"
                end
                className={({ isActive }) =>
                  clsx(
                    "text-body-2 block rounded-md px-3 py-1.5 transition-colors hover:bg-neutral-50",
                    isActive ? "font-semibold" : "text-ink-secondary hover:text-ink-primary",
                  )
                }
              >
                개요
              </NavLink>
            </li>
          </ul>
        </div>
        {Object.entries(PAGE_ROUTES).map(([key, category]) => (
          <div key={key}>
            <h4 className="text-caption-2 text-ink-tertiary mb-1 font-semibold uppercase tracking-wider">{category.title}</h4>
            <ul>
              {category.routes.map((route) => (
                <li key={route.path}>
                  <NavLink
                    data-roving-item
                    to={route.path}
                    className={({ isActive }) =>
                      clsx(
                        "text-body-2 block rounded-md px-3 py-1.5 transition-colors hover:bg-neutral-50",
                        isActive ? "font-semibold" : "text-ink-secondary hover:text-ink-primary",
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
    </aside>
  );
};

export default Sidebar;
