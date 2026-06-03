import { cn } from '@/lib/cn';

/** Pastille discrète (ex. badge de version dans le hero). */
export default function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-medium text-blue-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
