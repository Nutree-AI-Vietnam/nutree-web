/* eslint-disable @next/next/no-img-element */
import type { MealCatalogItem } from '@/types/meal-catalog';

interface MealCatalogTableProps {
  items: MealCatalogItem[];
  generatingId: string | null;
  isPreviewMode: boolean;
  onGenerateImage: (item: MealCatalogItem) => void;
}

export function MealCatalogTable({
  items,
  generatingId,
  isPreviewMode,
  onGenerateImage,
}: MealCatalogTableProps) {
  if (items.length === 0) {
    return (
      <div className="border border-slate-200 bg-white p-10 text-center rounded-xl">
        <p className="text-lg font-semibold text-slate-900">Không có món ăn nào phù hợp.</p>
        <p className="mt-2 text-sm text-slate-500">Thử xóa từ khóa tìm kiếm hoặc bộ lọc ảnh.</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden border border-slate-200 bg-white rounded-xl">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Món ăn</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Bữa</th>
              <th className="px-4 py-3">Dinh dưỡng</th>
              <th className="px-4 py-3">Nguyên liệu</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                isGenerating={generatingId === item.id}
                isPreviewMode={isPreviewMode}
                onGenerateImage={onGenerateImage}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {items.map((item) => (
          <MealCard
            key={item.id}
            item={item}
            isGenerating={generatingId === item.id}
            isPreviewMode={isPreviewMode}
            onGenerateImage={onGenerateImage}
          />
        ))}
      </div>
    </section>
  );
}

interface RowProps {
  item: MealCatalogItem;
  isGenerating: boolean;
  isPreviewMode: boolean;
  onGenerateImage: (item: MealCatalogItem) => void;
}

function TableRow({ item, isGenerating, isPreviewMode, onGenerateImage }: RowProps) {
  return (
    <tr className="border-b border-slate-200 last:border-b-0">
      <td className="max-w-[28rem] px-4 py-4 align-top">
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="mt-1 text-xs text-slate-500">{item.catalog_key}</p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.description || 'Chưa có mô tả'}</p>
        <p className="mt-2 text-xs font-semibold uppercase text-emerald-600">{item.cuisine}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <ImagePreview item={item} />
      </td>
      <td className="px-4 py-4 align-top">
        <TypePills types={item.meal_types} />
      </td>
      <td className="px-4 py-4 align-top">
        <MacroList item={item} />
      </td>
      <td className="px-4 py-4 align-top">
        <IngredientSummary item={item} />
      </td>
      <td className="px-4 py-4 align-top">
        <GenerateButton
          item={item}
          isGenerating={isGenerating}
          isPreviewMode={isPreviewMode}
          onGenerateImage={onGenerateImage}
        />
      </td>
    </tr>
  );
}

function MealCard({ item, isGenerating, isPreviewMode, onGenerateImage }: RowProps) {
  return (
    <article className="border border-slate-200 bg-slate-50 p-3 rounded-xl">
      <div className="flex gap-3">
        <ImagePreview item={item} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="mt-1 text-xs text-slate-500">{item.cuisine} · {item.catalog_key}</p>
          <TypePills types={item.meal_types} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{item.description || 'Chưa có mô tả'}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MacroList item={item} />
        <IngredientSummary item={item} />
      </div>
      <div className="mt-3">
        <GenerateButton
          item={item}
          isGenerating={isGenerating}
          isPreviewMode={isPreviewMode}
          onGenerateImage={onGenerateImage}
        />
      </div>
    </article>
  );
}

function ImagePreview({ item }: { item: MealCatalogItem }) {
  if (!item.image_url) {
    return (
      <div className="flex h-20 w-28 items-center justify-center border border-dashed border-amber-300 bg-amber-50 text-xs font-semibold text-amber-700 rounded-lg">
        Thiếu ảnh
      </div>
    );
  }

  return (
    <a href={item.image_url} target="_blank" rel="noreferrer" className="block h-20 w-28 overflow-hidden border border-slate-200 bg-slate-50 rounded-lg">
      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
    </a>
  );
}

function TypePills({ types }: { types: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => (
        <span key={type} className="border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-slate-900 rounded-lg">
          {type}
        </span>
      ))}
    </div>
  );
}

function MacroList({ item }: { item: MealCatalogItem }) {
  return (
    <div className="text-xs text-slate-500">
      <p className="font-semibold text-slate-900">{item.calories} kcal</p>
      <p>Đạm {item.protein_g}g · Tinh bột {item.carbs_g}g · Béo {item.fat_g}g</p>
      <p>Chất xơ {item.fiber_g}g</p>
    </div>
  );
}

function IngredientSummary({ item }: { item: MealCatalogItem }) {
  const names = item.ingredients?.map((ingredient) => ingredient.display_name).slice(0, 3);
  return (
    <div className="text-xs text-slate-500">
      <p className="font-semibold text-slate-900">{item.ingredient_count} nguyên liệu</p>
      <p>{names && names.length > 0 ? names.join(', ') : 'Chưa có tóm tắt nguyên liệu'}</p>
    </div>
  );
}

function GenerateButton({ item, isGenerating, isPreviewMode, onGenerateImage }: RowProps) {
  const disabled = Boolean(item.image_url) || isGenerating || isPreviewMode;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onGenerateImage(item)}
      className="h-10 min-w-[8.5rem] border border-slate-900 px-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent rounded-lg"
    >
      {item.image_url ? 'Đã có ảnh' : isPreviewMode ? 'Chờ backend' : isGenerating ? 'Đang tạo...' : 'Tạo ảnh'}
    </button>
  );
}
