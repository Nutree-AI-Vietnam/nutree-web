import Image from 'next/image';
import { cn } from '@/lib/cn';
import { BO_CONG_THUONG_NOTICE } from '@/lib/legal-company';

interface BoCongThuongBadgeProps {
  className?: string;
  height?: number;
  alt?: string;
}

/** Official “Đã thông báo thương mại điện tử” mark. Opens the Bộ Công Thương record. */
export function BoCongThuongBadge({
  className,
  height = BO_CONG_THUONG_NOTICE.displayHeight,
  alt = BO_CONG_THUONG_NOTICE.alt,
}: BoCongThuongBadgeProps) {
  const width = Math.round(
    (BO_CONG_THUONG_NOTICE.imageWidth / BO_CONG_THUONG_NOTICE.imageHeight) * height,
  );

  return (
    <a
      href={BO_CONG_THUONG_NOTICE.href}
      target="_blank"
      rel="noopener noreferrer"
      title={BO_CONG_THUONG_NOTICE.title}
      className={cn(
        'inline-flex shrink-0 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2',
        className,
      )}
    >
      <Image
        src={BO_CONG_THUONG_NOTICE.imageSrc}
        alt={alt}
        width={width}
        height={height}
        unoptimized
      />
    </a>
  );
}
