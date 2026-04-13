import { Link } from "react-router-dom";
import { hookRegistry } from "@/entities/hook";
import { Badge } from "@/shared/ui";

export function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <header className="mb-10">
        <h1 className="mt-0 mb-2 text-[1.75rem] font-bold font-mono">
          @leejaehyeok/react-hooks
        </h1>
        <p className="mt-0 text-base text-gray-500 dark:text-gray-400">
          접근성을 고려한 React Custom Hooks 모음
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {hookRegistry.map((hook) => (
          <Link
            key={hook.id}
            to={`/hooks/${hook.id}`}
            className="block px-6 py-5 bg-white dark:bg-[#16213e] border border-gray-200 dark:border-[#2d3748] rounded-xl no-underline text-inherit transition-all duration-150 hover:border-indigo-300 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <code className="text-[0.95rem] font-semibold font-mono text-indigo-600 dark:text-indigo-400">
                {hook.name}
              </code>
              {hook.tags && hook.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {hook.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="m-0 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {hook.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
