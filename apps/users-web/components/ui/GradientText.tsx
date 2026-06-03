import { cn } from '@/lib/cn';

/** Texte en dégradé de marque (sky → blue). Utilisé pour le logo et les accents. */
export default function GradientText({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </span>
  );
}
