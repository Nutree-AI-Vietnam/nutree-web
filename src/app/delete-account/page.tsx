import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { deleteAccountContent } from '@/lib/delete-account-content';

export const metadata = createPageMetadata({
  title: `${deleteAccountContent.title} | Nutree`,
  description: deleteAccountContent.description,
  path: '/delete-account',
});

export default function DeleteAccountPage() {
  const copy = deleteAccountContent;

  return (
    <article className="container mx-auto max-w-3xl px-4 pb-16 pt-28 md:pt-32">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-emerald">Nutree</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-primary-forest md:text-5xl">
        {copy.en.heading}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">{copy.limitation}</p>

      <section lang="en" className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.en.stepsTitle}</h2>
        <p className="leading-relaxed">{copy.en.steps}</p>
        <h2 className="font-display text-2xl font-bold text-primary-forest">Subscriptions</h2>
        <p className="leading-relaxed">{copy.en.subscription}</p>
        <p className="leading-relaxed">{copy.en.photos}</p>
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.en.contactTitle}</h2>
        <p className="leading-relaxed">{copy.en.contact}</p>
        <p className="leading-relaxed">
          <a className="font-semibold text-primary-forest underline" href={`mailto:${copy.supportEmail}`}>
            {copy.supportEmail}
          </a>
          {' · '}
          <a className="font-semibold text-primary-forest underline" href={copy.messengerUrl}>
            Facebook Messenger
          </a>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href="/cancellation">
            Cancellation
          </Link>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href="/faq">
            FAQ
          </Link>
        </p>
      </section>

      <section lang="vi" className="mt-12 space-y-4 border-t border-border/70 pt-10">
        <h2 className="font-display text-2xl font-bold text-primary-forest">{copy.vi.heading}</h2>
        <h3 className="font-display text-xl font-bold text-primary-forest">{copy.vi.stepsTitle}</h3>
        <p className="leading-relaxed">{copy.vi.steps}</p>
        <h3 className="font-display text-xl font-bold text-primary-forest">Gói đăng ký</h3>
        <p className="leading-relaxed">{copy.vi.subscription}</p>
        <p className="leading-relaxed">{copy.vi.photos}</p>
        <h3 className="font-display text-xl font-bold text-primary-forest">{copy.vi.contactTitle}</h3>
        <p className="leading-relaxed">{copy.vi.contact}</p>
        <p className="leading-relaxed">
          <a className="font-semibold text-primary-forest underline" href={`mailto:${copy.supportEmail}`}>
            {copy.supportEmail}
          </a>
          {' · '}
          <a className="font-semibold text-primary-forest underline" href={copy.messengerUrl}>
            Facebook Messenger
          </a>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href="/cancellation">
            Hủy gói
          </Link>
          {' · '}
          <Link className="font-semibold text-primary-forest underline" href="/faq">
            Câu hỏi thường gặp
          </Link>
        </p>
      </section>
    </article>
  );
}
