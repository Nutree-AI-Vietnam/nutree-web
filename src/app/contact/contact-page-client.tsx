'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ContactPageClient() {
  const { locale, setLocale, t } = useLocale();

  const channels = [
    {
      id: 'email',
      content: t.contact.email,
      detail: SITE_CONFIG.supportEmail,
      href: `mailto:${SITE_CONFIG.supportEmail}?subject=Nutree%20Support`,
      logo: '/contact/email.svg',
      className: 'md:row-span-2 md:min-h-[26rem] bg-primary-forest text-white',
      mutedClass: 'text-white/70',
      detailClass: 'text-energy-lime',
    },
    {
      id: 'messenger',
      content: t.contact.messenger,
      detail: 'Facebook Messenger',
      href: SITE_CONFIG.social.facebookMessenger,
      logo: '/contact/messenger.svg',
      className: 'bg-white text-foreground',
      mutedClass: 'text-muted',
      detailClass: 'text-primary-emerald',
    },
    {
      id: 'tiktok',
      content: t.contact.tiktok,
      detail: '@nutree.ai',
      href: SITE_CONFIG.social.tiktok,
      logo: '/contact/tiktok.svg',
      className: 'bg-[#F0F7F4] text-foreground',
      mutedClass: 'text-muted',
      detailClass: 'text-primary-forest',
    },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-background pb-16 pt-28 md:pb-24 md:pt-36">
      <div aria-hidden="true" className="absolute -right-40 top-16 -z-10 h-[30rem] w-[30rem] rounded-full bg-primary-teal/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -left-52 bottom-10 -z-10 h-[26rem] w-[26rem] rounded-full bg-energy-lime/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-forest transition-colors hover:text-primary-teal">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-1">
              <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.contact.backHome}
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}
            aria-label={t.contact.languageLabel}
            className="min-h-11 rounded-full border border-primary-forest/20 bg-white/80 px-4 text-sm font-semibold text-primary-forest transition-colors hover:border-primary-forest/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
          >
            {locale === 'en' ? 'VI' : 'EN'}
          </button>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-12 max-w-3xl md:mb-16"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary-emerald">{t.contact.eyebrow}</p>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t.contact.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">{t.contact.description}</p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr] md:grid-rows-2 md:gap-5">
          {channels.map((channel, index) => (
            <motion.a
              key={channel.id}
              href={channel.href}
              target={channel.id === 'email' ? undefined : '_blank'}
              rel={channel.id === 'email' ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + index * 0.06, ease: 'easeOut' }}
              className={`group flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 shadow-[0_18px_55px_rgba(26,71,57,0.08)] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-4 sm:p-8 ${channel.className}`}
            >
              <div className="flex items-start justify-between gap-4">
                <Image src={channel.logo} alt="" width={56} height={56} className="h-14 w-14" />
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current/15" aria-hidden="true"><ArrowIcon /></span>
              </div>
              <div className="mt-10">
                <p className={`mb-2 text-sm font-semibold ${channel.detailClass}`}>{channel.detail}</p>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">{channel.content.name}</h2>
                <p className={`mt-3 max-w-md leading-7 ${channel.mutedClass}`}>{channel.content.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">{channel.content.action}<ArrowIcon /></span>
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-muted">{t.contact.responseNote}</p>
      </div>
    </div>
  );
}
