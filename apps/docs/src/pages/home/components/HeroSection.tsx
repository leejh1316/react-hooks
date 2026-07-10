import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { GITHUB_URL, GETTING_STARTED_PATH } from "../constants/links";

interface HeroSectionProps {
  hookCount: number;
}

const HeroSection = ({ hookCount }: HeroSectionProps) => {
  return (
    <section className="flex flex-col items-center pb-16 pt-20 text-center md:pb-24 md:pt-32">
      {/* Badge */}
      <div className="text-caption-1 text-ink-tertiary border-line-regular mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-medium">
        {hookCount}개의 훅 제공 중
      </div>

      {/* Title */}
      <h1 className="text-display-4 text-ink-primary md:text-display-2 font-bold">React Hooks</h1>

      {/* Subtitle */}
      <p className="text-title-4 text-ink-secondary md:text-title-3 mt-5 max-w-2xl font-normal">
        실무에서 자주 마주치는 로직을 훅 단위로 제공하는 React 커스텀 훅 라이브러리로 빠르고 견고한 애플리케이션을 구축하세요.
      </p>

      {/* Description */}
      <p className="text-body-2 text-ink-tertiary mt-4 max-w-xl font-normal">
        각 훅은 독립 패키지로 배포되어 필요한 것만 설치할 수 있습니다.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex items-center gap-3">
        <Link
          to={GETTING_STARTED_PATH}
          className="bg-ink-primary text-ink-white text-body-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-85"
        >
          시작하기
          <ArrowRight size={16} />
        </Link>
        {/* <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="border-line-regular text-ink-secondary text-body-2 inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-neutral-50"
        >
          GitHub
        </a> */}
      </div>
    </section>
  );
};

export default HeroSection;
