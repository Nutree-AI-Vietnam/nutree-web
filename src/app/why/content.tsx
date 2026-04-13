'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { AppleIcon } from '@/components/ui/AppleIcon';

/**
 * Locale-aware feature demo videos, keyed by solution.features array index.
 * Swap the en/vi files independently per language.
 */
const FEATURE_VIDEOS: Record<number, Record<string, string>> = {
  0: { en: '/videos/scanning-en.mp4', vi: '/videos/scanning-vi.mp4' },       // Snap your meal
  1: { en: '/videos/macro-en.mp4', vi: '/videos/macro-vi.mp4' },             // Targets adapt in real time
  2: { en: '/videos/cheatmeal-en.mp4', vi: '/videos/cheatmeal-vi.mp4' },     // Cheat days rebalance
  3: { en: '/videos/mealsuggest-en.mp4', vi: '/videos/mealsuggest-vi.mp4' }, // Know exactly what to eat
};

/* ─── animation helpers ─── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
      className={`py-16 md:py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ─── page ─── */
export function WhyNutreeContent() {
  const { t, locale } = useLocale();
  const w = t.whyNutree;

  const videoFor = (index: number): string | undefined => {
    const pair = FEATURE_VIDEOS[index];
    return pair?.[locale] ?? pair?.en;
  };

  return (
    <article className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-forest/10 border border-primary-forest/20 text-sm font-medium text-primary-forest"
          >
            {w.badge}
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6"
          >
            <span className="gradient-text">{w.heroTitle}</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto"
          >
            {w.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* ── The Real Problem ── */}
      <Section>
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.problem.titleLead}{' '}
            <span className="text-primary-teal">{w.problem.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-6 leading-relaxed">
            {w.problem.p1}
          </motion.p>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-6 leading-relaxed">
            {w.problem.p2Before}
            <strong className="text-foreground">{w.problem.p2Emphasis}</strong>
          </motion.p>

          <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
            {w.problem.p3}
          </motion.p>
        </div>
      </Section>

      {/* ── The Compound Cost ── */}
      <Section className="bg-primary-forest/[0.03]">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.compound.titleLead}{' '}
            <span className="text-primary-teal">{w.compound.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-6 leading-relaxed">
            {w.compound.p1}
          </motion.p>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-8 leading-relaxed">
            {w.compound.p2Before}
            <em>{w.compound.p2Emphasis}</em>
          </motion.p>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4">
            {w.compound.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white p-6 text-center shadow-sm border border-border"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-primary-forest">
                  {item.stat}
                </div>
                <div className="text-sm text-muted mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── Why Other Solutions Fail ── */}
      <Section>
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.friction.titleLead}{' '}
            <span className="text-primary-teal">{w.friction.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-8 leading-relaxed">
            {w.friction.intro}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-4">
            {w.friction.steps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50/50 px-5 py-3"
              >
                <span className="flex-shrink-0 text-red-400 font-bold text-sm">
                  {w.friction.stepLabel} {i + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-lg text-muted leading-relaxed">
            {w.friction.outro}
          </motion.p>
        </div>
      </Section>

      {/* ── The Fat Loss Truth ── */}
      <Section className="bg-primary-forest/[0.03]">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.truth.titleLead}{' '}
            <span className="text-primary-teal">{w.truth.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-6 leading-relaxed">
            {w.truth.p1}
          </motion.p>

          <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
            {w.truth.p2Before}
            <strong className="text-foreground">{w.truth.p2Emphasis}</strong>
            {w.truth.p2After}
          </motion.p>
        </div>
      </Section>

      {/* ── Enter Nutree ── */}
      <Section>
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-teal/10 border border-primary-teal/20"
          >
            <span className="text-sm font-semibold text-primary-teal">
              {w.solution.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.solution.titleLead}{' '}
            <span className="text-primary-teal">{w.solution.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-10 leading-relaxed">
            {w.solution.intro}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-6">
            {w.solution.features.map((item, index) => {
              const video = videoFor(index);
              return (
                <div key={item.title}>
                  <div className="flex gap-5 items-start rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <span className="text-3xl flex-shrink-0" role="img">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Feature demo video (if one is configured for this index) */}
                  {video && (
                    <div className="mt-6 mx-auto max-w-xs">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary-forest/10 bg-black">
                        <video
                          key={video}
                          src={video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-auto block"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* ── What Changes ── */}
      <Section className="bg-primary-forest/[0.03]">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-10"
          >
            {w.day.titleLead}{' '}
            <span className="text-primary-teal">{w.day.titleAccent}</span>
          </motion.h2>

          <motion.div variants={fadeUp} className="space-y-6">
            {w.day.steps.map((item, i) => (
              <div key={item.time} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-teal/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary-teal">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1">{item.time}</h3>
                  <p className="text-muted leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-10 text-lg font-medium text-foreground leading-relaxed"
          >
            {w.day.outro}
          </motion.p>
        </div>
      </Section>

      {/* ── 6-Week Journey ── */}
      <Section>
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-teal/10 border border-primary-teal/20"
          >
            <span className="text-sm font-semibold text-primary-teal">
              {w.journey.badge}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl font-bold mb-6"
          >
            {w.journey.titleLead}{' '}
            <span className="text-primary-teal">{w.journey.titleAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-muted mb-12 leading-relaxed">
            {w.journey.intro}
          </motion.p>

          {/* Vertical timeline */}
          <motion.div variants={fadeUp} className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-6 md:left-8 top-3 bottom-3 w-px bg-gradient-to-b from-primary-teal via-primary-teal/40 to-primary-forest/10"
              aria-hidden
            />

            <ol className="space-y-8">
              {w.journey.weeks.map((week, i) => (
                <li key={i} className="relative flex gap-5 md:gap-7">
                  {/* Week marker */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-brand flex flex-col items-center justify-center text-white shadow-md ring-4 ring-background">
                      <span className="text-[10px] md:text-xs uppercase tracking-wider opacity-80 leading-none">
                        {w.journey.weekLabel}
                      </span>
                      <span className="font-display text-lg md:text-2xl font-bold leading-none mt-0.5">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1 md:pt-2">
                    <h3 className="font-display text-lg md:text-xl font-bold mb-1">
                      {week.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{week.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-12 text-lg font-medium text-foreground leading-relaxed"
          >
            {w.journey.outro}
          </motion.p>
        </div>
      </Section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-brand p-8 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {w.cta.title}
              </h2>
              <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">
                {w.cta.subtext}
              </p>

              <Link href={SITE_CONFIG.stores.appStore} aria-label="Download on App Store">
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-3 bg-white text-primary-forest border-white hover:bg-white/90 hover:border-white/90"
                >
                  <AppleIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs font-normal opacity-70">
                      {w.cta.downloadOnThe}
                    </div>
                    <div className="text-sm font-semibold -mt-0.5">{w.cta.appStore}</div>
                  </div>
                </Button>
              </Link>

              <p className="mt-6 text-sm text-white/50">{w.cta.fineprint}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
}
