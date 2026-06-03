/* eslint-disable @next/next/no-img-element */
import { getTranslations } from 'next-intl/server';
import NextLink from 'next/link';
import { auth } from '@/auth';
import { Link } from '@/i18n/navigation';
import { NAV_LINKS } from '@/config/site';
import { buttonVariants } from '@/components/ui/buttonVariants';
import GradientText from '@/components/ui/GradientText';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default async function Navbar() {
  const t = await getTranslations('Nav');
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
      {/* Pleine largeur : logo collé à gauche, actions collées à droite. */}
      <div className="flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <GradientText>Neko</GradientText>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="hidden text-zinc-400 transition hover:text-white sm:inline"
            >
              {t(link.key)}
            </Link>
          ))}

          {user ? (
            <Link
              href="/dashboard"
              className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-2`}
            >
              {user.image && (
                <img
                  src={user.image}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              {t('dashboard')}
            </Link>
          ) : (
            <NextLink
              href="/api/auth/signin"
              className={buttonVariants({ variant: 'primary', size: 'sm' })}
            >
              {t('login')}
            </NextLink>
          )}

          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
