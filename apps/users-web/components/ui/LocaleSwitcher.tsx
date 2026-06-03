'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/** Bascule de langue (fr · en), préserve la route courante. */
export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error next-intl typed routes are strict; pathname is dynamic here
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
      {routing.locales.map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-zinc-700">
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(l)}
            disabled={isPending}
            aria-current={l === locale ? 'true' : undefined}
            className={cn(
              'uppercase transition',
              l === locale ? 'text-white' : 'text-zinc-500 hover:text-zinc-200',
            )}
          >
            {l}
          </button>
        </div>
      ))}
    </div>
  );
}
