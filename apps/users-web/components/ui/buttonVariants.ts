import { cn } from '@/lib/cn';

/**
 * Styles de bouton sous forme de helper de className.
 * On ne fournit pas un composant `<Button>` figé car les CTA du site sont
 * tantôt des `<a>` externes (invite Discord), tantôt des `<Link>` next-intl :
 * on applique donc ces classes directement sur l'élément approprié.
 *
 *   <Link className={buttonVariants({ variant: 'primary' })}>…</Link>
 */
type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
  secondary: 'border border-white/10 bg-white/5 hover:bg-white/10',
  ghost: 'bg-white/10 hover:bg-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-8 py-3',
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}
