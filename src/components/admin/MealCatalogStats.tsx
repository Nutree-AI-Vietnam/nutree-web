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
    <div className="border-b border-border bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p
        className={
          tone === 'warning'
            ? 'mt-1 text-2xl font-bold text-energy-orange'
            : textValue
              ? 'mt-1 text-lg font-bold text-primary-forest'
              : 'mt-1 text-2xl font-bold text-foreground'
        }
      >
        {value}
      </p>
    </div>
  );
}
