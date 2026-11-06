'use client';

import { useEffect } from 'react';
import type { LegalPageContent } from '@/lib/legal-content';
import type { Locale } from '@/lib/translations';
import { useLocale } from '@/lib/locale-context';
import { LegalPageView } from './LegalPageView';

interface LegalPageClientProps {
  content: Record<Locale, LegalPageContent>;
  siblingHref: '/privacy' | '/terms';
  siblingKey: 'privacy' | 'terms';
}

export function LegalPageClient({ content, siblingHref, siblingKey }: LegalPageClientProps) {
  const { locale } = useLocale();
  const page = content[locale];

  useEffect(() => {
    document.title = `${page.title} | Nutree`;
  }, [page.title]);

  return (
    <LegalPageView
      page={page}
      locale={locale}
      siblingHref={siblingHref}
      siblingKey={siblingKey}
    />
  );
}
