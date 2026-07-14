import { PAGE_ROUTES } from "@src/router/router";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";

/**
 * 현재 경로를 기준으로 PAGE_ROUTES 내 이전/다음 문서로 이동하는 하단 내비게이션.
 * PAGE_ROUTES는 router 모듈과의 순환 참조를 피하기 위해 렌더 시점에 읽습니다.
 */
const DocsPagination = ({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) => {
  const { pathname } = useLocation();
  const flatRoutes = Object.values(PAGE_ROUTES).flatMap((category) => category.routes);
  const currentIndex = flatRoutes.findIndex((route) => route.path === pathname);
  if (currentIndex === -1) return null;

  const prevRoute = flatRoutes[currentIndex - 1];
  const nextRoute = flatRoutes[currentIndex + 1];
  if (!prevRoute && !nextRoute) return null;

  return (
    <nav aria-label="이전/다음 문서" className={clsx("mt-16 grid grid-cols-2 gap-4", className)} {...props}>
      {prevRoute ? (
        <Link
          to={prevRoute.path}
          className="border-line-regular flex flex-col items-start gap-1 rounded-xl border p-4 transition-colors hover:bg-neutral-50"
        >
          <span className="text-caption-2 text-ink-tertiary flex items-center gap-1 font-medium">
            <ChevronLeft size={14} />
            이전
          </span>
          <span className="text-body-2 text-ink-primary font-semibold">
            <ProcessName name={prevRoute.name} />
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {nextRoute ? (
        <Link
          to={nextRoute.path}
          className="border-line-regular flex flex-col items-end gap-1 rounded-xl border p-4 text-right transition-colors hover:bg-neutral-50"
        >
          <span className="text-caption-2 text-ink-tertiary flex items-center gap-1 font-medium">
            다음
            <ChevronRight size={14} />
          </span>
          <span className="text-body-2 text-ink-primary font-semibold">
            <ProcessName name={nextRoute.name} />
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
};

const ProcessName = ({ name }: { name: string }) => {
  if (!name) return null;
  const parts = name.split(/(?<=[a-z0-9])(?=[A-Z])/g).map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </React.Fragment>
  ));
  return <>{parts}</>;
};

export { DocsPagination };
