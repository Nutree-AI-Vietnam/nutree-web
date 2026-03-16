'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Log',
    description: 'Snap a photo, scan a barcode, or describe your meal in plain text',
    gradient: 'from-primary-teal to-primary-emerald',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Adapt',
    description: 'AI breaks down macros and rebalances your weekly budget automatically',
    gradient: 'from-primary-emerald to-energy-lime',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Achieve',
    description: 'Cut, bulk, or recomp — hit your goals without guilt',
    gradient: 'from-energy-lime to-primary-forest',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            How <span className="gradient-text">Nutree</span> works
          </h2>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* VIDEO: Replace div below with iframe/video element */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary-forest/5 to-primary-teal/10 border border-border shadow-glass">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-muted text-sm">Video coming soon</span>
            </div>
          </div>
        </motion.div>

        {/* Steps - Modern Timeline Style */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block relative">
            {/* Connection Line */}
            <div className="absolute top-[60px] left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-primary-teal via-primary-emerald to-energy-lime rounded-full" />

            <div className="grid grid-cols-3 gap-6">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Large Number Badge */}
                  <div className={`relative z-10 w-[120px] h-[120px] rounded-3xl bg-gradient-to-br ${step.gradient} p-[2px] shadow-glow mb-6`}>
                    <div className="w-full h-full rounded-3xl bg-background flex flex-col items-center justify-center">
                      <span className="font-display text-4xl font-bold gradient-text">{step.number}</span>
                      <div className="text-primary-forest mt-1">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted text-sm max-w-[200px]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary-teal via-primary-emerald to-energy-lime rounded-full" />

            <div className="space-y-8">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="relative flex items-start gap-6"
                >
                  {/* Number Badge */}
                  <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} p-[2px] shadow-glow`}>
                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                      <span className="font-display text-xl font-bold gradient-text">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary-forest">
                        {step.icon}
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12"
        >
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-brand text-white font-medium shadow-glow hover:shadow-glow-lg transition-all hover:scale-105"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div> */}
      </div>
    </section>
  );
}
