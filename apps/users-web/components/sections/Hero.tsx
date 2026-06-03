import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { INVITE_URL } from '@/config/site';
import { buttonVariants } from '@/components/ui/buttonVariants';
import Badge from '@/components/ui/Badge';
import Container from '@/components/ui/Container';
import GradientText from '@/components/ui/GradientText';

export default async function Hero() {
  const t = await getTranslations('Hero');

  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <Badge className="mb-6">{t('badge')}</Badge>
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
        {t('titleBefore')} <GradientText>{t('titleHighlight')}</GradientText> {t('titleAfter')}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-400">{t('subtitle')}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'primary' })}
        >
          {t('invite')}
        </a>
        <Link href="/dashboard" className={buttonVariants({ variant: 'secondary' })}>
          {t('manageServers')}
        </Link>
      </div>
      <p className="mt-6 text-sm text-zinc-500">{t('socialProof')}</p>
    </Container>
  );
}
