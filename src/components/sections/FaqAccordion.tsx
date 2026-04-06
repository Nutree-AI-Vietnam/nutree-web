'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { FaqSection } from '@/lib/translations';

interface FaqAccordionProps {
  sections: FaqSection[];
}

interface AccordionKey {
  sectionIdx: number;
  itemIdx: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4 shrink-0 text-primary-teal"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </motion.svg>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 py-4 text-left',
          'text-sm font-medium transition-colors',
          isOpen ? 'text-primary-forest' : 'text-foreground hover:text-primary-forest',
        )}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronIcon open={isOpen} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({ sections }: FaqAccordionProps) {
  const [openKey, setOpenKey] = useState<AccordionKey | null>(null);

  function toggle(sectionIdx: number, itemIdx: number) {
    const isSame = openKey?.sectionIdx === sectionIdx && openKey?.itemIdx === itemIdx;
    setOpenKey(isSame ? null : { sectionIdx, itemIdx });
  }

  return (
    <div className="space-y-6">
      {sections.map((section, sIdx) => (
        <section key={sIdx} className="rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-3 border-b border-border/40 px-6 py-4 bg-primary-forest/5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-forest/10 text-xs font-bold text-primary-forest">
              {sIdx + 1}
            </span>
            <h2 className="font-display font-semibold text-foreground">{section.title}</h2>
          </div>

          {/* Items */}
          <div className="px-6">
            {section.items.map((item, iIdx) => (
              <FaqItem
                key={iIdx}
                question={item.question}
                answer={item.answer}
                isOpen={openKey?.sectionIdx === sIdx && openKey?.itemIdx === iIdx}
                onToggle={() => toggle(sIdx, iIdx)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
