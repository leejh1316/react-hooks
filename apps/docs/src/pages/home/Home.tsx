import { Link } from "react-router";
import { PAGE_ROUTES } from "@src/router/router";
import { Document } from "@src/components/ui/Document";
import { Layers, Accessibility, Palette, Feather, Code, Blocks, ArrowRight, ChevronRight } from "lucide-react";

/* ──────────────────────────────────────────────
   Feature Data
   ────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <Layers size={20} strokeWidth={1.8} />,
    title: "Compound Pattern",
    description: "합성 컴포넌트 패턴으로 유연한 구조를 제공합니다. 내부 상태를 자동으로 관리하면서도 외부에 깔끔한 API를 노출합니다.",
  },
  {
    icon: <Accessibility size={20} strokeWidth={1.8} />,
    title: "Accessible",
    description: "WAI-ARIA 표준을 준수하여 키보드 내비게이션과 스크린 리더를 지원합니다.",
  },
  {
    icon: <Palette size={20} strokeWidth={1.8} />,
    title: "Unstyled",
    description:
      "스타일이 포함되지 않은 헤드리스 컴포넌트입니다. Tailwind CSS, CSS Modules 등 어떤 스타일링 솔루션과도 결합할 수 있습니다.",
  },
  {
    icon: <Code size={20} strokeWidth={1.8} />,
    title: "TypeScript",
    description: "모든 컴포넌트가 TypeScript로 작성되어 완벽한 타입 안전성과 자동완성을 제공합니다.",
  },
  {
    icon: <Blocks size={20} strokeWidth={1.8} />,
    title: "Composable",
    description: "각 컴포넌트를 자유롭게 조합하여 복잡한 UI를 구성할 수 있습니다. React의 합성 모델을 극대화합니다.",
  },
] as const;

/* ──────────────────────────────────────────────
   Code Example
   ────────────────────────────────────────────── */

const CODE_EXAMPLE = `import { Accordion } from "@timeless-ui/react";

function App() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          시작하기
        </Accordion.Trigger>
        <Accordion.Content>
          npm add @timeless-ui/react 로
          설치하세요.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}`;

/* ──────────────────────────────────────────────
   Home Page
   ────────────────────────────────────────────── */

const Home = () => {
  const componentRoutes = PAGE_ROUTES.components.routes;
  const componentCount = componentRoutes.length;

  return (
    <Document.Root className="col-span-12 pb-24">
      {/* ═══════════════════════════════════════════
          Hero Section
          ═══════════════════════════════════════════ */}
      <section className="flex flex-col items-center pb-16 pt-20 text-center md:pb-24 md:pt-32">
        {/* Badge */}
        <div className="text-caption-1 text-ink-tertiary border-line-regular mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-medium">
          {componentCount}개의 컴포넌트 제공 중
        </div>

        {/* Title */}
        <h1 className="text-display-4 text-ink-primary md:text-display-2 font-bold">Timeless UI</h1>

        {/* Subtitle */}
        <p className="text-title-5 text-ink-secondary md:text-title-2 mt-5 max-w-2xl font-normal">
          접근성과 합성 패턴을 기반으로 설계된 헤드리스 컴포넌트를 사용하여 빠르고 유연한 디자인 시스템을 구축하세요.
        </p>

        {/* Description */}
        <p className="text-body-2 text-ink-tertiary mt-4 max-w-xl font-normal">
          이 프로젝트는 Radix-ui 컴포넌트를 참고하여 학습용으로 개발된 React 컴포넌트 라이브러리 입니다.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center gap-3">
          <Link
            to="/docs/button"
            className="bg-ink-primary text-ink-white text-body-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-85"
          >
            시작하기
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/leejh1316/timeless-ui"
            target="_blank"
            rel="noreferrer"
            className="border-line-regular text-ink-secondary text-body-2 inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-neutral-50"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Code Preview Section
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-2xl">
        <div className="border-line-regular overflow-hidden rounded-xl border">
          {/* Window bar */}
          <div className="border-line-light flex items-center gap-2 border-b bg-neutral-50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            <span className="text-caption-2 text-ink-disabled ml-2 font-medium">App.tsx</span>
          </div>
          {/* Code block */}
          <pre className="scrollbar-light overflow-x-auto bg-white p-5">
            <code className="font-code text-body-3 text-ink-secondary whitespace-pre leading-relaxed">{CODE_EXAMPLE}</code>
          </pre>
        </div>
      </section>

      <Document.Divider mt={20} mb={20} />

      {/* ═══════════════════════════════════════════
          Features Section
          ═══════════════════════════════════════════ */}
      <section>
        <div className="mb-4 text-center">
          <Document.Heading1 mt={0} mb={3}>
            왜 Timeless UI인가요?
          </Document.Heading1>
          <Document.Paragraph mt={0} mb={12}>
            현대적인 React 애플리케이션을 위해 설계된 컴포넌트 라이브러리입니다.
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

      <Document.Divider mt={20} mb={20} />

      {/* ═══════════════════════════════════════════
          Components Overview Section
          ═══════════════════════════════════════════ */}
      <section>
        <div className="mb-4 text-center">
          <Document.Heading1 mt={0} mb={3}>
            다양한 컴포넌트
          </Document.Heading1>
          <Document.Paragraph mt={0} mb={12}>
            {componentCount}개 이상의 컴포넌트를 제공합니다.
          </Document.Paragraph>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {componentRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="border-line-regular text-body-3 text-ink-secondary group flex items-center justify-between rounded-lg border px-4 py-3 font-medium transition-all hover:border-neutral-300 hover:bg-neutral-50"
            >
              <span>{route.name}</span>
              <span className="text-ink-disabled opacity-0 transition-opacity group-hover:opacity-100">
                <ChevronRight size={14} strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Document.Divider mt={20} mb={20} />

      {/* ═══════════════════════════════════════════
          Getting Started Section
          ═══════════════════════════════════════════ */}
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
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <span className="text-caption-1 text-ink-secondary font-semibold">1</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-2 text-ink-primary mb-2 font-semibold">패키지 설치</p>
              <div className="border-line-regular rounded-lg border bg-neutral-50 px-4 py-3">
                <code className="font-code text-body-3 text-ink-secondary">npm add @timeless-ui/react</code>
              </div>
            </div>
          </div>

          <div className="ml-3.5 h-6 border-l border-neutral-200" />

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <span className="text-caption-1 text-ink-secondary font-semibold">2</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-2 text-ink-primary mb-2 font-semibold">컴포넌트 가져오기</p>
              <div className="border-line-regular rounded-lg border bg-neutral-50 px-4 py-3">
                <code className="font-code text-body-3 text-ink-secondary">{'import { Button } from "@timeless-ui/react";'}</code>
              </div>
            </div>
          </div>

          <div className="ml-3.5 h-6 border-l border-neutral-200" />

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <span className="text-caption-1 text-ink-secondary font-semibold">3</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-2 text-ink-primary mb-2 font-semibold">사용하기</p>
              <div className="border-line-regular rounded-lg border bg-neutral-50 px-4 py-3">
                <code className="font-code text-body-3 text-ink-secondary">{"<Button>Click me</Button>"}</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Document.Divider mt={20} mb={20} />

      {/* ═══════════════════════════════════════════
          CTA Footer Section
          ═══════════════════════════════════════════ */}
      <section className="text-center">
        <h2 className="text-headline-3 text-ink-primary mb-3 font-semibold">지금 바로 시작하세요</h2>
        <p className="text-body-1 text-ink-tertiary mx-auto mb-8 max-w-md font-normal">
          문서를 살펴보고 프로젝트에 Timeless UI를 적용해 보세요.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/docs/alert-dialog"
            className="bg-ink-primary text-ink-white text-body-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-85"
          >
            컴포넌트 둘러보기
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Document.Root>
  );
};

export default Home;
