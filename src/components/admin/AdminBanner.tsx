interface AdminBannerProps {
  tone: 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export function AdminBanner({ tone, title, message }: AdminBannerProps) {
  const toneClass =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-900'
      : tone === 'warning'
        ? 'border-energy-orange/30 bg-energy-orange-soft text-foreground'
        : 'border-primary-teal/30 bg-primary-teal/10 text-foreground';

  return (
    <div className={`border px-4 py-3 ${toneClass}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
