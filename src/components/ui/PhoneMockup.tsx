'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';

interface PhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'floating';
  backgroundImage?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  imageSizes?: string;
}

export function PhoneMockup({
  className,
  children,
  variant = 'default',
  backgroundImage,
  imageAlt = '',
  imagePriority = false,
  imageSizes = '(max-width: 640px) 260px, (max-width: 768px) 280px, 300px',
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        // Mobile: smaller, tablet+: larger
        'phone-frame w-[260px] sm:w-[280px] md:w-[300px]',
        variant === 'floating' && 'animate-float',
        className
      )}
    >
      {/* Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full z-10" />

      {/* Screen */}
      <div className="phone-screen relative flex items-center justify-center bg-white">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={imageAlt}
            fill
            priority={imagePriority}
            loading={imagePriority ? undefined : 'lazy'}
            unoptimized
            sizes={imageSizes}
            className="object-cover"
            draggable={false}
          />
        ) : null}
        {children || null}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
    </div>
  );
}
