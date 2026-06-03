import { getTranslations } from 'next-intl/server';
import { FEATURES } from '@/config/site';
import Container from '@/components/ui/Container';

export default async function Features() {
  const t = await getTranslations('Features');

  return (
    <Container className="py-20">
      <section id="features" className="scroll-mt-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {t('heading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.04]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-blue-300">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="text-sm text-zinc-400">{t(`${key}.description`)}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
