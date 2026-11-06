import type { FaqSection } from '@/lib/translations';

interface FaqAccordionProps {
  sections: FaqSection[];
}

/** One group so opening a question closes the others, including with JavaScript disabled. */
const FAQ_GROUP = 'nutree-faq';

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-primary-teal transition-transform duration-200 group-open:rotate-180"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export function FaqAccordion({ sections }: FaqAccordionProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, sIdx) => (
        <section key={section.title} className="overflow-hidden rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-border/40 bg-primary-forest/5 px-6 py-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-forest/10 text-xs font-bold text-primary-forest">
              {sIdx + 1}
            </span>
            <h2 className="font-display font-semibold text-foreground">{section.title}</h2>
          </div>

          <div className="px-6">
            {section.items.map((item) => (
              <details
                key={item.question}
                name={FAQ_GROUP}
                className="group border-b border-border/40 last:border-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground hover:text-primary-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronIcon />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
