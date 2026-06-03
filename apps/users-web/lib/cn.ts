/**
 * Concatène des classes conditionnelles en ignorant les valeurs falsy.
 * Version minimale de `clsx` — suffisante tant qu'on n'a pas besoin de
 * résolution de conflits Tailwind (auquel cas : ajouter `tailwind-merge`).
 *
 *   cn('px-4', isActive && 'bg-white/10', undefined) // -> "px-4 bg-white/10"
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
