import 'next-auth';

declare module 'next-auth' {
  interface Session {
    /** Access token Discord (scope `identify guilds`), propagé depuis le JWT. */
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
