import { getTranslations } from 'next-intl/server';
import { Plus, LogIn, Settings } from 'lucide-react';
import Container from '@/components/ui/Container';

const STEPS = [
  { key: 'invite', Icon: Plus },
  { key: 'signin', Icon: LogIn },
  { key: 'configure', Icon: Settings },
] as const;

export default async function Steps() {
  const t = await getTranslations('Steps');

  return (
    <Container className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        {t('heading')}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ key, Icon }, i) => (
          <div
            key={key}
            className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center"
          >
            <span className="absolute right-4 top-4 text-sm font-bold text-zinc-700">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-blue-300">
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{t(`${key}.title`)}</h3>
            <p className="text-sm text-zinc-400">{t(`${key}.description`)}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
