// Protège toutes les pages et routes API via le callback `authorized` de auth.ts.
// Exclus : les routes NextAuth (/api/auth/*), les assets Next, le favicon et /login.
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)'],
};
