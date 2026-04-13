interface DemoSectionProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <section className="mb-10 p-6 bg-white dark:bg-[#16213e] border border-gray-200 dark:border-[#2d3748] rounded-xl">
      <h2 className="mt-0 mb-2 text-[1.05rem] font-semibold">{title}</h2>
      {description && (
        <p className="mt-0 mb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
