import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { homePath } from '@/lib/home-language';
import { useLocale } from '@/lib/locale-context';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkHome?: boolean;
}

const sizeClasses = {
  sm: 'text-[1.35rem]',
  md: 'text-[1.7rem]',
  lg: 'text-4xl',
};

const iconSizes = {
  sm: 28,
  md: 36,
  lg: 48,
};

export function Logo({ size = 'md', className, linkHome = true }: LogoProps) {
  const { locale } = useLocale();
  const iconSize = iconSizes[size];

  const logoContent = (
    <span
      className={cn('inline-flex items-center gap-2.5', className)}
    >
      {/* 96px covers the largest icon at 2x. The header copy loads eagerly but without a preload,
          so this small icon never competes with the fonts and hero text for early bandwidth. */}
      <Image
        src="/logo-gradient-96.webp"
        alt=""
        width={iconSize}
        height={iconSize}
        unoptimized
        className="rounded-[10px] object-contain shadow-sm ring-1 ring-primary-forest/15"
        loading={size === 'sm' ? 'eager' : 'lazy'}
      />
      <span
        className={cn(
          'font-display font-extrabold leading-none tracking-[-0.04em] text-primary-forest',
          sizeClasses[size]
        )}
      >
        Nutree
      </span>
    </span>
  );

  if (linkHome) {
    return (
      <Link href={homePath(locale)} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
