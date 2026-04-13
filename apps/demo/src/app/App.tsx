import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { hookRegistry } from "@/entities/hook";
import { HomePage } from "@/pages/home";

function PageNav({ hookName }: { hookName: string }) {
  return (
    <nav className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-[#2d3748] sticky top-0 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm z-10">
      <Link
        to="/"
        className="text-sm text-indigo-500 font-medium no-underline hover:underline whitespace-nowrap"
      >
        ← 목록으로
      </Link>
      <code className="text-sm font-mono text-gray-500 dark:text-gray-400">{hookName}</code>
    </nav>
  );
}

function HookPage() {
  const { hookId } = useParams<{ hookId: string }>();
  const hook = hookRegistry.find((h) => h.id === hookId);

  if (!hook) return <Navigate to="/" replace />;

  const { Page, name } = hook;

  return (
    <div>
      <PageNav hookName={name} />
      <main>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
          }
        >
          <Page />
        </Suspense>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/react-hooks">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hooks/:hookId" element={<HookPage />} />
      </Routes>
    </BrowserRouter>
  );
}
