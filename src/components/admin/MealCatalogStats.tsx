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
      <Stat label="Tổng món ăn trong danh mục" value={total} />
      <Stat label="Đang hiển thị có ảnh" value={visibleWithImage} />
      <Stat label="Đang hiển thị thiếu ảnh" value={visibleMissing} tone="warning" />
      <Stat label="Nguồn dữ liệu" value={isPreviewMode ? 'Dữ liệu mẫu' : 'MealTrack'} textValue />
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
    <div className="border border-[#E3DDD2] bg-[#FBF9F4] px-5 py-4">
      <p className="text-[12px] text-[#5C6B62]">{label}</p>
      <p
        className={
          tone === 'warning'
            ? 'mt-2 text-2xl font-medium tracking-[-0.03em] text-[#8A6A1F]'
            : textValue
              ? 'mt-2 text-lg font-medium text-[#1A2820]'
              : 'mt-2 text-2xl font-medium tracking-[-0.03em] text-[#1A2820]'
        }
      >
        {value}
      </p>
    </div>
  );
}
