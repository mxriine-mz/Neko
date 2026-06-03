/* eslint-disable @next/next/no-img-element */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { requireGuildAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import {
  fetchGuildChannels,
  fetchGuildRoles,
  guildIconUrl,
  hasBotToken,
} from '@/lib/discord';
import { CONFIG_MODULES, getModule } from '@/lib/guild-config';
import ConfigSidebar from '@/components/dashboard/ConfigSidebar';
import ModuleCard from '@/components/dashboard/ModuleCard';
import DangerZone from '@/components/dashboard/DangerZone';

export default async function GuildConfigPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; guildId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale, guildId } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const guild = await requireGuildAdmin(guildId); // garde + nom/icône
  const t = await getTranslations('Dashboard');

  // Catégorie active : ?tab=… si valide, sinon la première (général).
  const activeModule = getModule(tab ?? '') ?? CONFIG_MODULES[0];

  const [config, channels, roles] = await Promise.all([
    prisma.guild.findUnique({ where: { id: guildId } }),
    fetchGuildChannels(guildId),
    fetchGuildRoles(guildId),
  ]);

  const icon = guildIconUrl(guild, 80);

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-12">
      {/* Lien retour posé en haut, simplement espacé du reste (ni bande ni trait). */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back')}
      </Link>

      <header className="mt-12 flex items-center gap-4">
        {icon ? (
          <img src={icon} alt="" width={56} height={56} className="h-14 w-14 rounded-2xl" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-lg font-semibold text-zinc-400">
            {guild.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{guild.name}</h1>
          <p className="text-sm text-zinc-500">{t('configSubtitle')}</p>
        </div>
      </header>

      {!hasBotToken() && (
        <p className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300/90">
          {t('noBotToken')}
        </p>
      )}

      {/* Menu catégories (gauche) + formulaire de la catégorie active (droite). */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <ConfigSidebar guildId={guildId} activeKey={activeModule.key} />
        <div className="min-w-0 flex-1 md:max-w-2xl">
          <ModuleCard
            module={activeModule}
            config={config as Record<string, unknown> | null}
            channels={channels}
            roles={roles}
            guildId={guildId}
          />
        </div>
      </div>

      {/* Zone de danger : seulement dans la catégorie « Général ». */}
      {activeModule.key === 'general' && (
        <div className="mt-10 md:ml-[15rem] md:max-w-2xl md:pl-8">
          <DangerZone guildId={guildId} />
        </div>
      )}
    </div>
  );
}
