/* eslint-disable @next/next/no-img-element */
import type { MealCatalogItem } from '@/types/meal-catalog';

interface MealCatalogTableProps {
  items: MealCatalogItem[];
  generatingId: string | null;
  isPreviewMode: boolean;
  onGenerateImage: (item: MealCatalogItem, force: boolean) => void;
  onEdit: (item: MealCatalogItem) => void;
}

export function MealCatalogTable({
  items,
  generatingId,
  isPreviewMode,
  onGenerateImage,
  onEdit,
}: MealCatalogTableProps) {
  if (items.length === 0) {
    return (
      <div className="border border-[#E3DDD2] bg-[#FBF9F4] p-10 text-center">
        <p className="text-lg font-medium text-[#1A2820]">Không có món ăn nào phù hợp.</p>
        <p className="mt-2 text-sm text-[#5C6B62]">Thử xóa từ khóa tìm kiếm hoặc bộ lọc ảnh.</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden border border-[#E3DDD2] bg-[#FBF9F4]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="border-b border-[#E3DDD2] text-xs uppercase tracking-[0.08em] text-[#53635B]">
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
                onEdit={onEdit}
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
            onEdit={onEdit}
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
  onGenerateImage: (item: MealCatalogItem, force: boolean) => void;
  onEdit: (item: MealCatalogItem) => void;
}

function TableRow({ item, isGenerating, isPreviewMode, onGenerateImage, onEdit }: RowProps) {
  return (
    <tr className="border-b border-[#EDE8DE] last:border-b-0">
      <td className="max-w-[28rem] px-4 py-4 align-top">
        <p className="font-medium text-[#1A2820]">{item.name}</p>
        <p className="mt-1 text-xs text-[#5C6B62]">{item.catalog_key}</p>
        <p className="mt-2 line-clamp-2 text-sm text-[#5C6B62]">{item.description || 'Chưa có mô tả'}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.08em] text-[#1B4336]">{item.cuisine}</p>
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
        <RowActions item={item} isGenerating={isGenerating} isPreviewMode={isPreviewMode} onGenerateImage={onGenerateImage} onEdit={onEdit} />
      </td>
    </tr>
  );
}

function MealCard({ item, isGenerating, isPreviewMode, onGenerateImage, onEdit }: RowProps) {
  return (
    <article className="border border-[#E3DDD2] bg-[#FBF9F4] p-3">
      <div className="flex gap-3">
        <ImagePreview item={item} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[#1A2820]">{item.name}</p>
          <p className="mt-1 text-xs text-[#5C6B62]">{item.cuisine} · {item.catalog_key}</p>
          <TypePills types={item.meal_types} />
        </div>
      </div>
      <p className="mt-3 text-sm text-[#5C6B62]">{item.description || 'Chưa có mô tả'}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MacroList item={item} />
        <IngredientSummary item={item} />
      </div>
      <div className="mt-3">
        <RowActions item={item} isGenerating={isGenerating} isPreviewMode={isPreviewMode} onGenerateImage={onGenerateImage} onEdit={onEdit} />
      </div>
    </article>
  );
}

function ImagePreview({ item }: { item: MealCatalogItem }) {
  if (!item.image_url) {
    return (
      <div className="flex h-20 w-28 items-center justify-center border border-dashed border-[#C4A574] bg-[#F4EBD4] text-xs font-medium text-[#6B4E12]">
        Thiếu ảnh
      </div>
    );
  }

  return (
    <a href={item.image_url} target="_blank" rel="noreferrer" className="block h-20 w-28 overflow-hidden border border-[#E3DDD2] bg-[#F4F1EA]">
      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
    </a>
  );
}

function TypePills({ types }: { types: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => (
        <span key={type} className="bg-[#E5F0EA] px-1.5 py-0.5 text-xs font-medium text-[#1B4336]">
          {type}
        </span>
      ))}
    </div>
  );
}

function MacroList({ item }: { item: MealCatalogItem }) {
  return (
    <div className="text-xs text-[#5C6B62]">
      <p className="font-medium text-[#1A2820]">{item.calories} kcal</p>
      <p>Đạm {item.protein_g}g · Tinh bột {item.carbs_g}g · Béo {item.fat_g}g</p>
      <p>Chất xơ {item.fiber_g}g</p>
    </div>
  );
}

function IngredientSummary({ item }: { item: MealCatalogItem }) {
  const names = item.ingredients?.map((ingredient) => ingredient.display_name).slice(0, 3);
  return (
    <div className="text-xs text-[#5C6B62]">
      <p className="font-medium text-[#1A2820]">{item.ingredient_count} nguyên liệu</p>
      <p>{names && names.length > 0 ? names.join(', ') : 'Chưa có tóm tắt nguyên liệu'}</p>
    </div>
  );
}

function RowActions({ item, isGenerating, isPreviewMode, onGenerateImage, onEdit }: RowProps) {
  const label = item.image_url ? 'Tạo lại ảnh' : isPreviewMode ? 'Chờ backend' : isGenerating ? 'Đang tạo...' : 'Tạo ảnh';
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="h-11 min-w-[8.5rem] cursor-pointer border border-[#D5CFC3] bg-[#FBF9F4] px-3 text-sm font-medium text-[#1A2820] hover:border-[#1B4336] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336]"
      >
        Sửa
      </button>
      <button
        type="button"
        disabled={isGenerating || isPreviewMode}
        onClick={() => onGenerateImage(item, Boolean(item.image_url))}
        className="h-11 min-w-[8.5rem] cursor-pointer border border-[#1B4336] px-3 text-sm font-medium text-[#1B4336] transition-colors duration-200 hover:bg-[#1B4336] hover:text-[#F4F1EA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336] disabled:cursor-not-allowed disabled:border-[#D5CFC3] disabled:text-[#A39E93] disabled:hover:bg-transparent"
      >
        {label}
      </button>
    </div>
  );
}
