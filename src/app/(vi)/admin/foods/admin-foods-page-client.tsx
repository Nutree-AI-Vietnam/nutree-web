'use client';

import { ContentPage } from '@/components/admin/data-packs/ContentPage';
import { FieldFormDrawer, type FormSection } from '@/components/admin/data-packs/FieldFormDrawer';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { KNOWN_DATA_PACKS, type PackFood, type PackItem } from '@/types/data-pack-admin';

const FOOD_PACKS = packIdsOf('food', KNOWN_DATA_PACKS);

const per100 = (key: string, label: string) => ({ key: `${key}_per_100g`, label, type: 'number' as const });

const SECTIONS: FormSection[] = [
  {
    title: 'Thực phẩm',
    fields: [
      { key: 'name', label: 'Tên', type: 'text', required: true, wide: true },
      { key: 'brand', label: 'Thương hiệu', type: 'text', hint: 'Để trống nếu là thực phẩm chung.' },
      { key: 'category_code', label: 'Mã nhóm', type: 'text' },
    ],
  },
  {
    title: 'Dinh dưỡng trên 100 g',
    columns: 3,
    fields: [
      per100('calories', 'Năng lượng (kcal)'),
      per100('protein', 'Đạm (g)'),
      per100('carbs', 'Tinh bột (g)'),
      per100('fat', 'Chất béo (g)'),
      per100('fiber', 'Chất xơ (g)'),
      per100('sugar', 'Đường (g)'),
    ],
  },
  {
    title: 'Khẩu phần mặc định',
    hint: 'Một khẩu phần nghĩa là bao nhiêu khi người dùng ghi món này, VD "1 tô" = 450 g.',
    columns: 3,
    fields: [
      { key: 'serving_label', label: 'Tên khẩu phần', type: 'text', required: true },
      { key: 'serving_grams', label: 'Gam', type: 'number' },
      { key: 'serving_milliliters', label: 'Mililit', type: 'number' },
      { key: 'serving_kcal', label: 'Năng lượng (kcal)', type: 'number' },
      { key: 'serving_protein_g', label: 'Đạm (g)', type: 'number' },
      { key: 'serving_carbs_g', label: 'Tinh bột (g)', type: 'number' },
      { key: 'serving_fat_g', label: 'Chất béo (g)', type: 'number' },
      { key: 'serving_fiber_g', label: 'Chất xơ (g)', type: 'number' },
      { key: 'serving_sugar_g', label: 'Đường (g)', type: 'number' },
    ],
  },
];

const round = (value: number | null) => (value === null || value === undefined ? '—' : Math.round(value * 10) / 10);

export function AdminFoodsPageClient() {
  return (
    <ContentPage<PackFood>
      current="/admin/foods"
      title="Cơ sở dữ liệu thực phẩm"
      description="Thực phẩm người dùng tìm khi tự ghi bữa ăn, mỗi ngôn ngữ một cơ sở dữ liệu. Điện thoại giữ một bản để tìm offline và nhận thay đổi ở lần kiểm tra tiếp theo."
      icon="globe"
      packIds={FOOD_PACKS}
      preferredPackId="food_vi"
      noun={{ one: 'thực phẩm', many: 'thực phẩm' }}
      packNoun="cơ sở dữ liệu"
      releases={{
        title: 'Cơ sở dữ liệu theo ngôn ngữ',
        description: 'Tải lên cơ sở dữ liệu mới để thử trên SIT, rồi phát hành cho người dùng ở PROD.',
        unit: { one: 'ngôn ngữ', many: 'ngôn ngữ' },
      }}
      columns={[
        {
          label: 'Thực phẩm',
          render: (food) => (
            <div>
              <p className="font-medium text-slate-900">{food.name}</p>
              {food.brand && <p className="text-xs text-slate-400">{food.brand}</p>}
            </div>
          ),
        },
        { label: 'Khẩu phần', render: (food) => <span className="text-slate-600">{food.serving_label}</span> },
        { label: 'kcal / 100 g', align: 'right', render: (food) => round(food.calories_per_100g) },
        {
          label: 'Đạm / Tinh bột / Béo',
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
          title={(food: PackItem) => String(food.name ?? 'Thực phẩm')}
          sections={SECTIONS}
          onSave={(food) => rest.onSave(food as PackFood)}
          onDelete={(food) => rest.onDelete(food as PackFood)}
        />
      )}
    />
  );
}
