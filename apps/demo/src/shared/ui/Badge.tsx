interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block px-2 py-0.5 text-[0.7rem] font-medium rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
      {children}
    </span>
  );
}
