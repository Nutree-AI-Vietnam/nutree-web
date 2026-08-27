'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PricingTable } from '@/components/sections/PricingTable';
import { useInView } from '@/hooks/useInView';
import { useLocale } from '@/lib/locale-context';
import { payPageContent } from '@/lib/pay-page-content';
import type { PayPlanCopy } from '@/lib/pay-page-content';

export function HomePricing() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const plans = payPageContent[locale].plans;

  const onSelect = (planId: PayPlanCopy['id']) => {
    router.push(`/pay?plan=${planId}`);
  };

  return (
    <section id="pricing" ref={ref} className="section-padding">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary-forest md:text-4xl">
            {t.homePricing.title}
          </h2>
          <p className="mt-3 text-base text-muted md:text-lg">{t.homePricing.subtitle}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <PricingTable plans={plans} onSelect={onSelect} />
        </motion.div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">
          {t.homePricing.footnote}
        </p>
      </div>
    </section>
  );
}
