import type { HasImageFilter, MealType } from '@/types/meal-catalog';

interface MealCatalogFiltersProps {
  q: string;
  cuisine: string;
  mealType: MealType | '';
  hasImage: HasImageFilter;
  isActive: 'all' | 'true' | 'false';
  token: string;
  onQChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onMealTypeChange: (value: MealType | '') => void;
  onHasImageChange: (value: HasImageFilter) => void;
  onIsActiveChange: (value: 'all' | 'true' | 'false') => void;
  onTokenChange: (value: string) => void;
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
  token,
  onQChange,
  onCuisineChange,
  onMealTypeChange,
  onHasImageChange,
  onIsActiveChange,
  onTokenChange,
  onRefresh,
}: MealCatalogFiltersProps) {
  return (
    <section className="border-y border-border bg-white">
      <div className="grid gap-3 p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Search</span>
          <input
            value={q}
            onChange={(event) => onQChange(event.target.value)}
            placeholder="Name, cuisine, key"
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Cuisine</span>
          <input
            value={cuisine}
            onChange={(event) => onCuisineChange(event.target.value)}
            placeholder="vietnamese"
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Meal type</span>
          <select
            value={mealType}
            onChange={(event) => onMealTypeChange(event.target.value as MealType | '')}
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          >
            {mealTypes.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Image</span>
          <select
            value={hasImage}
            onChange={(event) => onHasImageChange(event.target.value as HasImageFilter)}
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          >
            <option value="all">All meals</option>
            <option value="false">Missing image</option>
            <option value="true">Has image</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Active</span>
          <select
            value={isActive}
            onChange={(event) => onIsActiveChange(event.target.value as 'all' | 'true' | 'false')}
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          >
            <option value="true">Active</option>
            <option value="all">All</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          className="mt-5 h-11 border border-primary-forest bg-primary-forest px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-emerald"
        >
          Refresh
        </button>
      </div>

      <div className="border-t border-border p-4">
        <label className="block max-w-xl">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">
            Admin bearer token
          </span>
          <input
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
            placeholder="Paste Firebase/admin token when backend is live"
            type="password"
            className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
          />
        </label>
      </div>
    </section>
  );
}
