'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';

// Official badge artwork at a shared height; widths follow each file's aspect ratio.
const BADGE_SIZES = {
  md: { height: 48, appStore: 144, googlePlay: { en: 161, vi: 162 } },
  sm: { height: 40, appStore: 120, googlePlay: { en: 134, vi: 135 } },
} as const;

const badgeLinkClass =
  'inline-flex shrink-0 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2';

interface StoreBadgesProps {
  className?: string;
  size?: 'md' | 'sm';
  onClick?: () => void;
}

export function StoreBadges({ className, size = 'md', onClick }: StoreBadgesProps) {
  const { locale, t } = useLocale();
  const dims = BADGE_SIZES[size];

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <a href={SITE_CONFIG.stores.appStore} onClick={onClick} className={badgeLinkClass}>
        <Image
          src={`/badges/app-store-${locale}.svg`}
          alt={t.common.appStoreDownloadLabel}
          width={dims.appStore}
          height={dims.height}
          unoptimized
        />
      </a>
      <a href={SITE_CONFIG.stores.googlePlay} onClick={onClick} className={badgeLinkClass}>
        <Image
          src={`/badges/google-play-${locale}.webp`}
          alt={t.common.googlePlayDownloadLabel}
          width={dims.googlePlay[locale]}
          height={dims.height}
          unoptimized
        />
      </a>
    </div>
  );
}
