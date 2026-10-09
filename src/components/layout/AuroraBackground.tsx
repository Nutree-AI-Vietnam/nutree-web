import { cn } from '@/lib/cn';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

const OPACITY = {
  subtle: { green: 0.2, teal: 0.15 },
  medium: { green: 0.35, teal: 0.28 },
  strong: { green: 0.45, teal: 0.38 },
} as const;

// Static radial-gradient glows: no blur filters or JS animation, so they cost one paint and
// nothing per frame, and server and client render the same markup at every width.
export function AuroraBackground({ children, className, intensity = 'medium' }: AuroraBackgroundProps) {
  const opacity = OPACITY[intensity];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full opacity-60 md:h-[600px] md:w-[600px] md:opacity-100"
        style={{
          background: `radial-gradient(circle, rgba(45, 139, 112, ${opacity.green}) 0%, transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full opacity-60 md:h-[500px] md:w-[500px] md:opacity-100"
        style={{
          background: `radial-gradient(circle, rgba(41, 182, 161, ${opacity.teal}) 0%, transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 hidden h-[400px] w-[400px] -translate-x-1/2 rounded-full md:block"
        style={{ background: 'radial-gradient(circle, rgba(167, 243, 208, 0.2) 0%, transparent 70%)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
