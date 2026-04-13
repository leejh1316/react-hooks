interface KbdProps {
  children: React.ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-block px-1.5 py-0.5 text-[0.8em] font-mono bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
      {children}
    </kbd>
  );
}
