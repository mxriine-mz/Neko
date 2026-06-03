import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Le client Prisma "bot" et "admin" sont générés dans lib/generated/* :
  // on les laisse externes au bundle serveur.
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
