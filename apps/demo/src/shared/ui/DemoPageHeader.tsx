interface DemoPageHeaderProps {
  title: string;
  description: string;
}

export function DemoPageHeader({ title, description }: DemoPageHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="mt-0 mb-2 text-2xl font-bold font-mono">{title}</h1>
      <p className="mt-0 text-[0.95rem] text-gray-500 dark:text-gray-400">{description}</p>
    </header>
  );
}
