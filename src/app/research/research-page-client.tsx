'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { researchContent } from './research-content';

export function ResearchPageClient() {
  const { locale, t } = useLocale();
  const content = researchContent[locale];
  const toc = [...content.sections.map(({ id, title }) => ({ id, title })), { id: 'references', title: content.referencesTitle }, { id: 'disclaimer', title: content.disclaimerTitle }];

  return (
    <div className="bg-background pb-16 pt-24 md:pt-32">
      <article className="container mx-auto max-w-4xl px-4">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-medium text-primary-forest underline-offset-4 hover:text-primary-teal hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-teal">
          ← {t.common.backHome}
        </Link>
        <header className="border-b border-border pb-10 pt-8">
          <p className="text-sm font-semibold uppercase text-primary-teal">{content.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground md:text-5xl">{content.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{content.summary}</p>
          <p className="mt-5 text-sm text-muted">{content.reviewed}</p>
        </header>

        <nav aria-label={content.contents} className="border-b border-border py-8">
          <h2 className="font-display text-lg font-bold text-foreground">{content.contents}</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {toc.map((item) => <li key={item.id}><a href={`#${item.id}`} className="text-primary-forest underline-offset-4 hover:text-primary-teal hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-teal">{item.title}</a></li>)}
          </ol>
        </nav>

        <section className="py-10" aria-labelledby="methodology">
          <h2 id="methodology" className="font-display text-2xl font-bold text-foreground md:text-3xl">{content.methodology}</h2>
          <ol className="mt-7 space-y-5 border-l-2 border-primary-teal/30 pl-6">
            {content.sequence.map((step, index) => <li key={step.title} className="relative"><span className="absolute -left-[2.35rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary-forest text-sm font-bold text-white">{index + 1}</span><h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3><p className="mt-1 leading-relaxed text-muted">{step.detail}</p></li>)}
          </ol>
        </section>

        {content.sections.map((section) => <section key={section.id} id={section.id} className="border-t border-border py-10"><h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed text-muted">{paragraph}</p>)}</section>)}

        <details className="border-y border-border py-6"><summary className="cursor-pointer font-display text-xl font-bold text-foreground marker:text-primary-teal">{content.detailsTitle}</summary><ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted">{content.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><p className="mt-5 text-sm font-medium text-foreground">{content.detailsNote}</p></details>

        <section id="references" className="py-10"><h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{content.referencesTitle}</h2><p className="mt-4 leading-relaxed text-muted">{content.referencesIntro}</p><ol className="mt-7 divide-y divide-border border-y border-border">{content.references.map((reference) => <li key={reference.id} className="py-5"><h3 className="font-semibold text-foreground">{reference.title}</h3><p className="mt-1 text-sm text-muted">{reference.authors} · {reference.publication}</p><p className="mt-1 text-sm text-muted">{reference.identifier}</p><p className="mt-3 text-sm leading-relaxed text-muted">{reference.supports}</p><a href={reference.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary-forest underline underline-offset-4 hover:text-primary-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-teal">{content.sourceLink}<span aria-hidden="true"> ↗</span></a></li>)}</ol></section>

        <section id="disclaimer" className="border-l-4 border-primary-teal bg-primary-teal/5 px-5 py-6"><h2 className="font-display text-xl font-bold text-foreground">{content.disclaimerTitle}</h2><p className="mt-3 leading-relaxed text-foreground">{content.disclaimer}</p></section>
      </article>
    </div>
  );
}
