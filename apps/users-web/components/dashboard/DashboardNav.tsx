/* eslint-disable @next/next/no-img-element */
import { getTranslations } from 'next-intl/server';
import { LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';
import { Link } from '@/i18n/navigation';
import GradientText from '@/components/ui/GradientText';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default async function DashboardNav() {
  const session = await auth();
  const t = await getTranslations('Dashboard');
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          <GradientText>Neko</GradientText>
          <span className="ml-2 text-sm font-normal text-zinc-500">{t('title')}</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user?.image && (
            <img
              src={user.image}
              alt=""
              width={28}
              height={28}
              className="rounded-full border border-white/10"
            />
          )}
          {user?.name && <span className="hidden text-zinc-300 sm:inline">{user.name}</span>}

          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {t('signOut')}
            </button>
          </form>

          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
