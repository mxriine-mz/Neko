import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import FeatureBlocks from '@/components/sections/FeatureBlocks';
import Steps from '@/components/sections/Steps';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-950 via-blue-950/20 to-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <FeatureBlocks />
        <Steps />
      </main>
      <Footer />
    </div>
  );
}
