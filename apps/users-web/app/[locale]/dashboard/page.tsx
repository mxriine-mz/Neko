import { getTranslations, setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth-guard';
import { getUserGuildsCached, canManageGuild } from '@/lib/discord';
import { prisma } from '@/lib/prisma';
import ServerCard from '@/components/dashboard/ServerCard';

export default async function DashboardHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { accessToken } = await requireSession();
  const t = await getTranslations('Dashboard');

  let guilds;
  try {
    guilds = (await getUserGuildsCached(accessToken)).filter(canManageGuild);
  } catch {
    return (
      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <p className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          {t('loadError')}
        </p>
      </div>
    );
  }

  // Quels serveurs ont déjà le bot (présents en base) ?
  const present = await prisma.guild.findMany({
    where: { id: { in: guilds.map((g) => g.id) } },
    select: { id: true },
  });
  const presentSet = new Set(present.map((g) => g.id));

  // Bot présent d'abord, puis ordre alphabétique.
  guilds.sort(
    (a, b) =>
      Number(presentSet.has(b.id)) - Number(presentSet.has(a.id)) || a.name.localeCompare(b.name),
  );

  return (
    <div className="px-6 py-12 sm:px-8 lg:px-12">
      <h1 className="text-3xl font-bold tracking-tight">{t('serversTitle')}</h1>
      <p className="mt-2 text-zinc-400">{t('serversSubtitle')}</p>

      {guilds.length === 0 ? (
        <p className="mt-8 max-w-4xl rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-zinc-500">
          {t('noServers')}
        </p>
      ) : (
        <div className="mt-8 grid max-w-4xl gap-3">
          {guilds.map((g) => (
            <ServerCard
              key={g.id}
              guild={g}
              botPresent={presentSet.has(g.id)}
              configureLabel={t('configure')}
              inviteLabel={t('invite')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
