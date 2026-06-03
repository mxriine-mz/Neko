/**
 * Accès à l'API REST de Discord (serveur uniquement).
 *
 * Deux niveaux d'autorisation :
 *  - le token OAuth de l'utilisateur (scope `guilds`) → lister SES serveurs ;
 *  - le token du bot (`DISCORD_BOT_TOKEN`, optionnel) → lister salons & rôles
 *    d'un serveur où le bot est présent, pour alimenter les sélecteurs.
 */
import { unstable_cache } from 'next/cache';

const API = 'https://discord.com/api/v10';

/** Bits de permission Discord utiles (BigInt() car la cible TS est < ES2020). */
const ADMINISTRATOR = BigInt(0x8);
const MANAGE_GUILD = BigInt(0x20);

export type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string; // bitfield sérialisé en string
};

export type DiscordChannel = {
  id: string;
  name: string;
  type: number; // 0 = texte, 2 = vocal, 4 = catégorie, 5 = annonce, 15 = forum
  position: number;
};

export type DiscordRole = {
  id: string;
  name: string;
  position: number;
  managed: boolean;
};

/** L'utilisateur peut-il administrer ce serveur (propriétaire ou perms admin) ? */
export function canManageGuild(g: Pick<DiscordGuild, 'owner' | 'permissions'>): boolean {
  if (g.owner) return true;
  const perms = BigInt(g.permissions);
  return (perms & (ADMINISTRATOR | MANAGE_GUILD)) !== BigInt(0);
}

/** URL de l'icône d'un serveur (ou null si aucune). */
export function guildIconUrl(g: Pick<DiscordGuild, 'id' | 'icon'>, size = 64): string | null {
  if (!g.icon) return null;
  const ext = g.icon.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${ext}?size=${size}`;
}

/** Liste les serveurs de l'utilisateur connecté (via son token OAuth). */
export async function fetchUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const res = await fetch(`${API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Discord /users/@me/guilds → ${res.status}`);
  }
  return res.json();
}

/**
 * Version mise en cache (30 s) de {@link fetchUserGuilds}. Évite de marteler
 * l'API Discord — et donc le rate-limit 429 — à chaque navigation entre
 * catégories du dashboard. Clé de cache = l'access token → strictement par
 * utilisateur (aucune fuite entre comptes).
 */
export const getUserGuildsCached = unstable_cache(
  (accessToken: string) => fetchUserGuilds(accessToken),
  ['discord-user-guilds'],
  { revalidate: 30 },
);

const botToken = process.env.DISCORD_BOT_TOKEN;

/** Le bot token est-il configuré (→ sélecteurs salon/rôle disponibles) ? */
export function hasBotToken(): boolean {
  return Boolean(botToken);
}

async function botFetch<T>(path: string): Promise<T | null> {
  if (!botToken) return null;
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bot ${botToken}` },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null; // bot absent du serveur, rate-limit, etc. → repli silencieux
  return res.json();
}

/** Salons d'un serveur (nécessite le bot token et le bot présent). */
export function fetchGuildChannels(guildId: string): Promise<DiscordChannel[] | null> {
  return botFetch<DiscordChannel[]>(`/guilds/${guildId}/channels`);
}

/** Rôles d'un serveur (nécessite le bot token et le bot présent). */
export function fetchGuildRoles(guildId: string): Promise<DiscordRole[] | null> {
  return botFetch<DiscordRole[]>(`/guilds/${guildId}/roles`);
}
