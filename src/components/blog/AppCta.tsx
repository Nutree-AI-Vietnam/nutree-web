import { StoreBadges } from '@/components/ui/StoreBadges';
import { SITE_CONFIG } from '@/lib/constants';

/** Mid-article app promotion, written in MDX as <AppCta /> on its own line. */
export function AppCta() {
  return (
    <aside className="my-10 overflow-hidden rounded-3xl bg-gradient-brand px-6 py-7 text-white shadow-glass-lg md:px-8 md:py-8">
      <p className="text-balance font-display text-xl font-bold leading-snug md:text-2xl">
        Muốn biết bữa ăn của bạn có bao nhiêu calo?
      </p>
      <p className="mt-2 max-w-xl leading-relaxed text-white/85">
        Chụp ảnh, scan mã vạch hoặc gõ tên món: Nutree tính calo và macro cho bạn, rồi tự điều chỉnh mục
        tiêu theo tiến độ.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={SITE_CONFIG.quizUrl}
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-primary-forest no-underline transition-colors hover:bg-energy-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-forest"
        >
          Tạo kế hoạch cho tôi
        </a>
        <StoreBadges size="sm" />
      </div>
    </aside>
  );
}
