import Link from 'next/link';
import { deleteAccountContent } from '@/lib/delete-account-content';
import type { Locale } from '@/lib/translations';

export function DeleteAccountArticle({ locale }: { locale: Locale }) {
  const copy = deleteAccountContent[locale];

  return (
    <article lang={locale} className="container mx-auto max-w-3xl px-4 pb-16 pt-28 md:pt-32">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-emerald">Nutree</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-primary-forest md:text-5xl">
        {copy.heading}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">{copy.limitation}</p>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.stepsTitle}</h2>
        <p className="leading-relaxed">{copy.steps}</p>
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.subscriptionTitle}</h2>
        <p className="leading-relaxed">{copy.subscription}</p>
        <p className="leading-relaxed">{copy.photos}</p>
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.contactTitle}</h2>
        <p className="leading-relaxed">{copy.contact}</p>
        <p className="leading-relaxed">
          <a className="font-semibold text-primary-forest underline" href={`mailto:${deleteAccountContent.supportEmail}`}>
            {deleteAccountContent.supportEmail}
          </a>
          {' · '}
          <a className="font-semibold text-primary-forest underline" href={deleteAccountContent.messengerUrl}>
            {copy.messengerLabel}
          </a>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href={copy.cancellationHref}>
            {copy.cancellationLabel}
          </Link>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href={copy.faqHref}>
            {copy.faqLabel}
          </Link>
        </p>
      </section>
    </article>
  );
}
