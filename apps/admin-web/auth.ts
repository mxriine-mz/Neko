import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

// Login Discord réservé au propriétaire du bot.
// Seul le compte dont l'ID Discord == OWNER_ID peut ouvrir une session.
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Servi derrière nginx (reverse-proxy) : faire confiance au host transmis.
  trustHost: true,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      // On a juste besoin de l'identité (id Discord) pour vérifier l'owner.
      authorization: { params: { scope: 'identify' } },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    // Filtre owner : refuse toute connexion qui n'est pas le créateur.
    async signIn({ profile }) {
      return Boolean(process.env.OWNER_ID) && profile?.id === process.env.OWNER_ID;
    },
    // Utilisé par le middleware : accès autorisé si une session existe.
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
});
