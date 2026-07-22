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
      <div className="border-y border-border bg-white p-10 text-center">
        <p className="text-lg font-semibold text-foreground">No meals match this view.</p>
        <p className="mt-2 text-sm text-muted">Try clearing search or image filters.</p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden border-y border-border bg-white">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-background text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Types</th>
              <th className="px-4 py-3">Macros</th>
              <th className="px-4 py-3">Ingredients</th>
              <th className="px-4 py-3">Action</th>
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
    <tr className="border-b border-border last:border-b-0">
      <td className="max-w-[28rem] px-4 py-4 align-top">
        <p className="font-semibold text-foreground">{item.name}</p>
        <p className="mt-1 text-xs text-muted">{item.catalog_key}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{item.description || 'No description'}</p>
        <p className="mt-2 text-xs font-semibold uppercase text-primary-emerald">{item.cuisine}</p>
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
    <article className="border border-border bg-background p-3">
      <div className="flex gap-3">
        <ImagePreview item={item} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="mt-1 text-xs text-muted">{item.cuisine} · {item.catalog_key}</p>
          <TypePills types={item.meal_types} />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">{item.description || 'No description'}</p>
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
      <div className="flex h-20 w-28 items-center justify-center border border-dashed border-energy-orange/70 bg-energy-orange-soft text-xs font-semibold text-energy-orange">
        Missing
      </div>
    );
  }

  return (
    <a href={item.image_url} target="_blank" rel="noreferrer" className="block h-20 w-28 overflow-hidden border border-border bg-background">
      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
    </a>
  );
}

function TypePills({ types }: { types: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => (
        <span key={type} className="border border-primary-teal/25 bg-primary-teal/10 px-2 py-1 text-xs font-semibold text-primary-forest">
          {type}
        </span>
      ))}
    </div>
  );
}

function MacroList({ item }: { item: MealCatalogItem }) {
  return (
    <div className="text-xs text-muted">
      <p className="font-bold text-foreground">{item.calories} kcal</p>
      <p>P {item.protein_g}g · C {item.carbs_g}g · F {item.fat_g}g</p>
      <p>Fiber {item.fiber_g}g</p>
    </div>
  );
}

function IngredientSummary({ item }: { item: MealCatalogItem }) {
  const names = item.ingredients?.map((ingredient) => ingredient.display_name).slice(0, 3);
  return (
    <div className="text-xs text-muted">
      <p className="font-semibold text-foreground">{item.ingredient_count} ingredients</p>
      <p>{names && names.length > 0 ? names.join(', ') : 'Ingredient summary pending'}</p>
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
      className="h-10 min-w-[8.5rem] border border-primary-forest px-3 text-sm font-semibold text-primary-forest transition-colors hover:bg-primary-forest hover:text-white disabled:border-border disabled:text-muted disabled:hover:bg-transparent"
    >
      {item.image_url ? 'Has image' : isPreviewMode ? 'Backend pending' : isGenerating ? 'Generating...' : 'Generate image'}
    </button>
  );
}
