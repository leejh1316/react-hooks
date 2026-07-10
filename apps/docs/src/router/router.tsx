import App from "@src/App";
import DocsLayout from "@src/components/layout/DocsLayout";
import Home from "@src/pages/home/Home";

import PageNotFound from "@src/pages/errors/PageNotFound";
import UseFocusTrapPage from "@src/pages/docs/hooks/use-focus-trap/UseFocusTrapPage";
import { createBrowserRouter, RouteObject } from "react-router";


export const PATH = {
  NOT_FOUND: `*`,
};
export interface RouteConfig {
  path: string;
  element: React.ReactNode | null;
  name: string;
}

type RouteCategory = {
  [categoryName: string]: {
    title: string;
    routes: RouteConfig[];
  };
};

export const PAGE_ROUTES: RouteCategory = {
  hooks: {
    title: "Hooks",
    routes: [
      // 훅 라우트는 이름 기준 ABC 순으로 정렬합니다.
      { path: "/docs/use-focus-trap", element: <UseFocusTrapPage />, name: "useFocusTrap" },
    ],
  },
  // hooks: {
  //   title: "Hooks",
  //   routes: [
  //     { path: "/docs/use-arrow-navigation", element: <UseArrowNavigationPage />, name: "useArrowNavigation" },
  //     { path: "/docs/use-snooze", element: <UseSnoozePage />, name: "useSnooze" },
  //   ],
  // },
};

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "docs",
        element: <DocsLayout />,
        children: [
          // Generates routes from PAGE_ROUTES, or manually mapping them
          ...Object.values(PAGE_ROUTES).flatMap((category) =>
            category.routes.map((route) => ({
              path: route.path.replace("/docs/", ""), // remove prefix since we are in /docs
              element: route.element,
            })),
          ),
        ],
      },
    ],
  },
  {
    path: `${PATH.NOT_FOUND}`,
    element: <PageNotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
