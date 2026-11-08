'use client';

import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { appStoreUrl, SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';

/** Public store signal used on the landing awards row: 4.7 average, 5000+ total ratings. */
const APP_STORE_RATING = '4.7';

function Laurel({ side }: { side: 'left' | 'right' }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      src={side === 'left' ? '/awards/laurel-left.svg' : '/awards/laurel-right.svg'}
      className="h-16 w-auto flex-none sm:h-20"
    />
  );
}

function Stars() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex gap-0.5 text-[#f5a623]">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
          <path d="M6 1.2 7.3 4.4l3.4.3-2.6 2.2.8 3.3L6 8.6 3.1 10.2l.8-3.3L1.3 4.7l3.4-.3L6 1.2Z" />
        </svg>
      ))}
    </span>
  );
}

function Award({
  href,
  children,
  className,
  contentClassName,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const body = (
    <>
      <Laurel side="left" />
      <span
        className={`flex flex-none flex-col items-center text-center ${contentClassName ?? 'w-[8.75rem] sm:w-[9.5rem]'}`}
      >
        {children}
      </span>
      <Laurel side="right" />
    </>
  );
  const classNames = `flex items-end justify-center gap-1.5 ${className ?? ''}`;
  if (!href) return <div className={classNames}>{body}</div>;
  return (
    <a href={href} className={classNames}>
      {body}
    </a>
  );
}

export function SocialProof() {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const { locale, t } = useLocale();

  return (
    <section ref={ref} data-inview={isInView} className="relative z-10 py-2 md:py-4">
      <div className="container mx-auto px-4">
        <div className="reveal mx-auto flex max-w-[980px] flex-wrap items-end justify-center gap-x-5 gap-y-8 md:flex-nowrap md:gap-x-8">
          <Award href={appStoreUrl(locale)} contentClassName="w-[9.75rem] sm:w-[11rem]">
            <span className="flex h-8 items-end justify-center">
              <img alt="" aria-hidden="true" src="/awards/app-store.svg" className="h-7 w-7" />
            </span>
            <span className="mt-2 text-balance text-[13px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#121212] md:text-[15px]">
              {t.socialProof.essential}
            </span>
            <span className="mt-1 text-[11px] leading-[1.25] text-[#808080] md:text-[12px]">
              {t.socialProof.appStore}
            </span>
          </Award>

          <Award className="order-first w-full md:order-none md:w-auto">
            <span className="flex h-8 flex-col items-center justify-end">
              <span className="font-display text-[21px] font-semibold leading-none tracking-[-0.02em] text-[#121212]">
                {APP_STORE_RATING}
              </span>
              <Stars />
            </span>
            <span className="mt-2 text-balance text-[13px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#121212] md:text-[15px]">
              {t.socialProof.ratingLabel}
            </span>
            <span className="mt-1 text-[11px] leading-[1.25] text-[#808080] md:text-[12px]">
              {t.socialProof.ratingDetail}
            </span>
          </Award>

          <Award href={SITE_CONFIG.stores.googlePlay} contentClassName="w-[9.75rem] sm:w-[11rem]">
            <span className="flex h-8 items-end justify-center">
              <img alt="" aria-hidden="true" src="/awards/google-play.svg" className="h-7 w-7" />
            </span>
            <span className="mt-2 text-balance text-[13px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#121212] md:text-[15px]">
              {t.socialProof.essential}
            </span>
            <span className="mt-1 text-[11px] leading-[1.25] text-[#808080] md:text-[12px]">
              {t.socialProof.playStore}
            </span>
          </Award>
        </div>
      </div>
    </section>
  );
}
