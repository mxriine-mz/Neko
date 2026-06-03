import { PrismaClient } from './generated/admin';

const globalForAdmin = globalThis as unknown as {
  adminPrisma: PrismaClient | undefined;
};

// Client de la base admin (neko_admin) — notes & planners.
export const adminPrisma =
  globalForAdmin.adminPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForAdmin.adminPrisma = adminPrisma;
