import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { GETTING_STARTED_PATH } from "../constants/links";

const CtaSection = () => {
  return (
    <section className="text-center">
      <h2 className="text-headline-3 text-ink-primary mb-3 font-semibold">지금 바로 시작하세요</h2>
      <p className="text-body-1 text-ink-tertiary mx-auto mb-8 max-w-md font-normal">
        문서를 살펴보고 프로젝트에 React Hooks를 적용해 보세요.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          to={GETTING_STARTED_PATH}
          className="bg-ink-primary text-ink-white text-body-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-85"
        >
          훅 둘러보기
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
