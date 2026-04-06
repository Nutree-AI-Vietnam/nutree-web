'use client';

import { useLocale } from '@/lib/locale-context';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

export function FaqPageClient() {
  const { t } = useLocale();
  return <FaqAccordion sections={t.faq.sections} />;
}
