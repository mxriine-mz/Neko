/**
 * Description déclarative des modules de configuration d'un serveur.
 * Chaque champ correspond exactement à une colonne du modèle Prisma `Guild`.
 * Le rendu (ModuleCard) et l'action serveur (updateGuildConfig) s'appuient sur
 * cette source unique — ajouter un réglage = ajouter une ligne ici.
 *
 * Libellés : i18n via la clé `name` du champ (Dashboard.fields.<name>) et la clé
 * du module (Dashboard.modules.<key>). Icône : Dashboard reprend `config/site`.
 */
export type FieldType =
  | 'boolean'
  | 'text'
  | 'textarea'
  | 'number'
  | 'channel'
  | 'category'
  | 'role';

export type ConfigField = {
  /** Colonne Prisma `Guild` (= clé i18n du libellé). */
  name: string;
  type: FieldType;
};

export type ConfigModule = {
  /** Clé i18n + icône. */
  key: string;
  /** Champ booléen qui active le module (affiché en tête de carte). */
  toggle?: string;
  fields: ConfigField[];
};

export const CONFIG_MODULES: ConfigModule[] = [
  {
    key: 'general',
    fields: [{ name: 'prefix', type: 'text' }],
  },
  {
    key: 'welcome',
    toggle: 'welcomeEnabled',
    fields: [
      { name: 'welcomeEnabled', type: 'boolean' },
      { name: 'welcomeChannel', type: 'channel' },
      { name: 'welcomeMessage', type: 'textarea' },
      { name: 'welcomeImage', type: 'text' },
    ],
  },
  {
    key: 'bye',
    toggle: 'byeEnabled',
    fields: [
      { name: 'byeEnabled', type: 'boolean' },
      { name: 'byeChannel', type: 'channel' },
      { name: 'byeMessage', type: 'textarea' },
      { name: 'byeImage', type: 'text' },
    ],
  },
  {
    key: 'levels',
    toggle: 'levelEnabled',
    fields: [
      { name: 'levelEnabled', type: 'boolean' },
      { name: 'levelChannel', type: 'channel' },
      { name: 'levelMessage', type: 'textarea' },
      { name: 'levelMultiplier', type: 'number' },
    ],
  },
  {
    key: 'moderation',
    toggle: 'modEnabled',
    fields: [
      { name: 'modEnabled', type: 'boolean' },
      { name: 'modRole', type: 'role' },
      { name: 'modLogChannel', type: 'channel' },
      { name: 'modLogThread', type: 'text' },
      { name: 'autoModEnabled', type: 'boolean' },
      { name: 'antiSpam', type: 'boolean' },
      { name: 'antiLink', type: 'boolean' },
    ],
  },
  {
    key: 'tickets',
    toggle: 'ticketEnabled',
    fields: [
      { name: 'ticketEnabled', type: 'boolean' },
      { name: 'ticketChannel', type: 'channel' },
      { name: 'ticketCategory', type: 'category' },
      { name: 'ticketMessage', type: 'textarea' },
      { name: 'ticketRoleSupport', type: 'role' },
      { name: 'ticketLogs', type: 'channel' },
    ],
  },
  {
    key: 'birthdays',
    toggle: 'birthdayEnabled',
    fields: [
      { name: 'birthdayEnabled', type: 'boolean' },
      { name: 'birthdayChannel', type: 'channel' },
      { name: 'birthdayMessage', type: 'textarea' },
    ],
  },
  {
    key: 'announces',
    toggle: 'announcesEnabled',
    fields: [
      { name: 'announcesEnabled', type: 'boolean' },
      { name: 'announcesChannel', type: 'channel' },
    ],
  },
  {
    key: 'autorole',
    toggle: 'autoRoleEnabled',
    fields: [
      { name: 'autoRoleEnabled', type: 'boolean' },
      { name: 'autoRoleId', type: 'role' },
    ],
  },
  {
    key: 'logs',
    toggle: 'logsEnabled',
    fields: [
      { name: 'logsEnabled', type: 'boolean' },
      { name: 'logsChannel', type: 'channel' },
      { name: 'logsMessages', type: 'boolean' },
      { name: 'logsModeration', type: 'boolean' },
      { name: 'logsJoins', type: 'boolean' },
      { name: 'logsLeaves', type: 'boolean' },
      { name: 'logsRoles', type: 'boolean' },
      { name: 'logsChannels', type: 'boolean' },
      { name: 'logsBans', type: 'boolean' },
      { name: 'logsBoosts', type: 'boolean' },
    ],
  },
];

/** Retrouve un module par sa clé (utilisé par l'action serveur). */
export function getModule(key: string): ConfigModule | undefined {
  return CONFIG_MODULES.find((m) => m.key === key);
}
