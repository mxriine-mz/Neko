import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t border-white/5 py-8">
      <Container className="text-center text-sm text-zinc-500">
        {t('copyright', { year: new Date().getFullYear() })}
      </Container>
    </footer>
  );
}
