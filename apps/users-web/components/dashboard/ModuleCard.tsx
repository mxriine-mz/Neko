'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, Check } from 'lucide-react';
import { MODULE_ICONS } from '@/config/site';
import type { ConfigModule } from '@/lib/guild-config';
import type { DiscordChannel, DiscordRole } from '@/lib/discord';
import { updateGuildConfig } from '@/app/[locale]/dashboard/[guildId]/actions';
import Field from './Field';

export default function ModuleCard({
  module,
  config,
  channels,
  roles,
  guildId,
}: {
  module: ConfigModule;
  config: Record<string, unknown> | null;
  channels: DiscordChannel[] | null;
  roles: DiscordRole[] | null;
  guildId: string;
}) {
  const t = useTranslations('Dashboard');
  const Icon = MODULE_ICONS[module.key] ?? Settings;
  const [state, formAction, isPending] = useActionState(updateGuildConfig, null);

  return (
    <form
      action={formAction}
      className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6"
    >
      <input type="hidden" name="__guildId" value={guildId} />
      <input type="hidden" name="__module" value={module.key} />

      <header className="mb-5 flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-blue-300">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t(`modules.${module.key}.title`)}</h3>
          <p className="text-sm text-zinc-500">{t(`modules.${module.key}.description`)}</p>
        </div>
      </header>

      <div className="flex-1 space-y-4">
        {module.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            label={t(`fields.${field.name}`)}
            value={config?.[field.name]}
            channels={channels}
            roles={roles}
            guildId={guildId}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {state?.ok && !isPending && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
            <Check className="h-4 w-4" />
            {t('saved')}
          </span>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:shadow-blue-500/40 disabled:opacity-60"
        >
          {isPending ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  );
}
