import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { canManageGuild, getUserGuildsCached, type DiscordGuild } from '@/lib/discord';

/**
 * Garde d'authentification serveur. Renvoie la session + l'access token, ou
 * redirige vers la connexion Discord si l'utilisateur n'est pas connecté.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect('/api/auth/signin');
  }
  return { session, accessToken: session.accessToken };
}

/**
 * Garde au niveau d'un serveur : l'utilisateur doit avoir les droits d'admin
 * sur `guildId` (vérifié côté Discord, jamais sur la seule base de l'URL).
 * Renvoie le serveur Discord correspondant, ou redirige si accès refusé.
 */
export async function requireGuildAdmin(guildId: string): Promise<DiscordGuild> {
  const { accessToken } = await requireSession();
  let guilds: DiscordGuild[];
  try {
    guilds = await getUserGuildsCached(accessToken);
  } catch {
    // Discord indisponible / rate-limited : on renvoie vers la liste plutôt
    // que de planter en 500 (la liste a sa propre gestion d'erreur).
    redirect('/dashboard');
  }
  const guild = guilds.find((g) => g.id === guildId && canManageGuild(g));
  if (!guild) {
    redirect('/dashboard');
  }
  return guild;
}
