import { cn } from '@/lib/cn';

interface AdminBannerProps {
  tone: 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

const TONES = {
  error: 'border-[#8E2F2F] text-[#8E2F2F]',
  warning: 'border-[#8A6A1F] text-[#6B4E12]',
  info: 'border-[#1B4336] text-[#1B4336]',
} as const;

export function AdminBanner({ tone, title, message }: AdminBannerProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('border-l-[3px] py-1 pl-3', TONES[tone])}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-sm text-[#1A2820]">{message}</p>
    </div>
  );
}
