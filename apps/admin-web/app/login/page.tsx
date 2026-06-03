import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/');
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[380px] rounded-[20px] border border-white/8 bg-panel p-8 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="mb-1 text-center text-[26px] font-extrabold">
          <span className="brand-text">Neko</span>
        </div>
        <div className="mb-7 text-center text-[12.5px] uppercase tracking-wider text-ink-3">
          Administration
        </div>

        {error && (
          <div className="mb-5 rounded-[10px] border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[13px] text-danger">
            Accès réservé au propriétaire du bot. Ce compte Discord n’est pas autorisé.
          </div>
        )}

        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-ink-2">
          Connecte-toi avec le compte Discord du créateur pour accéder au panneau.
        </p>

        <form
          action={async () => {
            'use server';
            await signIn('discord', { redirectTo: '/' });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-[11px] bg-[#5865F2] px-4 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.6-.719 1.385-.984 2.001a18.27 18.27 0 0 0-5.486 0 12.6 12.6 0 0 0-.998-2.001.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C1.07 8.246.36 12.02.71 15.745a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-4.302-.838-8.045-2.939-11.349a.06.06 0 0 0-.031-.028ZM8.02 13.476c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
            </svg>
            Se connecter avec Discord
          </button>
        </form>
      </div>
    </div>
  );
}
