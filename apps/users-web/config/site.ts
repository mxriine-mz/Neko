import {
  Shield,
  Sparkles,
  Ticket,
  Gamepad2,
  Cake,
  Megaphone,
  Settings,
  DoorOpen,
  DoorClosed,
  ScrollText,
  UserCog,
  type LucideIcon,
} from 'lucide-react';

/**
 * Constantes centralisées du site. Toute valeur « en dur » partagée
 * (URLs, liens de nav, liste des features…) vit ici — jamais dans un composant.
 */

/** Lien d'invitation du bot (permissions=8 → Administrateur). */
export const INVITE_URL =
  'https://discord.com/oauth2/authorize?client_id=1047116483379073044&permissions=8&scope=bot%20applications.commands';

/** Liens de navigation principaux. `key` → clé i18n dans `messages/*.json` (Nav.*). */
export const NAV_LINKS = [
  { key: 'features', href: '/#features' },
] as const;

/**
 * Features mises en avant sur la landing.
 * `key` → clé i18n (Features.<key>.title / .description).
 * `Icon` → icône lucide associée (présentation).
 */
export const FEATURES: { key: string; Icon: LucideIcon }[] = [
  { key: 'moderation', Icon: Shield },
  { key: 'leveling', Icon: Sparkles },
  { key: 'tickets', Icon: Ticket },
  { key: 'games', Icon: Gamepad2 },
  { key: 'birthdays', Icon: Cake },
  { key: 'announcements', Icon: Megaphone },
];

/** Icône associée à chaque module du dashboard (clés de `lib/guild-config`). */
export const MODULE_ICONS: Record<string, LucideIcon> = {
  general: Settings,
  welcome: DoorOpen,
  bye: DoorClosed,
  levels: Sparkles,
  moderation: Shield,
  tickets: Ticket,
  birthdays: Cake,
  announces: Megaphone,
  autorole: UserCog,
  logs: ScrollText,
};
