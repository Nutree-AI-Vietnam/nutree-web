'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/lib/locale-context';

interface AppChromeProps {
  children: React.ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main lang={locale} className="min-h-screen flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main lang={locale} className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
