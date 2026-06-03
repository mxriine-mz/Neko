'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { RotateCcw, Trash2 } from 'lucide-react';
import { resetGuildConfig, deleteGuildData } from '@/app/[locale]/dashboard/[guildId]/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
    >
      {label}
    </button>
  );
}

/**
 * Une action dangereuse : bouton → confirmation en deux temps → submit du
 * server action passé en prop.
 */
function DangerAction({
  guildId,
  action,
  title,
  hint,
  trigger,
  confirm,
  confirmYes,
  cancel,
  Icon,
}: {
  guildId: string;
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  hint: string;
  trigger: string;
  confirm: string;
  confirmYes: string;
  cancel: string;
  Icon: typeof Trash2;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div>
      <h4 className="font-medium text-red-300">{title}</h4>
      <p className="mt-1 max-w-xl text-sm text-zinc-400">{hint}</p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
        >
          <Icon className="h-4 w-4" />
          {trigger}
        </button>
      ) : (
        <form action={action} className="mt-3 flex flex-wrap items-center gap-3">
          <input type="hidden" name="__guildId" value={guildId} />
          <span className="text-sm font-medium text-zinc-200">{confirm}</span>
          <SubmitButton label={confirmYes} />
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
          >
            {cancel}
          </button>
        </form>
      )}
    </div>
  );
}

/** Zone de danger (catégorie Général uniquement) : réinitialiser ou tout supprimer. */
export default function DangerZone({ guildId }: { guildId: string }) {
  const t = useTranslations('Dashboard');

  return (
    <div className="space-y-6 rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
      <h3 className="text-lg font-semibold text-red-300">{t('dangerZone')}</h3>

      <DangerAction
        guildId={guildId}
        action={resetGuildConfig}
        Icon={RotateCcw}
        title={t('resetConfig')}
        hint={t('resetConfigHint')}
        trigger={t('resetConfig')}
        confirm={t('confirmReset')}
        confirmYes={t('resetYes')}
        cancel={t('cancel')}
      />

      <div className="border-t border-white/5" />

      <DangerAction
        guildId={guildId}
        action={deleteGuildData}
        Icon={Trash2}
        title={t('delete')}
        hint={t('deleteHint')}
        trigger={t('delete')}
        confirm={t('confirmDelete')}
        confirmYes={t('deleteYes')}
        cancel={t('cancel')}
      />
    </div>
  );
}
