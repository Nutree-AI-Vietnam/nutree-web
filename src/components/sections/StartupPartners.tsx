'use client';

import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import { useLocale } from '@/lib/locale-context';

// Logos are self-hosted so the rail makes no third-party requests. Square glyphs
// sit next to the partner name; wide wordmarks render alone at their own ratio.
const partners = [
  {
    name: 'Anthropic',
    href: 'https://www.anthropic.com/startups',
    logo: '/partners/anthropic.svg',
    width: 56,
    height: 56,
  },
  {
    name: 'Sentry',
    href: 'https://sentry.io',
    logo: '/partners/sentry.svg',
    width: 56,
    height: 56,
  },
  {
    name: 'Render',
    href: 'https://render.com',
    logo: '/partners/render.svg',
    width: 56,
    height: 56,
  },
  {
    name: 'Cloudflare for Startups',
    href: 'https://www.cloudflare.com/startups/',
    logo: '/cloudflare-for-startups-logo.png',
    width: 512,
    height: 173,
    wideClass: 'w-32',
  },
  {
    name: 'Neon',
    href: 'https://neon.tech',
    logo: '/partners/neon.svg',
    width: 56,
    height: 56,
  },
  {
    name: 'ElevenLabs',
    href: 'https://elevenlabs.io/startup-grants',
    logo: '/partners/elevenlabs-grants.webp',
    width: 1496,
    height: 132,
    wideClass: 'w-56',
  },
  {
    name: 'PostHog',
    href: 'https://posthog.com',
    logo: '/partners/posthog.svg',
    width: 56,
    height: 56,
  },
];

export function StartupPartners() {
  const { t } = useLocale();
  // The rail only runs while it is on screen.
  const { ref, isInView } = useInView({ triggerOnce: false });

  return (
    <section aria-labelledby="startup-partners-title" className="relative pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-6 flex max-w-3xl items-center gap-4 md:mb-8">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <h2
            id="startup-partners-title"
            className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary-teal"
          >
            {t.common.startupPartners}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>

      {/* Full-bleed rail: two identical lists slide by one list width; the second is decorative. */}
      <div
        ref={ref}
        data-paused={isInView ? undefined : true}
        className="marquee"
        style={{ '--gap': '3.5rem', '--marquee-duration': '40s' } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="marquee-track items-center py-2">
            {partners.map((partner) => (
              <li key={partner.name} className="shrink-0">
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.common.partnerWebsiteLabel(partner.name)}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="flex h-16 items-center gap-3 rounded-2xl px-3 opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:grayscale-0"
                >
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={partner.width}
                    height={partner.height}
                    unoptimized
                    draggable={false}
                    className={partner.wideClass ? `h-auto ${partner.wideClass}` : 'h-9 w-9'}
                  />
                  {!partner.wideClass && (
                    <span className="text-xl font-bold tracking-tight text-foreground">{partner.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
