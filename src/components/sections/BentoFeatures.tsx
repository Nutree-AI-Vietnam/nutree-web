'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';
import { PhoneMockup } from '@/components/ui/PhoneMockup';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  screenshot?: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'ai-scanning',
    title: 'Effortless Food Logging',
    description: 'Photo scan, barcode, or describe in plain text. AI decomposes every ingredient and derives fiber-aware calories from your macros.',
    screenshot: '/images/meal-scanning.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    id: 'meal-suggestions',
    title: 'Daily Meal Guidance',
    description: 'Personalized meals with exact portions, a meal prep calendar for your week, and step-by-step recipe instructions.',
    screenshot: '/images/meal-suggestions.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    title: 'No Guilt. Ever.',
    description: 'Cheat day? Nutree rebalances your weekly budget and adjusts tomorrow\'s target automatically. Life happens — Nutree adapts.',
    screenshot: '/images/dashboard.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: 'edit',
    title: 'Science-Based Goals',
    description: 'Cut, bulk, or recomposition — weight-based macros (g/kg) grounded in evidence, with TDEE personalized to your body.',
    screenshot: '/images/edit-meal.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    id: 'languages',
    title: '7 Languages',
    description: 'Available in 7 languages with dark/light themes and redesigned onboarding. Your AI Nutrition Assistant, your way.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
  },
  {
    id: 'reports',
    title: 'Weekly Nutrition Budget',
    description: 'Adaptive targets that update daily based on your real consumption. Next-day preview so you always know what\'s coming.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export function BentoFeatures() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedFeature = FEATURES[selectedIndex]?.id;
  const selectedItem = FEATURES[selectedIndex];

  const handleSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (info.offset.x < -swipeThreshold && selectedIndex < FEATURES.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const selectFeature = (id: string) => {
    const index = FEATURES.findIndex(f => f.id === id);
    if (index !== -1) setSelectedIndex(index);
  };

  return (
    <section ref={ref} id="features" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="section-title">
            What does <span className="gradient-text">Nutree</span> include?
          </h2>
        </motion.div>

        {/* Side-by-side Layout: Preview (left) | Features (right) */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Left: iPhone Preview with Swipe */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 order-2 lg:order-1 flex flex-col items-center"
          >
            {/* iPhone Mockup with swipe */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleSwipe}
              className="cursor-grab active:cursor-grabbing"
            >
              <PhoneMockup className="w-[280px] md:w-[350px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFeature}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-primary-teal/5"
                  >
                    {selectedItem?.screenshot ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedItem.screenshot}
                        alt={`${selectedItem.title} screenshot`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-forest/10 text-primary-forest flex items-center justify-center">
                          {selectedItem?.icon}
                        </div>
                        <span className="text-muted text-sm">Coming soon</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </PhoneMockup>
            </motion.div>

            {/* Swipe indicator dots */}
            <div className="flex items-center gap-2 mt-4">
              {FEATURES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    selectedIndex === index
                      ? 'w-6 bg-primary-teal'
                      : 'bg-border hover:bg-primary-teal/50'
                  )}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>

            {/* Swipe hint */}
            <p className="text-xs text-muted mt-2">Swipe to browse features</p>
          </motion.div>

          {/* Right: Feature List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 order-1 lg:order-2"
          >
            {FEATURES.map((item, index) => {
              const isSelected = selectedFeature === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 10,
                    scale: isSelected ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  onClick={() => selectFeature(item.id)}
                  className={cn(
                    'text-left rounded-xl transition-all duration-300 cursor-pointer',
                    'border hover:border-primary-teal/50',
                    isSelected
                      ? 'w-[calc(100%+16px)] lg:w-[calc(100%+24px)] -ml-2 lg:-ml-3 p-5 lg:p-6 bg-gradient-to-r from-primary-forest/10 to-primary-teal/5 border-primary-teal shadow-md'
                      : 'w-full p-4 lg:p-5 bg-white/50 border-border hover:bg-white/80'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300',
                        isSelected
                          ? 'w-14 h-14 lg:w-16 lg:h-16 bg-primary-teal text-white'
                          : 'w-11 h-11 lg:w-12 lg:h-12 bg-primary-forest/10 text-primary-forest'
                      )}
                    >
                      <div className={isSelected ? 'scale-125' : ''}>
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-display font-semibold text-foreground transition-all',
                        isSelected ? 'text-lg lg:text-xl' : 'text-base lg:text-lg'
                      )}>
                        {item.title}
                      </h3>
                      <p className={cn(
                        'text-muted mt-1 transition-all',
                        isSelected ? 'text-sm lg:text-base line-clamp-3' : 'text-sm line-clamp-2'
                      )}>
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow indicator - points left */}
                    <div
                      className={cn(
                        'flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300',
                        isSelected
                          ? 'w-8 h-8 bg-primary-teal text-white'
                          : 'w-6 h-6 bg-transparent text-muted'
                      )}
                    >
                      <svg className={cn('rotate-180', isSelected ? 'w-5 h-5' : 'w-4 h-4')} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
