import { getTranslations } from 'next-intl/server';
import { Settings } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { MODULE_ICONS } from '@/config/site';
import { CONFIG_MODULES } from '@/lib/guild-config';
import { cn } from '@/lib/cn';

/**
 * Menu latéral de sélection de catégorie. Sur mobile : barre horizontale
 * scrollable au-dessus du contenu ; sur desktop : colonne fixe à gauche.
 */
export default async function ConfigSidebar({
  guildId,
  activeKey,
}: {
  guildId: string;
  activeKey: string;
}) {
  const t = await getTranslations('Dashboard');

  return (
    <nav className="flex shrink-0 gap-1 overflow-x-auto pb-2 md:w-60 md:flex-col md:overflow-visible md:pb-0">
      {CONFIG_MODULES.map((module) => {
        const Icon = MODULE_ICONS[module.key] ?? Settings;
        const active = module.key === activeKey;
        return (
          <Link
            key={module.key}
            href={`/dashboard/${guildId}?tab=${module.key}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition',
              active
                ? 'bg-white/10 font-medium text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {t(`modules.${module.key}.title`)}
          </Link>
        );
      })}
    </nav>
  );
}
