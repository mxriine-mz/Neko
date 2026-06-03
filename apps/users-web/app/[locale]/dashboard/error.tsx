'use client';

import { useTranslations } from 'next-intl';
import { RotateCw } from 'lucide-react';

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('Dashboard');

  return (
    <div className="px-6 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
        <h2 className="text-lg font-semibold">{t('serverError')}</h2>
        <p className="mt-2 text-sm text-zinc-400">{t('serverErrorHint')}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium transition hover:bg-white/20"
        >
          <RotateCw className="h-4 w-4" />
          {t('reload')}
        </button>
      </div>
    </div>
  );
}
