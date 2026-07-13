import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { CodeBlock } from "@src/components/docs";
import { Document } from "@src/components/ui/Document";
import { InlineCode } from "@src/components/ui/InlineCode";
import { PAGE_ROUTES } from "@src/router/router";

/* ──────────────────────────────────────────────
   Docs Index (Overview) Page
   ────────────────────────────────────────────── */

const DocsIndexPage = () => {
  return (
    <Document.Root>
      {/* ─── Page Header ─── */}
      <Document.Title mb={3}>React Hooks</Document.Title>
      <Document.Description mb={10}>
        실무에서 자주 마주치는 로직을 훅 단위로 제공하는 React 커스텀 훅 라이브러리입니다.
      </Document.Description>
      <Document.Divider />

      {/* 특징 */}
      <section>
        <Document.Heading1>특징</Document.Heading1>
        <ul className="text-body-1 text-ink-secondary flex list-disc flex-col gap-2 pl-5">
          {FEATURES.map(({ title, description }) => (
            <li key={title}>
              <span className="text-ink-primary font-semibold">{title}</span> — {description}
            </li>
          ))}
        </ul>
      </section>

      {/* 설치 */}
      <section>
        <Document.Heading1>설치</Document.Heading1>
        <Document.Paragraph mb={6}>라이브러리 전체가 아닌 필요한 훅 패키지만 개별 설치하세요.</Document.Paragraph>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      {/* 훅 목록 */}
      <section>
        <Document.Heading1>훅 목록</Document.Heading1>
        <Document.Paragraph mb={6}>왼쪽 사이드바 또는 아래 목록에서 훅을 선택하면 상세 문서로 이동합니다.</Document.Paragraph>
        {Object.entries(PAGE_ROUTES).map(([key, category]) => (
          <div key={key}>
            <Document.Heading3>{category.title}</Document.Heading3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {category.routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="border-line-regular group flex items-center justify-between gap-3 rounded-xl border p-5 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="text-body-2 text-ink-primary font-semibold">{route.name}</p>
                    {route.description && <p className="text-body-3 text-ink-tertiary mt-1 font-normal">{route.description}</p>}
                  </div>
                  <span className="text-ink-disabled shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </Document.Root>
  );
};

/* ──────────────────────────────────────────────
   Overview Data
   ────────────────────────────────────────────── */

const FEATURES = [
  { title: "TypeScript", description: "모든 훅이 TypeScript로 작성되어 완전한 타입 정의를 제공합니다." },
  { title: "가벼운 번들", description: "React 외 런타임 의존성이 없어 번들 크기 부담이 없습니다." },
  { title: "접근성 우선", description: "WAI-ARIA 가이드라인을 고려해 설계되어 접근성 요구사항을 충족하는 데 도움이 됩니다." },
  {
    title: "Agent Skill 제공",
    description: "Claude Code 등 AI 코딩 에이전트가 훅을 올바르게 사용하도록 돕는 SKILL 정의를 함께 제공합니다.",
  },
];

/* ──────────────────────────────────────────────
   Code Snippets
   ────────────────────────────────────────────── */

const INSTALL_CODE = `npm install @leejaehyeok/{HOOK_NAME}`;

export default DocsIndexPage;
