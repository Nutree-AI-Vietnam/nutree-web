'use client';

import { useLocale } from '@/lib/locale-context';

const partners = [
  {
    name: 'Sentry',
    href: 'https://sentry.io',
    logo: 'https://cdn.simpleicons.org/sentry/362D59',
  },
  {
    name: 'Render',
    href: 'https://render.com',
    logo: 'https://cdn.simpleicons.org/render/000000',
  },
  {
    name: 'Cloudflare for Startups',
    href: 'https://www.cloudflare.com/startups/',
    logo: '/cloudflare-for-startups-logo.png',
    wide: true,
  },
  {
    name: 'Neon',
    href: 'https://neon.tech',
    logo: 'https://cdn.simpleicons.org/neon/00E599',
  },
  {
    name: 'ElevenLabs',
    href: 'https://elevenlabs.io/startup-grants',
    logo: 'https://eleven-public-cdn.elevenlabs.io/payloadcms/pwsc4vchsqt-ElevenLabsGrants.webp',
    wide: true,
  },
  {
    name: 'PostHog',
    href: 'https://posthog.com',
    logo: 'https://cdn.simpleicons.org/posthog/FF5C34',
  },
];

export function StartupPartners() {
  const logoRail = [...partners, ...partners];
  const { t } = useLocale();

  return (
    <section aria-labelledby="startup-partners-title" className="relative pb-16 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-4 text-center">
          <h2
            id="startup-partners-title"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-teal"
          >
            {t.common.startupPartners}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 py-10 shadow-glass backdrop-blur-xl md:py-12">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background via-background/90 to-transparent md:w-40" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background via-background/90 to-transparent md:w-40" />

          <div className="startup-logo-rail flex w-max items-center gap-20 px-12 md:gap-24">
            {logoRail.map((partner, index) => (
              <a
                key={`${partner.name}-${index}`}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.common.partnerWebsiteLabel(partner.name)}
                aria-hidden={index >= partners.length}
                tabIndex={index >= partners.length ? -1 : 0}
                className="group flex h-24 min-w-72 items-center justify-center gap-6 rounded-3xl outline-none transition duration-200 hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={
                    partner.wide
                      ? 'h-auto w-64 opacity-70 transition duration-200 group-hover:opacity-100'
                      : 'h-14 w-14 opacity-75 transition duration-200 group-hover:opacity-100'
                  }
                  loading="lazy"
                />
                {!partner.wide && (
                  <span className="text-2xl font-bold text-muted/80 transition duration-200 group-hover:text-foreground">
                    {partner.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
