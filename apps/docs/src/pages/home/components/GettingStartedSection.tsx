import { Fragment } from "react";
import { Document } from "@src/components/ui/Document";
import { GETTING_STARTED_STEPS } from "../constants/getting-started";

const GettingStartedSection = () => {
  return (
    <section>
      <div className="mb-4 text-center">
        <Document.Heading1 mt={0} mb={3}>
          빠르게 시작하기
        </Document.Heading1>
        <Document.Paragraph mt={0} mb={12}>
          단 하나의 명령어로 설치하고, 바로 사용할 수 있습니다.
        </Document.Paragraph>
      </div>

      <div className="mx-auto max-w-lg">
        {GETTING_STARTED_STEPS.map((step, index) => (
          <Fragment key={step.title}>
            {index > 0 && <div className="ml-3.5 h-6 border-l border-neutral-200" />}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-caption-1 text-ink-secondary font-semibold">{index + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body-2 text-ink-primary mb-2 font-semibold">{step.title}</p>
                <div className="border-line-regular rounded-lg border bg-neutral-50 px-4 py-3">
                  <code className="font-code text-body-3 text-ink-secondary">{step.code}</code>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default GettingStartedSection;
