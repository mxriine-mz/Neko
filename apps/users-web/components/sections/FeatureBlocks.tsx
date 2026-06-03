import { getTranslations } from 'next-intl/server';
import { Shield, Sparkles, Ticket, Gamepad2, Check, type LucideIcon } from 'lucide-react';
import Container from '@/components/ui/Container';

/**
 * Blocs de features détaillées, alternés gauche/droite. Le texte vient de l'i18n
 * (FeatureDetails.<key>.title / .description / .points[]) ; les « commandes »
 * affichées dans le visuel sont des slash-commands réelles du bot (neutres).
 */
const BLOCKS: { key: string; Icon: LucideIcon; items: string[] }[] = [
  { key: 'moderation', Icon: Shield, items: ['/ban', '/kick', '/timeout', '/warn', '/clear', '/automod'] },
  { key: 'leveling', Icon: Sparkles, items: ['/rank', '/levels', '/add_xp', '/remove_xp'] },
  { key: 'tickets', Icon: Ticket, items: ['/ticket', '/setup tickets', 'open · close · reopen'] },
  { key: 'games', Icon: Gamepad2, items: ['/morpion', '/simon', '/pendu', '/alea', '/anime'] },
];

export default async function FeatureBlocks() {
  const t = await getTranslations('FeatureDetails');

  return (
    <Container className="py-20">
      <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        {t('heading')}
      </h2>

      <div className="space-y-20">
        {BLOCKS.map(({ key, Icon, items }, i) => {
          const points = t.raw(`${key}.points`) as string[];
          const reversed = i % 2 === 1;

          return (
            <div
              key={key}
              className={`flex flex-col items-center gap-10 md:gap-16 ${
                reversed ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Texte */}
              <div className="flex-1">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-blue-300">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{t(`${key}.title`)}</h3>
                <p className="mt-3 text-zinc-400">{t(`${key}.description`)}</p>
                <ul className="mt-6 space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visuel : panneau de commandes */}
              <div className="w-full flex-1">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 shadow-xl shadow-black/20">
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    <Icon className="h-3.5 w-3.5" />
                    {t(`${key}.title`)}
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item}
                        className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 font-mono text-sm text-sky-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
