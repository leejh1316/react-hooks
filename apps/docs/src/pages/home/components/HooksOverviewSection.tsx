import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Document } from "@src/components/ui/Document";
import { RouteConfig } from "@src/router/router";
import BreakableCamelCase from "@src/components/ui/BreakableCamelCase";

interface HooksOverviewSectionProps {
  routes: RouteConfig[];
}

const HooksOverviewSection = ({ routes }: HooksOverviewSectionProps) => {
  return (
    <section>
      <div className="mb-4 text-center">
        <Document.Heading1 mt={0} mb={3}>
          다양한 훅
        </Document.Heading1>
        <Document.Paragraph mt={0} mb={12}>
          {routes.length}개의 훅을 제공합니다.
        </Document.Paragraph>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="border-line-regular text-body-3 text-ink-secondary group flex items-center justify-between rounded-lg border px-4 py-3 font-medium transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            <span>
              <BreakableCamelCase text={route.name} />
            </span>
            <span className="text-ink-disabled opacity-0 transition-opacity group-hover:opacity-100">
              <ChevronRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HooksOverviewSection;
