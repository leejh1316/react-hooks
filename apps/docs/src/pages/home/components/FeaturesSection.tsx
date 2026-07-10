import { Document } from "@src/components/ui/Document";
import { FEATURES } from "../constants/features";

const FeaturesSection = () => {
  return (
    <section>
      <div className="mb-4 text-center">
        <Document.Heading1 mt={0} mb={3}>
          왜 React Hooks인가요?
        </Document.Heading1>
        <Document.Paragraph mt={0} mb={12}>
          현대적인 React 애플리케이션을 위해 설계된 커스텀 훅 라이브러리입니다.
        </Document.Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="border-line-regular group rounded-xl border p-6 transition-all hover:border-neutral-300">
            <div className="text-icon-secondary mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-50 transition-colors group-hover:bg-neutral-100">
              {feature.icon}
            </div>
            <h3 className="text-title-5 text-ink-primary mb-2 font-semibold">{feature.title}</h3>
            <p className="text-body-3 text-ink-tertiary font-normal leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
