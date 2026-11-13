import { Icon } from '@/components/admin/ui/AdminUi';
import { cn } from '@/lib/cn';

interface AdminBannerProps {
  tone: 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

const TONES = {
  error: { box: 'bg-rose-50 ring-rose-200 text-rose-900', icon: 'text-rose-500', name: 'alert' },
  warning: { box: 'bg-amber-50 ring-amber-200 text-amber-900', icon: 'text-amber-500', name: 'alert' },
  info: { box: 'bg-emerald-50 ring-emerald-200 text-emerald-900', icon: 'text-emerald-500', name: 'check' },
} as const;

export function AdminBanner({ tone, title, message }: AdminBannerProps) {
  const style = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-xl px-4 py-3 ring-1 ring-inset', style.box)}>
      <Icon name={style.name} className={cn('mt-0.5 h-5 w-5 shrink-0', style.icon)} />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
