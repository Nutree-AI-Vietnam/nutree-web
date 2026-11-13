import type { MealCatalogItem } from '@/types/meal-catalog';

interface MealCatalogStatsProps {
  items: MealCatalogItem[];
  total: number;
  isPreviewMode: boolean;
}

export function MealCatalogStats({ items, total, isPreviewMode }: MealCatalogStatsProps) {
  const visibleMissing = items.filter((item) => !item.image_url).length;
  const visibleWithImage = items.length - visibleMissing;

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <Stat label="Total catalog meals" value={total} />
      <Stat label="Visible with image" value={visibleWithImage} />
      <Stat label="Visible missing image" value={visibleMissing} tone="warning" />
      <Stat label="Data source" value={isPreviewMode ? 'Preview' : 'MealTrack'} textValue />
    </section>
  );
}

interface StatProps {
  label: string;
  value: number | string;
  tone?: 'default' | 'warning';
  textValue?: boolean;
}

function Stat({ label, value, tone = 'default', textValue = false }: StatProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={
          tone === 'warning'
            ? 'mt-1 text-2xl font-semibold text-amber-700'
            : textValue
              ? 'mt-1 text-lg font-semibold text-slate-900'
              : 'mt-1 text-2xl font-semibold text-slate-900'
        }
      >
        {value}
      </p>
    </div>
  );
}
