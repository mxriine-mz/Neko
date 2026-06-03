import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth-guard';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireSession(); // garde : redirige vers la connexion si non authentifié

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-950 via-blue-950/20 to-zinc-950">
      <DashboardNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
