import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AppShell from '@/components/AppShell';

// Garde serveur : pas de session → redirection vers /login.
// (Le middleware bloque déjà en amont ; ceci est une défense supplémentaire.)
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return (
    <AppShell user={{ name: session.user.name, image: session.user.image }}>
      {children}
    </AppShell>
  );
}
