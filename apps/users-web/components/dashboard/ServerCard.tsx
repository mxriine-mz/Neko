/* eslint-disable @next/next/no-img-element */
import { Settings, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { INVITE_URL } from '@/config/site';
import { guildIconUrl, type DiscordGuild } from '@/lib/discord';

export default function ServerCard({
  guild,
  botPresent,
  configureLabel,
  inviteLabel,
}: {
  guild: DiscordGuild;
  botPresent: boolean;
  configureLabel: string;
  inviteLabel: string;
}) {
  const icon = guildIconUrl(guild);
  const initials = guild.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-blue-500/30 hover:bg-white/[0.04]">
      {icon ? (
        <img src={icon} alt="" width={48} height={48} className="h-12 w-12 rounded-xl" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-zinc-400">
          {initials}
        </div>
      )}

      <span className="flex-1 truncate font-medium">{guild.name}</span>

      {botPresent ? (
        <Link
          href={`/dashboard/${guild.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Settings className="h-4 w-4" />
          {configureLabel}
        </Link>
      ) : (
        <a
          href={`${INVITE_URL}&guild_id=${guild.id}&disable_guild_select=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          {inviteLabel}
        </a>
      )}
    </div>
  );
}
