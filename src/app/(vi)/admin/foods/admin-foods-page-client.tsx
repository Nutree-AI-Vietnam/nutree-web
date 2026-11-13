'use client';

import { ContentPage } from '@/components/admin/data-packs/ContentPage';
import { FieldFormDrawer, type FormSection } from '@/components/admin/data-packs/FieldFormDrawer';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { KNOWN_DATA_PACKS, type PackFood, type PackItem } from '@/types/data-pack-admin';

const FOOD_PACKS = packIdsOf('food', KNOWN_DATA_PACKS);

const per100 = (key: string, label: string) => ({ key: `${key}_per_100g`, label, type: 'number' as const });

const SECTIONS: FormSection[] = [
  {
    title: 'Food',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, wide: true },
      { key: 'brand', label: 'Brand', type: 'text', hint: 'Leave empty for generic foods.' },
      { key: 'category_code', label: 'Category code', type: 'text' },
    ],
  },
  {
    title: 'Nutrition per 100 g',
    columns: 3,
    fields: [
      per100('calories', 'Calories (kcal)'),
      per100('protein', 'Protein (g)'),
      per100('carbs', 'Carbs (g)'),
      per100('fat', 'Fat (g)'),
      per100('fiber', 'Fiber (g)'),
      per100('sugar', 'Sugar (g)'),
    ],
  },
  {
    title: 'Default serving',
    hint: 'What one serving means when someone logs this food, e.g. "1 bowl" = 450 g.',
    columns: 3,
    fields: [
      { key: 'serving_label', label: 'Serving name', type: 'text', required: true },
      { key: 'serving_grams', label: 'Grams', type: 'number' },
      { key: 'serving_milliliters', label: 'Milliliters', type: 'number' },
      { key: 'serving_kcal', label: 'Calories (kcal)', type: 'number' },
      { key: 'serving_protein_g', label: 'Protein (g)', type: 'number' },
      { key: 'serving_carbs_g', label: 'Carbs (g)', type: 'number' },
      { key: 'serving_fat_g', label: 'Fat (g)', type: 'number' },
      { key: 'serving_fiber_g', label: 'Fiber (g)', type: 'number' },
      { key: 'serving_sugar_g', label: 'Sugar (g)', type: 'number' },
    ],
  },
];

const round = (value: number | null) => (value === null || value === undefined ? '—' : Math.round(value * 10) / 10);

export function AdminFoodsPageClient() {
  return (
    <ContentPage<PackFood>
      current="/admin/foods"
      title="Food database"
      description="The foods people search when they log a meal by hand, one database per language. Phones keep a copy for offline search and get changes on their next check."
      icon="globe"
      packIds={FOOD_PACKS}
      preferredPackId="food_vi"
      noun={{ one: 'food', many: 'foods' }}
      packNoun="database"
      releases={{
        title: 'Food databases',
        description: 'Upload a new database to test it, then release it to users from the PROD target.',
        unit: { one: 'language', many: 'languages' },
      }}
      columns={[
        {
          label: 'Food',
          render: (food) => (
            <div>
              <p className="font-medium text-slate-900">{food.name}</p>
              {food.brand && <p className="text-xs text-slate-400">{food.brand}</p>}
            </div>
          ),
        },
        { label: 'Serving', render: (food) => <span className="text-slate-600">{food.serving_label}</span> },
        { label: 'kcal / 100 g', align: 'right', render: (food) => round(food.calories_per_100g) },
        {
          label: 'P / C / F',
          align: 'right',
          render: (food) => [food.protein_per_100g, food.carbs_per_100g, food.fat_per_100g].map(round).join(' / '),
        },
      ]}
      newItem={() =>
        ({
          id: crypto.randomUUID(),
          name: '',
          brand: null,
          calories_per_100g: null,
          protein_per_100g: null,
          carbs_per_100g: null,
          fat_per_100g: null,
          serving_label: '100 g',
          serving_grams: 100,
        }) as PackFood
      }
      itemName={(food) => food.name}
      editor={({ item, ...rest }) => (
        <FieldFormDrawer
          item={item}
          {...rest}
          title={(food: PackItem) => String(food.name ?? 'Food')}
          sections={SECTIONS}
          onSave={(food) => rest.onSave(food as PackFood)}
          onDelete={(food) => rest.onDelete(food as PackFood)}
        />
      )}
    />
  );
}
