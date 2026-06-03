'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireGuildAdmin } from '@/lib/auth-guard';
import { CONFIG_MODULES, getModule } from '@/lib/guild-config';

/** Colonnes string NOT NULL (ont un défaut) : un champ vidé ne doit pas les écraser. */
const NON_NULLABLE = new Set([
  'prefix',
  'welcomeMessage',
  'byeMessage',
  'levelMessage',
  'birthdayMessage',
]);

export type SaveState = { ok: boolean } | null;

/**
 * Persiste un module de configuration pour un serveur (créé si absent, sinon
 * mis à jour). Signature `useActionState` → renvoie un état pour le feedback UI.
 * Sécurité : ré-vérifie côté Discord que l'utilisateur est admin du serveur —
 * on ne se fie jamais au seul `guildId` du formulaire.
 */
export async function updateGuildConfig(
  _prevState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const guildId = String(formData.get('__guildId') ?? '');
  const moduleKey = String(formData.get('__module') ?? '');
  const mod = getModule(moduleKey);
  if (!guildId || !mod) return { ok: false };

  // Re-vérification d'autorisation + récupération du nom (pour l'upsert).
  const guild = await requireGuildAdmin(guildId);

  const data: Record<string, string | number | boolean | null> = {};
  for (const field of mod.fields) {
    const raw = formData.get(field.name);
    switch (field.type) {
      case 'boolean':
        data[field.name] = formData.has(field.name);
        break;
      case 'number': {
        const s = String(raw ?? '').trim();
        if (s === '') break;
        const n = Number(s);
        if (Number.isFinite(n)) data[field.name] = n;
        break;
      }
      case 'channel':
      case 'category':
      case 'role': {
        const s = String(raw ?? '').trim();
        data[field.name] = s === '' ? null : s;
        break;
      }
      case 'text':
      case 'textarea': {
        const s = String(raw ?? '');
        if (s.trim() === '' && NON_NULLABLE.has(field.name)) break;
        data[field.name] = s.trim() === '' ? null : s;
        break;
      }
    }
  }

  await prisma.guild.upsert({
    where: { id: guildId },
    update: data as Prisma.GuildUpdateInput,
    create: { id: guildId, name: guild.name, ...data } as Prisma.GuildCreateInput,
  });

  revalidatePath(`/dashboard/${guildId}`);
  return { ok: true };
}

/** Valeurs par défaut (schéma Prisma) pour les colonnes string NOT NULL. */
const STRING_DEFAULTS: Record<string, string> = {
  prefix: '!',
  welcomeMessage: 'Bienvenue {user} 👋',
  byeMessage: '{user} nous a quitté… 😢',
  levelMessage: '🎉 Bravo {user} ! Tu passes au niveau {level} !',
  birthdayMessage: '🎉 Joyeux anniversaire {user} ! Tu as maintenant {age} ans ! 🎂',
};
const NUMBER_DEFAULTS: Record<string, number> = { levelMultiplier: 1 };

/**
 * Réinitialise la CONFIGURATION du serveur (modules désactivés, salons/rôles
 * vidés, messages remis aux valeurs par défaut) en CONSERVANT la ligne Guild —
 * donc les niveaux/XP et avertissements des membres restent intacts.
 * Sécurité : ré-vérifie l'admin.
 */
export async function resetGuildConfig(formData: FormData) {
  const guildId = String(formData.get('__guildId') ?? '');
  if (!guildId) return;
  await requireGuildAdmin(guildId);

  const data: Record<string, string | number | boolean | null> = {};
  for (const mod of CONFIG_MODULES) {
    for (const field of mod.fields) {
      switch (field.type) {
        case 'boolean':
          data[field.name] = false;
          break;
        case 'number':
          data[field.name] = NUMBER_DEFAULTS[field.name] ?? 0;
          break;
        case 'channel':
        case 'category':
        case 'role':
          data[field.name] = null;
          break;
        case 'text':
        case 'textarea':
          data[field.name] = STRING_DEFAULTS[field.name] ?? null;
          break;
      }
    }
  }

  // updateMany : ne lève pas si la ligne n'existe pas encore.
  await prisma.guild.updateMany({
    where: { id: guildId },
    data: data as Prisma.GuildUpdateManyMutationInput,
  });
  revalidatePath(`/dashboard/${guildId}`);
}

/**
 * Supprime DÉFINITIVEMENT toutes les données d'un serveur en base (ligne Guild
 * + ses membres et avertissements via cascade). Redirige vers la liste ensuite.
 * Sécurité : ré-vérifie l'admin avant suppression.
 */
export async function deleteGuildData(formData: FormData) {
  const guildId = String(formData.get('__guildId') ?? '');
  if (!guildId) return;

  await requireGuildAdmin(guildId);

  // deleteMany : ne lève pas si la ligne n'existe pas (bot présent jamais sauvegardé).
  await prisma.guild.deleteMany({ where: { id: guildId } });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
