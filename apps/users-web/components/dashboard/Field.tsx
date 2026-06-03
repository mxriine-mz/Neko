import type { ConfigField } from '@/lib/guild-config';
import type { DiscordChannel, DiscordRole } from '@/lib/discord';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-sky-500/50 focus:bg-white/[0.07]';

// Types de salons « texte » proposés pour un champ de type `channel`.
const TEXT_CHANNEL_TYPES = new Set([0, 5, 15]); // texte, annonce, forum
const CATEGORY_TYPE = 4;

function ChannelSelect({
  field,
  value,
  channels,
  category,
}: {
  field: ConfigField;
  value: string | null;
  channels: DiscordChannel[];
  category: boolean;
}) {
  const options = channels
    .filter((c) => (category ? c.type === CATEGORY_TYPE : TEXT_CHANNEL_TYPES.has(c.type)))
    .sort((a, b) => a.position - b.position);

  return (
    <select name={field.name} defaultValue={value ?? ''} className={inputClass}>
      <option value="">—</option>
      {options.map((c) => (
        <option key={c.id} value={c.id}>
          {category ? c.name : `# ${c.name}`}
        </option>
      ))}
    </select>
  );
}

function RoleSelect({
  field,
  value,
  roles,
  guildId,
}: {
  field: ConfigField;
  value: string | null;
  roles: DiscordRole[];
  guildId: string;
}) {
  const options = roles
    .filter((r) => r.id !== guildId && !r.managed)
    .sort((a, b) => b.position - a.position);

  return (
    <select name={field.name} defaultValue={value ?? ''} className={inputClass}>
      <option value="">—</option>
      {options.map((r) => (
        <option key={r.id} value={r.id}>
          @ {r.name}
        </option>
      ))}
    </select>
  );
}

export default function Field({
  field,
  label,
  value,
  channels,
  roles,
  guildId,
}: {
  field: ConfigField;
  label: string;
  value: unknown;
  channels: DiscordChannel[] | null;
  roles: DiscordRole[] | null;
  guildId: string;
}) {
  // Booléen : interrupteur (pas de label au-dessus, libellé à droite).
  if (field.type === 'boolean') {
    return (
      <label className="flex cursor-pointer items-center gap-3 py-1">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="h-4 w-4 rounded border-white/20 bg-white/5 accent-sky-500"
        />
        <span className="text-sm text-zinc-300">{label}</span>
      </label>
    );
  }

  const stringValue = value == null ? null : String(value);

  let control: React.ReactNode;
  if (field.type === 'textarea') {
    control = (
      <textarea
        name={field.name}
        defaultValue={stringValue ?? ''}
        rows={2}
        className={inputClass}
      />
    );
  } else if (field.type === 'number') {
    control = (
      <input
        type="number"
        step="0.1"
        name={field.name}
        defaultValue={stringValue ?? ''}
        className={inputClass}
      />
    );
  } else if ((field.type === 'channel' || field.type === 'category') && channels) {
    control = (
      <ChannelSelect
        field={field}
        value={stringValue}
        channels={channels}
        category={field.type === 'category'}
      />
    );
  } else if (field.type === 'role' && roles) {
    control = <RoleSelect field={field} value={stringValue} roles={roles} guildId={guildId} />;
  } else {
    // text, ou channel/role sans bot token → saisie d'ID en repli.
    control = (
      <input type="text" name={field.name} defaultValue={stringValue ?? ''} className={inputClass} />
    );
  }

  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      {control}
    </label>
  );
}
