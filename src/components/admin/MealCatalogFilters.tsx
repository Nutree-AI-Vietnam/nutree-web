import { inputClass } from '@/components/admin/ui/AdminUi';
import type { HasImageFilter, MealType } from '@/types/meal-catalog';

const labelClass = 'mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]';

interface MealCatalogFiltersProps {
  q: string;
  cuisine: string;
  mealType: MealType | '';
  hasImage: HasImageFilter;
  isActive: 'all' | 'true' | 'false';
  onQChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onMealTypeChange: (value: MealType | '') => void;
  onHasImageChange: (value: HasImageFilter) => void;
  onIsActiveChange: (value: 'all' | 'true' | 'false') => void;
  onRefresh: () => void;
}

const mealTypes: Array<{ label: string; value: MealType | '' }> = [
  { label: 'Tất cả bữa', value: '' },
  { label: 'Bữa sáng', value: 'breakfast' },
  { label: 'Bữa trưa', value: 'lunch' },
  { label: 'Bữa tối', value: 'dinner' },
  { label: 'Bữa phụ', value: 'snack' },
];

export function MealCatalogFilters({
  q,
  cuisine,
  mealType,
  hasImage,
  isActive,
  onQChange,
  onCuisineChange,
  onMealTypeChange,
  onHasImageChange,
  onIsActiveChange,
  onRefresh,
}: MealCatalogFiltersProps) {
  return (
    <section className="overflow-hidden border border-[#E3DDD2] bg-[#FBF9F4]">
      <div className="grid gap-3 p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
        <label className="block">
          <span className={labelClass}>Tìm kiếm</span>
          <input
            value={q}
            onChange={(event) => onQChange(event.target.value)}
            placeholder="Tên, ẩm thực, mã"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Ẩm thực</span>
          <input
            value={cuisine}
            onChange={(event) => onCuisineChange(event.target.value)}
            placeholder="vietnamese"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Loại bữa</span>
          <select
            value={mealType}
            onChange={(event) => onMealTypeChange(event.target.value as MealType | '')}
            className={inputClass}
          >
            {mealTypes.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Ảnh</span>
          <select
            value={hasImage}
            onChange={(event) => onHasImageChange(event.target.value as HasImageFilter)}
            className={inputClass}
          >
            <option value="all">Tất cả món ăn</option>
            <option value="false">Thiếu ảnh</option>
            <option value="true">Có ảnh</option>
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Trạng thái</span>
          <select
            value={isActive}
            onChange={(event) => onIsActiveChange(event.target.value as 'all' | 'true' | 'false')}
            className={inputClass}
          >
            <option value="true">Đang dùng</option>
            <option value="all">Tất cả</option>
            <option value="false">Ngừng dùng</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          className="mt-5 h-9 bg-[#1B4336] px-4 text-sm font-medium text-[#F4F1EA] transition-colors hover:bg-[#14352B]"
        >
          Làm mới
        </button>
      </div>
    </section>
  );
}
