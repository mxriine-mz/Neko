import { PrismaClient } from './generated/bot';

const globalForBot = globalThis as unknown as {
  botPrisma: PrismaClient | undefined;
};

// Client de la base du bot (neko_db) — lecture/écriture de données uniquement.
export const botPrisma =
  globalForBot.botPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForBot.botPrisma = botPrisma;
