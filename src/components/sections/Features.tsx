'use client';

import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { useInView } from '@/hooks/useInView';
import { FEATURE_ICONS } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { renderTitle } from '@/lib/render-title';

const FEATURE_ICON_BY_ID: Record<string, keyof typeof FEATURE_ICONS> = {
  tdee: 'settings',
  'ai-scanning': 'camera',
  'meal-suggestions': 'sparkles',
  dashboard: 'chart',
  edit: 'pencil',
  languages: 'settings',
};

export function Features() {
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.2 });
  const { t } = useLocale();

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16 md:mb-24"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-forest/10 text-sm font-medium text-primary-forest">
            {t.nav.features}
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {renderTitle(t.features.title)}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {t.hero.subheadline}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="space-y-24 md:space-y-32">
          {t.features.items.map((feature, index) => (
            <FeatureSection key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({
  feature,
  index,
}: {
  feature: { id: string; title: string; description: string };
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <div ref={ref}>
      <FeatureCard
        title={feature.title}
        description={feature.description}
        icon={FEATURE_ICON_BY_ID[feature.id] ?? 'settings'}
        screenshotLabel={feature.title}
        index={index}
        isInView={isInView}
      />
    </div>
  );
}
