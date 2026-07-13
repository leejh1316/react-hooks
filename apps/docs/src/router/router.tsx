import App from "@src/App";
import DocsLayout from "@src/components/layout/DocsLayout";
import Home from "@src/pages/home/Home";

import PageNotFound from "@src/pages/errors/PageNotFound";
import DocsIndexPage from "@src/pages/docs/DocsIndexPage";
import UseFocusTrapPage from "@src/pages/docs/hooks/use-focus-trap/UseFocusTrapPage";
import UseThrottlePage from "@src/pages/docs/hooks/use-throttle/UseThrottlePage";
import { createBrowserRouter, RouteObject } from "react-router";

export const PATH = {
  NOT_FOUND: `*`,
};
export interface RouteConfig {
  path: string;
  element: React.ReactNode | null;
  name: string;
  /** docs index 페이지의 훅 목록 카드에 표시되는 한 줄 요약 */
  description?: string;
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
      {
        path: "/docs/use-focus-trap",
        element: <UseFocusTrapPage />,
        name: "useFocusTrap",
        description: "모달, 다이얼로그처럼 특정 컨테이너 안에 키보드 포커스를 가두는 훅",
      },
      {
        path: "/docs/use-throttle",
        element: <UseThrottlePage />,
        name: "useThrottle",
        description: "함수 호출을 스로틀링하여 지정된 시간당 최대 한 번만 실행되도록 하는 훅",
      },
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
          {
            index: true,
            element: <DocsIndexPage />,
          },
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
