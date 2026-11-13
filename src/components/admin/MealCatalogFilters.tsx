import type { HasImageFilter, MealType } from '@/types/meal-catalog';

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
  { label: 'All types', value: '' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
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
    <section className="border border-slate-200 bg-white rounded-xl overflow-hidden">
      <div className="grid gap-3 p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Search</span>
          <input
            value={q}
            onChange={(event) => onQChange(event.target.value)}
            placeholder="Name, cuisine, key"
            className="h-9 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 rounded-lg"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Cuisine</span>
          <input
            value={cuisine}
            onChange={(event) => onCuisineChange(event.target.value)}
            placeholder="vietnamese"
            className="h-9 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 rounded-lg"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Meal type</span>
          <select
            value={mealType}
            onChange={(event) => onMealTypeChange(event.target.value as MealType | '')}
            className="h-9 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 rounded-lg"
          >
            {mealTypes.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Image</span>
          <select
            value={hasImage}
            onChange={(event) => onHasImageChange(event.target.value as HasImageFilter)}
            className="h-9 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 rounded-lg"
          >
            <option value="all">All meals</option>
            <option value="false">Missing image</option>
            <option value="true">Has image</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Active</span>
          <select
            value={isActive}
            onChange={(event) => onIsActiveChange(event.target.value as 'all' | 'true' | 'false')}
            className="h-9 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 rounded-lg"
          >
            <option value="true">Active</option>
            <option value="all">All</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          className="mt-5 h-9 border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 rounded-lg"
        >
          Refresh
        </button>
      </div>
    </section>
  );
}
