import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkHome?: boolean;
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

const iconSizes = {
  sm: 28,
  md: 36,
  lg: 48,
};

export function Logo({ size = 'md', className, linkHome = true }: LogoProps) {
  const iconSize = iconSizes[size];

  const logoContent = (
    <span
      className={cn(
        'inline-flex items-center gap-2',
        className
      )}
      aria-label="Nutree"
    >
      {/* 96px covers the largest icon at 2x. The header copy loads eagerly but without a preload,
          so this small icon never competes with the fonts and hero text for early bandwidth. */}
      <Image
        src="/logo-gradient-96.webp"
        alt="Nutree Icon"
        width={iconSize}
        height={iconSize}
        unoptimized
        className="object-contain rounded-lg"
        loading={size === 'sm' ? 'eager' : 'lazy'}
      />
      <span
        className={cn(
          'font-display font-semibold bg-gradient-to-r from-primary-forest via-primary-emerald to-primary-teal bg-clip-text text-transparent',
          sizeClasses[size]
        )}
      >
        Nutree
      </span>
    </span>
  );

  if (linkHome) {
    return (
      <Link href="/" className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
