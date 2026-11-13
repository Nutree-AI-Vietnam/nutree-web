'use client';

import { ContentPage } from '@/components/admin/data-packs/ContentPage';
import { RecipeEditorDrawer } from '@/components/admin/data-packs/RecipeEditorDrawer';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { Badge, Icon } from '@/components/admin/ui/AdminUi';
import { KNOWN_DATA_PACKS, type PackRecipe } from '@/types/data-pack-admin';

const RECIPE_PACKS = packIdsOf('recipes', KNOWN_DATA_PACKS);

export function AdminRecipesPageClient() {
  return (
    <ContentPage<PackRecipe>
      current="/admin/recipes"
      title="Recipe library"
      description="The recipes people browse and swap in the meal planner, one library per language. Phones get changes on their next check."
      icon="catalog"
      packIds={RECIPE_PACKS}
      preferredPackId="recipes_vi"
      noun={{ one: 'recipe', many: 'recipes' }}
      packNoun="library"
      releases={{
        title: 'Recipe libraries',
        description: 'A language without its own library shows the English (US) one. Upload a library to add a language.',
        unit: { one: 'language', many: 'languages' },
      }}
      columns={[
        {
          label: 'Recipe',
          render: (recipe) => (
            <div className="flex items-center gap-3">
              {recipe.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote recipe photos from many hosts
                <img src={recipe.image_url} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" loading="lazy" />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                  <Icon name="catalog" className="h-4 w-4" />
                </span>
              )}
              <span className="font-medium text-slate-900">{recipe.name || 'Untitled'}</span>
            </div>
          ),
        },
        {
          label: 'Meals',
          render: (recipe) => (
            <div className="flex flex-wrap gap-1">
              {(recipe.meal_types ?? []).map((meal) => (
                <Badge key={meal}>{meal}</Badge>
              ))}
            </div>
          ),
        },
        { label: 'kcal', align: 'right', render: (recipe) => recipe.calories ?? '—' },
        {
          label: 'P / C / F',
          align: 'right',
          render: (recipe) => {
            const macros = (recipe.macros as Record<string, number> | undefined) ?? {};
            return [macros.protein_g, macros.carbs_g, macros.fat_g].map((value) => (value === undefined ? '—' : Math.round(value))).join(' / ');
          },
        },
      ]}
      newItem={() => ({
        id: crypto.randomUUID(),
        name: '',
        calories: 0,
        macros: { protein_g: 0, carbs_g: 0, fat_g: 0 },
        prep_time_minutes: 0,
        meal_types: ['lunch'],
        ingredients: [],
        steps: [],
        image_url: null,
      })}
      itemName={(recipe) => recipe.name ?? ''}
      editor={({ item, ...rest }) => <RecipeEditorDrawer recipe={item} {...rest} />}
    />
  );
}
