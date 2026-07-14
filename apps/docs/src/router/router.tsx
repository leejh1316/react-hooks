import App from "@src/App";
import DocsLayout from "@src/components/layout/DocsLayout";
import Home from "@src/pages/home/Home";

import PageNotFound from "@src/pages/errors/PageNotFound";
import DocsIndexPage from "@src/pages/docs/DocsIndexPage";
import UseBrowserStoragePage from "@src/pages/docs/hooks/use-browser-storage/UseBrowserStoragePage";
import UseComposeRefPage from "@src/pages/docs/hooks/use-compose-ref/UseComposeRefPage";
import UseDebouncePage from "@src/pages/docs/hooks/use-debounce/UseDebouncePage";
import UseDeferredLoadingPage from "@src/pages/docs/hooks/use-deferred-loading/UseDeferredLoadingPage";
import UseFocusTrapPage from "@src/pages/docs/hooks/use-focus-trap/UseFocusTrapPage";
import UseLatestRefPage from "@src/pages/docs/hooks/use-latest-ref/UseLatestRefPage";
import UsePaginationPage from "@src/pages/docs/hooks/use-pagination/UsePaginationPage";
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
        path: "/docs/use-browser-storage",
        element: <UseBrowserStoragePage />,
        name: "useBrowserStorage",
        description: "localStorage / sessionStorage를 React 상태처럼 사용하는 훅. TTL 만료, 커스텀 직렬화, 크로스탭 동기화 지원",
      },
      {
        path: "/docs/use-compose-ref",
        element: <UseComposeRefPage />,
        name: "useComposedRefs",
        description: "여러 개의 ref(객체형·함수형)를 하나의 callback ref로 병합해 한 엘리먼트에 동시에 연결하는 훅. React 19 cleanup 지원",
      },
      {
        path: "/docs/use-debounce",
        element: <UseDebouncePage />,
        name: "useDebounce",
        description: "함수 호출을 디바운싱하여 마지막 호출 이후 지정된 시간 동안 추가 호출이 없을 때만 실행되도록 하는 훅",
      },
      {
        path: "/docs/use-deferred-loading",
        element: <UseDeferredLoadingPage />,
        name: "useDeferredLoading",
        description: "로딩이 지정 시간 이상 지속될 때만 로딩 상태를 표시하고 최소 표시 시간을 보장해 스피너 깜빡임을 방지하는 훅",
      },
      {
        path: "/docs/use-focus-trap",
        element: <UseFocusTrapPage />,
        name: "useFocusTrap",
        description: "모달, 다이얼로그처럼 특정 컨테이너 안에 키보드 포커스를 가두는 훅",
      },
      {
        path: "/docs/use-latest-ref",
        element: <UseLatestRefPage />,
        name: "useLatestRef",
        description: "전달된 최신 값을 항상 담고 있는 ref를 반환해 stale closure와 불필요한 재실행 없이 최신 값에 접근하게 하는 훅",
      },
      {
        path: "/docs/use-pagination",
        element: <UsePaginationPage />,
        name: "usePagination",
        description: "siblings/boundaries 기반 페이지 범위 계산과 생략 기호, 내비게이션 로직을 제공하는 headless 페이지네이션 훅",
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
